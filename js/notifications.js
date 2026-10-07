const LocalNotifications = window.Capacitor?.Plugins?.LocalNotifications;

async function requestSystemNotificationPermission() {
    if (LocalNotifications) {
        const res = await LocalNotifications.requestPermissions();
        return res.display === 'granted';
    }
    if (!("Notification" in window)) {
        showToast("Browser/HP ini belum mendukung notifikasi.");
        return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }
    return false;
}

async function sendMeowNotification(title, bodyText) {
    if (LocalNotifications) {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: title,
                    body: bodyText,
                    id: Math.floor(Math.random() * 100000),
                    schedule: { at: new Date(Date.now() + 500) },
                    sound: undefined,
                    attachments: undefined,
                    actionTypeId: "",
                    extra: null
                }
            ]
        });
        return;
    }

    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") return;
    }
    const iconUrl = "https://j.top4top.io/p_3932ausky1.png";
    try {
        new Notification(title, {
            body: bodyText,
            icon: iconUrl,
            badge: iconUrl
        });
    } catch (e) {
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(title, { body: bodyText, icon: iconUrl, badge: iconUrl });
            }).catch(() => {});
        }
    }
}

async function toggleSavingsNotification(enable) {
    if (enable) {
        const granted = await requestSystemNotificationPermission();
        if (!granted) {
            document.getElementById('savingsNotifToggle').checked = false;
            document.getElementById('notifStatusText').innerText = "Izin notifikasi ditolak";
            showToast("Aktifkan izin notifikasi pada pengaturan HP Anda.");
            return;
        }
        localStorage.setItem('meowkas_notif_enabled', 'true');
        const time = localStorage.getItem('meowkas_notif_time') || '13:00';
        document.getElementById('notifStatusText').innerText = `Aktif tiap hari pkl ${time} WIB`;
        showToast("Pengingat notifikasi HP aktif!");
        testSavingsNotification();
    } else {
        localStorage.setItem('meowkas_notif_enabled', 'false');
        document.getElementById('notifStatusText').innerText = "Notifikasi dinonaktifkan";
        showToast("Pengingat dinonaktifkan.");
    }
}

function saveNotificationTime(val) {
    if (!val) return;
    localStorage.setItem('meowkas_notif_time', val);
    const isEnabled = localStorage.getItem('meowkas_notif_enabled') === 'true';
    if (isEnabled) {
        document.getElementById('notifStatusText').innerText = `Aktif tiap hari pkl ${val} WIB`;
    }
    showToast(`Jam pengingat diatur ke ${val} WIB`);
}

async function testSavingsNotification() {
    const savings = await dbOp.getAll("savings");
    if (savings && savings.length > 0) {
        const s = savings[0];
        const rem = Math.max(0, s.target - s.current);
        sendMeowNotification(
            `MeowKAS - ${s.name}`,
            `WOI! TABUNGAN ${s.name.toUpperCase()} LU SISA ${formatRp(rem)}. BURUAN DH ISI, JANGAN LU PAKE BUAT JAJAN JIR`
        );
    } else {
        sendMeowNotification(
            "MeowKAS",
            "WOI! TABUNGAN BELUM ADA TARGET. BURUAN BIKIN TARGET CELENGAN, JANGAN JAJAN MULU!"
        );
    }
}

async function triggerGalakNotification(savingId) {
    const savings = await dbOp.getAll("savings");
    const target = savings.find(s => s.id === savingId);
    if (!target) return;
    const rem = Math.max(0, target.target - target.current);
    const granted = await requestSystemNotificationPermission();
    if (granted) {
        sendMeowNotification(
            `MeowKAS - ${target.name}`,
            `WOI! TABUNGAN ${target.name.toUpperCase()} LU SISA ${formatRp(rem)}. BURUAN DH ISI, JANGAN LU PAKE BUAT JAJAN JIR`
        );
        showToast(`Notifikasi ${target.name} dikirim ke HP!`);
    } else {
        showToast("Aktifkan izin notifikasi di HP terlebih dahulu!");
    }
}

async function checkScheduledNotification() {
    const isEnabled = localStorage.getItem('meowkas_notif_enabled') === 'true';
    if (!isEnabled) return;

    const targetTime = localStorage.getItem('meowkas_notif_time') || '13:00';
    const [tHour, tMin] = targetTime.split(':').map(Number);
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const targetMins = tHour * 60 + tMin;
    const todayStr = now.toDateString();

    if (nowMins >= targetMins && localStorage.getItem('meowkas_last_scheduled_notif') !== todayStr) {
        const savings = await dbOp.getAll("savings");
        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);

        const activeSavings = savings.filter(s => s.current < s.target);
        if (activeSavings.length > 0) {
            activeSavings.forEach((s, idx) => {
                const hasDeposited = cachedTransactions.some(t => 
                    t.type === 'expense' && 
                    t.category === 'Tabungan' && 
                    t.note && t.note.toLowerCase().includes(s.name.toLowerCase()) && 
                    new Date(t.date) >= todayStart
                );
                if (!hasDeposited) {
                    setTimeout(() => {
                        const rem = Math.max(0, s.target - s.current);
                        sendMeowNotification(
                            `MeowKAS - ${s.name}`,
                            `WOI! TABUNGAN ${s.name.toUpperCase()} LU SISA ${formatRp(rem)}. BURUAN DH ISI, JANGAN LU PAKE BUAT JAJAN JIR`
                        );
                    }, idx * 1400);
                }
            });
        }
        localStorage.setItem('meowkas_last_scheduled_notif', todayStr);
    }
}
