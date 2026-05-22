// CoffeeAgent - Core JavaScript Module
// Pure vanilla JS, zero framework dependencies
// Flesch Reading Ease Algorithm + Ollama Streaming Pipeline

class CoffeeAgent {
    constructor() {
        this.fileCache = { openclaw: null, hermes: null, openhuman: null };
        this.isStreaming = false;
        this.init();
    }

    init() {
        this.bindDropZones();
        this.bindInputHandlers();
        this.bindSettings();
        this.injectWelcomeText();
        this.checkOllamaStatus();
        setInterval(() => this.checkOllamaStatus(), 10000);
    }

    // ═══════════════════════════════════════════════════════════
    // New-User Onboarding: Inject welcome text into the textarea
    // Only shown when the textarea is empty (first-time feel)
    // ═══════════════════════════════════════════════════════════
    injectWelcomeText() {
        const textarea = document.getElementById('microInput');
        if (!textarea || textarea.value.trim() !== '') return;

        textarea.value = `💡 欢迎使用 CoffeeAgent — 你的个人 AI 终点站！

【它能解决什么痛点？】
1. 绝对隐私：支持本地断网运行，公司机密 / 私人日记放心处理。
2. 拒绝大厂绑架：一键无缝切换本地 Ollama 与顶级云端大模型（硅基流动 DeepSeek、OpenRouter）。
3. 极速唤醒：常驻 macOS 菜单栏，随叫随到，用完即走。

【小白如何开始？】
👇 第1步：在下方『服务提供商』选择你的 AI 大脑并输入 API Key。
⌨️ 第2步：清空本框，输入你要处理的文本或问题。
🚀 第3步：点击『生成增强』，见证奇迹。`;

        // Update stats to reflect the welcome text
        this.updateStats(textarea.value);
    }

    // ═══════════════════════════════════════════════════════════
    // Flesch Reading Ease Algorithm (Hard-coded)
    // Formula: 206.835 - 1.015*(totalWords/totalSentences) - 84.6*(totalSyllables/totalWords)
    // ═══════════════════════════════════════════════════════════
    calculateFlesch(text) {
        const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim());
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        
        if (sentences.length === 0 || words.length === 0) return 0;

        const totalWords = words.length;
        const totalSentences = sentences.length;
        const totalSyllables = words.reduce((acc, word) => {
            return acc + this.countSyllables(word);
        }, 0);

        const flesch = 206.835 
            - 1.015 * (totalWords / totalSentences)
            - 84.6 * (totalSyllables / totalWords);

