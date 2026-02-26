// =============================================================
//  PARTY & DRINKING GAMES — Script (v4 — Premium Effects)
// =============================================================

// --- Constants & State ---
const suits = ['♥', '♦', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// =============================================================
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
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.position = 'relative';
        toast.innerHTML = `
            <span class="toast-icon">${TOAST_ICONS[type] || '💬'}</span>
            <span>${message}</span>
            <div class="toast-progress"></div>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 350);
        }, 3000);
    }
};

// --- Ripple Effect ---
const Ripple = {
    add(btn, e) {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const x = (e ? e.clientX : rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (e ? e.clientY : rect.top + rect.height / 2) - rect.top - size / 2;

        const wave = document.createElement('span');
        wave.className = 'ripple-wave';
        wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
        btn.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
    },
    attachToAll() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('pointerdown', (e) => Ripple.add(btn, e));
        });
    }
};

// --- Screen Shake ---
const screenShake = () => {
    document.body.classList.remove('shaking');
    void document.body.offsetWidth; // force reflow
    document.body.classList.add('shaking');
    document.body.addEventListener('animationend', () => {
        document.body.classList.remove('shaking');
    }, { once: true });
};

// =============================================================
//  PARTICLE ENGINE
// =============================================================

const Particles = (() => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId = null;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.18; // gravity
            p.vx *= 0.98;
            p.life -= p.decay;
            p.size = Math.max(0, p.size - 0.05);

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            if (p.shape === 'rect') {
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            p.rotation += 0.1;
        });

        if (particles.length > 0) {
            animId = requestAnimationFrame(loop);
        } else {
            animId = null;
        }
    };

    const burst = (x, y, color, count = 28, spread = 160) => {
        const colors = Array.isArray(color) ? color : [color];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
            const speed = 2 + Math.random() * spread / 40;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 6 + Math.random() * 8,
                life: 0.9 + Math.random() * 0.1,
                decay: 0.012 + Math.random() * 0.008,
                shape: Math.random() > 0.4 ? 'circle' : 'rect',
                rotation: Math.random() * Math.PI * 2,
            });
        }
        if (!animId) animId = requestAnimationFrame(loop);
    };

    const confetti = (colors, count = 80) => {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvas.width;
            const y = -20;
            const c = colors[Math.floor(Math.random() * colors.length)];
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 4,
                vy: 1 + Math.random() * 3,
                color: c,
                size: 7 + Math.random() * 8,
                life: 1,
                decay: 0.005 + Math.random() * 0.005,
                shape: Math.random() > 0.3 ? 'rect' : 'circle',
                rotation: Math.random() * Math.PI * 2,
            });
        }
        if (!animId) animId = requestAnimationFrame(loop);
    };

    return { burst, confetti };
})();

// =============================================================
//  QUESTION DATA
// =============================================================

// =============================================================
//  QUESTION DATA
// =============================================================

const ques = {
    love: [
        { q: "รักครั้งไหนที่สอนคุณมากที่สุด", a: "ถ้ารู้สึกว่ารักจริงก็มีแค่ครีมแหละ มันสอนเราเยอะมากๆ ว่าเราควรเลิกเป็นเด็กได้แล้ว ต้องใจเย็นให้มากกว่านี้ ใจเย็นให้เท่าพ่อ เราใจร้อนจนทำให้ความสัมพันธ์ดีๆจบลง" },
        { q: "คุณเชื่อ \"คนที่ใช่ในเวลาที่ไม่ใช่\" มั้ย", a: "ไม่นะ ถ้ามันเป็นคนที่ใช่ เราจะจัดการกับเวลาให้มันกลายเป็นถูกต้องเอง ตัวเราเองจะรู้ว่าตอนมีครีมเราจัดการเวลาได้ดีแค่ไหน" },
        { q: "ข้อเสียของตัวเองในเรื่องความรักที่ยังแก้ไม่ได้", a: "ถ้าตอนที่ทำเว็ปนี้ก็คงมีเยอะมากๆอ่ะ ความใจร้อน ความเอาใจใส่ ความที่เราเป็นคนน่าเบื่อจำเจ" },
        { q: "คุณเคยฝืนอยู่กับใครสักคน ทั้งๆที่รู้ว่ามันไปต่อไม่ได้มั้ย", a: "อยู่แล้วแค่หวังว่าการกระทำของเรามันจะเปลี่ยนคนได้ ขนาดเราไม่เคยรู้จักกัน ในช่วงนึงเรายังเคยทำให้แกรักเราได้เลย" },
        { q: "Red Flag ในแฟนที่คุณจะไม่มีวันทน", a: "การด้อยค่าอีกฝ่าย การดูถูกความพยายาม" },
        { q: "\"ความรัก\" ในมุมมองของคุณมันเป็นยังไง ", a: "มันคงเป็นการที่เราอยู่กับใครแล้วเราเป็นตัวเอง ไม่ต้องฝืนขอความรักจากเขา การที่เราอยู่ที่ๆไม่คุ้นเคยแต่กลับรู้สึกปลอดภัยเมื่อได้อยู่กับคนๆนี้" },
        { q: "คุณ Move on จากรักครั้งที่เจ็บที่สุดยังไง", a: "ตอนที่ทำเว็ปนี้ยัง move on ไม่ได้เลย เราก็แค่ทำตัวให้ดีขึ้น โฟกัสตัวเองก่อน เผื่อวันไหนที่เราวนกลับมามันคงไม่อยากให้อีกฝั่งรู้สึกผิดที่ช่วงที่ทิ้งเรามันทำให้เราเศร้าขนาดนี้ แต่ถ้ามันไม่วนกลับมาก็ไม่เป็นไร ทุกอย่างมันไม่ได้เป็นของเราเสมอนิ ตัวเราเองรู้อยู่แก่ใจ อย่างน้อยก็ทำให้ตัวเองดีขึ้นเพื่อคนที่รอเราอยู่" },
        { q: "คุณเคยแอบชอบเพื่อนตัวเองมั้ย แล้วจัดการกับความรู้สึกนั้นยังไง", a: "ก็เคยนะ ก็ระบายออกมาเลย เรามันคนกล้าอยู่แล้ว" },
        { q: "คิดว่าการแต่งงานจำเป็นสำหรับคุณมั้ย", a: "มันก็สำคัญนะในมุมเรา เราอยากจะให้มันเป็นไปตามวิธีการ ตามประเพณี ให้มันเป็นความทรงจำดีๆ แขกทุกคนร่วมกันยินดีที่เราได้พบความรัก แต่ไม่ได้อยากให้มันมาเป็นข้อผูกมัดจนทำให้เราเปลี่ยนไป สุดท้ายจะแต่งไม่แต่ง ก็ต้องแล้วอนาคตแหละ" },
        { q: "ถ้าย้อนกลับไปบอกแฟนเก่าได้ 1 ประโยค จะบอกว่าอะไร", a: "ไปหาคลิปดูนะ เคยอัดไว้ละ" },
        { q: "ตอนนี้คุณพร้อมจะมีความรักครั้งใหม่จริงๆ หรือแค่อยากมีคนใหม่เพื่อมารองรับอารมณ์ในตอนนี้", a: "ตอนที่ทำเว็ปนี้ยังไม่พร้อม ตัวเราเองยังจัดการตัวเองไม่ได้เลย แต่ถ้ามันมีคนที่ใช่เข้ามาเราก็ไม่ได้ปิดกั้น แต่ไม่ได้โฟกัสมันขนาดนั้นแล้ว" },
        { q: "เรื่องที่แฟนทำแล้ว คุณรู้สึกว่ามันทำร้ายจิตใจที่สุด", a: "โดนอีกฝ่ายดูถูกความพยายาม" },
        { q: "คิดว่าเราสามารถรักคนสองคนในเวลาเดียวกันได้มั้ย", a: "ได้นะ รักพร้อมกันแต่รักไม่เท่ากัน" },
        { q: "การนอกใจ ร้ายแรงแค่ไหนสำหรับคุณ ให้อภัยได้ไหม", a: "ไม่มากขนาดนั้น 7/10 เราให้อภัยได้ แต่จะไปต่อได้มั้ยก็อยู่ที่การตัดสินใจตอนนั้นนะ ถึงสมองมันรู้อยู่แล้วว่ามันเป็นเรื่องที่ให้อภัยไม่ได้ มันเหมือนการที่ถ้าคุณรักคนที่หนึ่ง แล้วคุณเกิดรักคนที่สอง แสดงว่าคุณไม่รักคนที่หนึ่ง เพราะถ้าคุณรักคนแรกจริงๆคุณจะไม่ตกหลุมรักคนที่สองเลย" },
        { q: "คุณกลัวการผูกมัดมั้ย", a: "ไม่นะ การมีข้อผูกมัดมันก็ดี อย่ายึดติดกับคำว่าข้อผูกมัดจนทำให้เราไม่เป็นตัวเอง ก่อนที่เราจะมีเขาเราเป็นไง เราต้องเป็นอย่างนั้น" },
        { q: "ความทรงจำเรื่องความรักที่ทำให้คุณยิ้มได้เสมอคืออะไร", a: "เรื่องตอนที่อยู่กับครีมมันก็ทำให้ยิ้มได้ตลอดนะ แต่ที่ชอบที่สุดคงเป็นตอนที่เราตีแบตแหละ เธอดูมีความสุขมากจริงๆ" },
        { q: "วิธีง้อแฟนในแบบของคุณคืออะไร?", a: "คงเป็นการพาไปกินของอร่อย คุยกัน ทำตัวตลกๆ" },
        { q: "เลิกกันแล้ว กลับมาเป็นเพื่อนกันได้มั้ย", a: "ไม่ได้เราไม่ได้ตั้งใจเข้ามาในสถานะนี้อยู่แล้ว เลิกกันไปก็ต้องให้เกียรต์คนใหม่ๆของเขาด้วย" },
        { q: "เชื่อในรักแรกพบไหม หรือแกเป็นสายต้องคุยก่อนถึงจะชอบ", a: "เราเป็นคนชอบคนง่าย แต่จะรักใครยาก" },
        { q: "สิ่งที่โรแมนติกที่สุดที่แกเคยทำให้คนอื่นคืออะไร", a: "พับดอกไม้มั้ง อันอื่นโรแมนติกมั้ยไม่รู้ แต่ถ้าเธอรู้สึกว่ามันโรแมนติกบางอย่างเราแค่ทำตามปกติ" },
        { q: "คุณให้ความสำคัญกับเซ็กส์ในความสัมพันธ์กี่เปอร์เซ็นต์", a: "คง 10% มั้ง เอาจริงเป็นผชบางที่ก็ต้องอยากทำบ้าง แต่ถ้าแฟนเราไม่เราจะไม่ฝืนมันเด็ดขาด" },
        { q: "คิดว่าระยะทาง (Long Distance) เป็นอุปสรรคกับความรักไหม?", a: "เป็นอุปสรรค แต่ไม่ได้เป็นเหตุผลที่ทำให้เรารักเธอน้อยลง" },
        { q: "ถ้าครอบครัวไม่ชอบแฟนคุณ คุณจะทำยังไง", a: "เรารู้ว่าคนที่เราเลือกมาเป็นแฟน มีคุณสมบัติมากพอที่จะให้ครอบครัวเรายอมรับ" },
        { q: "รู้สึกยังไงกับประโยคที่ว่า \"รักแท้แพ้ใกล้ชิด\"", a: "เรื่องจริง แต่สำหรับบางคนที่จัดการอารมณ์ตัวเองไม่ได้ ถ้าเรารักใครคนนึงจริงๆแล้ว เราก็จะไม่เป็น" },
        { q: "ระหว่างคนที่เรารัก กับคนที่รักเรา คุณจะเลือกใคร?", a: "คงต้องเลือกคนที่เรารักและรักเราด้วย มันเสียใจนะเวลารู้ว่าคนที่รักเรามันไม่ได้รักแล้ว" },
        { q: "เคยรู้สึกแย่กับตัวเองเพราะความรักพังมั้ย?", a: "สุดๆอ่ะ ทำพังเองกับมือ" },
        { q: "คุณเป็นคนขี้หึงระดับไหน จาก 1-10?", a: "10 หึงนะแต่มีเหตุผล ถ้ามีเหตุผลจะไม่หึง" },
        { q: "การกระทำอะไรของแฟนที่ทำให้รู้สึกปลอดภัยที่สุด?", a: "ควงแขน ซบแขน " },
        { q: "เรื่องบนเตียงสำคัญกว่า หรือความเข้าใจสำคัญกว่า?", a: "ความเข้าใจอยู่แล้ว" },
        { q: "แกมีความลับเรื่องความรักที่คนในนี้ยังไม่รู้มั้ย", a: "เราเป็นคนเหี้ย ที่เอาแต่ใจมาก ศูนย์รวมความเป็นเด็กไม่รู้จักโต" },
        { q: "คิดว่าความรักจืดจางลงตามกาลเวลาเป็นเรื่องปกติมั้ย", a: "ปกตินะ แต่ไม่ใช่จืดชืดมันแค่ไม่หวือหวาตลอดเวลา" },
        { q: "เคยโดนเทแบบงงๆ ไหม เล่าให้ฟังหน่อย", a: "ไม่นะ" },
        { q: "มีเพลงไหนไหมที่ฟังแล้วนึกถึงแฟนเก่าเสมอ?", a: "รักเมียที่สุดในโลก กลับมาฟังเพราะเธอ และเธอก็เป็นคนส่งให้เราด้วย" },
        { q: "คุณให้โอกาสคนที่นอกใจได้กี่ครั้ง", a: "ครั้งสองครั้งมั้ง ไม่ก็จนกว่าตัวเองจะไม่มีคุณค่า ถ้ารักตัวเองทำใจได้เมื่อไหร่รีบออก" },
        { q: "ถ้าแฟนบอกเลิกโดยไม่บอกเหตุผล คุณจะทำยังไง", a: "หาวิธีติดต่อเพื่อเคลียร์ถึงจะจบ ก็ขอให้มันมีเหตุผล" },
        { q: "ชอบเป็นฝ่ายรุก หรือฝ่ายรับในความสัมพันธ์", a: "ชอบรับนะ แต่เราก็รุกด้วยในบางที" },
        { q: "อะไรคือสิ่งที่ทำให้คุณตกหลุมรักคนคนนึงได้ง่ายๆ", a: "การถูกรักและเอาใจใส่" },
        { q: "คิดว่าตัวเองเป็นแฟนที่ดีพอหรือยัง", a: "ไม่พอเลย เรายังต้องปรับอีกเยอะ" },
        { q: "รักษาความสัมพันธ์ยังไงให้คบกันได้นานๆ", a: "ความสม่ำเสมอ ความเป็นตัวเอง สำคัญที่สุดความใจเย็น" },
        { q: "เคยเปรียบเทียบแฟนปัจจุบันกับแฟนเก่ามั้ย", a: "ยังไม่มีใหม่" },
        { q: "ความผิดหวังในความรักครั้งไหนที่เปลี่ยนนิสัยคุณไปเลย", a: "ครีม ทำให้เราใจเย็นลงเยอะ" },
        { q: "คิดว่าแอปหาคู่หาความรักจริงจังได้มั้ย", a: "อาจจะได้แต่น้อย ความรักในยุคสมัยนี้มันมีแต่ฉาบฉวย" },
        { q: "ระหว่างความรักที่หวือหวาแต่น่าตื่นเต้น กับความรักที่เรียบง่ายแตมั่นคง เลือกแบบไหน", a: "เรียบง่ายมันคง" },
        { q: "คุณบอกรักครั้งสุดท้ายเมื่อไหร่", a: "คงเป็น 14 กุมภาพันธ์ บอกรักแต่ไม่รู้เขารับไว้มั้ย" },
        { q: "ถ้าคนที่คุณชอบ เขามีคนที่ชอบอยู่แล้ว คุณจะสู้หรือถอย", a: "ถ้ายังไม่มีสถานะ ก็สู้เต็มที่ดิ" },
        { q: "ทุกวันนี้ คุณยังรอใครอยู่มั้ย", a: "รอคนๆนั้นแหละ" },
        { q: "เคยทำอะไรบ้าๆ เพื่อประชดแฟนมั้ย", a: "บอกเลิกอ่ะ หนักอยู่" },
        { q: "ชอบคน \"รวยแต่ไม่มีเวลาให้\" หรือ \"จนแต่มีเวลาให้ตลอด\"", a: "จนแต่มีเวลาให้ตลอด คือสิ่งที่เราเป็นและไม่ได้มองหาความร่ำรวย เราอยากมีความรักที่มีเวลา ไม่ใช่เงินทองมากมาย" },
        { q: "เชื่อเรื่องการ \"มีเซ็กส์ก่อนเป็นแฟน\" (One Night Stand) แค่ไหน", a: "เจอกับตัวเอง" },
        { q: "อะไรคือความลับเรื่องแฟนเก่าที่แก \"ไม่เคยบอกใครเลย\"", a: "ครีมเป็นคนที่เอาแต่ใจมาก นิสัยชอบดูถูก สนใจภาพลักษณ์มากไป แต่เราไม่เคยบอกใคร เพราะเราไม่อยากให้ใครมองเธอแย่ให้มันเหี้ยที่เรา" },
        { q: "เคยเสียใจเพราะเลือก \"คนที่ใช่\" ผิดคนไหม?", a: "ไม่เคยเลือกผิด แต่เราเองดันกลายเป็นคนที่ไม่ใช่" },
        { q: "คิดว่าตัวเองเป็นคน \"ขี้หึง\" หรือ \"ขี้ระแวง\" มากกว่ากัน", a: "หนักทั้งคู่ แต่ให้หึงมากกว่า" },
        { q: "ถ้าแฟนเก่ามางานแต่งงานคุณ คุณจะรู้สึกยังไง", a: "ดีใจดิ ก็เราเป็นคนเชิญมาเอง" },
        { q: "สิ่งที่แย่ที่สุดที่คนรักเคยพูดกับคุณคือประโยคไหน", a: " \"กูซวยมากที่มาเจอคนแบบมึง\" " },
        { q: "คุณให้ความสำคัญกับ \"หน้าตา\" หรือ \"นิสัย\" มากกว่ากัน", a: "หน้าตาอยู่แล้ว ถ้าหน้าตาไม่ผ่านไม่ได้รู้จักนิสัยหรอก" },
        { q: "คิดยังไงกับคนที่มี \"FWB\" (Friends with Benefits)", a: "ถ้าไม่มีแฟนก็ปกติ ถ้ามีคือมึงเหี้ย" },
        { q: "ถ้าคนคุยปัจจุบันของคุณ มีลูกติด จะยังคบต่อไหม", a: "ติด แต่ถ้าตอนนั้นรับผิดชอบไหวก็พอไปได้" },
        { q: "อะไรคือสิ่งที่แฟนเก่าทุกคนมักจะตำหนิในตัวคุณ", a: "มีคนเดียวน่าจะความใจร้อน" },
        { q: "เคย \"อ้อนวอน\" ให้ใครสักคนไม่ไปจากชีวิตไหม", a: "เคยดิ พยายามมากสุดๆ ตอนนี้ไม่รู้เธอเดินไปไกลถึงไหนแล้ว" },
        { q: "ถ้าพรุ่งนี้แฟนเก่าทักมาว่า \"คิดถึง\" จะตอบว่าอะไร?", a: "\"คิดถึงเหมือนกัน\"" },
        { q: "เคยโดนหลอกใช้ในเรื่องความรักไหม", a: "ไม่น่านะ" },
        { q: "คุณคิดว่าการเลิกกันเป็นจุดจบ หรือการเริ่มต้นใหม่", a: "อาจจะไม่ใช่สำหรับคนๆนี้ แต่มันจะเป็นการจบของลูปเดิมๆ ลูปที่ทำให้ใครสักคนต้องเจ็บ ถ้าสักวันเราโตขึ้นการเลิกกันครั้งนั้น จะทำให้เรากลับมาเริ่มต้นใหม่ในเวอร์ชั้นที่ดีกว่าเดิม" },
        { q: "ถ้ามีโอกาสกลับไปแก้ไขความสัมพันธ์ครั้งหนึ่ง คุณจะเลือกกลับไปหาใคร", a: "\"อ้วนน้อย\" มันมีอยู่คนเดียวที่เราเรียกงี้ครีมนั้นแหละ" },
        { q: "ถ้าสามารถลบคนคนหนึ่งออกจากความทรงจำได้ตลอดกาล จะลบใคร", a: "ก็คงต้องลบครีมแหละ รักมากมันก็เจ็บมากเนอะ" },
        { q: "เคยแอบเช็คโทรศัพท์แฟนมั้ย", a: "ไม่นะ เราเชื่อใจรู้รหัสหมดแหละแต่ไม่ทำอ่ะ" },
        { q: "ถ้าวันหนึ่งแฟนเก่าที่แกเกลียดที่สุดมาขอความช่วยเหลือ คุณจะช่วยไหม", a: "เกลียดแค่ไหนก็ต้องช่วย เราไม่สามารถเมินใครที่เคยรักได้หรอก" },
        { q: "ถ้าแฟนอยากให้แกเลิกคบกับเพื่อนสนิทคนหนึ่ง คุณจะทำตามไหม", a: "ไม่มีทางที่จะทำ สุดท้ายถ้ามันแยกทางใครล่ะที่ยังอยู่ เพื่อนกุไง" },
        { q: "คุณให้เวลาศึกษานิสัยคนคนหนึ่งนานแค่ไหน ก่อนจะตกลงเป็นแฟน", a: "3 เดือนต้องมาการพัฒนาไม่งั้นก็จบเถอะ" },
        { q: "เรื่องไหนที่คุณเสียใจที่สุด ที่ไม่ได้ทำตอนที่ยังมีเขาอยู่", a: "เล่นเกมกับเธอเยอะๆ ถ่ายคลิปด้วยกันเยอะๆ ถ้าย้อนไปได้จะทำให้หมดเยย" },
        { q: "คุณยอมทิ้งความฝันของตัวเองเพื่อความรักไหม", a: "ไม่อ่ะ ในฝันเราคือการมีความรักพร้อมกับการประสบความสำเร็จ" },
        { q: "ถ้าต้องไปเดท แล้วต้องจ่ายเงินเองทั้งหมด คุณจะไปต่อกับคนนั้นไหม", a: "ไม่ติด bare minimum มากๆ" },
        { q: "ความรักครั้งไหนที่ทำให้แกเสียน้ำตามากที่สุด", a: "ครีม" }
    ],
    life: ["ถ้าย้อนกลับไป 5 ปีที่แล้วได้ จะเตือนตัวเองเรื่องอะไร?", "ภาพชีวิตที่สมบูรณ์แบบของแกในอีก 10 ปีข้างหน้า หน้าตาเป็นยังไง?"],
    inner: ["ปมในใจ (Insecurity) ที่แกพยายามซ่อนไว้ไม่ให้ใครรู้คืออะไร?", "ร้องไห้ครั้งล่าสุดเมื่อไหร่ และร้องไห้เพราะเรื่องอะไร?"],
    friends: ["ใครในวงนี้ที่แกคิดว่า \"พึ่งพาได้มากที่สุด\" เวลาเดือดร้อน?", "วีรกรรมของกลุ่มเราที่แกจะไม่มีวันลืมคืออะไร?"]
};

// =============================================================
//  APP CONTROLLER
// =============================================================

const App = {
    init() {
        Ripple.attachToAll();
        this.nav();
        Cards.init();
        Croc.init();
        DeepTalk.init();
        this.initLock();
        PinPad.init();
    },

    initLock() {
        const lockBtn = document.getElementById('lock-btn');
        lockBtn.addEventListener('click', () => {
            if (DeepTalk.isUnlocked) {
                DeepTalk.isUnlocked = false;
                lockBtn.innerText = '🔒';
                lockBtn.classList.remove('unlocked');
                Toast.show('Locking secret answers...', 'blue');
                DeepTalk.updateCurrentDisplay();
                return;
            }

            PinPad.show((pin) => {
                if (pin === '03102004') {
                    DeepTalk.isUnlocked = true;
                    lockBtn.innerText = '🔓';
                    lockBtn.classList.add('unlocked');
                    Particles.confetti(['#ff00c8', '#ffffff'], 30);
                    Toast.show('Secret Answers Unlocked! 💖', 'pink');
                    DeepTalk.updateCurrentDisplay();
                    return true; // success
                } else {
                    Toast.show('Incorrect PIN!', 'red');
                    return false; // failure
                }
            });
        });
    },

    nav() {
        const navBtns = document.querySelectorAll('.nav-btn:not(.lock-btn)');
        const sections = document.querySelectorAll('.game-section');

        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const game = btn.dataset.game;
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                sections.forEach(s => {
                    s.classList.remove('active');
                    s.style.display = 'none';
                });

                const target = document.getElementById(game);
                target.style.display = '';
                void target.offsetWidth;
                target.classList.add('active');

                document.body.classList.remove('flash-red');

                const rect = btn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const colors = {
                    'cards': ['#00f2ff', '#00aacc'],
                    'crocodile': ['#39ff14', '#00cc00'],
                    'deep-talk': ['#ff00c8', '#cc0099'],
                };
                Particles.burst(cx, cy, colors[game] || ['#fff'], 14, 100);
            });
        });
    }
};

// =============================================================
//  CARD GAME MODULE
// =============================================================

const Cards = {
    deck: [],
    history: [],

    init() {
        this.reset();
        document.getElementById('draw-btn').addEventListener('click', (e) => this.draw(e));
        document.getElementById('shuffle-btn').addEventListener('click', (e) => this.shuffle(e));
        document.getElementById('reset-cards-btn').addEventListener('click', (e) => this.reset(e));
    },

    createDeck() {
        this.deck = [];
        suits.forEach(suit => {
            values.forEach(value => {
                this.deck.push({
                    value, suit,
                    color: (suit === '♥' || suit === '♦') ? 'card-red' : 'card-black'
                });
            });
        });
    },

    shuffle(e) {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }

        const cardEl = document.getElementById('card-card');
        cardEl.style.transition = 'transform 0.08s';
        let count = 0;
        const shimmy = setInterval(() => {
            cardEl.style.transform = count % 2 === 0 ? 'rotate(-4deg) scale(1.05)' : 'rotate(4deg) scale(1.05)';
            count++;
            if (count >= 6) {
                clearInterval(shimmy);
                cardEl.style.transform = '';
                cardEl.style.transition = '';
            }
        }, 80);

        if (this.deck.length > 0) {
            const cardRect = cardEl.getBoundingClientRect();
            Particles.burst(
                cardRect.left + cardRect.width / 2,
                cardRect.top + cardRect.height / 2,
                ['#00f2ff', '#00aadd', '#ffffff'],
                22, 120
            );
            Toast.show('สลับสำรับเรียบร้อย!', 'blue');
        }
        this.updateCountBadge();
    },

    draw(e) {
        if (this.deck.length === 0) {
            Toast.show('ไพ่หมดสำรับแล้ว! กรุณารีเซ็ต', 'red');
            const cardEl = document.getElementById('card-card');
            const cardRect = cardEl.getBoundingClientRect();
            Particles.burst(
                cardRect.left + cardRect.width / 2,
                cardRect.top + cardRect.height / 2,
                ['#ff3131'],
                12, 80
            );
            return;
        }
        const card = this.deck.pop();
        this.history.unshift(card);
        this.animateFlip(card);
    },

    animateFlip(card) {
        const cardEl = document.getElementById('card-card');
        const valEl = document.getElementById('card-val');
        const valTL = document.getElementById('card-val-tl');
        const valBR = document.getElementById('card-val-br');
        const suitEl = document.getElementById('card-suit');

        cardEl.classList.remove('is-flipping');
        void cardEl.offsetWidth;
        cardEl.classList.add('is-flipping');

        setTimeout(() => {
            valEl.innerText = card.value;
            valTL.innerText = card.value;
            valBR.innerText = card.value;
            suitEl.innerText = card.suit;
            cardEl.className = `card-display is-flipping ${card.color}`;
        }, 280);

        setTimeout(() => {
            cardEl.classList.remove('is-flipping');
            const rect = cardEl.getBoundingClientRect();
            const isRed = card.color === 'card-red';
            Particles.burst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                isRed ? ['#ff3131', '#ff6b6b', '#ff0000'] : ['#00f2ff', '#00aacc', '#ffffff'],
                18, 100
            );
            this.updateHistoryUI();
            this.updateCountBadge();
        }, 580);
    },

    reset(e) {
        this.createDeck();
        this.shuffleSilent();
        this.history = [];

        const cardEl = document.getElementById('card-card');
        cardEl.className = 'card-display';
        document.getElementById('card-val').innerText = '?';
        document.getElementById('card-val-tl').innerText = '?';
        document.getElementById('card-val-br').innerText = '?';
        document.getElementById('card-suit').innerText = '🃏';
        this.updateHistoryUI();
        this.updateCountBadge();

        if (e) {
            Particles.confetti(['#00f2ff', '#ff00c8', '#39ff14', '#ffe600'], 60);
            Toast.show('เริ่มเกมใหม่แล้ว! โชคดีนะ 🎉', 'green');
        }
    },

    shuffleSilent() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },

    updateCountBadge() {
        const badge = document.getElementById('card-count-badge');
        if (badge) badge.innerText = `${this.deck.length} ใบ`;
    },

    updateHistoryUI() {
        const list = document.getElementById('history-list');
        list.innerHTML = '';
        this.history.forEach((card, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';

            const label = document.createElement('span');
            label.className = card.color;
            label.style.fontWeight = '800';
            label.innerText = `${card.value} ${card.suit}`;

            const id = document.createElement('span');
            id.className = 'history-index';
            id.innerText = this.history.length - index;

            item.appendChild(label);
            item.appendChild(id);
            list.appendChild(item);
        });
    }
};

// =============================================================
//  CROCODILE DENTIST MODULE
// =============================================================

const Croc = {
    trapTooth: -1,
    teethCount: 12,

    init() {
        document.getElementById('reset-croc-btn').addEventListener('click', (e) => this.reset());
        this.reset();
    },

    reset() {
        this.trapTooth = Math.floor(Math.random() * this.teethCount);
        const container = document.getElementById('teeth-container');
        const resetBtn = document.getElementById('reset-croc-btn');
        const crocEl = document.getElementById('croc-mouth');

        container.innerHTML = '';
        document.body.classList.remove('flash-red');
        crocEl.classList.remove('danger');
        resetBtn.classList.add('hidden');

        for (let i = 0; i < this.teethCount; i++) {
            const tooth = document.createElement('div');
            tooth.className = 'tooth';
            tooth.addEventListener('click', (e) => this.handlePress(i, tooth));
            container.appendChild(tooth);
        }
    },

    handlePress(index, el) {
        if (index === this.trapTooth) {
            el.classList.add('trap');
            document.body.classList.add('flash-red');
            document.getElementById('croc-mouth').classList.add('danger');
            document.getElementById('reset-croc-btn').classList.remove('hidden');
            document.querySelectorAll('.tooth').forEach(t => t.classList.add('pressed'));

            screenShake();
            const rect = el.getBoundingClientRect();
            Particles.burst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                ['#ff3131', '#ff0000', '#ff6060', '#ffaaaa'],
                40, 200
            );
            Toast.show('มึงโดน! 💀', 'red');

        } else {
            el.classList.add('pressed');
            const rect = el.getBoundingClientRect();
            Particles.burst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                ['#ffffff', '#dddddd'],
                6, 50
            );
        }
    }
};

// =============================================================
//  DEEP TALK MODULE
// =============================================================

const DeepTalk = {
    currentCat: 'love',
    pools: {},
    currentQuestion: null,
    isUnlocked: false,

    init() {
        this.resetPools(false);
        this.initChips();
        document.getElementById('next-q-btn').addEventListener('click', (e) => this.next(e));
        document.getElementById('reset-q-btn').addEventListener('click', (e) => this.resetAll(e));
    },

    resetPools(showToast = true) {
        Object.keys(ques).forEach(cat => {
            this.pools[cat] = [...ques[cat]];
        });
        this.currentQuestion = null;
        this.updateCurrentDisplay('พร้อมจะขุดความลับหรือยัง? <br> เลือกหมวดหมู่แล้วกด "ถัดไป" ได้เลย!');
        if (showToast) Toast.show('รีเซ็ตคำถามทั้งหมดแล้ว', 'pink');
    },

    resetAll(e) {
        this.resetPools(true);
        const rect = document.getElementById('next-q-btn').getBoundingClientRect();
        Particles.confetti(['#ff00c8', '#ff69b4', '#c800a0', '#ffffff'], 70);
    },

    initChips() {
        const chips = document.querySelectorAll('.chip');
        const label = document.getElementById('q-category-label');

        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentCat = chip.dataset.cat;
                label.innerText = `หมวดหมู่: ${chip.innerText}`;

                const rect = chip.getBoundingClientRect();
                Particles.burst(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    ['#ff00c8', '#ff69b4', '#ffffff'],
                    12, 80
                );

                this.swapText(`เปลี่ยนเป็นหมวด ${chip.innerText} แล้ว!<br>กดปุ่มด้านล่างเพื่อเริ่ม`);
                this.currentQuestion = null;
            });
        });
    },

    updateCurrentDisplay(overrideHtml = null) {
        if (overrideHtml) {
            this.swapText(overrideHtml);
            return;
        }
        if (!this.currentQuestion) return;

        let content = typeof this.currentQuestion === 'string' ? this.currentQuestion : this.currentQuestion.q;
        if (this.isUnlocked && this.currentQuestion.a) {
            content += `
                <div class="secret-answer-block">
                    <span class="secret-label">Secret Answer</span>
                    ${this.currentQuestion.a}
                </div>
            `;
        }
        this.swapText(content);
    },

    swapText(html) {
        const textEl = document.getElementById('question-text');
        textEl.classList.add('fading');
        setTimeout(() => {
            textEl.innerHTML = html;
            textEl.classList.remove('fading');
        }, 250);
    },

    next(e) {
        const pool = this.pools[this.currentCat];
        if (pool.length === 0) {
            this.pools[this.currentCat] = [...ques[this.currentCat]];
            this.currentQuestion = null;
            this.updateCurrentDisplay('หมดคลังคำถามหมวดนี้แล้ว! กำลังรีเซ็ต...');
            Toast.show('คำถามหมวดนี้หมดแล้ว รีเซ็ตให้เรียบร้อย!', 'pink');
            return;
        }
        const index = Math.floor(Math.random() * pool.length);
        this.currentQuestion = pool.splice(index, 1)[0];

        this.updateCurrentDisplay();

        if (e && e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            Particles.burst(
                rect.left + rect.width / 2,
                rect.top,
                ['#ff00c8', '#ffffff'],
                10, 70
            );
        }
    }
};

// =============================================================
//  PIN PAD MODULE
// =============================================================

const PinPad = {
    currentPin: '',
    onSuccess: null,
    modal: null,
    dots: [],

    init() {
        this.modal = document.getElementById('pin-modal');
        if (!this.modal) return;
        this.dots = Array.from(this.modal.querySelectorAll('.pin-dot'));

        this.modal.querySelectorAll('.key').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = btn.innerText;
                if (val === 'C') {
                    this.clear();
                } else if (val === '←') {
                    this.backspace();
                } else {
                    this.add(val);
                }

                // Key press effect
                const rect = btn.getBoundingClientRect();
                Particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#ff00c8', '#ffffff'], 6, 40);
            });
        });

        document.getElementById('close-pin-btn').addEventListener('click', () => this.hide());

        // Handle keyboard input
        window.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            if (e.key >= '0' && e.key <= '9') this.add(e.key);
            if (e.key === 'Backspace') this.backspace();
            if (e.key === 'Escape') this.hide();
        });
    },

    show(callback) {
        this.clear();
        this.onSuccess = callback;
        this.modal.classList.add('active');
        void this.modal.offsetWidth;
    },

    hide() {
        this.modal.classList.remove('active');
    },

    add(num) {
        if (this.currentPin.length >= 8) return;
        this.currentPin += num;
        this.updateDots();

        if (this.currentPin.length === 8) {
            this.submit();
        }
    },

    backspace() {
        this.currentPin = this.currentPin.slice(0, -1);
        this.updateDots();
    },

    clear() {
        this.currentPin = '';
        this.updateDots();
    },

    updateDots() {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('filled', i < this.currentPin.length);
        });
    },

    submit() {
        const success = this.onSuccess(this.currentPin);
        if (success) {
            this.hide();
        } else {
            this.shake();
            this.clear();
        }
    },

    shake() {
        const container = this.modal.querySelector('.pin-container');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 400);
        if (typeof screenShake === 'function') screenShake();
    }
};

// =============================================================
//  BOOT
// =============================================================

document.addEventListener('DOMContentLoaded', () => App.init());
