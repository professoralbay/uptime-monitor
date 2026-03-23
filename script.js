// ============================================
// UPTIME MONITOR — script.js
// Checks websites using fetch() with no-cors
// Tracks response time, history, uptime %
// Saves to localStorage between sessions
// ============================================

var sites  = [];
var timers = {};
var toastTm;

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTm);
  toastTm = setTimeout(function(){ t.classList.remove('show'); }, 2500);
}

function save() {
  try { localStorage.setItem('uptimeData', JSON.stringify(sites)); } catch(e){}
}

function load() {
  try {
    var d = localStorage.getItem('uptimeData');
    if (d) sites = JSON.parse(d);
  } catch(e){ sites = []; }
}

function urlToName(url) {
  try { return new URL(url).hostname.replace('www.',''); } catch(e){ return url; }
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function badgeText(s) {
  return s==='up' ? 'ONLINE' : s==='down' ? 'OFFLINE' : 'CHECKING';
}

// ── Add site ──
function addSite() {
  var url  = document.getElementById('siteUrl').value.trim();
  var name = document.getElementById('siteName').value.trim();
  var intv = parseInt(document.getElementById('siteInterval').value);

  if (!url) { showToast('Please enter a URL'); return; }
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  for (var i=0; i<sites.length; i++) {
    if (sites[i].url === url) { showToast('Already added!'); return; }
  }

  var site = {
    id: Date.now(), url: url,
    name: name || urlToName(url),
    interval: intv, status: 'checking', response: null,
    history: new Array(30).fill('pending'),
    uptime: 0, checks: 0, ups: 0, lastCheck: null
  };

  sites.push(site);
  save();
  document.getElementById('siteUrl').value  = '';
  document.getElementById('siteName').value = '';
  renderAll();
  startMonitor(site);
  showToast('✓ ' + site.name + ' added!');
}

// ── Remove site ──
function removeSite(id) {
  clearInterval(timers[id]);
  delete timers[id];
  sites = sites.filter(function(s){ return s.id !== id; });
  save();
  renderAll();
}

// ── Toggle expand ──
function toggleCard(id) {
  var card = document.getElementById('card-'+id);
  if (card) card.classList.toggle('expanded');
}

// ── Check site via fetch ──
function checkSite(site) {
  site.status = 'checking';
  renderCard(site);
  var start = Date.now();

  fetch(site.url, { method:'HEAD', mode:'no-cors', cache:'no-cache' })
  .then(function() {
    site.status   = 'up';
    site.response = Date.now() - start;
    site.checks++; site.ups++;
    site.uptime    = Math.round(site.ups / site.checks * 100);
    site.lastCheck = new Date().toLocaleTimeString();
    site.history.push('up');
    if (site.history.length > 30) site.history.shift();
    save(); renderCard(site); updateStats(); updateGlobal();
  })
  .catch(function() {
    site.status   = 'down';
    site.response = null;
    site.checks++;
    site.uptime    = Math.round(site.ups / site.checks * 100);
    site.lastCheck = new Date().toLocaleTimeString();
    site.history.push('down');
    if (site.history.length > 30) site.history.shift();
    save(); renderCard(site); updateStats(); updateGlobal();
  });
}

// ── Start monitoring ──
function startMonitor(site) {
  checkSite(site);
  timers[site.id] = setInterval(function(){ checkSite(site); }, site.interval * 1000);
}

// ── Build history bars HTML ──
function buildBars(history) {
  return history.map(function(h) {
    var ht = h==='up' ? (60 + Math.random()*38) : h==='down' ? 20 : 10;
    return '<div class="hbar ' + h + '" style="height:' + ht + '%"></div>';
  }).join('');
}

// ── Build site card ──
function buildCard(site) {
  var card = document.createElement('div');
  card.className = 'site-card ' + site.status;
  card.id = 'card-' + site.id;
  card.innerHTML =
    '<div class="site-header" onclick="toggleCard('+site.id+')">' +
      '<div class="site-indicator '+site.status+'" id="ind-'+site.id+'"></div>' +
      '<div class="site-info">' +
        '<div class="site-name">'+escHtml(site.name)+'</div>' +
        '<div class="site-url">'+escHtml(site.url)+'</div>' +
      '</div>' +
      '<div class="site-response" id="resp-'+site.id+'">'+(site.response?site.response+'ms':'—')+'</div>' +
      '<div class="site-badge '+site.status+'" id="badge-'+site.id+'">'+badgeText(site.status)+'</div>' +
      '<button class="site-remove" onclick="event.stopPropagation();removeSite('+site.id+')">✕</button>' +
    '</div>' +
    '<div class="site-history">' +
      '<div class="history-label">Last 30 Checks</div>' +
      '<div class="history-bars" id="hist-'+site.id+'">'+buildBars(site.history)+'</div>' +
      '<div class="history-meta">' +
        '<div class="hm-item">Uptime: <span id="upt-'+site.id+'">'+site.uptime+'%</span></div>' +
        '<div class="hm-item">Checks: <span id="chk-'+site.id+'">'+site.checks+'</span></div>' +
        '<div class="hm-item">Last: <span id="lst-'+site.id+'">'+(site.lastCheck||'—')+'</span></div>' +
      '</div>' +
    '</div>';
  return card;
}

// ── Update card without re-render ──
function renderCard(site) {
  var card = document.getElementById('card-'+site.id);
  if (!card) return;
  var exp = card.classList.contains('expanded');
  card.className = 'site-card ' + site.status + (exp ? ' expanded' : '');
  var g = function(id){ return document.getElementById(id); };
  var ind  = g('ind-'+site.id);   if(ind)  ind.className  = 'site-indicator '+site.status;
  var bdg  = g('badge-'+site.id); if(bdg)  { bdg.className='site-badge '+site.status; bdg.textContent=badgeText(site.status); }
  var rsp  = g('resp-'+site.id);  if(rsp)  rsp.textContent = site.response ? site.response+'ms' : '—';
  var hst  = g('hist-'+site.id);  if(hst)  hst.innerHTML  = buildBars(site.history);
  var upt  = g('upt-'+site.id);   if(upt)  upt.textContent = site.uptime+'%';
  var chk  = g('chk-'+site.id);   if(chk)  chk.textContent = site.checks;
  var lst  = g('lst-'+site.id);   if(lst)  lst.textContent = site.lastCheck||'—';
}

// ── Render all sites ──
function renderAll() {
  var list     = document.getElementById('siteList');
  var empty    = document.getElementById('emptyState');
  var statsBar = document.getElementById('statsBar');

  if (sites.length === 0) {
    list.innerHTML = '';
    list.appendChild(empty);
    statsBar.style.display = 'none';
    updateGlobal();
    return;
  }

  empty.style.display    = 'none';
  statsBar.style.display = 'flex';
  list.innerHTML = '';
  sites.forEach(function(s){ list.appendChild(buildCard(s)); });
  updateStats();
  updateGlobal();
}

// ── Update stats bar ──
function updateStats() {
  var up   = sites.filter(function(s){ return s.status==='up'; }).length;
  var down = sites.filter(function(s){ return s.status==='down'; }).length;
  var resp = sites.filter(function(s){ return s.response; }).map(function(s){ return s.response; });
  var avg  = resp.length ? Math.round(resp.reduce(function(a,b){return a+b;},0)/resp.length) : null;
  document.getElementById('stTotal').textContent = sites.length;
  document.getElementById('stUp').textContent    = up;
  document.getElementById('stDown').textContent  = down;
  document.getElementById('stAvg').textContent   = avg ? avg+'ms' : '—';
}

// ── Update global dot ──
function updateGlobal() {
  var dot   = document.getElementById('globalDot');
  var label = document.getElementById('globalStatus');
  if (!dot || !label) return;
  var up   = sites.filter(function(s){ return s.status==='up'; }).length;
  var down = sites.filter(function(s){ return s.status==='down'; }).length;
  if (sites.length===0)       { dot.className='status-dot'; label.textContent='—'; }
  else if (down===0 && up>0)  { dot.className='status-dot up';    label.textContent='All Online'; }
  else if (up===0)             { dot.className='status-dot down';  label.textContent='All Offline'; }
  else                         { dot.className='status-dot mixed'; label.textContent=up+'/'+sites.length+' Online'; }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('addBtn').addEventListener('click', addSite);
  document.getElementById('siteUrl').addEventListener('keydown', function(e){
    if (e.key === 'Enter') addSite();
  });
  load();
  renderAll();
  sites.forEach(function(s){ startMonitor(s); });
});
