/* ====================================================
   AUTH.JS — Login, Register, Forgot Password Logic
   Particle canvas, form switching, OTP, password strength
   ==================================================== */

/* ── Particle Canvas Animation ─────────────────────── */
(function initParticleCanvas() {
    const canvas = document.getElementById('auth-bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(Math.random() * 0.5 + 0.2),
            alpha: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.6 ? '16,185,129' : Math.random() > 0.3 ? '99,102,241' : '245,158,11'
        };
    }

    function initParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 12000);
        for (let i = 0; i < count; i++) particles.push(createParticle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(16,185,129,${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections();

        particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.y < -5) { particles[idx] = createParticle(); particles[idx].y = canvas.height + 5; }
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); initParticles(); });
    resize();
    initParticles();
    animate();
})();


/* ── Role Tab Logic ────────────────────────────────── */
document.querySelectorAll('.role-tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.role-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            tabGroup.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});


/* ── Form Switcher ─────────────────────────────────── */
function showForm(id) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
}


/* ── Password Toggle ───────────────────────────────── */
function togglePass(inputId, btn) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    const isPass = inp.type === 'password';
    inp.type = isPass ? 'text' : 'password';
    btn.querySelector('i').className = isPass ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
}

document.getElementById('login-pass-toggle').addEventListener('click', function() {
    togglePass('login-password', this);
});

document.getElementById('reg-pass-toggle').addEventListener('click', function() {
    togglePass('reg-password', this);
});


/* ── Password Strength Meter ───────────────────────── */
document.getElementById('reg-password').addEventListener('input', function() {
    const val = this.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const colors = ['', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];
    const labels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];

    for (let i = 1; i <= 4; i++) {
        const seg = document.getElementById('s' + i);
        seg.style.background = i <= score ? colors[score] : 'var(--border-color)';
    }
    document.getElementById('strength-label').textContent = labels[score] || '';
    document.getElementById('strength-label').style.color = colors[score] || 'var(--text-muted)';
});


