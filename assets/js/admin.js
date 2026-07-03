const SUPA_URL = 'https://bsatkunfxyclbmraoczo.supabase.co';
const SUPA_KEY = 'sb_publishable_R1Qum0HdYElJ1tTHAEXzIQ_aiQFwO8_';
let rawData = [];
let logsFiltered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 20;

// Chart Instances
let charts = {};

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const gate = document.getElementById('gate');
const btn = document.getElementById('gate-btn');
const pw = document.getElementById('gate-pw');
const err = document.getElementById('gate-err');

pw?.addEventListener('keypress', e => { if (e.key === 'Enter') btn.click(); });
btn?.addEventListener('click', async () => {
  const hash = await sha256(pw.value);
  if (hash === '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8') {
    sessionStorage.setItem('admin_auth', '1');
    initDashboard();
  } else {
    err.style.display = 'block';
  }
});

if (sessionStorage.getItem('admin_auth') === '1') {
  initDashboard();
}

function initDashboard() {
  if (gate) gate.style.display = 'none';
  const app = document.getElementById('app');
  if (app) app.style.display = 'flex';
  
  setupTabs();
  setupLogFilters();
  setupModal();
  setupNetworkStatus();
  
  fetchData();
}

// Network Status
function setupNetworkStatus() {
  const dot = document.getElementById('network-dot');
  const txt = document.getElementById('network-text');
  const update = () => {
    if(navigator.onLine) {
      dot.className = 'status-dot online';
      txt.textContent = 'System Online';
    } else {
      dot.className = 'status-dot offline';
      txt.textContent = 'System Offline';
    }
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

// Tabs
function setupTabs() {
  const btns = document.querySelectorAll('.nav-btn');
  const contents = document.querySelectorAll('.tab-content');
  const title = document.getElementById('page-title');
  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(`tab-${tabId}`).classList.add('active');
      
      if(tabId === 'overview') title.textContent = 'Overview';
      if(tabId === 'analytics') title.textContent = 'Analytics';
      if(tabId === 'logs') title.textContent = 'Raw Logs';
    });
  });
}

// Fetch Data
async function fetchData() {
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/visitors?select=*&order=created_at.desc&limit=10000`, {
      headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` }
    });
    if (!res.ok) throw new Error('API Error');
    rawData = await res.json();
    
    processOverview();
    processAnalytics();
    applyLogFilters();
  } catch (err) {
    console.error('Failed to fetch data:', err);
  }
}

// --- ENGINE: OVERVIEW ---
function processOverview() {
  if (!rawData.length) return;
  
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  const monthAgo = new Date();
  monthAgo.setDate(now.getDate() - 30);
  
  let totalSessions = rawData.length;
  let visitors = new Set();
  let returningSet = new Set();
  let knownVisitors = new Set();
  let totalDuration = 0;
  let bounces = 0;
  let totalClicks = 0;
  
  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;
  
  let pages = {};
  let referrers = {};
  let hours = new Array(24).fill(0);
  
  // Backwards iteration to detect new vs returning accurately over time
  [...rawData].reverse().forEach(v => {
    // Returning logic
    if (knownVisitors.has(v.visitor_id)) {
      returningSet.add(v.visitor_id);
    }
    knownVisitors.add(v.visitor_id);
  });
  
  rawData.forEach(v => {
    visitors.add(v.visitor_id);
    
    const d = new Date(v.created_at);
    const dStr = d.toISOString().split('T')[0];
    
    if (dStr === todayStr) todayCount++;
    if (d >= weekAgo) weekCount++;
    if (d >= monthAgo) monthCount++;
    
    totalDuration += (v.duration_seconds || 0);
    
    const hasClicks = v.clicks && v.clicks.length > 0;
    if ((v.duration_seconds || 0) < 10 && !hasClicks) bounces++;
    if (hasClicks) totalClicks += v.clicks.split('|').length;
    
    const pg = v.page_visited || '/';
    pages[pg] = (pages[pg] || 0) + 1;
    
    const ref = (v.referrer && v.referrer !== 'Direct') ? new URL(v.referrer).hostname : 'Direct';
    referrers[ref] = (referrers[ref] || 0) + 1;
    
    hours[d.getHours()]++;
  });
  
  const uniqueVisitors = visitors.size;
  const returning = returningSet.size;
  const newVisitors = uniqueVisitors - returning;
  const avgDur = totalSessions > 0 ? Math.floor(totalDuration / totalSessions) : 0;
  const bounceRate = totalSessions > 0 ? Math.round((bounces / totalSessions) * 100) : 0;
  
  const peakHour = hours.indexOf(Math.max(...hours));
  const peakHourStr = `${peakHour.toString().padStart(2, '0')}:00`;
  
  // Set UI
  document.getElementById('kpi-sessions').textContent = totalSessions;
  document.getElementById('kpi-unique').textContent = uniqueVisitors;
  document.getElementById('kpi-views').textContent = totalSessions; // Assuming 1 row = 1 view in this tracker
  document.getElementById('kpi-bounce').textContent = `${bounceRate}%`;
  
  document.getElementById('kpi-today').textContent = todayCount;
  document.getElementById('kpi-week').textContent = weekCount;
  document.getElementById('kpi-month').textContent = monthCount;
  document.getElementById('kpi-duration').textContent = `${Math.floor(avgDur / 60)}m ${avgDur % 60}s`;
  
  document.getElementById('kpi-new').textContent = newVisitors;
  document.getElementById('kpi-returning').textContent = returning;
  document.getElementById('kpi-peak').textContent = peakHourStr;
  document.getElementById('kpi-clicks').textContent = totalClicks;
  
  renderList('list-top-pages', pages, 5);
  renderList('list-top-referrers', referrers, 5);
}

