let cachedTransactions = [];
let currentTrxFilterType = 'all';
let currentReceiptTrxId = null;
let trxDisplayLimit = 7;

function formatRp(num) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(num || 0));
}

function formatCurrencyInput(el) {
    let val = el.value.replace(/\D/g, '');
    if (!val) {
        el.value = '';
        return;
    }
    el.value = new Intl.NumberFormat('id-ID').format(parseInt(val, 10));
}

function parseCurrency(str) {
    if (!str) return 0;
    return parseInt(String(str).replace(/\D/g, ''), 10) || 0;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

const expenseCategories = [
    "Makanan & Minuman",
    "Barang Fisik & Kebutuhan",
    "Barang Elektronik",
    "Cicilan / Hutang",
    "Perbaikan Barang",
    "Transportasi",
    "Hiburan & Jajan",
    "Lainnya"
];

const incomeCategories = [
    "Gaji Pokok",
    "Penghasilan Tambahan",
    "Uang Saku / Pemberian",
    "Hasil Usaha / Freelance",
    "Lainnya"
];

const catIcons = {
    "Makanan & Minuman": '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>',
    "Barang Fisik & Kebutuhan": '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',
    "Barang Elektronik": '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
    "Cicilan / Hutang": '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
    "Perbaikan Barang": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
    "Transportasi": '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
    "Hiburan & Jajan": '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
    "Gaji Pokok": '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
    "Penghasilan Tambahan": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
    "Uang Saku / Pemberian": '<path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>',
    "Hasil Usaha / Freelance": '<circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="6" x2="12" y2="8"></line><line x1="12" y1="16" x2="12" y2="18"></line>',
    "Tabungan": '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>',
    "Lainnya": '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>'
};

function openTxModal(type) {
    document.getElementById('txType').value = type;
    const isInc = type === 'income';
    document.getElementById('txModalTitle').innerText = isInc ? 'Catat Pemasukan' : 'Catat Pengeluaran';
    
    const sel = document.getElementById('txCategorySelect');
    sel.innerHTML = '';
    const list = isInc ? incomeCategories : expenseCategories;
    list.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.innerText = cat;
        sel.appendChild(opt);
    });

    document.getElementById('txAmountInput').value = '';
    document.getElementById('txNoteInput').value = '';
    
    const billGrp = document.getElementById('txBillReminderGroup');
    if (isInc) billGrp.classList.add('hidden');
    else billGrp.classList.remove('hidden');

    document.getElementById('txIsBillCheck').checked = false;
    document.getElementById('txBillDueDateField').classList.add('hidden');
    document.getElementById('txDueDateInput').value = '';

    openModal('txSheet');
}

function toggleBillDateField(checked) {
    document.getElementById('txBillDueDateField').classList.toggle('hidden', !checked);
}

async function submitTransaction() {
    const type = document.getElementById('txType').value;
    const amount = parseCurrency(document.getElementById('txAmountInput').value);
    const category = document.getElementById('txCategorySelect').value;
    const note = document.getElementById('txNoteInput').value.trim();
    const isBill = document.getElementById('txIsBillCheck').checked;
    const dueDate = isBill ? document.getElementById('txDueDateInput').value : null;

    if (amount <= 0) return showToast("Masukkan nominal uang yang valid!");
    if (isBill && !dueDate) return showToast("Pilih tanggal jatuh tempo tagihan!");

    await dbOp.add("transactions", {
        type,
        amount,
        category,
        note,
        isBill,
        dueDate,
        date: new Date().toISOString()
    });

    closeModal('txSheet');
    showToast("Transaksi berhasil dicatat.");
    loadDashboard();
}

function getBillingCycleRange() {
    const resetDay = parseInt(localStorage.getItem('meowkas_reset_day') || '1', 10);
    const now = new Date();
    let start, end;

    if (now.getDate() >= resetDay) {
        start = new Date(now.getFullYear(), now.getMonth(), resetDay, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, resetDay, 0, 0, 0);
    } else {
        start = new Date(now.getFullYear(), now.getMonth() - 1, resetDay, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), resetDay, 0, 0, 0);
    }
    return { start, end, resetDay };
}

function saveBudgetResetDay(val) {
    let day = parseInt(val, 10);
    if (isNaN(day) || day < 1) day = 1;
    if (day > 31) day = 31;
    localStorage.setItem('meowkas_reset_day', day);
    document.getElementById('budgetResetDayInput').value = day;
    showToast(`Siklus bulanan direset tiap tgl ${day}`);
    loadDashboard();
}