/* ── Alert Helper ──────────────────────────────────── */
function showAlert(id, msg, type) {
    const el = document.getElementById(id);
    el.className = `auth-alert ${type} show`;
    el.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${msg}`;
}

function hideAlert(id) {
    const el = document.getElementById(id);
    el.className = 'auth-alert';
}


/* ── Button Loading State ──────────────────────────── */
function setLoading(btnId, spinnerId, loading) {
    const btn = document.getElementById(btnId);
    const spinner = document.getElementById(spinnerId);
    const text = btn ? btn.querySelector('.btn-text') : null;
    if (loading) {
        btn.disabled = true;
        if (text) text.style.display = 'none';
        spinner.style.display = 'block';
    } else {
        btn.disabled = false;
        if (text) text.style.display = '';
        spinner.style.display = 'none';
    }
}


/* ── LOGIN FORM SUBMIT ─────────────────────────────── */
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    hideAlert('login-alert');

    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const role = document.querySelector('#login-role-tabs .role-tab.active').dataset.role;

    if (!email || !pass) {
        showAlert('login-alert', 'Please fill in all fields.', 'error');
        return;
    }

    setLoading('login-submit-btn', 'login-spinner', true);

    // Simulate API authentication
    setTimeout(() => {
        setLoading('login-submit-btn', 'login-spinner', false);

        // Demo credentials
        const DEMO = { farmer: '9876543210', buyer: 'buyer@fresh.com', admin: 'admin@agri.com' };
        const isValid = email === DEMO[role] || pass.length >= 4;

        if (isValid) {
            showAlert('login-alert', `Welcome back! Redirecting to ${role} dashboard...`, 'success');
            // Store session
            sessionStorage.setItem('agri_role', role);
            sessionStorage.setItem('agri_user', email);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        } else {
            showAlert('login-alert', 'Invalid credentials. Please check and try again.', 'error');
        }
    }, 1500);
});


/* ── REGISTER FORM SUBMIT ──────────────────────────── */
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    hideAlert('register-alert');

    const name  = document.getElementById('reg-name').value.trim();
    const mob   = document.getElementById('reg-mobile').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass  = document.getElementById('reg-password').value;
    const role  = document.querySelector('#register-role-tabs .role-tab.active').dataset.role;

    if (!name || !mob || !email || !pass) {
        showAlert('register-alert', 'Please fill all required fields.', 'error');
        return;
    }

    if (pass.length < 8) {
        showAlert('register-alert', 'Password must be at least 8 characters.', 'error');
        return;
    }

    setLoading('register-submit-btn', 'register-spinner', true);

    setTimeout(() => {
        setLoading('register-submit-btn', 'register-spinner', false);
        showAlert('register-alert', `Account created! OTP sent to ${mob}. Redirecting...`, 'success');
        sessionStorage.setItem('agri_role', role);
        sessionStorage.setItem('agri_user', email);
        setTimeout(() => { window.location.href = 'index.html'; }, 1800);
    }, 2000);
});


/* ── FORGOT PASSWORD — OTP Flow ────────────────────── */
let otpTimerInterval = null;
let fpCurrentStep = 1;

function setFPStep(step) {
    fpCurrentStep = step;
    document.getElementById('forgot-step-1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('forgot-step-2').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('forgot-step-3').style.display = step === 3 ? 'block' : 'none';

    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('fp-step-' + i);
        dot.className = 'step-dot' + (i < step ? ' complete' : i === step ? ' active' : '');
    }
}

function sendOTP() {
    const val = document.getElementById('forgot-mobile').value.trim();
    if (!val) {
        showAlert('forgot-alert', 'Please enter your registered mobile or email.', 'error');
        return;
    }
    hideAlert('forgot-alert');

    document.getElementById('otp-sent-to').textContent = val;
    setFPStep(2);

    // Set up OTP auto-focus
    setupOTPInputs();
    startOTPTimer(120);

    showAlert('forgot-alert', `OTP sent to ${val}. Use 1 2 3 4 5 6 for demo.`, 'success');
}

function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach((inp, i) => {
        inp.value = '';
        inp.addEventListener('input', () => {
            if (inp.value.length === 1 && i < inputs.length - 1) {
                inputs[i + 1].focus();
            }
        });
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !inp.value && i > 0) {
                inputs[i - 1].focus();
            }
        });
    });
    inputs[0].focus();
}

function startOTPTimer(seconds) {
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    const timerEl = document.getElementById('otp-timer');
    let remaining = seconds;

    otpTimerInterval = setInterval(() => {
        remaining--;
        const m = String(Math.floor(remaining / 60)).padStart(2, '0');
        const s = String(remaining % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
        if (remaining <= 0) {
            clearInterval(otpTimerInterval);
            timerEl.textContent = 'Expired';
            timerEl.style.color = 'var(--danger)';
        }
    }, 1000);
}

function verifyOTP() {
    const otp = ['otp-1','otp-2','otp-3','otp-4','otp-5','otp-6']
        .map(id => document.getElementById(id).value).join('');

    if (otp === '123456') {
        clearInterval(otpTimerInterval);
        hideAlert('forgot-alert');
        setFPStep(3);
        showAlert('forgot-alert', 'OTP verified! Set your new password below.', 'success');
    } else {
        showAlert('forgot-alert', 'Invalid OTP. Try 1 2 3 4 5 6 for demo.', 'error');
    }
}

function resetPassword() {
    const np = document.getElementById('new-pass').value;
    const cp = document.getElementById('confirm-pass').value;

    if (!np || np.length < 8) {
        showAlert('forgot-alert', 'Password must be at least 8 characters.', 'error');
        return;
    }

    if (np !== cp) {
        showAlert('forgot-alert', 'Passwords do not match.', 'error');
        return;
    }

    hideAlert('forgot-alert');
    showAlert('forgot-alert', 'Password reset successful! Redirecting to login...', 'success');

    setTimeout(() => {
        showForm('form-login');
        showAlert('login-alert', 'Password reset successful. Please sign in with your new password.', 'success');
    }, 1600);
}


/* ── Social Login Simulation ───────────────────────── */
function socialLogin(provider) {
    const alerts = { google: 'Redirecting to Google OAuth...', aadhaar: 'Launching Aadhaar OTP verification...' };
    showAlert('login-alert', alerts[provider] || 'Redirecting...', 'success');
    setTimeout(() => {
        sessionStorage.setItem('agri_role', 'farmer');
        sessionStorage.setItem('agri_user', 'social@user.com');
        window.location.href = 'index.html';
    }, 1800);
}


/* ── Demo Auto-fill hint ───────────────────────────── */
(function addDemoHint() {
    const hint = document.createElement('div');
    hint.style.cssText = `
        position:fixed; top:16px; left:50%; transform:translateX(-50%);
        background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25);
        color:#10b981; padding:8px 20px; border-radius:20px; font-size:0.75rem;
        z-index:200; white-space:nowrap; backdrop-filter:blur(8px);
        font-family:'Inter',sans-serif; letter-spacing:0.3px;
        animation: fadeDown 0.5s ease 0.5s both;
    `;
    hint.innerHTML = '<i class="fa-solid fa-circle-info"></i> &nbsp;Demo: Enter any mobile/email + password (4+ chars) to proceed';
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 6000);
})();

const fadeStyle = document.createElement('style');
fadeStyle.textContent = `@keyframes fadeDown { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`;
document.head.appendChild(fadeStyle);
