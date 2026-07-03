(async function() {
    const SUPABASE_URL = 'https://bsatkunfxyclbmraoczo.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_R1Qum0HdYElJ1tTHAEXzIQ_aiQFwO8_';
    
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    };

    function generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    let visitorId = localStorage.getItem('portofolio_visitor_id');
    if (!visitorId) {
        visitorId = generateId();
        localStorage.setItem('portofolio_visitor_id', visitorId);
    }
    
    const sessionId = sessionStorage.getItem('portofolio_session_id') || generateId();
    const isNewSession = !sessionStorage.getItem('portofolio_session_id');
    sessionStorage.setItem('portofolio_session_id', sessionId);

    const startTime = Date.now();
    let clicksTracked = [];

    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, .card, .gallery-item');
        if (target) {
            let label = target.innerText?.trim().substring(0, 30);
            if (!label) label = target.title || target.getAttribute('data-caption') || target.tagName;
            label = label.replace(/\n/g, ' ').trim();
            if (label && label.length > 0) {
                clicksTracked.push(label);
            }
        }
    });

    if (isNewSession) {
        try {
            let ipData = {};
            try {
                const ipResponse = await fetch('https://ipinfo.io/json');
                const data = await ipResponse.json();
                ipData = {
                    ip: data.ip,
                    city: data.city,
                    country_name: data.country,
                    org: data.org
                };
            } catch (e) {
                try {
                    const ipResponse2 = await fetch('https://ipwho.is/');
                    const data2 = await ipResponse2.json();
                    if (data2.success) {
                        ipData = {
                            ip: data2.ip,
                            city: data2.city,
                            country_name: data2.country,
                            org: data2.connection ? data2.connection.isp : 'Unknown'
                        };
                    }
                } catch(e2) {
                    console.warn('Location fetch failed');
                }
            }

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

            setInterval(() => {
                if (document.visibilityState === 'visible') {
                    const duration = Math.floor((Date.now() - startTime) / 1000);
                    const clickString = clicksTracked.length > 0 ? clicksTracked.join(' | ') : '';
                    
                    fetch(`${SUPABASE_URL}/rest/v1/visitors?session_id=eq.${sessionId}`, {
                        method: 'PATCH',
                        headers: headers,
                        body: JSON.stringify({
                            duration_seconds: duration,
                            last_active_at: new Date().toISOString(),
                            clicks: clickString
                        })
                    }).catch(e => console.warn('Ping error'));
                }
            }, 15000);

        } catch (error) {
            console.error('Tracking init error:', error);
        }
    }

    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            const clickString = clicksTracked.length > 0 ? clicksTracked.join(' | ') : 'No interactions';

            fetch(`${SUPABASE_URL}/rest/v1/visitors?session_id=eq.${sessionId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({
                    duration_seconds: duration,
                    last_active_at: new Date().toISOString(),
                    clicks: clickString
                }),
                keepalive: true
            }).catch(e => console.error('Final sync error:', e));
        }
    });

})();