async function loadDashboard() {
    cachedTransactions = await dbOp.getAll("transactions");
    cachedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    const { start: cycleStart, end: cycleEnd, resetDay } = getBillingCycleRange();
    document.getElementById('cycleBadgeDisplay').innerText = `Siklus Tgl ${resetDay}`;

    const now = new Date();
    let totalIncome = 0;
    let totalExpense = 0;
    let cycleIncome = 0;
    let cycleExpense = 0;
    let billAlert = null;

    cachedTransactions.forEach(t => {
        const d = new Date(t.date);
        const inCycle = d >= cycleStart && d < cycleEnd;

        if (t.type === 'income') {
            totalIncome += t.amount;
            if (inCycle) cycleIncome += t.amount;
        } else {
            totalExpense += t.amount;
            if (inCycle) cycleExpense += t.amount;

            if (t.isBill && t.dueDate && !billAlert) {
                const due = new Date(t.dueDate);
                const diffTime = due - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays <= 3) {
                    billAlert = { cat: t.category, diff: diffDays, amt: t.amount };
                }
            }
        }
    });

    const netBalance = totalIncome - totalExpense;
    const reserveMin = Math.round(cycleIncome * 0.20);

    document.getElementById('balanceDisplay').innerText = formatRp(netBalance);
    document.getElementById('expenseDisplay').innerText = formatRp(cycleExpense);
    document.getElementById('reserveDisplay').innerText = formatRp(reserveMin);

    const autoLimit = cycleIncome > 0 ? cycleIncome : 1500000;
    const pct = Math.min(100, Math.round((cycleExpense / autoLimit) * 100));
    document.getElementById('budgetProgressBar').style.width = `${pct}%`;
    document.getElementById('budgetPct').innerText = `${pct}%`;
    document.getElementById('budgetSpent').innerText = `Terpakai: ${formatRp(cycleExpense)}`;
    document.getElementById('budgetLimit').innerText = `Limit: ${formatRp(autoLimit)} (Auto)`;

    const pb = document.getElementById('budgetProgressBar');
    if (pct >= 90) pb.style.background = 'var(--danger-color)';
    else if (pct >= 75) pb.style.background = 'var(--warning-color)';
    else pb.style.background = 'var(--primary-accent)';

    const banner = document.getElementById('billBanner');
    if (billAlert) {
        banner.classList.remove('hidden');
        document.getElementById('billBannerTitle').innerText = billAlert.diff === 0 ? `Hari Ini: ${billAlert.cat}` : `H-${billAlert.diff}: ${billAlert.cat}`;
        document.getElementById('billBannerDesc').innerText = `Tagihan ${formatRp(billAlert.amt)} mendekati jatuh tempo.`;
    } else {
        banner.classList.add('hidden');
    }

    renderFilteredTransactions();
    loadSavings();
}

function dismissBillAlert() {
    document.getElementById('billBanner').classList.add('hidden');
}

function onSearchChange() {
    trxDisplayLimit = 7;
    renderFilteredTransactions();
}

function setTrxFilter(type) {
    currentTrxFilterType = type;
    trxDisplayLimit = 7;
    document.getElementById('filterAll').className = type === 'all' ? 'neu-accent-btn px-3 py-1.5 text-[10px] font-bold' : 'neu-btn px-3 py-1.5 text-[10px] font-bold';
    document.getElementById('filterExp').className = type === 'expense' ? 'neu-accent-btn px-3 py-1.5 text-[10px] font-bold' : 'neu-btn px-3 py-1.5 text-[10px] font-bold';
    document.getElementById('filterInc').className = type === 'income' ? 'neu-accent-btn px-3 py-1.5 text-[10px] font-bold' : 'neu-btn px-3 py-1.5 text-[10px] font-bold';
    renderFilteredTransactions();
}

function expandTrxLimit() {
    trxDisplayLimit += 7;
    renderFilteredTransactions();
}

