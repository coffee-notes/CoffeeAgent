/**
 * CoffeeAgent — main.js
 * Pure vanilla JS. Zero framework dependencies.
 * Architecture:
 *   CoffeeAgent (class)
 *   ├── init()
 *   ├── bindGettingStarted()     — dismissible banner
 *   ├── bindDropZones()          — file drag & drop
 *   ├── bindInputHandlers()      — textarea stats + submit
 *   ├── bindSettings()           — dispatcher config + localStorage
 *   │   └── toggleProviderMode() — local vs cloud UI switching
 *   ├── fetchOllamaModels()      — dynamic model list from API
 *   ├── checkStatus()            — connection status indicator
 *   ├── generateEnhancement()    — route to correct streaming engine
 *   ├── streamOllama()           — Ollama NDJSON stream
 *   └── streamCloudModel()       — OpenAI SSE stream (buffered)
 */

class CoffeeAgent {

    constructor() {
        this.fileCache = { openclaw: null, hermes: null, openhuman: null };
        this.isStreaming = false;
        this.init();
    }

    init() {
        this.bindGettingStarted();
        this.bindDropZones();
        this.bindInputHandlers();
        this.bindSettings();
        this.checkStatus();
        setInterval(() => this.checkStatus(), 15000);
    }

    // ─── Getting Started Banner ──────────────────────────────────
    bindGettingStarted() {
        const banner = document.getElementById('gettingStarted');
        const closeBtn = document.getElementById('gsClose');
        const container = document.querySelector('.container');

        // Hide permanently if dismissed before
        if (localStorage.getItem('ca_gs_dismissed') === '1') {
            banner.classList.add('hidden');
            container.classList.add('banner-hidden');
            return;
        }

        closeBtn.addEventListener('click', () => {
            banner.classList.add('hidden');
            container.classList.add('banner-hidden');
            localStorage.setItem('ca_gs_dismissed', '1');
        });
    }

    // ─── Flesch Reading Ease ─────────────────────────────────────
    calculateFlesch(text) {
        const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim());
        const words     = text.trim().split(/\s+/).filter(w => w.length > 0);
        if (!sentences.length || !words.length) return 0;