        return Math.round(flesch * 100) / 100;
    }

    countSyllables(word) {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length <= 3) return word.length > 0 ? 1 : 0;
        
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        
        const syllables = word.match(/[aeiouy]{1,2}/g);
        return syllables ? syllables.length : 1;
    }

    // ═══════════════════════════════════════════════════════════
    // File System Integration (Drag & Drop + Click)
    // ═══════════════════════════════════════════════════════════
    bindDropZones() {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            const input = zone.querySelector('.file-input');
            const target = zone.dataset.target;

            zone.addEventListener('click', () => input.click());
            
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const file = e.dataTransfer.files[0];
                if (file) this.processFile(file, target, zone);
            });

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.processFile(file, target, zone);
            });
        });
    }

    async processFile(file, target, zoneElement) {
        try {
            const text = await file.text();
            this.fileCache[target] = {
                name: file.name,
                content: text,
                size: file.size,
                timestamp: new Date().toISOString()
            };
            
            zoneElement.classList.add('active');
            this.updateFileInfo();
        } catch (err) {
            console.error(`[CoffeeAgent] File read error:`, err);
        }
    }

    updateFileInfo() {
        const info = document.getElementById('fileInfo');
        const active = Object.entries(this.fileCache)
            .filter(([_, v]) => v)
            .map(([k, v]) => `${k}: ${v.name} (${(v.size/1024).toFixed(1)}KB)`);
        
        info.textContent = active.length 
            ? '已加载:\n' + active.join('\n')
            : '拖拽或点击加载文件...';
    }

    // ═══════════════════════════════════════════════════════════
    // Real-time Text Statistics & Input Handlers
    // ═══════════════════════════════════════════════════════════
    bindInputHandlers() {
        const textarea = document.getElementById('microInput');
        const submitBtn = document.getElementById('submitBtn');

        textarea.addEventListener('input', () => this.updateStats(textarea.value));
        textarea.addEventListener('keydown', (e) => {
            if (e.metaKey && e.key === 'Enter') {
                this.generateEnhancement();
            }
        });

        submitBtn.addEventListener('click', () => this.generateEnhancement());
    }

    updateStats(text) {
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim()).length;
        const flesch = this.calculateFlesch(text);

        document.getElementById('wordCount').textContent = `${words} 词`;
        document.getElementById('sentenceCount').textContent = `${sentences} 句`;
        document.getElementById('fleschScore').textContent = `Flesch: ${flesch}`;
    }

    // ═══════════════════════════════════════════════════════════
    // Ollama Async Streaming Pipeline
    // POST http://127.0.0.1:11434/api/generate
    // 5-minute keep-alive, auto VRAM release
    // ═══════════════════════════════════════════════════════════
    async checkOllamaStatus() {
        const provider = document.getElementById('providerSelect')?.value || 'local-ollama';
        if (provider !== 'local-ollama') {
            const statusDot = document.getElementById('ollamaStatus');
            const statusText = document.getElementById('statusText');
            if (statusDot) statusDot.className = 'status-dot online';
            return;
        }

        const statusDot = document.getElementById('ollamaStatus');
        const statusText = document.getElementById('statusText');
        try {
            const res = await fetch('http://127.0.0.1:11434/api/tags', { 
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            if (res.ok) {
                statusDot.className = 'status-dot online';
                statusText.textContent = '本地 Ollama 服务在线';
            } else {
                statusDot.className = 'status-dot';
                statusText.textContent = '本地 Ollama 离线 (请启动 Ollama)';
            }
        } catch {
            statusDot.className = 'status-dot';
            statusText.textContent = '本地 Ollama 离线 (请启动 Ollama)';
        }
    }

    bindSettings() {
        const providerSelect = document.getElementById('providerSelect');
        const modelInput = document.getElementById('modelInput');
        const apiKeyInput = document.getElementById('apiKeyInput');
        const baseUrlInput = document.getElementById('baseUrlInput');
        const saveBtn = document.getElementById('saveSettingsBtn');

        // Load settings from localStorage or use defaults
        const stored = localStorage.getItem('coffee_agent_settings');
        if (stored) {
            try {
                const settings = JSON.parse(stored);
                providerSelect.value = settings.provider || 'local-ollama';
                modelInput.value = settings.model || 'qwen2.5:7b';
                apiKeyInput.value = settings.apiKey || '';
                baseUrlInput.value = settings.baseUrl || '';
            } catch (e) {
                console.error('Failed to parse settings:', e);
            }
        } else {
            providerSelect.value = 'local-ollama';
            modelInput.value = 'qwen2.5:7b';
            apiKeyInput.value = '';
            baseUrlInput.value = 'http://127.0.0.1:11434/api/generate';
        }

        // Apply initial fields visibility
        this.toggleSettingsFields(providerSelect.value);

        // Listen for provider changes
        providerSelect.addEventListener('change', () => {
            const provider = providerSelect.value;
            this.toggleSettingsFields(provider);
            
            // Auto-fill defaults
            if (provider === 'local-ollama') {
                modelInput.value = 'qwen2.5:7b';
                baseUrlInput.value = 'http://127.0.0.1:11434/api/generate';
            } else if (provider === 'siliconflow') {
                modelInput.value = 'deepseek-ai/DeepSeek-V3';
                baseUrlInput.value = 'https://api.siliconflow.cn/v1/chat/completions';
            } else if (provider === 'openrouter') {
                modelInput.value = 'deepseek/deepseek-chat';
                baseUrlInput.value = 'https://openrouter.ai/api/v1/chat/completions';
            } else if (provider === 'custom') {
                modelInput.value = '';
                baseUrlInput.value = '';
            }
        });

        // Listen for Save button click
        saveBtn.addEventListener('click', () => {
            const settings = {
                provider: providerSelect.value,
                model: modelInput.value.trim(),
                apiKey: apiKeyInput.value.trim(),
                baseUrl: baseUrlInput.value.trim()
            };

            if (!settings.model) {
                alert('请填写模型名称！');
                return;
            }
            if (settings.provider !== 'local-ollama' && !settings.apiKey) {
                alert('使用云端模型必须填写 API Key！');
                return;
            }
            if (settings.provider === 'custom' && !settings.baseUrl) {
                alert('请填写接口地址！');
                return;
            }

            localStorage.setItem('coffee_agent_settings', JSON.stringify(settings));

            // Save confirmation feedback
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '✅ 配置已保存并应用';
            saveBtn.style.background = 'var(--accent-hover)';
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = 'var(--accent)';
            }, 2000);
        });
    }

    toggleSettingsFields(provider) {
        const apiKeyWrapper = document.getElementById('apiKeyWrapper');
        const baseUrlWrapper = document.getElementById('baseUrlWrapper');
        const statusText = document.getElementById('statusText');

        if (provider === 'local-ollama') {
            apiKeyWrapper.classList.add('hidden');
            baseUrlWrapper.classList.add('hidden');
            statusText.textContent = '本地 Ollama 检测中...';
        } else if (provider === 'siliconflow') {
            apiKeyWrapper.classList.remove('hidden');
            baseUrlWrapper.classList.add('hidden');
            statusText.textContent = '硅基流动云端连接就绪';
            document.getElementById('ollamaStatus').className = 'status-dot online';
        } else if (provider === 'openrouter') {
            apiKeyWrapper.classList.remove('hidden');
            baseUrlWrapper.classList.add('hidden');
            statusText.textContent = 'OpenRouter 云端连接就绪';
            document.getElementById('ollamaStatus').className = 'status-dot online';
        } else if (provider === 'custom') {
            apiKeyWrapper.classList.remove('hidden');
            baseUrlWrapper.classList.remove('hidden');
            statusText.textContent = '自定义第三方 API 连接就绪';
            document.getElementById('ollamaStatus').className = 'status-dot online';
        }
    }

    async generateEnhancement() {
        const input = document.getElementById('microInput').value.trim();
        if (!input || this.isStreaming) return;

        // Retrieve config from UI
        const provider = document.getElementById('providerSelect').value;
        const model = document.getElementById('modelInput').value.trim();
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const baseUrl = document.getElementById('baseUrlInput').value.trim();

        if (!model) {
            alert('请在下方配置区填写或选择模型！');
            return;
        }

        const output = document.getElementById('streamOutput');
        const btn = document.getElementById('submitBtn');

        this.isStreaming = true;
        btn.disabled = true;
        output.innerHTML = '<span class="streaming"></span>';

        const context = this.buildContext();
        const prompt = this.buildPrompt(input, context);

        try {
            if (provider === 'local-ollama') {
                await this.streamOllama(prompt, model, output);
            } else {
                await this.streamCloudModel(prompt, provider, model, apiKey, baseUrl, output);
            }
        } catch (err) {
            output.innerHTML = `<span style="color:#f85149">[连接错误] ${err.message}</span>`;
        } finally {
            this.isStreaming = false;
            btn.disabled = false;
        }
    }

    buildContext() {
        const parts = [];
        if (this.fileCache.openclaw) {
            parts.push(`[OpenClaw Skill Context]\n${this.fileCache.openclaw.content.slice(0, 2000)}`);
        }
        if (this.fileCache.hermes) {
            parts.push(`[Hermes Trigger Config]\n${this.fileCache.hermes.content.slice(0, 1000)}`);
        }
        if (this.fileCache.openhuman) {
            parts.push(`[OpenHuman Memory Tree]\n${this.fileCache.openhuman.content.slice(0, 1500)}`);
        }
        return parts.join('\n\n---\n\n');
    }

    buildPrompt(input, context) {
        const flesch = this.calculateFlesch(input);
        return `你是一个专业的写作助手。请根据以下上下文优化用户的Micro-Post。

${context}

用户原文（Flesch易读度: ${flesch}）：
"${input}"

要求：
1. 保持原文核心观点
2. 提升文字流畅度和可读性
3. 输出简洁的优化版本，不超过3个选项

优化结果：`;
    }

    async streamOllama(prompt, model, outputEl) {
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: true,
                keep_alive: '5m'
            })
        });

        if (!response.ok) throw new Error(`Ollama responded ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(l => l.trim());

            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.response) {
                        fullText += data.response;
                        outputEl.textContent = fullText;
                        outputEl.scrollTop = outputEl.scrollHeight;
                    }
                    if (data.done) break;
                } catch {}
            }
        }
    }

    async streamCloudModel(prompt, provider, model, apiKey, baseUrl, outputEl) {
        let url = baseUrl;
        if (!url) {
            if (provider === 'siliconflow') {
                url = 'https://api.siliconflow.cn/v1/chat/completions';
            } else if (provider === 'openrouter') {
                url = 'https://openrouter.ai/api/v1/chat/completions';
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };

        if (provider === 'openrouter') {
            headers['HTTP-Referer'] = 'https://coffeeagent.io';
            headers['X-Title'] = 'CoffeeAgent';
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'user', content: prompt }
                ],
                stream: true
            })
        });

        if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
            } catch {}
            throw new Error(`服务商响应错误 (${response.status}): ${errorText || '无法连接 API'}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let partialChunk = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value, { stream: true });
            const rawLines = (partialChunk + textChunk).split('\n');
            partialChunk = rawLines.pop() || '';

            for (const line of rawLines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (trimmed === 'data: [DONE]') continue;

                if (trimmed.startsWith('data: ')) {
                    try {
                        const jsonStr = trimmed.slice(6);
                        const data = JSON.parse(jsonStr);
                        const content = data.choices?.[0]?.delta?.content;
                        if (content) {
                            fullText += content;
                            outputEl.textContent = fullText;
                            outputEl.scrollTop = outputEl.scrollHeight;
                        }
                    } catch (e) {
                        // Silent catch
                    }
                }
            }
        }
        
        if (partialChunk && partialChunk.startsWith('data: ') && !partialChunk.endsWith('[DONE]')) {
            try {
                const jsonStr = partialChunk.slice(6).trim();
                const data = JSON.parse(jsonStr);
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                    fullText += content;
                    outputEl.textContent = fullText;
                    outputEl.scrollTop = outputEl.scrollHeight;
                }
            } catch {}
        }
    }
}

// ═══════════════════════════════════════════════════════════
// Initialize on DOM Ready
// ═══════════════════════════════════════════════════════════
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CoffeeAgent());
} else {
    new CoffeeAgent();
}
