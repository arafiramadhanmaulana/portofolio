const SUPA_URL = 'https://bsatkunfxyclbmraoczo.supabase.co';
const SUPA_KEY = 'sb_publishable_R1Qum0HdYElJ1tTHAEXzIQ_aiQFwO8_';
const P_HASH = 'be6dd1b3e7dc26dae2a8e152174f3a44ab8f9082271c490992c61f09ba5b1638';

let rawData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 20;

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
    const res = await fetch(`${SUPA_URL}/rest/v1/visitors?select=*&order=created_at.desc&limit=10000`, {
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
  const dt = document.getElementById('filter-date')?.value || '';
  
  filteredData = rawData.filter(v => {
    if (q) {
      const hay = [v.ip_address, v.city, v.country, v.browser, v.os].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (dev !== 'all' && v.device_type !== dev) return false;
    if (dt && getDateString(v.created_at) !== dt) return false;
    return true;
  });
  
  currentPage = 1;
  const eTotal = document.getElementById('total-logs');
  if (eTotal) eTotal.textContent = `(${filteredData.length})`;
  
  renderTable();
}

document.getElementById('search-input')?.addEventListener('input', applyFilters);
document.getElementById('filter-device')?.addEventListener('change', applyFilters);
document.getElementById('filter-date')?.addEventListener('change', applyFilters);

document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    document.getElementById('search-input')?.focus();
  }
});

function renderTable() {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  
  const startIdx = (currentPage - 1) * itemsPerPage;
  const items = filteredData.slice(startIdx, startIdx + itemsPerPage);
  
  items.forEach(v => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.onclick = () => showLogDetails(v);
    
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
  
  // Update Pagination UI
  const eInfo = document.getElementById('page-info');
  const ePrev = document.getElementById('page-prev');
  const eNext = document.getElementById('page-next');
  
  if (eInfo) eInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  if (ePrev) ePrev.disabled = currentPage === 1;
  if (eNext) eNext.disabled = currentPage === totalPages || totalPages === 0;
}

document.getElementById('page-prev')?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

document.getElementById('page-next')?.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

function showLogDetails(v) {
  const modal = document.getElementById('log-modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body) return;
  
  body.innerHTML = `
    <div style="margin-bottom: 12px;"><strong>Time:</strong> ${new Date(v.created_at).toLocaleString('en-US')}</div>
    <div style="margin-bottom: 12px;"><strong>IP Address:</strong> ${escapeHtml(v.ip_address)}</div>
    <div style="margin-bottom: 12px;"><strong>Location:</strong> ${escapeHtml(v.city)}, ${escapeHtml(v.country)}</div>
    <div style="margin-bottom: 12px;"><strong>ISP:</strong> ${escapeHtml(v.isp)}</div>
    <div style="margin-bottom: 12px;"><strong>Device:</strong> ${escapeHtml(v.device_type)} (${escapeHtml(v.os)})</div>
    <div style="margin-bottom: 12px;"><strong>Browser:</strong> ${escapeHtml(v.browser)}</div>
    <div style="margin-bottom: 12px;"><strong>Session Duration:</strong> ${formatDuration(v.duration_seconds)}</div>
    <div><strong>Interactions:</strong><br><pre style="background: var(--surface-2); padding: 8px; border-radius: 4px; margin-top: 4px; white-space: pre-wrap; font-size: 11px;">${escapeHtml(v.clicks || 'No interactions')}</pre></div>
  `;
  modal.style.display = 'flex';
}

document.getElementById('modal-close')?.addEventListener('click', () => {
  const modal = document.getElementById('log-modal');
  if (modal) modal.style.display = 'none';
});

document.getElementById('log-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'log-modal') {
    e.target.style.display = 'none';
  }
});

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
