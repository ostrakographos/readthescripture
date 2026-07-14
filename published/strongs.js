/* readthescripture.com — Strong's Concordance reader
   Drop  <script src="/strongs.js" defer></script>  near the end of <body>.
   - Lazily loads /strongs-dictionary.json (Strong's Hebrew + Greek, public domain).
   - Finds valid G#### / H#### references in the page text and turns them into
     links to /strongs.html#<ref> with a mouseover (and focus/tap) definition popup.
   - Skips scripts, styles, existing links, inputs, and anything marked .no-strongs.
*/
(function () {
  'use strict';
  var DICT_URL = '/strongs-dictionary.json';
  var READER   = '/strongs.html';
  var dict = null, dictPromise = null;

  /* ---- styles ---- */
  var css = [
    '.sg-ref{color:#8A6018;border-bottom:1px dotted rgba(138,96,24,.6);cursor:help;',
    '  text-decoration:none;white-space:nowrap;font-variant-numeric:tabular-nums;}',
    '.sg-ref:hover,.sg-ref:focus{color:#B85A30;border-bottom-color:#B85A30;outline:none;}',
    '#sg-pop{position:absolute;z-index:2147483600;max-width:340px;width:max-content;',
    '  background:#0E0A04;color:#EAD7AF;border:1px solid rgba(192,144,48,.35);border-radius:8px;',
    '  box-shadow:0 10px 40px rgba(0,0,0,.55);padding:14px 16px;font-family:Georgia,"Times New Roman",serif;',
    '  font-size:14px;line-height:1.5;opacity:0;pointer-events:none;transition:opacity .12s;}',
    '#sg-pop.on{opacity:1;pointer-events:auto;}',
    '#sg-pop::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;',
    '  background:linear-gradient(90deg,transparent 10%,#C09030 40%,#E8CC76 50%,#C09030 60%,transparent 90%);}',
    '#sg-pop .sg-h{display:flex;align-items:baseline;gap:8px;margin-bottom:6px;flex-wrap:wrap;}',
    '#sg-pop .sg-lemma{font-size:22px;color:#E8CC76;line-height:1;}',
    '#sg-pop .sg-x{font-style:italic;color:#7F77DD;}',
    '#sg-pop .sg-num{font-family:"Cinzel",Georgia,serif;font-size:10px;letter-spacing:.12em;',
    '  text-transform:uppercase;color:rgba(232,204,118,.6);margin-left:auto;}',
    '#sg-pop .sg-pron{color:rgba(235,215,175,.6);font-size:12.5px;margin-bottom:8px;}',
    '#sg-pop .sg-def{margin:0 0 8px;color:#EAD7AF;}',
    '#sg-pop .sg-kjv{font-size:12.5px;color:rgba(235,215,175,.72);margin:0 0 10px;}',
    '#sg-pop .sg-kjv b{color:#C09030;font-weight:600;font-family:"Cinzel",Georgia,serif;font-size:9.5px;',
    '  letter-spacing:.14em;text-transform:uppercase;display:block;margin-bottom:2px;}',
    '#sg-pop .sg-open{font-family:"Cinzel",Georgia,serif;font-size:10px;letter-spacing:.12em;',
    '  text-transform:uppercase;color:#C09030;text-decoration:none;}',
    '#sg-pop .sg-open:hover{color:#E8CC76;}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---- single shared popup ---- */
  var pop = document.createElement('div');
  pop.id = 'sg-pop'; pop.setAttribute('role', 'tooltip');
  document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(pop); });
  var hideTimer = null, current = null;

  function esc(s){ return (s||'').replace(/[&<>]/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }

  function render(ref, e){
    if (!e) { pop.innerHTML = '<div class="sg-def">'+ref+': not found.</div>'; return; }
    var html = '<div class="sg-h">';
    if (e.l) html += '<span class="sg-lemma" lang="'+(ref[0]==='H'?'he':'el')+'">'+esc(e.l)+'</span>';
    if (e.x) html += '<span class="sg-x">'+esc(e.x)+'</span>';
    html += '<span class="sg-num">'+ref+'</span></div>';
    if (e.p) html += '<div class="sg-pron">/'+esc(e.p)+'/</div>';
    if (e.d) html += '<p class="sg-def">'+esc(e.d)+'</p>';
    if (e.k) html += '<p class="sg-kjv"><b>KJV usage</b>'+esc(e.k)+'</p>';
    html += '<a class="sg-open" href="'+READER+'#'+ref+'">Open in concordance &rarr;</a>';
    pop.innerHTML = html;
  }

  function place(target){
    var r = target.getBoundingClientRect();
    pop.style.left = '-9999px'; pop.classList.add('on');
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var sx = window.pageXOffset, sy = window.pageYOffset;
    var left = sx + r.left + r.width/2 - pw/2;
    left = Math.max(sx+8, Math.min(left, sx + document.documentElement.clientWidth - pw - 8));
    var top = sy + r.top - ph - 8;
    if (r.top - ph - 8 < 0) top = sy + r.bottom + 8;   /* flip below if no room above */
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }

  function show(target){
    clearTimeout(hideTimer);
    var ref = target.getAttribute('data-sg');
    current = target;
    if (dict){ render(ref, dict[ref]); place(target); return; }
    pop.innerHTML = '<div class="sg-h"><span class="sg-num">'+ref+'</span></div><p class="sg-def">Loading&hellip;</p>';
    place(target);
    load().then(function(){ if (current === target){ render(ref, dict[ref]); place(target); } });
  }
  function hide(){ hideTimer = setTimeout(function(){ pop.classList.remove('on'); current=null; }, 120); }

  pop.addEventListener('mouseenter', function(){ clearTimeout(hideTimer); });
  pop.addEventListener('mouseleave', hide);

  /* ---- load dictionary ---- */
  function load(){
    if (dictPromise) return dictPromise;
    dictPromise = fetch(DICT_URL).then(function(r){ return r.json(); })
      .then(function(j){ dict = j; return j; })
      .catch(function(){ dict = {}; return {}; });
    return dictPromise;
  }

  /* ---- scan & wrap ---- */
  var SKIP = {SCRIPT:1,STYLE:1,A:1,BUTTON:1,TEXTAREA:1,INPUT:1,CODE:1,PRE:1};
  var RE = /\b([GH])(\d{1,5})\b/g;
  /* cheap validity check without the dictionary: Hebrew H1-H8674, Greek G1-G5624 */
  function inRange(ref){ var n=parseInt(ref.slice(1),10); return n>=1 && (ref[0]==='H'?n<=8674:n<=5624); }

  function scan(root){
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n){
        if (!n.nodeValue || !/[GH]\d/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        while (p && p !== root){
          if (SKIP[p.nodeName] || (p.classList && p.classList.contains('no-strongs'))) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var targets = [], n;
    while ((n = walker.nextNode())) targets.push(n);
    targets.forEach(function(node){
      RE.lastIndex = 0;
      var text = node.nodeValue, m, last = 0, frag = null;
      while ((m = RE.exec(text))){
        var ref = m[1] + String(parseInt(m[2],10));   /* normalise G026 -> G26 */
        if (!inRange(ref)) continue;                    /* skip out-of-range false positives */
        if (!frag) frag = document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var a = document.createElement('a');
        a.className = 'sg-ref'; a.href = READER + '#' + ref;
        a.setAttribute('data-sg', ref); a.setAttribute('tabindex','0');
        a.textContent = m[0];
        frag.appendChild(a);
        last = m.index + m[0].length;
      }
      if (frag){
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    });
  }

  /* delegated hover/focus/tap */
  document.addEventListener('mouseover', function(e){ var t = e.target.closest && e.target.closest('.sg-ref'); if (t) show(t); });
  document.addEventListener('mouseout',  function(e){ if (e.target.closest && e.target.closest('.sg-ref')) hide(); });
  document.addEventListener('focusin',   function(e){ if (e.target.classList && e.target.classList.contains('sg-ref')) show(e.target); });
  document.addEventListener('focusout',  function(e){ if (e.target.classList && e.target.classList.contains('sg-ref')) hide(); });
  document.addEventListener('click', function(e){
    var t = e.target.closest && e.target.closest('.sg-ref');
    if (!t) return;
    if (window.matchMedia && window.matchMedia('(hover:none)').matches){  /* touch: first tap shows, second follows */
      if (current !== t){ e.preventDefault(); show(t); }
    }
  });
  window.addEventListener('scroll', function(){ if (pop.classList.contains('on') && current) place(current); }, {passive:true});

  /* go — wrap references immediately (range-checked); the dictionary loads on first hover */
  function run(){ scan(document.body); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