        const syllables = words.reduce((n, w) => n + this._countSyllables(w), 0);
        const score = 206.835
            - 1.015  * (words.length / sentences.length)
            - 84.6   * (syllables    / words.length);
        return Math.round(score * 100) / 100;
    }

    _countSyllables(word) {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length <= 3) return word.length > 0 ? 1 : 0;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
        const m = word.match(/[aeiouy]{1,2}/g);
        return m ? m.length : 1;
    }

    // ─── File Drag & Drop ────────────────────────────────────────
    bindDropZones() {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            const input  = zone.querySelector('.file-input');
            const target = zone.dataset.target;

            zone.addEventListener('click',     () => input.click());
            zone.addEventListener('dragover',  e  => { e.preventDefault(); zone.classList.add('drag-over'); });
            zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const file = e.dataTransfer.files[0];
                if (file) this._loadFile(file, target, zone);
            });
            input.addEventListener('change', e => {
                const file = e.target.files[0];
                if (file) this._loadFile(file, target, zone);
            });
        });
    }

    async _loadFile(file, target, zone) {
        try {
            const text = await file.text();
            this.fileCache[target] = { name: file.name, content: text, size: file.size };
            zone.classList.add('active');
            this._updateFileInfo();
        } catch (err) {
            console.error('[CoffeeAgent] File read error:', err);
        }
    }

    _updateFileInfo() {
        const el     = document.getElementById('fileInfo');
        const loaded = Object.entries(this.fileCache)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v.name} (${(v.size / 1024).toFixed(1)} KB)`);
        el.textContent = loaded.length ? '已加载:\n' + loaded.join('\n') : '';
    }

    // ─── Input Stats & Submit Binding ────────────────────────────
    bindInputHandlers() {
        const textarea = document.getElementById('microInput');
        document.getElementById('submitBtn').addEventListener('click', () => this.generateEnhancement());
        textarea.addEventListener('input', () => this._updateStats(textarea.value));
        textarea.addEventListener('keydown', e => {
            if (e.metaKey && e.key === 'Enter') this.generateEnhancement();
        });
    }

    _updateStats(text) {
        const words     = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim()).length;
        document.getElementById('wordCount').textContent     = `${words} 词`;
        document.getElementById('sentenceCount').textContent = `${sentences} 句`;
        document.getElementById('fleschScore').textContent   = `Flesch: ${this.calculateFlesch(text)}`;
    }

    // ─── Settings: Load / Save / Toggle ─────────────────────────
    bindSettings() {
        const providerSelect = document.getElementById('providerSelect');
        const saveBtn        = document.getElementById('saveSettingsBtn');

        // Restore from localStorage
        const saved = this._loadSettings();
        providerSelect.value = saved.provider || 'local-ollama';
        document.getElementById('apiKeyInput').value  = saved.apiKey  || '';
        document.getElementById('baseUrlInput').value = saved.baseUrl || '';
        // modelInput / modelSelect restored after mode switch below

        this._applyProviderMode(saved.provider || 'local-ollama', saved.model || '');

        providerSelect.addEventListener('change', () => {
            this._applyProviderMode(providerSelect.value, '');
            this.checkStatus();
        });

        saveBtn.addEventListener('click', () => this._saveSettings());
    }

    _loadSettings() {
        try {
            return JSON.parse(localStorage.getItem('ca_settings') || '{}');
        } catch { return {}; }
    }

    _saveSettings() {
        const provider = document.getElementById('providerSelect').value;
        const isLocal  = provider === 'local-ollama';
        const model    = isLocal
            ? document.getElementById('modelSelect').value
            : document.getElementById('modelInput').value.trim();
        const apiKey   = document.getElementById('apiKeyInput').value.trim();
        const baseUrl  = document.getElementById('baseUrlInput').value.trim();

        if (!model) { alert('请选择或填写模型名称！'); return; }
        if (!isLocal && !apiKey) { alert('云端模型必须填写 API Key！'); return; }
        if (provider === 'custom' && !baseUrl) { alert('自定义 API 必须填写 Base URL！'); return; }

        localStorage.setItem('ca_settings', JSON.stringify({ provider, model, apiKey, baseUrl }));

        const btn = document.getElementById('saveSettingsBtn');
        const orig = btn.innerHTML;
        btn.innerHTML = '✅ 已保存';
        setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }

    /**
     * Switch the model UI between:
     *   - Local Ollama → <select> populated from /api/tags
     *   - Cloud        → free-text <input>
     * Also shows/hides apiKey and baseUrl fields.
     */
    _applyProviderMode(provider, savedModel) {
        const isLocal    = provider === 'local-ollama';
        const isCustom   = provider === 'custom';

        this._show('modelSelectWrapper', isLocal);
        this._show('modelInputWrapper',  !isLocal);
        this._show('apiKeyWrapper',      !isLocal);
        this._show('baseUrlWrapper',     isCustom);

        const statusText = document.getElementById('statusText');

        if (isLocal) {
            statusText.textContent = '正在检测本地 Ollama...';
            this.fetchOllamaModels(savedModel);
        } else {
            // Pre-fill sensible defaults for known providers
            const defaults = {
                siliconflow: { model: 'deepseek-ai/DeepSeek-V3', url: 'https://api.siliconflow.cn/v1/chat/completions' },
                openrouter:  { model: 'deepseek/deepseek-chat',  url: 'https://openrouter.ai/api/v1/chat/completions' },
                custom:      { model: '', url: '' },
            };
            const def = defaults[provider] || {};

            const modelInput   = document.getElementById('modelInput');
            const baseUrlInput = document.getElementById('baseUrlInput');

            // Only overwrite if the field is currently empty or has the previous default
            if (!modelInput.value || savedModel)  modelInput.value   = savedModel || def.model || '';
            if (!baseUrlInput.value)               baseUrlInput.value = def.url   || '';

            statusText.textContent = `${this._providerLabel(provider)} 就绪`;
            this._setStatus('online');
        }
    }

    _show(id, visible) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('hidden', !visible);
    }

    _providerLabel(p) {
        return { siliconflow: 'SiliconFlow', openrouter: 'OpenRouter', custom: 'Custom API' }[p] || p;
    }

    // ─── Dynamic Ollama Model List ───────────────────────────────
    /**
     * Calls GET http://localhost:11434/api/tags, parses the model list,
     * and populates the <select id="modelSelect"> dynamically.
     * Falls back gracefully if Ollama is offline.
     */
    async fetchOllamaModels(preferred = '') {
        const select = document.getElementById('modelSelect');
        select.innerHTML = '<option value="">— 检测中 —</option>';
        this._setStatus('checking');

        try {
            const res = await fetch('http://localhost:11434/api/tags', {
                signal: AbortSignal.timeout(4000)
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const { models = [] } = await res.json();

            if (models.length === 0) {
                select.innerHTML = '<option value="">— 未找到已安装模型 —</option>';
                document.getElementById('statusText').textContent = 'Ollama 在线，但没有已安装的模型';
                this._setStatus('online');
                return;
            }

            select.innerHTML = '';
            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value       = m.name;
                opt.textContent = m.name;
                select.appendChild(opt);
            });

            // Restore saved selection if still available
            if (preferred && [...select.options].some(o => o.value === preferred)) {
                select.value = preferred;
            }

            document.getElementById('statusText').textContent =
                `Ollama 在线 · ${models.length} 个模型`;
            this._setStatus('online');

        } catch {
            select.innerHTML = '<option value="">— Ollama 未运行 —</option>';
            document.getElementById('statusText').textContent = 'Ollama 离线（请先启动 Ollama）';
            this._setStatus('offline');
        }
    }

    // ─── Status Indicator ────────────────────────────────────────
    async checkStatus() {
        const provider = document.getElementById('providerSelect')?.value || 'local-ollama';
        if (provider !== 'local-ollama') return; // cloud providers assumed ready
        await this.fetchOllamaModels(document.getElementById('modelSelect')?.value || '');
    }

    _setStatus(state) {
        // state: 'online' | 'offline' | 'checking'
        const dot = document.getElementById('statusDot');
        if (!dot) return;
        dot.className = 'status-dot' + (state !== 'offline' ? ` ${state}` : '');
    }

    // ─── Generate Enhancement ────────────────────────────────────
    async generateEnhancement() {
        const input = document.getElementById('microInput').value.trim();
        if (!input || this.isStreaming) return;

        const provider = document.getElementById('providerSelect').value;
        const isLocal  = provider === 'local-ollama';
        const model    = isLocal
            ? document.getElementById('modelSelect').value
            : document.getElementById('modelInput').value.trim();
        const apiKey   = document.getElementById('apiKeyInput').value.trim();
        const baseUrl  = document.getElementById('baseUrlInput').value.trim();

        if (!model) {
            alert(isLocal
                ? 'Ollama 尚未检测到已安装的模型，请先通过 `ollama pull` 安装一个模型。'
                : '请在调度台填写模型名称。');
            return;
        }
        if (!isLocal && !apiKey) { alert('请填写 API Key！'); return; }

        const output = document.getElementById('streamOutput');
        const btn    = document.getElementById('submitBtn');

        this.isStreaming = true;
        btn.disabled     = true;
        output.innerHTML = '<span class="streaming"></span>';

        const prompt = this._buildPrompt(input, this._buildContext());

        try {
            if (isLocal) {
                await this._streamOllama(prompt, model, output);
            } else {
                await this._streamCloud(prompt, provider, model, apiKey, baseUrl, output);
            }
        } catch (err) {
            output.innerHTML = `<span style="color:var(--error)">[错误] ${err.message}</span>`;
        } finally {
            this.isStreaming = false;
            btn.disabled     = false;
        }
    }

    _buildContext() {
        const LIMITS = { openclaw: 2000, hermes: 1000, openhuman: 1500 };
        return Object.entries(this.fileCache)
            .filter(([, v]) => v)
            .map(([k, v]) => `[${k}]\n${v.content.slice(0, LIMITS[k])}`)
            .join('\n\n---\n\n');
    }

    _buildPrompt(input, context) {
        return [
            '你是一个专业的写作助手。请优化以下 Micro-Post，保留核心观点，提升流畅度，给出不超过3个选项。',
            context && `\n上下文：\n${context}`,
            `\n原文（Flesch: ${this.calculateFlesch(input)}）：\n"${input}"\n\n优化结果：`
        ].filter(Boolean).join('');
    }

    // ─── Ollama Streaming (NDJSON) ───────────────────────────────
    async _streamOllama(prompt, model, outputEl) {
        const res = await fetch('http://localhost:11434/api/generate', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ model, prompt, stream: true, keep_alive: '5m' })
        });

        if (!res.ok) throw new Error(`Ollama ${res.status}`);

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let   full    = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            for (const line of decoder.decode(value, { stream: true }).split('\n')) {
                try {
                    const d = JSON.parse(line);
                    if (d.response) {
                        full += d.response;
                        outputEl.textContent = full;
                        outputEl.scrollTop   = outputEl.scrollHeight;
                    }
                } catch { /* partial line — skip */ }
            }
        }
    }

    // ─── Cloud Streaming (OpenAI SSE) ───────────────────────────
    async _streamCloud(prompt, provider, model, apiKey, baseUrl, outputEl) {
        const URLS = {
            siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
            openrouter:  'https://openrouter.ai/api/v1/chat/completions',
        };
        const url = baseUrl || URLS[provider] || '';
        if (!url) throw new Error('未填写 Base URL');

        const headers = {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };
        if (provider === 'openrouter') {
            headers['HTTP-Referer'] = 'https://coffeeagent.io';
            headers['X-Title']      = 'CoffeeAgent';
        }

        const res = await fetch(url, {
            method:  'POST',
            headers,
            body:    JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                stream:   true
            })
        });

        if (!res.ok) {
            const msg = await res.text().catch(() => '');
            throw new Error(`API ${res.status}: ${msg || '无响应'}`);
        }

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let   full    = '';
        let   buf     = '';   // buffer for split SSE lines

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const lines = (buf + decoder.decode(value, { stream: true })).split('\n');
            buf = lines.pop() ?? ''; // last element may be incomplete

            for (const line of lines) {
                const t = line.trim();
                if (!t || t === 'data: [DONE]') continue;
                if (!t.startsWith('data: ')) continue;
                try {
                    const content = JSON.parse(t.slice(6))?.choices?.[0]?.delta?.content;
                    if (content) {
                        full += content;
                        outputEl.textContent = full;
                        outputEl.scrollTop   = outputEl.scrollHeight;
                    }
                } catch { /* malformed chunk — skip */ }
            }
        }

        // Flush any remaining buffer
        if (buf.startsWith('data: ') && !buf.includes('[DONE]')) {
            try {
                const content = JSON.parse(buf.slice(6))?.choices?.[0]?.delta?.content;
                if (content) { full += content; outputEl.textContent = full; }
            } catch { /* ignore */ }
        }
    }
}

// ─── Boot ────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CoffeeAgent());
} else {
    new CoffeeAgent();
}