function renderFilteredTransactions() {
    const listEl = document.getElementById('transactionList');
    const keyword = (document.getElementById('trxSearchInput')?.value || '').toLowerCase().trim();

    let filtered = cachedTransactions.filter(t => {
        if (currentTrxFilterType !== 'all' && t.type !== currentTrxFilterType) return false;
        if (!keyword) return true;
        const matchCat = (t.category || '').toLowerCase().includes(keyword);
        const matchNote = (t.note || '').toLowerCase().includes(keyword);
        return matchCat || matchNote;
    });

    document.getElementById('trxTotalCount').innerText = `${filtered.length} Catatan`;

    if (filtered.length === 0) {
        listEl.innerHTML = '<div class="neu-flat p-6 text-center text-xs opacity-60">Tidak ada riwayat transaksi.</div>';
        return;
    }

    const visibleItems = filtered.slice(0, trxDisplayLimit);

    let html = visibleItems.map(t => {
        const isInc = t.type === 'income';
        const color = isInc ? 'text-[var(--success-color)]' : 'text-[var(--danger-color)]';
        const sign = isInc ? '+' : '-';
        const iconSvg = catIcons[t.category] || catIcons['Lainnya'];
        const d = new Date(t.date);
        const dateFormatted = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeFormatted = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const noteHtml = t.note 
            ? `<p class="text-[11px] font-semibold mt-0.5 break-words line-clamp-1" style="color: var(--text-color);">${escapeHtml(t.note)}</p>` 
            : '';

        return `
            <div onclick="openReceiptModal(${t.id})" class="neu-flat p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="w-9 h-9 neu-pressed rounded-xl flex-shrink-0 flex items-center justify-center ${color}">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${iconSvg}</svg>
                    </div>
                    <div class="min-w-0 flex-1 pr-2">
                        <h4 class="font-extrabold text-xs truncate" style="color: var(--text-muted); text-transform: uppercase;">${escapeHtml(t.category)}</h4>
                        ${noteHtml}
                        <span class="text-[10px] block opacity-75 mt-0.5 font-bold" style="color: var(--text-muted);">${dateFormatted} • ${timeFormatted} WIB</span>
                    </div>
                </div>
                <span class="font-black text-xs flex-shrink-0 ml-2 ${color}">${sign}${formatRp(t.amount)}</span>
            </div>
        `;
    }).join('');

    if (filtered.length > trxDisplayLimit) {
        const remaining = filtered.length - trxDisplayLimit;
        html += `
            <button type="button" onclick="expandTrxLimit()" class="neu-btn w-full py-3 text-xs font-black text-[var(--primary-accent)] flex items-center justify-center gap-1.5 mt-1">
                <span>Lihat Lainnya (${remaining} lagi)</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
        `;
    }

    listEl.innerHTML = html;
}

function openReceiptModal(id) {
    const t = cachedTransactions.find(item => item.id === id);
    if (!t) return;
    currentReceiptTrxId = id;

    const isInc = t.type === 'income';
    const colorClass = isInc ? 'text-[var(--success-color)]' : 'text-[var(--danger-color)]';
    const sign = isInc ? '+' : '-';

    document.getElementById('receiptTypeLabel').innerText = isInc ? 'Pemasukan Kas' : 'Pengeluaran Kas';
    const amtEl = document.getElementById('receiptAmountDisplay');
    amtEl.innerText = `${sign}${formatRp(t.amount)}`;
    amtEl.className = `text-2xl font-black mb-3 mt-1 tracking-tight ${colorClass}`;

    document.getElementById('receiptCategoryDisplay').innerText = t.category || '-';
    document.getElementById('receiptNoteDisplay').innerText = t.note && t.note.trim() !== '' ? t.note : 'Tidak ada catatan tambahan.';

    const d = new Date(t.date);
    const dateStr = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('receiptDateTimeDisplay').innerText = `${dateStr}, ${timeStr} WIB`;

    const billGroup = document.getElementById('receiptBillInfoGroup');
    if (t.isBill && t.dueDate) {
        billGroup.classList.remove('hidden');
        document.getElementById('receiptBillDateDisplay').innerText = `Tempo: ${new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
        billGroup.classList.add('hidden');
    }

    openModal('receiptModalBackdrop');
}

function closeReceiptModal() {
    closeModal('receiptModalBackdrop');
    currentReceiptTrxId = null;
}

async function deleteCurrentReceiptTrx() {
    if (!currentReceiptTrxId) return;
    await dbOp.delete("transactions", currentReceiptTrxId);
    closeReceiptModal();
    showToast("Transaksi berhasil dihapus.");
    loadDashboard();
}

async function clearCashOnly() {
    showToast("Cache kalkulasi saldo dibersihkan.");
    loadDashboard();
}

async function resetAllData() {
    await dbOp.clear("transactions");
    await dbOp.clear("savings");
    localStorage.clear();
    showToast("Seluruh data berhasil dihapus total.");
    setTimeout(() => location.reload(), 800);
}
