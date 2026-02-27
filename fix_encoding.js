const fs = require('fs');

// Read encrypted_ques.js (source of truth for question data)
const quesContent = fs.readFileSync('encrypted_ques.js', 'utf8');

// I need to reconstruct script.js. 
// I know the first 210 lines were fine until I overwrote them with ANSI-decoded text.
// Wait, if I read script.js now as UTF8, the garbled characters will be preserved in their garbled state.

// HOWEVER, I have the original content of the first 210 lines from previous view_file calls!
// Let me collect them.
const header = `// =============================================================
//  PARTY & DRINKING GAMES — Script (v4 — Premium Effects)
// =============================================================

// --- Constants & State ---
// (truncated)
//  UTILS
// =============================================================

// --- Toast Notification ---
const TOAST_ICONS = {
    blue: '🔀',
    red: '💀',
    green: '✅',
    pink: '🔁',
};

const Toast = {
    show(message, type = 'blue') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.innerHTML = \`
            <span class="toast-icon">\${TOAST_ICONS[type] || '✨'}</span>
            <span class="toast-msg">\${message}</span>
        \`;

        container.appendChild(toast);

        // Slide in
        requestAnimationFrame(() => toast.classList.add('show'));

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
};

// --- Ripple Effect ---
const Ripple = {
    attach(el) {
        el.addEventListener('mousedown', (e) => {
            const circle = document.createElement('span');
            const d = Math.max(el.clientWidth, el.clientHeight);
            const rect = el.getBoundingClientRect();

            circle.style.width = circle.style.height = \`\${d}px\`;
            circle.style.left = \`\${e.clientX - rect.left - d / 2}px\`;
            circle.style.top = \`\${e.clientY - rect.top - d / 2}px\`;
            circle.classList.add('ripple');

            const prev = el.getElementsByClassName('ripple')[0];
            if (prev) prev.remove();

            el.appendChild(circle);
        });
    },
    attachToAll() {
        document.querySelectorAll('.btn, .chip, .nav-btn, .key').forEach(el => this.attach(el));
    }
};

// --- Particles Engine ---
const Particles = {
    canvas: null,
    ctx: null,
    particles: [],

    init() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    burst(x, y, colors, count = 20, speed = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 2,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
    },

    confetti(colors, count = 100) {
        const x = window.innerWidth / 2;
        const y = window.innerHeight + 10;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: -Math.random() * 15 - 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 4,
                alpha: 1,
                decay: Math.random() * 0.01 + 0.01
            });
        }
    },

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            } else {
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        requestAnimationFrame(() => this.loop());
    }
};
Particles.init();

function screenShake() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 400);
}

// =============================================================
//  QUESTION DATA
// =============================================================

const Crypt = {
    // Simple XOR based encryption/decryption (Obfuscation)
    // Using the PIN as a key to scramble/unscramble the secret answers
    cipher(text, key) {
        if (!text || !key) return text;
        const k = String(key);
        return Array.from(text).map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ k.charCodeAt(i % k.length))
        ).join('');
    },

    // Convert text to Base64 for safe storage
    encode(text, key) {
        const scrambled = this.cipher(text, key);
        return btoa(unescape(encodeURIComponent(scrambled)));
    },

    // Decode from Base64 and descramble
    decode(encoded, key) {
        try {
            const scrambled = decodeURIComponent(escape(atob(encoded)));
            return this.cipher(scrambled, key);
        } catch (e) {
            return "Error: Wrong PIN or Corrupted Data";
        }
    },

    // SHA-256 Hashing for PIN Verification (Web Crypto API)
    async hash(str) {
        const msgUint8 = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};
`;

// Now for the footer (lines 1396 to end of current script.js)
// I'll read current script.js as UTF8 (the garbled stuff is fine for the footer part if it's English)
const currentScript = fs.readFileSync('script.js', 'utf8');
const lines = currentScript.split(/\\r?\\n/);
// lines[1395] is line 1396 (0-indexed)
const footer = lines.slice(1395).join('\\n');

const finalContent = header + '\\n' + quesContent + '\\n' + footer;
fs.writeFileSync('script.js', finalContent, 'utf8');
console.log('Fixed script.js encoding');
