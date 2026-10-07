let savingTempBase64 = "";

function previewSavingPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        savingTempBase64 = e.target.result;
        document.getElementById('savingPhotoPreview').src = savingTempBase64;
        document.getElementById('savingPhotoPreviewContainer').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function submitSavingGoal() {
    const name = document.getElementById('savingNameInput').value.trim();
    const target = parseCurrency(document.getElementById('savingTargetInput').value);
    const dailyInput = parseCurrency(document.getElementById('savingDailyRateInput').value);
    const dailyRate = dailyInput > 0 ? dailyInput : 10000;

    if (!name || target <= 0) return showToast("Isi nama dan target dengan benar!");

    await dbOp.add("savings", {
        name,
        target,
        current: 0,
        dailyRate,
        photo: savingTempBase64,
        createdAt: new Date().toISOString()
    });

    document.getElementById('savingNameInput').value = '';
    document.getElementById('savingTargetInput').value = '';
    document.getElementById('savingDailyRateInput').value = '';
    document.getElementById('savingPhotoPreviewContainer').classList.add('hidden');
    savingTempBase64 = "";

    closeModal('addSavingSheet');
    showToast("Target celengan dibuat.");
    loadSavings();
}

async function loadSavings() {
    const savings = await dbOp.getAll("savings");
    const cont = document.getElementById('savingsContainer');

    if (!savings || savings.length === 0) {
        cont.innerHTML = '<div class="neu-flat p-7 text-center text-xs opacity-65">Belum ada target impian. Tekan tombol + di atas untuk membuat celengan!</div>';
        return;
    }

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    cont.innerHTML = savings.map(s => {
        const pct = Math.min(100, Math.round((s.current / s.target) * 100));
        const remaining = Math.max(0, s.target - s.current);
        const dailyRate = s.dailyRate || 10000;
        const daysNeeded = dailyRate > 0 && remaining > 0 ? Math.ceil(remaining / dailyRate) : 0;

        const hasDepositedToday = cachedTransactions.some(t => 
            t.type === 'expense' && 
            t.category === 'Tabungan' && 
            t.note && t.note.toLowerCase().includes(s.name.toLowerCase()) && 
            new Date(t.date) >= todayStart
        );

        let estText = "Target Sudah Tercapai!";
        let shiftWarning = "";

        if (remaining > 0) {
            const estDate = new Date();
            estDate.setDate(estDate.getDate() + daysNeeded);
            const formattedEst = estDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            estText = `Estimasi: <b>${formattedEst}</b> (~${daysNeeded} hari lagi)`;

            if (!hasDepositedToday) {
                shiftWarning = `<span class="text-[10px] block text-amber-500 font-extrabold mt-0.5"><span class="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5 align-middle"></span>Belum nabung hari ini (estimasi terus mundur)</span>`;
            } else {
                shiftWarning = `<span class="text-[10px] block text-[var(--success-color)] font-extrabold mt-0.5"><span class="inline-block w-2 h-2 rounded-full bg-[var(--success-color)] mr-1.5 align-middle"></span>Sudah setor hari ini</span>`;
            }
        }

        const imgHtml = s.photo
            ? `<img src="${s.photo}" class="w-full h-full object-cover">`
            : `<div class="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                <span class="text-[9px] uppercase tracking-widest font-black opacity-60 mb-0.5" style="color: var(--text-muted);">Target Impian</span>
                <span class="text-sm font-black tracking-tight text-[var(--primary-accent)] line-clamp-2">${escapeHtml(s.name)}</span>
               </div>`;

        return `
            <div class="neu-flat p-4">
                <div class="h-32 w-full rounded-2xl overflow-hidden mb-3.5 neu-pressed flex justify-center items-center">${imgHtml}</div>
                <div class="flex justify-between items-center mb-1">
                    <h3 class="font-extrabold text-sm truncate">${escapeHtml(s.name)}</h3>
                    <span class="badge-subtle">${pct}%</span>
                </div>
                
                <div class="flex justify-between items-baseline mb-2 text-xs">
                    <span class="font-bold" style="color: var(--text-muted);">${formatRp(s.current)} <span class="font-normal">dari ${formatRp(s.target)}</span></span>
                    <span class="font-extrabold text-[var(--danger-color)]">Sisa: ${formatRp(remaining)}</span>
                </div>

                <div class="h-2.5 neu-pressed overflow-hidden rounded-full mb-3 p-0.5">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: var(--primary-accent);"></div>
                </div>

                <div class="neu-pressed p-2.5 rounded-xl mb-3.5 text-[11px] flex justify-between items-center">
                    <div>
                        <span class="block text-[10px]" style="color: var(--text-muted);">${estText}</span>
                        <span class="text-[10px] opacity-80 font-bold">Rencana: ${formatRp(dailyRate)}/hari</span>
                        ${shiftWarning}
                    </div>
                    <button onclick="openEditDailyRate(${s.id}, '${escapeHtml(s.name)}', ${dailyRate})" class="neu-btn px-2.5 py-1 text-[10px] font-extrabold">Ubah</button>
                </div>

                <div class="flex gap-2">
                    <button onclick="openDepositSheet(${s.id}, '${escapeHtml(s.name)}')" class="neu-accent-btn flex-1 py-2.5 text-xs font-bold">Setor Uang</button>
                    <button onclick="triggerGalakNotification(${s.id})" title="Kirim Notifikasi Target Ini ke HP" class="neu-btn px-3 text-xs font-bold text-amber-500 flex items-center justify-center">
                        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                    <button onclick="deleteSavingGoal(${s.id})" class="neu-btn px-3 text-xs text-[var(--danger-color)] flex items-center justify-center">
                        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openEditDailyRate(id, name, currentRate) {
    document.getElementById('editDailyTargetId').value = id;
    document.getElementById('editDailyGoalName').innerText = `Target: ${name}`;
    document.getElementById('editDailyRateInput').value = new Intl.NumberFormat('id-ID').format(currentRate);
    openModal('editDailySheet');
}

async function saveDailySavingRate() {
    const id = parseInt(document.getElementById('editDailyTargetId').value, 10);
    const rate = parseCurrency(document.getElementById('editDailyRateInput').value);
    if (rate <= 0) return showToast("Masukkan nominal harian yang valid!");

    const savings = await dbOp.getAll("savings");
    const target = savings.find(s => s.id === id);
    if (target) {
        target.dailyRate = rate;
        await dbOp.put("savings", target);
        closeModal('editDailySheet');
        showToast("Rencana harian diperbarui.");
        loadSavings();
    }
}

function openDepositSheet(id, name) {
    document.getElementById('depositTargetId').value = id;
    document.getElementById('depositGoalName').innerText = `Target: ${name}`;
    document.getElementById('depositAmountInput').value = '';
    openModal('depositSheet');
}

function setDepositAmount(num) {
    document.getElementById('depositAmountInput').value = new Intl.NumberFormat('id-ID').format(num);
}

async function submitDeposit() {
    const id = parseInt(document.getElementById('depositTargetId').value, 10);
    const amount = parseCurrency(document.getElementById('depositAmountInput').value);
    if (amount <= 0) return showToast("Masukkan nominal uang setoran!");

    const savings = await dbOp.getAll("savings");
    const target = savings.find(s => s.id === id);
    if (!target) return;

    target.current = (target.current || 0) + amount;
    await dbOp.put("savings", target);

    await dbOp.add("transactions", {
        type: "expense",
        amount,
        category: "Tabungan",
        note: `Setoran Celengan: ${target.name}`,
        isBill: false,
        date: new Date().toISOString()
    });

    closeModal('depositSheet');
    showToast(`Berhasil setor ${formatRp(amount)}!`);
    loadDashboard();
}

async function deleteSavingGoal(id) {
    await dbOp.delete("savings", id);
    showToast("Celengan dihapus.");
    loadSavings();
}
