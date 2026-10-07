let currentActiveTabIndex = 0;

function openModal(id) { 
    const el = document.getElementById(id);
    if (el) el.classList.add('active'); 
}

function closeModal(id) { 
    const el = document.getElementById(id);
    if (el) el.classList.remove('active'); 
}

function switchTab(idx) {
    currentActiveTabIndex = idx;
    window.scrollTo(0, 0);
    document.querySelectorAll('.tab-content').forEach((tab, i) => {
        tab.classList.toggle('active', i === idx);
    });
    moveNavBall(idx);

    if (idx === 2) renderStatsChart();
}

function moveNavBall(idx) {
    const ball = document.getElementById('navBall');
    const btns = document.querySelectorAll('.nav-btn');
    if (!ball || !btns[idx]) return;
    const targetBtn = btns[idx];
    const targetLeft = targetBtn.offsetLeft + (targetBtn.offsetWidth / 2) - 21;
    ball.style.transform = `translateX(${targetLeft}px)`;
    btns.forEach((b, i) => b.classList.toggle('active', i === idx));
}

window.addEventListener('resize', () => moveNavBall(currentActiveTabIndex));

document.addEventListener("DOMContentLoaded", async () => {
    applyTheme();
    await initDB();

    const savedResetDay = localStorage.getItem('meowkas_reset_day') || '1';
    if (document.getElementById('budgetResetDayInput')) {
        document.getElementById('budgetResetDayInput').value = savedResetDay;
    }

    await loadDashboard();

    const savedSal = localStorage.getItem('meowkas_salary_target');
    if (savedSal && document.getElementById('allocationSalaryInput')) {
        document.getElementById('allocationSalaryInput').value = new Intl.NumberFormat('id-ID').format(savedSal);
        calculateAllocationRules();
    }

    const isNotifEnabled = localStorage.getItem('meowkas_notif_enabled') === 'true';
    const toggleEl = document.getElementById('savingsNotifToggle');
    const savedTime = localStorage.getItem('meowkas_notif_time') || '13:00';
    
    if (document.getElementById('savingsNotifTimeInput')) {
        document.getElementById('savingsNotifTimeInput').value = savedTime;
    }

    if (toggleEl) {
        toggleEl.checked = isNotifEnabled;
        document.getElementById('notifStatusText').innerText = isNotifEnabled ? `Aktif tiap hari pkl ${savedTime} WIB` : "Notifikasi HP harian";
    }

    checkScheduledNotification();
    setInterval(checkScheduledNotification, 30000);

    switchTab(0);
    requestAnimationFrame(() => moveNavBall(0));
    setTimeout(() => moveNavBall(0), 150);
    setTimeout(() => moveNavBall(0), 400);
});
