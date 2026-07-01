(async function() {
    // Kredensial Supabase
    const SUPABASE_URL = 'https://bsatkunfxyclbmraoczo.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_R1Qum0HdYElJ1tTHAEXzIQ_aiQFwO8_';

    // Cek apakah sudah pernah dilacak di sesi ini untuk menghindari duplikasi saat refresh
    if (sessionStorage.getItem('tracked')) {
        return;
    }

    try {
        // 1. Dapatkan IP dan Lokasi
        let ipData = {};
        try {
            const ipResponse = await fetch('https://ipapi.co/json/');
            ipData = await ipResponse.json();
        } catch (e) {
            console.warn('Gagal mendapatkan IP:', e);
        }

        // 2. Deteksi Perangkat, OS, dan Browser sederhana
        const ua = navigator.userAgent;
        let browser = "Unknown";
        if (ua.indexOf("Firefox") > -1) browser = "Firefox";
        else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
        else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
        else if (ua.indexOf("Edge") > -1) browser = "Edge";
        else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
        else if (ua.indexOf("Safari") > -1) browser = "Safari";

        let os = "Unknown";
        if (ua.indexOf("Win") > -1) os = "Windows";
        else if (ua.indexOf("Mac") > -1) os = "MacOS";
        else if (ua.indexOf("Linux") > -1) os = "Linux";
        else if (ua.indexOf("Android") > -1) os = "Android";
        else if (ua.indexOf("like Mac") > -1) os = "iOS";

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const deviceType = isMobile ? "Mobile" : "Desktop";

        // 3. Siapkan Data
        const visitorData = {
            ip_address: ipData.ip || 'Unknown',
            city: ipData.city || 'Unknown',
            country: ipData.country_name || 'Unknown',
            browser: browser,
            os: os,
            device_type: deviceType,
            page_visited: window.location.pathname,
            referrer: document.referrer || 'Direct',
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            user_agent: ua
        };

        // 4. Kirim ke Supabase via REST API
        await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(visitorData)
        });

        // Tandai sudah dilacak di sesi ini
        sessionStorage.setItem('tracked', 'true');

    } catch (error) {
        console.error('Tracking error:', error);
    }
})();