function renderList(id, dataObj, limit) {
  const el = document.getElementById(id);
  if (!el) return;
  const sorted = Object.entries(dataObj).sort((a,b) => b[1] - a[1]).slice(0, limit);
  el.innerHTML = sorted.map(([k, v]) => `
    <div class="list-item">
      <div class="list-item-key">${escapeHtml(k)}</div>
      <div class="list-item-val">${v}</div>
    </div>
  `).join('');
}

// --- ENGINE: ANALYTICS ---
function processAnalytics() {
  if (!rawData.length) return;
  
  // Traffic 30 days
  const trafficData = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    trafficData[d.toISOString().split('T')[0]] = 0;
  }
  
  let devices = {};
  let browsers = {};
  let oss = {};
  let geo = {};
  let hours = new Array(24).fill(0);
  
  rawData.forEach(v => {
    const dStr = v.created_at.split('T')[0];
    if (trafficData[dStr] !== undefined) trafficData[dStr]++;
    
    devices[v.device_type] = (devices[v.device_type] || 0) + 1;
    browsers[v.browser] = (browsers[v.browser] || 0) + 1;
    oss[v.os] = (oss[v.os] || 0) + 1;
    
    const loc = `${v.city}, ${v.country}`;
    if (v.city && v.city !== 'Unknown') geo[loc] = (geo[loc] || 0) + 1;
    
    const h = new Date(v.created_at).getHours();
    hours[h]++;
  });
  
  renderChart('chart-traffic', 'line', Object.keys(trafficData), Object.values(trafficData), 'Sessions');
  renderChart('chart-device', 'doughnut', Object.keys(devices), Object.values(devices));
  renderChart('chart-browser', 'doughnut', Object.keys(browsers), Object.values(browsers));
  renderChart('chart-os', 'doughnut', Object.keys(oss), Object.values(oss));
  
  const hourLabels = hours.map((_,i) => `${i}:00`);
  renderChart('chart-hourly', 'bar', hourLabels, hours, 'Traffic Heat');
  
  renderList('list-geo', geo, 10);
}

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

function renderChart(id, type, labels, data, labelName = '') {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  if (charts[id]) charts[id].destroy();
  
  Chart.defaults.color = '#a1a1aa';
  Chart.defaults.font.family = 'Inter';
  
  const isLineBar = type === 'line' || type === 'bar';
  
  charts[id] = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: labelName,
        data: data,
        backgroundColor: isLineBar ? 'rgba(59, 130, 246, 0.2)' : colors,
        borderColor: isLineBar ? '#3b82f6' : 'transparent',
        borderWidth: isLineBar ? 2 : 0,
        fill: type === 'line',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: !isLineBar, position: 'right' },
      },
      scales: isLineBar ? {
        y: { beginAtZero: true, grid: { color: '#27272a' } },
        x: { grid: { display: false } }
      } : {}
    }
  });
}

// --- ENGINE: LOGS ---
function setupLogFilters() {
  document.getElementById('log-search')?.addEventListener('input', applyLogFilters);
  document.getElementById('log-date')?.addEventListener('change', applyLogFilters);
  document.getElementById('log-device')?.addEventListener('change', applyLogFilters);
  
  document.getElementById('page-prev')?.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderLogs(); }
  });
  document.getElementById('page-next')?.addEventListener('click', () => {
    const max = Math.ceil(logsFiltered.length / ITEMS_PER_PAGE);
    if (currentPage < max) { currentPage++; renderLogs(); }
  });
}

