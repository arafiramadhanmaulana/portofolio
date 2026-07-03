const SUPA_URL = 'https://bsatkunfxyclbmraoczo.supabase.co';
const SUPA_KEY = 'sb_publishable_R1Qum0HdYElJ1tTHAEXzIQ_aiQFwO8_';
const P_HASH = 'be6dd1b3e7dc26dae2a8e152174f3a44ab8f9082271c490992c61f09ba5b1638';

let rawData = [];
let filteredData = [];

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(unsafe) {
  if (!unsafe) return '-';
  const div = document.createElement('div');
  div.textContent = String(unsafe);
  return div.innerHTML;
}

function timeAgo(isoDate) {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDuration(sec) {
  if (!sec) return '0s';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}



function getDateString(isoDate) {
  return isoDate.split('T')[0];
}

async function login() {
  const input = document.getElementById('gate-pw').value;
  const hash = await sha256(input);
  if (hash === P_HASH) {
    sessionStorage.setItem('admin_auth', '1');
    initDashboard();
  } else {
    document.getElementById('gate-err').style.display = 'block';
  }
}

document.getElementById('gate-pw')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') login();
});
document.getElementById('gate-btn')?.addEventListener('click', login);

function initDashboard() {
  const gate = document.getElementById('gate');
  const app = document.getElementById('app');
  if (gate) gate.style.display = 'none';
  if (app) app.style.display = 'flex';
  fetchData();
  setInterval(fetchData, 30000);
}

if (sessionStorage.getItem('admin_auth') === '1') {
  initDashboard();
}

async function fetchData() {
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/visitors?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`
      }
    });
    if (!res.ok) throw new Error('API Error');
    rawData = await res.json();
    applyFilters();
  } catch (err) {
    console.error(err);
  }
}

function applyFilters() {
  const q = document.getElementById('search-input')?.value.toLowerCase() || '';
  const dev = document.getElementById('filter-device')?.value || 'all';
  
  filteredData = rawData.filter(v => {
    if (q) {
      const hay = [v.ip_address, v.city, v.country, v.browser, v.os].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (dev !== 'all' && v.device_type !== dev) return false;
    return true;
  });
  
  renderMetrics();
  renderChart();
  renderFeed();
  renderTable();
}

document.getElementById('search-input')?.addEventListener('input', applyFilters);
document.getElementById('filter-device')?.addEventListener('change', applyFilters);

document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    document.getElementById('search-input')?.focus();
  }
});

function renderMetrics() {
  const todayStr = getDateString(new Date().toISOString());
  let todayCount = 0;
  let totalDur = 0;
  
  filteredData.forEach(v => {
    if (getDateString(v.created_at) === todayStr) todayCount++;
    totalDur += (v.duration_seconds || 0);
  });
  
  const total = filteredData.length;
  const avg = total > 0 ? Math.floor(totalDur / total) : 0;
  
  const eTotal = document.getElementById('m-total');
  const eToday = document.getElementById('m-today');
  const eAvg = document.getElementById('m-avg');
  
  if (eTotal) eTotal.textContent = total;
  if (eToday) eToday.textContent = todayCount;
  if (eAvg) eAvg.textContent = formatDuration(avg);
}

function renderChart() {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(getDateString(d.toISOString()));
  }
  
  const counts = {};
  days.forEach(d => counts[d] = 0);
  filteredData.forEach(v => {
    const k = getDateString(v.created_at);
    if (counts[k] !== undefined) counts[k]++;
  });
  
  const max = Math.max(...Object.values(counts)) || 1;
  const wrap = document.getElementById('chart-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  
  days.forEach(d => {
    const pct = Math.max((counts[d] / max) * 100, 4);
    const lbl = new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
    
    const col = document.createElement('div');
    col.className = 'chart-bar-wrap';
    col.innerHTML = `
      <div style="font-size: 10px; color: var(--text-muted); text-align: center; margin-bottom: 4px;">${counts[d]}</div>
      <div class="chart-bar" style="height: ${pct}%"></div>
      <div style="font-size: 10px; color: var(--text-faint); text-align: center; margin-top: 6px;">${lbl}</div>
    `;
    wrap.appendChild(col);
  });
}

function renderFeed() {
  const wrap = document.getElementById('feed-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  
  const items = filteredData.slice(0, 5);
  items.forEach(v => {
    const div = document.createElement('div');
    div.className = 'feed-item';
    div.innerHTML = `
      <div class="feed-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>
      <div class="feed-content">
        <div class="feed-title">${escapeHtml(v.city)}, ${escapeHtml(v.country)}</div>
        <div class="feed-meta">${escapeHtml(v.device_type)} · ${escapeHtml(v.browser)} · ${timeAgo(v.created_at)}</div>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function renderTable() {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const items = filteredData.slice(0, 20);
  items.forEach(v => {
    const tr = document.createElement('tr');
    const dt = new Date(v.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const clk = v.clicks ? escapeHtml(v.clicks).split(' | ').slice(0, 3).join(', ') : '-';
    
    tr.innerHTML = `
      <td style="color: var(--text-muted); font-size: 12px;">${dt}</td>
      <td>
        <div style="font-weight: 500;">${escapeHtml(v.ip_address)}</div>
        <div style="font-size: 11px; color: var(--text-faint); margin-top: 2px;">${escapeHtml(v.isp)}</div>
      </td>
      <td>
        <div>${escapeHtml(v.city)}</div>
        <div style="font-size: 11px; color: var(--text-faint); margin-top: 2px;">${escapeHtml(v.country)}</div>
      </td>
      <td>
        <div>${escapeHtml(v.device_type)}</div>
        <div style="font-size: 11px; color: var(--text-faint); margin-top: 2px;">${escapeHtml(v.os)} / ${escapeHtml(v.browser)}</div>
      </td>
      <td style="font-weight: 600; color: var(--text-main);">${formatDuration(v.duration_seconds)}</td>
      <td style="font-size: 12px; color: var(--text-muted); max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(v.clicks)}">${clk}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('export-btn')?.addEventListener('click', () => {
  if (!filteredData.length) return;
  const rows = [['Date', 'IP', 'City', 'Country', 'ISP', 'Browser', 'OS', 'Device', 'Duration', 'Clicks']];
  filteredData.forEach(v => {
    rows.push([
      new Date(v.created_at).toISOString(),
      v.ip_address, v.city, v.country, v.isp, v.browser, v.os, v.device_type,
      v.duration_seconds || 0,
      (v.clicks || '').replace(/,/g, ';')
    ]);
  });
  const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `analytics_export.csv`;
  a.click();
});

// System Status Logic
function updateSystemStatus() {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  if (!statusDot || !statusText) return;
  
  if (navigator.onLine) {
    statusDot.classList.add('online');
    statusText.textContent = 'System Online';
  } else {
    statusDot.classList.remove('online');
    statusText.textContent = 'System Offline';
  }
}

window.addEventListener('online', updateSystemStatus);
window.addEventListener('offline', updateSystemStatus);
document.addEventListener('DOMContentLoaded', updateSystemStatus);
