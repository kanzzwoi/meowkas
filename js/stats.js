function renderStatsChart() {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const catTotals = {};
    let totalExp = 0;

    cachedTransactions.filter(t => t.type === 'expense').forEach(t => {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
        totalExp += t.amount;
    });

    const legendEl = document.getElementById('chartLegend');
    legendEl.innerHTML = '';

    const brightColors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ec4899', 
        '#8b5cf6', '#06b6d4', '#f97316', '#64748b'
    ];

    const entries = Object.entries(catTotals);
    if (entries.length === 0 || totalExp === 0) {
        ctx.beginPath();
        ctx.arc(110, 110, 75, 0, 2 * Math.PI);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 26;
        ctx.stroke();
        legendEl.innerHTML = '<p class="text-xs text-center opacity-60">Belum ada data pengeluaran untuk dianalisis.</p>';
        return;
    }

    let startAngle = -0.5 * Math.PI;
    entries.forEach(([cat, val], idx) => {
        const sliceAngle = (val / totalExp) * 2 * Math.PI;
        const color = brightColors[idx % brightColors.length];

        ctx.beginPath();
        ctx.arc(110, 110, 75, startAngle, startAngle + sliceAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 26;
        ctx.stroke();

        startAngle += sliceAngle;
        const pct = Math.round((val / totalExp) * 100);
        legendEl.innerHTML += `
            <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full flex-shrink-0" style="background: ${color};"></span>
                    <span class="font-bold">${escapeHtml(cat)}</span>
                </div>
                <span class="font-extrabold">${pct}% <span class="font-semibold opacity-75">(${formatRp(val)})</span></span>
            </div>
        `;
    });
}

function calculateAllocationRules() {
    const salary = parseCurrency(document.getElementById('allocationSalaryInput').value);
    localStorage.setItem('meowkas_salary_target', salary);

    document.getElementById('allocPokok').innerText = formatRp(salary * 0.60);
    document.getElementById('allocTabungan').innerText = formatRp(salary * 0.20);
    document.getElementById('allocKeinginan').innerText = formatRp(salary * 0.10);
    document.getElementById('allocSosial').innerText = formatRp(salary * 0.10);
}
