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
        this.checkOllamaStatus();
        setInterval(() => this.checkOllamaStatus(), 10000);
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
        const statusDot = document.getElementById('ollamaStatus');
        try {
            const res = await fetch('http://127.0.0.1:11434/api/tags', { 
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            statusDot.className = res.ok ? 'status-dot online' : 'status-dot';
        } catch {
            statusDot.className = 'status-dot';
        }
    }

    async generateEnhancement() {
        const input = document.getElementById('microInput').value.trim();
        if (!input || this.isStreaming) return;

        const model = document.getElementById('modelSelect').value;
        const output = document.getElementById('streamOutput');
        const btn = document.getElementById('submitBtn');

        this.isStreaming = true;
        btn.disabled = true;
        output.innerHTML = '<span class="streaming"></span>';

        // Build context from loaded files
        const context = this.buildContext();
        const prompt = this.buildPrompt(input, context);

        try {
            await this.streamOllama(prompt, model, output);
        } catch (err) {
            output.innerHTML = `<span style="color:#f85149">[Error] ${err.message}</span>`;
        } finally {
            this.isStreaming = false;
            btn.disabled = false;
            // Auto release after 5min handled by Ollama's keep_alive param
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
                keep_alive: '5m'  // Auto release after 5 minutes
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
}

// ═══════════════════════════════════════════════════════════
// Initialize on DOM Ready
// ═══════════════════════════════════════════════════════════
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CoffeeAgent());
} else {
    new CoffeeAgent();
}
