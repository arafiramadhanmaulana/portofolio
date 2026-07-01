(async function() {
    // Kredensial Supabase
    const SUPABASE_URL = 'https://bsatkunfxyclbmraoczo.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_R1Qum0HdYElJ1tTHAEXzIQ_aiQFwO8_';
    
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    };

    // Session & Visitor Identification
    function generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    let visitorId = localStorage.getItem('portofolio_visitor_id');
    if (!visitorId) {
        visitorId = generateId();
        localStorage.setItem('portofolio_visitor_id', visitorId);
    }
    
    // Jangan track ganda saat refresh biasa (sessionStorage)
    const sessionId = sessionStorage.getItem('portofolio_session_id') || generateId();
    const isNewSession = !sessionStorage.getItem('portofolio_session_id');
    sessionStorage.setItem('portofolio_session_id', sessionId);

    const startTime = Date.now();
    let clicksTracked = [];

    // Lacak interaksi klik (hanya elemen penting)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, .project-card, .gallery-item');
        if (target) {
            let label = target.innerText?.trim().substring(0, 30);
            if (!label) label = target.title || target.getAttribute('data-caption') || target.tagName;
            // Bersihkan teks
            label = label.replace(/\n/g, ' ').trim();
            if (label && label.length > 0) {
                clicksTracked.push(label);
            }
        }
    });

    if (isNewSession) {
        try {
            // 1. Dapatkan IP, Lokasi, dan ISP
            let ipData = {};
            try {
                const ipResponse = await fetch('https://ipapi.co/json/');
                ipData = await ipResponse.json();
            } catch (e) {
                console.warn('Gagal mendapatkan lokasi');
            }

            // 2. Deteksi Perangkat, OS, dan Browser
            const ua = navigator.userAgent;
            let browser = "Unknown";
            if (ua.indexOf("Firefox") > -1) browser = "Firefox";
            else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
            else if (ua.indexOf("Trident") > -1) browser = "IE";
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

            // 3. Kirim Data Awal
            const visitorData = {
                visitor_id: visitorId,
                session_id: sessionId,
                ip_address: ipData.ip || 'Unknown',
                city: ipData.city || 'Unknown',
                country: ipData.country_name || 'Unknown',
                isp: ipData.org || 'Unknown',
                browser: browser,
                os: os,
                device_type: deviceType,
                page_visited: window.location.pathname,
                referrer: document.referrer || 'Direct',
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                user_agent: ua,
                duration_seconds: 0,
                clicks: ''
            };

            await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(visitorData)
            });

        } catch (error) {
            console.error('Tracking init error:', error);
        }
    }

    // 4. Update Durasi dan Klik saat akan keluar/berpindah tab
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            
            // Format clicks array to a readable string
            const clickString = clicksTracked.length > 0 ? clicksTracked.join(' | ') : 'No interactions';

            // Kirim update (gunakan keepalive agar request tetap jalan walau tab ditutup)
            fetch(`${SUPABASE_URL}/rest/v1/visitors?session_id=eq.${sessionId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({
                    duration_seconds: duration,
                    clicks: clickString
                }),
                keepalive: true
            }).catch(e => console.error('Final sync error:', e));
        }
    });

})();
