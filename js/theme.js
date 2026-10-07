function setThemePreset(preset) {
    localStorage.setItem('meowkas_theme', preset);
    localStorage.removeItem('meowkas_custom_bg');
    applyTheme();
}

function adjustBrightness(val) {
    localStorage.setItem('meowkas_brightness', val);
    const bVal = document.getElementById('brightnessVal');
    if (bVal) bVal.innerText = val;
    applyTheme();
}

function applyCustomColors() {
    const bg = document.getElementById('customBgColor').value;
    const dark = document.getElementById('customShadowDark').value;
    const light = document.getElementById('customShadowLight').value;

    localStorage.setItem('meowkas_theme', 'custom');
    localStorage.setItem('meowkas_custom_bg', bg);
    localStorage.setItem('meowkas_custom_dark', dark);
    localStorage.setItem('meowkas_custom_light', light);

    applyTheme();
}

function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function applyTheme() {
    const theme = localStorage.getItem('meowkas_theme') || 'white';
    const b = parseInt(localStorage.getItem('meowkas_brightness') || '0', 10);
    const slider = document.getElementById('brightnessSlider');
    if (slider) slider.value = b;
    const bVal = document.getElementById('brightnessVal');
    if (bVal) bVal.innerText = b;

    const root = document.documentElement;

    if (theme === 'custom') {
        const bg = localStorage.getItem('meowkas_custom_bg') || '#e2e8f0';
        const dark = localStorage.getItem('meowkas_custom_dark') || '#b0bdcf';
        const light = localStorage.getItem('meowkas_custom_light') || '#ffffff';

        root.style.setProperty('--bg-color', bg);
        root.style.setProperty('--flat-surface', bg);
        root.style.setProperty('--shadow-light', light);
        root.style.setProperty('--shadow-dark', dark);

        const rgb = hexToRgb(bg);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        if (luminance > 0.5) {
            root.style.setProperty('--text-color', '#0f172a');
            root.style.setProperty('--text-muted', '#64748b');
            root.style.setProperty('--primary-accent', '#0f172a');
            root.style.setProperty('--accent-contrast', '#ffffff');
        } else {
            root.style.setProperty('--text-color', '#f8fafc');
            root.style.setProperty('--text-muted', '#94a3b8');
            root.style.setProperty('--primary-accent', '#f8fafc');
            root.style.setProperty('--accent-contrast', '#0f172a');
        }

        const elBg = document.getElementById('customBgColor');
        const elDk = document.getElementById('customShadowDark');
        const elLt = document.getElementById('customShadowLight');
        if (elBg) elBg.value = bg;
        if (elDk) elDk.value = dark;
        if (elLt) elLt.value = light;
        return;
    }

    if (theme === 'dark') {
        const base = Math.max(14, Math.min(36, 20 + b));
        root.style.setProperty('--bg-color', `hsl(222, 22%, ${base}%)`);
        root.style.setProperty('--flat-surface', `hsl(222, 22%, ${base}%)`);
        root.style.setProperty('--shadow-light', `hsl(222, 22%, ${base + 7}%)`);
        root.style.setProperty('--shadow-dark', `hsl(222, 25%, ${Math.max(5, base - 9)}%)`);
        root.style.setProperty('--text-color', '#f8fafc');
        root.style.setProperty('--text-muted', '#94a3b8');
        root.style.setProperty('--primary-accent', '#f8fafc');
        root.style.setProperty('--accent-contrast', '#0f172a');
    } else if (theme === 'pink') {
        const base = Math.max(68, Math.min(94, 86 + b));
        root.style.setProperty('--bg-color', `hsl(350, 36%, ${base}%)`);
        root.style.setProperty('--flat-surface', `hsl(350, 36%, ${base}%)`);
        root.style.setProperty('--shadow-light', `hsl(350, 36%, ${Math.min(100, base + 8)}%)`);
        root.style.setProperty('--shadow-dark', `hsl(350, 36%, ${base - 14}%)`);
        root.style.setProperty('--text-color', '#4c0519');
        root.style.setProperty('--text-muted', '#881337');
        root.style.setProperty('--primary-accent', '#be185d');
        root.style.setProperty('--accent-contrast', '#ffffff');
    } else if (theme === 'blue') {
        const base = Math.max(68, Math.min(94, 86 + b));
        root.style.setProperty('--bg-color', `hsl(210, 40%, ${base}%)`);
        root.style.setProperty('--flat-surface', `hsl(210, 40%, ${base}%)`);
        root.style.setProperty('--shadow-light', `hsl(210, 40%, ${Math.min(100, base + 8)}%)`);
        root.style.setProperty('--shadow-dark', `hsl(210, 40%, ${base - 14}%)`);
        root.style.setProperty('--text-color', '#082f49');
        root.style.setProperty('--text-muted', '#0369a1');
        root.style.setProperty('--primary-accent', '#0284c7');
        root.style.setProperty('--accent-contrast', '#ffffff');
    } else {
        const base = Math.max(72, Math.min(96, 90 + b));
        root.style.setProperty('--bg-color', `hsl(215, 24%, ${base}%)`);
        root.style.setProperty('--flat-surface', `hsl(215, 24%, ${base}%)`);
        root.style.setProperty('--shadow-light', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--shadow-dark', `hsl(215, 25%, ${base - 16}%)`);
        root.style.setProperty('--text-color', '#0f172a');
        root.style.setProperty('--text-muted', '#64748b');
        root.style.setProperty('--primary-accent', '#0f172a');
        root.style.setProperty('--accent-contrast', '#ffffff');
    }
}