function applyLogFilters() {
  const q = document.getElementById('log-search')?.value.toLowerCase() || '';
  const dt = document.getElementById('log-date')?.value || '';
  const dev = document.getElementById('log-device')?.value || 'all';
  
  logsFiltered = rawData.filter(v => {
    if (q) {
      const hay = [v.ip_address, v.city, v.country, v.browser, v.os, v.isp].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (dev !== 'all' && v.device_type !== dev) return false;
    if (dt && v.created_at.split('T')[0] !== dt) return false;
    return true;
  });
  
  currentPage = 1;
  const count = document.getElementById('log-count');
  if (count) count.textContent = `(${logsFiltered.length} records)`;
  
  renderLogs();
}

function renderLogs() {
  const tbody = document.getElementById('log-tbody');
  if (!tbody) return;
  
  if (logsFiltered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No records found.</td></tr>`;
    updatePagination();
    return;
  }
  
  tbody.innerHTML = '';
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const items = logsFiltered.slice(start, start + ITEMS_PER_PAGE);
  
  items.forEach(v => {
    const tr = document.createElement('tr');
    tr.className = 'interactive';
    tr.onclick = () => openLogModal(v);
    
    const d = new Date(v.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    tr.innerHTML = `
      <td class="text-muted">${d}</td>
      <td>
        <div style="font-weight: 500;">${escapeHtml(v.ip_address)}</div>
      </td>
      <td>
        <div>${escapeHtml(v.city)}, ${escapeHtml(v.country)}</div>
        <div class="text-muted" style="font-size:11px;">${escapeHtml(v.isp)}</div>
      </td>
      <td>
        <div>${escapeHtml(v.device_type)}</div>
        <div class="text-muted" style="font-size:11px;">${escapeHtml(v.os)} · ${escapeHtml(v.browser)}</div>
      </td>
      <td>
        <div style="font-size:11px;">${escapeHtml(v.page_visited)}</div>
        <div class="text-muted" style="font-size:11px;">Ref: ${escapeHtml(v.referrer || 'Direct')}</div>
      </td>
      <td style="font-weight:600;">${formatDuration(v.duration_seconds)}</td>
    `;
    tbody.appendChild(tr);
  });
  
  updatePagination();
}

function updatePagination() {
  const max = Math.ceil(logsFiltered.length / ITEMS_PER_PAGE) || 1;
  const prev = document.getElementById('page-prev');
  const next = document.getElementById('page-next');
  const state = document.getElementById('page-state');
  
  if (prev) prev.disabled = currentPage === 1;
  if (next) next.disabled = currentPage === max;
  if (state) state.textContent = `Page ${currentPage} of ${max}`;
}

// Modal
function setupModal() {
  document.getElementById('modal-close')?.addEventListener('click', () => {
    document.getElementById('modal-log').style.display = 'none';
  });
  document.getElementById('modal-log')?.addEventListener('click', e => {
    if (e.target.id === 'modal-log') e.target.style.display = 'none';
  });
}

function openLogModal(v) {
  const modal = document.getElementById('modal-log');
  const content = document.getElementById('modal-content');
  
  content.innerHTML = `
    <div class="dt-grid">
      <div class="dt-item"><span class="dt-lbl">Timestamp</span><span class="dt-val">${new Date(v.created_at).toLocaleString('en-US')}</span></div>
      <div class="dt-item"><span class="dt-lbl">IP Address</span><span class="dt-val">${escapeHtml(v.ip_address)}</span></div>
      <div class="dt-item"><span class="dt-lbl">Location</span><span class="dt-val">${escapeHtml(v.city)}, ${escapeHtml(v.country)}</span></div>
      <div class="dt-item"><span class="dt-lbl">ISP / Org</span><span class="dt-val">${escapeHtml(v.isp)}</span></div>
      <div class="dt-item"><span class="dt-lbl">Device Type</span><span class="dt-val">${escapeHtml(v.device_type)}</span></div>
      <div class="dt-item"><span class="dt-lbl">Operating System</span><span class="dt-val">${escapeHtml(v.os)}</span></div>
      <div class="dt-item"><span class="dt-lbl">Browser</span><span class="dt-val">${escapeHtml(v.browser)}</span></div>
      <div class="dt-item"><span class="dt-lbl">Screen Res</span><span class="dt-val">${escapeHtml(v.screen_resolution || 'Unknown')}</span></div>
      
      <div class="dt-item dt-full"><span class="dt-lbl">User Agent</span><span class="dt-val text-muted" style="font-size:11px;">${escapeHtml(v.user_agent || '-')}</span></div>
      
      <div class="dt-item"><span class="dt-lbl">Entry Page</span><span class="dt-val">${escapeHtml(v.page_visited)}</span></div>
      <div class="dt-item"><span class="dt-lbl">Referrer Source</span><span class="dt-val">${escapeHtml(v.referrer || 'Direct')}</span></div>
      <div class="dt-item"><span class="dt-lbl">Session Duration</span><span class="dt-val">${formatDuration(v.duration_seconds)}</span></div>
      
      <div class="dt-item dt-full">
        <span class="dt-lbl">Interactions & Clicks</span>
        <pre class="code-block">${escapeHtml(v.clicks ? v.clicks.replace(/ \| /g, '\n') : 'No interactions recorded')}</pre>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

// Export CSV
document.getElementById('export-btn')?.addEventListener('click', () => {
  if (!rawData.length) return;
  const rows = [['Date', 'IP', 'City', 'Country', 'ISP', 'Device', 'OS', 'Browser', 'Page', 'Referrer', 'Duration', 'Clicks']];
  
  rawData.forEach(v => {
    rows.push([
      v.created_at, v.ip_address, v.city, v.country, v.isp,
      v.device_type, v.os, v.browser, v.page_visited, v.referrer,
      v.duration_seconds || 0,
      (v.clicks || '').replace(/,/g, ';')
    ]);
  });
  
  const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
});

// Utils
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

function formatDuration(sec) {
  if (!sec) return '0s';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}
