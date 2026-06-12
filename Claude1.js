Κάτι πήγε στραβά. Δοκίμασε ξανά 🙏');
  }
}

function sendContactForm(){
  const name = (document.getElementById('contact-name')?.value||'').trim()||'Ανώνυμος';
  const msg  = (document.getElementById('contact-msg')?.value||'').trim();
  if(!msg){ alert('Γράψε πρώτα ένα μήνυμα! ✏️'); return; }
  const subj = encodeURIComponent('Μήνυμα από μιά Ψυχή');
  const body = encodeURIComponent('Από: ' + name + '\n\n' + msg);
  window.open('mailto:cyp11111@gmail.com?subject=' + subj + '&body=' + body);
}

const chatHistory = [];

function addChatBubble(who, text){
  const box = document.getElementById('chat-messages');
  if(!box) return;
  const isAI = who==='ai';
  const div  = document.createElement('div');
  div.style.cssText = `margin-bottom:10px;display:flex;justify-content:${isAI?'flex-start':'flex-end'};`;
  div.innerHTML = `<div style="max-width:82%;padding:9px 13px;border-radius:${isAI?'4px 14px 14px 14px':'14px 4px 14px 14px'};background:${isAI?'#f0ece0':'#8b6914'};color:${isAI?'#2a1a00':'#fffef0'};font-size:13px;line-height:1.6;">${text}</div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

async function sendChatMsg(){
  const input = document.getElementById('chat-input');
  const text  = (input?.value||'').trim();
  if(!text) return;
  input.value = '';
  addChatBubble('user', text);
  chatHistory.push({ role:'user', content:text });

  const loadId = 'load-'+Date.now();
  const box = document.getElementById('chat-messages');
  if(box){
    const ld=document.createElement('div');
    ld.id=loadId; ld.style.cssText='margin-bottom:10px;color:#8a7040;font-size:12px;padding:4px 8px;';
    ld.textContent='✍️ ...';
    box.appendChild(ld); box.scrollTop=box.scrollHeight;
  }

  try{
    const resp = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        system:`Είσαι ένας φιλικός, ζεστός ακροατής με ενσυναίσθηση. Μιλάς Ελληνικά.
Ακούς τον χρήστη με κατανόηση. Δεν δίνεις ιατρικές/νομικές συμβουλές.
Είσαι σύντομος (2-4 προτάσεις), ζεστός, ειλικρινής.
Αν κάποιος εκφράζει σοβαρό πόνο, προτείνεις ήπια επαγγελματική βοήθεια.`,
        messages: chatHistory
      })
    });
    const data = await resp.json();
    const reply= data.content?.[0]?.text || 'Είμαι εδώ. Συνέχισε...';
    document.getElementById(loadId)?.remove();
    addChatBubble('ai', reply);
    chatHistory.push({ role:'assistant', content:reply });
    if(chatHistory.length>20){ chatHistory.splice(0,2); }
  }catch(e){
    document.getElementById(loadId)?.remove();
    addChatBubble('ai','Κάτι πήγε στραβά. Δοκίμασε ξανά 🙏');
  }
}

function loadCandleCount(){
  return parseInt(localStorage.getItem('proseyxitari-candles')||'0');
}
async function incrementCandleCount(){
  const n = loadCandleCount()+1;
  localStorage.setItem('proseyxitari-candles', String(n));
  updateCandleDisplay(n);
}
function updateCandleDisplay(n){
  if(n===undefined) n=loadCandleCount();
  const el=document.getElementById('candle-count-display');
  if(el) el.textContent='🕯️ '+n.toLocaleString();
}

function dedicateWhatsApp(){
  const name = document.getElementById('ded-name').value.trim()||'';
  const url  = window.location.href;
  const text = encodeURIComponent('🕯️ Κάποιος άναψε ένα κερί'+(name?' για '+name:'')+'!\nΜπες: '+url+' 💛');
  window.open('https://wa.me/?text='+text);
}
function dedicateViber(){
  const name = document.getElementById('ded-name').value.trim()||'';
  const url  = window.location.href;
  const text = encodeURIComponent('🕯️ Κάποιος άναψε ένα κερί'+(name?' για '+name:'')+'!\nΜπες: '+url+' 💛');
  window.open('viber://forward?text='+text);
}
function dedicateFacebook(){
  const url = encodeURIComponent(window.location.href);
  window.open('https://www.facebook.com/sharer/sharer.php?u='+url);
}

function shareApp(){
  updateCandleDisplay();
  const url   = window.location.href;
  const modal = document.getElementById('share-modal');
  document.getElementById('share-url').value = url;
  if(navigator.share){
    document.getElementById('native-share-btn').style.display='block';
  }
  document.getElementById('clean-viewer').style.display='none';
  document.getElementById('viewer-img').src='';
  viewerList=[];
  modal.style.display='flex';
}

function nativeShare(){
  const url   = window.location.href;
  const title = 'Εσωτερική Αναζήτηση';
  const text  = '🕯️ Εσωτερική Αναζήτηση — Άναψε ένα κερί, άκουσε ύμνους, βρες γαλήνη.';
  if(navigator.share){
    navigator.share({ title, text, url }).catch(()=>{});
  }
}

function copyShareUrl(){
  const input=document.getElementById('share-url');
  input.select(); input.setSelectionRange(0,999);
  navigator.clipboard?.writeText(input.value).catch(()=>{
    document.execCommand('copy');
  });
  const btn=event.target;
  btn.textContent='✓ Αντιγράφηκε!';
  setTimeout(()=>{ btn.textContent='Αντιγραφή'; },2000);
}

function shareTo(platform){
  const url  = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('🕯️ Εσωτερική Αναζήτηση — Άναψε ένα κερί, άκουσε ύμνους, βρες γαλήνη.');
  const links = {
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    viber:    `viber://forward?text=${text}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    email:    `mailto:?subject=Εσωτερική Αναζήτηση&body=${text}%20${url}`,
  };
  if(links[platform]) window.open(links[platform], '_blank');
}

let openCat = null;
function toggleCat(cat){
  const btn = document.getElementById('btn-'+cat);
  const nav = document.getElementById('nav-'+cat);
  if(!btn || !nav) return;
  const isOpen = nav.classList.contains('open');

  if(isOpen && curCat === cat){
    if(audio.paused){
      audio.play();
      _setPauseBtns('⏸', true);
    } else {
      audio.pause();
      _setPauseBtns('▶', true);
    }
    return;
  }

  ['prayer','psalm','music'].forEach(c=>{
    const b=document.getElementById('btn-'+c);
    const n=document.getElementById('nav-'+c);
    if(b) b.classList.remove('active');
    if(n) n.classList.remove('open');
  });

  if(!isOpen){
    btn.classList.add('active');
    nav.classList.add('open');
    openCat = cat;
    if(curCat !== cat){
      playCurrentAudio(cat);
      _setPauseBtns('⏸', true);
    } else {
      if(audio.paused){
        audio.play();
        _setPauseBtns('⏸', true);
      } else {
        playCurrentAudio(cat);
        _setPauseBtns('⏸', true);
      }
    }
  } else {
    if(!audio.paused && curCat===cat) audio.pause();
    _setPauseBtns('▶', false);
    openCat = null;
  }
}

const MENU_T = {
  el:{ prayer:"ΠΡΟΣΕΥΧΕΣ", psalm:"ΨΑΛΜΟΙ", music:"ΜΟΥΣΙΚΗ", icons:"ΕΙΚΟΝΕΣ", naoi:"ΚΑΤΙ ΑΛΛΟ", mute:"ΣΙΓΑΣΗ", reset:"RESET", back:"← ΑΡΧΙΚΗ", doorBack:"← ΠΟΡΤΕΣ", share:"🔗 ΜΟΙΡΑΣΟΥ", namePh:"Όνομα / Για χάρη...", nameSave:"Αποθήκευση", pencil:"✏️ Γράψε\nπαράκληση", candleLabel:"κεριά έχουν ανάψει", dedTitle:"ΑΦΙΕΡΩΣΕ ΕΝΑ ΚΕΡΙ", shareTitle:"ΜΟΙΡΑΣΟΥ ΜΕ ΦΙΛΟΥΣ",
    donateTitle:"ΣΥΝΕΙΣΦΟΡΑ", donateThanks:"Ευχαριστούμε από καρδιάς 💛",
    donateText:"Αν αυτός ο χώρος σας άρεσε και θέλετε να συνεχίσει να υπάρχει και για άλλες ψυχές που αναζητούν — <em style='color:#d4af37;'>μια μικρή συνεισφορά βοηθά να παραμείνει ενεργός.</em>",
    guideTitle:"🕯️ ΠΩΣ ΝΑ ΧΡΗΣΙΜΟΠΟΙΗΣΕΤΕ ΤΗΝ ΕΚΚΛΗΣΙΑ",
    guideClick:"— με κλικ —",
    guideClose:"[ πάτα για να κλείσεις ]",
    guideSteps:"✏️ <b style='color:#f0d060;'>Γράψε</b> ένα όνομα ή μια ευχή &nbsp; 🕯️ <b style='color:#f0d060;'>Πάρε κερί</b> από το παγκάρι &nbsp; 🔥 <b style='color:#f0d060;'>Άναψέ το</b> από το καντήλι &nbsp; 🙏 <b style='color:#f0d060;'>Τοποθέτησέ το</b> στην άμμο &nbsp; 🎵 <b style='color:#f0d060;'>Επέλεξε</b> Προσευχές ή Ψαλμούς &nbsp; 🤫 <b style='color:#f0d060;'>Παράμεινε</b> σιωπηλός για λίγο" },
  en:{ prayer:"PRAYERS", psalm:"PSALMS", music:"MUSIC", icons:"ICONS", naoi:"SOMETHING ELSE", mute:"MUTE", reset:"RESET", back:"← HOME", doorBack:"← DOORS", share:"🔗 SHARE", namePh:"Name / For...", nameSave:"Save", pencil:"✏️ Write\na prayer", candleLabel:"candles have been lit", dedTitle:"DEDICATE A CANDLE", shareTitle:"SHARE WITH FRIENDS",
    donateTitle:"SUPPORT US", donateThanks:"Thank you from the heart 💛",
    donateText:"If this space touched you and you'd like it to continue existing for other souls seeking — <em style='color:#d4af37;'>a small contribution helps keep it alive.</em>",
    guideTitle:"🕯️ HOW TO USE THE CHURCH", guideClick:"— click —", guideClose:"[ tap to close ]",
    guideSteps:"✏️ <b style='color:#f0d060;'>Write</b> a name or a wish &nbsp; 🕯️ <b style='color:#f0d060;'>Take a candle</b> from the stand &nbsp; 🔥 <b style='color:#f0d060;'>Light it</b> from the oil lamp &nbsp; 🙏 <b style='color:#f0d060;'>Place it</b> in the sand &nbsp; 🎵 <b style='color:#f0d060;'>Choose</b> Prayers or Psalms &nbsp; 🤫 <b style='color:#f0d060;'>Stay still</b> in silence for a moment" },
  ru:{ prayer:"МОЛИТВЫ", psalm:"ПСАЛМЫ", music:"МУЗЫКА", icons:"ИКОНЫ", naoi:"КОЕ-ЧТО ЕЩЁ", mute:"ТИХО", reset:"СБРОС", back:"← ГЛАВНАЯ", doorBack:"← ДВЕРИ", share:"🔗 ПОДЕЛИТЬСЯ", namePh:"Имя / За...", nameSave:"Сохранить", pencil:"✏️ Написать\nмолитву", candleLabel:"свечей зажжено", dedTitle:"ПОСВЯТИТЬ СВЕЧУ", shareTitle:"ПОДЕЛИТЬСЯ С ДРУЗЬЯМИ",
    donateTitle:"ПОДДЕРЖКА", donateThanks:"Спасибо от всего сердца 💛",
    donateText:"Если это место тронуло вас — <em style='color:#d4af37;'>небольшой вклад помогает сохранить его для других.</em>",
    guideTitle:"🕯️ КАК ПОЛЬЗОВАТЬСЯ ЦЕРКОВЬЮ", guideClick:"— нажмите —", guideClose:"[ нажмите для закрытия ]",
    guideSteps:"✏️ <b style='color:#f0d060;'>Напишите</b> имя или пожелание &nbsp; 🕯️ <b style='color:#f0d060;'>Возьмите свечу</b> &nbsp; 🔥 <b style='color:#f0d060;'>Зажгите её</b> от лампады &nbsp; 🙏 <b style='color:#f0d060;'>Поставьте</b> в песок &nbsp; 🎵 <b style='color:#f0d060;'>Выберите</b> Молитвы или Псалмы &nbsp; 🤫 <b style='color:#f0d060;'>Побудьте</b> в тишине" },
  ro:{ prayer:"RUGĂCIUNI", psalm:"PSALMI", music:"MUZICĂ", icons:"ICOANE", naoi:"ALTCEVA", mute:"MUT", reset:"RESET", back:"← ACASĂ", doorBack:"← UȘI", share:"🔗 DISTRIBUIE", namePh:"Nume / Pentru...", nameSave:"Salvează", pencil:"✏️ Scrie\nrugăciune", candleLabel:"lumânări aprinse", dedTitle:"DEDICĂ O LUMÂNARE", shareTitle:"DISTRIBUIE CU PRIETENII",
    donateTitle:"CONTRIBUȚIE", donateThanks:"Mulțumim din inimă 💛",
    donateText:"Dacă acest spațiu v-a plăcut — <em style='color:#d4af37;'>o mică contribuție ajută să rămână activ pentru alte suflete.</em>",
    guideTitle:"🕯️ CUM SĂ FOLOSIȚI BISERICA", guideClick:"— click —", guideClose:"[ apasă pentru a închide ]",
    guideSteps:"✏️ <b style='color:#f0d060;'>Scrie</b> un nume sau o dorință &nbsp; 🕯️ <b style='color:#f0d060;'>Ia o lumânare</b> &nbsp; 🔥 <b style='color:#f0d060;'>Aprinde-o</b> de la candelă &nbsp; 🙏 <b style='color:#f0d060;'>Pune-o</b> în nisip &nbsp; 🎵 <b style='color:#f0d060;'>Alege</b> Rugăciuni sau Psalmi &nbsp; 🤫 <b style='color:#f0d060;'>Rămâi</b> în liniște pentru un moment" }
};

function changeLangFull(lang){
  epSetLang(lang, null);
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.classList.toggle('active-lang', b.getAttribute('onclick')===`epSetLang('${lang}',this)`);
  });
  const sel=document.getElementById('lang-sel-menu');
  if(sel) sel.value=lang;
  const t=MENU_T[lang]||MENU_T.el;
  const bp=document.getElementById('btn-prayer'); if(bp) bp.textContent=t.prayer;
  const bs=document.getElementById('btn-psalm');  if(bs) bs.textContent=t.psalm;
  const bm=document.getElementById('btn-music');  if(bm) bm.textContent=t.music;
  const bi=document.getElementById('btn-icons');  if(bi) bi.textContent=t.icons;
  const bn=document.getElementById('btn-naoi');   if(bn) bn.textContent=t.naoi;
  const bmBtn=document.getElementById('mBtn');    if(bmBtn) bmBtn.textContent=t.mute;
  const backBtn=document.getElementById('back-to-entrance');
  if(backBtn) backBtn.textContent=t.back;
  const doorBackBtn=document.getElementById('door-back-btn');
  if(doorBackBtn) doorBackBtn.textContent=t.doorBack;
  document.querySelectorAll('.share-menu-btn').forEach(b=>b.textContent=t.share);
  const cl=document.getElementById('candle-count-label'); if(cl) cl.textContent=t.candleLabel;
  const dt=document.getElementById('ded-title'); if(dt) dt.textContent=t.dedTitle;
  const st=document.getElementById('share-title-text'); if(st) st.textContent=t.shareTitle;
  const nameInput=document.getElementById('prayer-name');
  if(nameInput) nameInput.placeholder=t.namePh;
  const dtitle=document.getElementById('donate-title'); if(dtitle) dtitle.textContent=t.donateTitle||'ΣΥΝΕΙΣΦΟΡΑ';
  const dtext=document.getElementById('donate-text');
  if(dtext) dtext.innerHTML=(t.donateText||'');
  const dthanks=document.getElementById('donate-thanks'); if(dthanks) dthanks.textContent=t.donateThanks||'Ευχαριστούμε από καρδιάς 💛';
  const gtitle=document.getElementById('guide-title'); if(gtitle && t.guideTitle) gtitle.textContent=t.guideTitle;
  const gclick=document.getElementById('guide-click'); if(gclick && t.guideClick) gclick.textContent=t.guideClick;
  const gsteps=document.getElementById('guide-steps'); if(gsteps && t.guideSteps) gsteps.innerHTML=t.guideSteps;
  const gclose=document.getElementById('guide-close'); if(gclose && t.guideClose) gclose.textContent=t.guideClose;
  const nameSaveBtn=document.getElementById('save-prayer-name');
  if(nameSaveBtn) nameSaveBtn.textContent=t.nameSave;
  const plbl=document.getElementById('pencil-label');
  if(plbl && t.pencil) plbl.innerHTML=t.pencil.replace('\n','<br>');
  const si=document.getElementById('search-input');
  const ep_t = (typeof EP_T !== 'undefined') ? (EP_T[lang]||EP_T.el) : {};
  if(si) si.placeholder = t.searchPh || ep_t.searchPh || '🔍 Αναζήτηση...';
  const kh=document.getElementById('kati-header-title');
  if(kh) kh.textContent = t.katiTitle || ep_t.katiTitle || '✦ ΚΑΤΙ ΑΛΛΟ';
  const dbBtn=document.getElementById('door-back-btn');
  if(dbBtn) dbBtn.textContent = t.doorBack || '← ΠΟΡΤΕΣ';
  /* Ενημέρωση label Σκέψης Ημέρας */
  const dtLbl = document.getElementById('dt-label');
  const dtLabels = { el:'✦ ΣΚΕΨΗ ΤΗΣ ΗΜΕΡΑΣ ✦', en:'✦ THOUGHT OF THE DAY ✦', ru:'✦ МЫСЛЬ ДНЯ ✦', ro:'✦ GÂNDUL ZILEI ✦' };
  if(dtLbl) dtLbl.textContent = dtLabels[lang] || dtLabels.el;
}

const EP_T = {
  el:{ enter:"Είσοδος", sub:"Ένας χώρος ηρεμίας, διαλογισμού και εσωτερικής ειρήνης", searchPh:"🔍 Αναζήτηση...", katiTitle:"✦ ΚΑΤΙ ΑΛΛΟ",
       l1:"Πύλη της Γνώσης", l2:"Πύλη του Νου & της Ειρήνης", l3:"Πύλη της Ελπίδας", l4:"Πύλη της Υγείας", l5:"Πύλη της Μουσικής", l6:"Πύλη Εσωτερικής Γαλήνης", l7:"Πύλη Προσευχής & Ελπίδας",
       a1:"ΓΝΩΣΗ", a2:"ΝΟΥ & ΕΙΡΗΝΗ", a3:"ΕΛΠΙΔΑ", a4:"ΥΓΕΙΑ", a5:"ΜΟΥΣΙΚΗ", a6:"ΓΑΛΗΝΗ", a7:"ΠΡΟΣΕΥΧΗ",
       back:"← ΕΠΙΣΤΡΟΦΗ" },
  en:{ enter:"Enter", sub:"A space of peace, meditation and inner serenity", searchPh:"🔍 Search...", katiTitle:"✦ SOMETHING ELSE",
       l1:"Gate of Knowledge", l2:"Gate of Mind & Peace", l3:"Gate of Hope", l4:"Gate of Health", l5:"Gate of Music", l6:"Gate of Inner Peace", l7:"Gate of Prayer & Hope",
       a1:"KNOWLEDGE", a2:"MIND & PEACE", a3:"HOPE", a4:"HEALTH", a5:"MUSIC", a6:"INNER PEACE", a7:"PRAYER",
       back:"← BACK" },
  ru:{ enter:"Войти", sub:"Пространство покоя, медитации и внутреннего мира", searchPh:"🔍 Поиск...", katiTitle:"✦ КОЕ-ЧТО ЕЩЁ",
       l1:"Врата Знания", l2:"Врата Разума и Покоя", l3:"Врата Надежды", l4:"Врата Здоровья", l5:"Врата Музыки", l6:"Врата Внутреннего Покоя", l7:"Врата Молитвы и Надежды",
       a1:"ЗНАНИЕ", a2:"РАЗУМ & ПОКОЙ", a3:"НАДЕЖДА", a4:"ЗДОРОВЬЕ", a5:"МУЗЫКА", a6:"ПОКОЙ", a7:"МОЛИТВА",
       back:"← НАЗАД" },
  ro:{ enter:"Intrare", sub:"Un spațiu de liniște, meditație și pace interioară", searchPh:"🔍 Căutare...", katiTitle:"✦ ALTCEVA",
       l1:"Poarta Cunoașterii", l2:"Poarta Minții & Păcii", l3:"Poarta Speranței", l4:"Poarta Sănătății", l5:"Poarta Muzicii", l6:"Poarta Păcii Interioare", l7:"Poarta Rugăciunii & Speranței",
       a1:"CUNOAȘTERE", a2:"MINTE & PACE", a3:"SPERANȚĂ", a4:"SĂNĂTATE", a5:"MUZICĂ", a6:"PACE INTERIOARĂ", a7:"RUGĂCIUNE",
       back:"← ÎNAPOI" }
};

function epSetLang(lang, btn){
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active-lang'));
  if(btn) btn.classList.add('active-lang');
  document.querySelectorAll('.verse').forEach(v=>v.classList.remove('active'));
  const vEl = document.getElementById('ep-v-'+lang);
  if(vEl) vEl.classList.add('active');
  const t=EP_T[lang];
  if(!t) return;
  document.getElementById('ep-enter-btn').textContent=t.enter;
  document.getElementById('ep-subtitle').textContent=t.sub;
  for(let i=1;i<=7;i++){ const el=document.getElementById('al-'+i); if(el) el.innerHTML = t['l'+i]||''; }
  for(let i=1;i<=7;i++){ const el=document.getElementById('at-'+i); if(el) el.textContent = t['a'+i]||''; }
  document.getElementById('ep-back-btn').textContent=t.back;
  /* Ενημέρωση label Σκέψης Ημέρας */
  const dtLbl = document.getElementById('dt-label');
  const dtLabels = { el:'✦ ΣΚΕΨΗ ΤΗΣ ΗΜΕΡΑΣ ✦', en:'✦ THOUGHT OF THE DAY ✦', ru:'✦ МЫСЛЬ ДНЯ ✦', ro:'✦ GÂNDUL ZILEI ✦' };
  if(dtLbl) dtLbl.textContent = dtLabels[lang] || dtLabels.el;
}

function epOpenMenu(){
  document.getElementById('ep-door').style.display='none';
  const menu = document.getElementById('ep-arch-menu');
  menu.style.background = ARCH_MENU_BG;
  menu.style.display = 'flex';
}
function epGoBack(){
  document.getElementById('ep-arch-menu').style.display='none';
  document.getElementById('ep-door').style.display='flex';
}

/* ════════════════════════════════════════════════════════════════
   renderDoorContent — χτίζει τη λίστα περιεχομένων μιας πύλης
   ════════════════════════════════════════════════════════════════ */
function renderDoorContent(contentList){
  const box = document.getElementById('door-content-box');
  if(!box) return;
  box.innerHTML = '';
  if(!contentList || contentList.length===0) return;

  const toc = document.createElement('div');
  toc.style.cssText = 'width:100%;margin-bottom:10px;';

  let activeIdx = -1;
  let activeContentEl = null;
  const visitedItems = new Set();

  function showItem(idx){
    activeIdx = idx;
    const item = contentList[idx];
    if(activeContentEl){ activeContentEl.remove(); activeContentEl=null; }
    visitedItems.add(idx);
    toc.querySelectorAll('.toc-btn').forEach((b,i)=>{
      const isActive  = i===idx;
      const isVisited = visitedItems.has(i);
      b.style.background  = isActive ? 'rgba(255,255,200,0.2)' : 'rgba(0,0,0,0.4)';
      b.style.borderColor = isActive ? '#ffe060' : isVisited ? '#4a90d9' : 'rgba(255,255,255,0.15)';
      b.style.fontWeight  = isActive ? '700' : '400';
      const dot = b.querySelector('.visited-dot');
      if(isVisited && !isActive){
        if(!dot){
          const d = document.createElement('span');
          d.className = 'visited-dot';
          d.style.cssText = 'display:inline-block;width:7px;height:7px;border-radius:50%;background:#4a90d9;margin-left:6px;flex-shrink:0;box-shadow:0 0 5px rgba(74,144,217,0.7);';
          b.appendChild(d);
        }
      } else if(dot && isActive){ dot.style.display='none'; }
      else if(dot && !isActive && isVisited){ dot.style.display='inline-block'; }
    });

    const wrap = document.createElement('div');
    wrap.style.marginBottom = '8px';
    wrap.style.opacity = '0';
    wrap.style.transform = 'translateY(-10px)';

    if(item.type==='text'){
      wrap.innerHTML = `<div style="border-radius:8px;padding:18px 20px;background:rgba(255,254,248,0.93);box-shadow:0 2px 16px rgba(0,0,0,0.5);">${item.title?`<div style="color:#5a3a00;font-size:14px;font-weight:700;letter-spacing:0.1em;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e0d0a0;"><span style="color:#d4af37;margin-right:5px;">✦</span>${item.title}</div>`:''}<div class="dropcap-p" style="color:#0a0800;font-size:15px;line-height:1.9;">${(item.body||'').replace(/\n/g,'<br>')}</div></div>`;
    } else if(item.type==='image'){
      wrap.innerHTML = `<div style="text-align:center;"><img src="${item.file}" alt="${item.caption||''}" style="max-width:100%;max-height:65vh;object-fit:contain;border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,0.5);">${item.caption?`<div style="color:#ffe060;font-size:11px;margin-top:8px;">${item.caption}</div>`:''}</div>`;
    } else if(item.type==='video'){
      wrap.innerHTML = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,0.5);"><iframe src="${item.url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div>${item.caption?`<div style="color:#ffe060;font-size:11px;margin-top:8px;text-align:center;">${item.caption}</div>`:''}`;
    } else if(item.type==='video-file'){
      wrap.innerHTML = `<video controls style="width:100%;border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,0.5);"><source src="${item.file}"></video>${item.caption?`<div style="color:#ffe060;font-size:11px;margin-top:8px;text-align:center;">${item.caption}</div>`:''}`;
    } else if(item.type==='pdf'){
      wrap.innerHTML = `<div style="border-radius:6px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.5);"><div style="padding:8px 14px;background:rgba(0,0,0,0.5);"><span style="color:#f0d060;font-size:12px;">📄 ${item.caption||item.file}</span></div><iframe src="${item.file}" style="width:100%;height:500px;border:none;display:block;background:#fff;" title="${item.caption||item.file}"><a href="${item.file}" target="_blank" style="color:#f0d060;padding:20px;display:block;text-align:center;">Άνοιγμα PDF</a></iframe></div>`;
    } else if(item.type==='link'){
      wrap.innerHTML = `<div style="text-align:center;padding:20px;background:rgba(0,0,0,0.4);border-radius:8px;"><a href="${item.url}" target="_blank" style="color:#f0d060;font-size:14px;text-decoration:none;">🔗 ${item.caption||item.url}</a></div>`;

    } else if(item.type==='journal'){
      /* ════ ΗΜΕΡΟΛΟΓΙΟ ΨΥΧΗΣ — πλήρης υλοποίηση ════ */
      var saved = [];
      try { saved = JSON.parse(localStorage.getItem('soul-journal')||'[]'); } catch(e){}
      var entriesHtml = '';
      if(saved.length){
        var recent = saved.slice(-8).reverse();
        recent.forEach(function(e){
          entriesHtml += '<div style="border-bottom:1px solid #e0d0a0;padding:8px 0;">'
            + '<div style="font-size:10px;color:#8a7040;margin-bottom:3px;">📅 ' + e.date + '</div>'
            + '<div style="font-size:13px;color:#2a1a00;line-height:1.6;">' + e.text.replace(/\n/g,'<br>') + '</div>'
            + '</div>';
        });
      } else {
        entriesHtml = '<div style="color:#a09070;font-size:12px;text-align:center;padding:8px 0;">Δεν υπάρχουν ακόμα σκέψεις — γράψε την πρώτη σου!</div>';
      }
      wrap.innerHTML = `
        <div style="border-radius:8px;padding:18px;background:rgba(255,254,248,0.93);box-shadow:0 2px 16px rgba(0,0,0,0.5);">
          <div style="color:#5a3a00;font-size:14px;font-weight:700;margin-bottom:4px;padding-bottom:6px;border-bottom:1px solid #e0d0a0;">
            📔 Ημερολόγιο Ψυχής
          </div>
          <div style="color:#8a7040;font-size:11px;margin-bottom:10px;font-style:italic;">
            Γράψε τη σκέψη σου — αποθηκεύεται μόνο σε αυτή τη συσκευή.
          </div>
          <textarea id="journal-input" placeholder="Τι νιώθεις σήμερα; Τι θέλεις να θυμάσαι;" rows="4"
            style="width:100%;padding:10px;border:1px solid #c8a040;border-radius:6px;font-size:14px;
            font-family:Georgia,serif;resize:none;background:#fffef0;color:#1a1200;box-sizing:border-box;"></textarea>
          <button onclick="saveJournalEntry()"
            style="margin-top:8px;background:#8b6914;color:white;border:none;padding:10px 20px;
            border-radius:6px;cursor:pointer;font-size:13px;font-family:Georgia,serif;width:100%;">
            💾 Αποθήκευση
          </button>
          ${saved.length ? `
          <div style="margin-top:16px;">
            <div style="font-size:11px;color:#8a7040;margin-bottom:6px;letter-spacing:0.1em;">
              📖 ΟΙ ΣΚΕΨΕΙΣ ΣΟΥ (τελευταίες ${Math.min(saved.length,8)} από ${saved.length}):
            </div>
            <div id="journal-entries-list">${entriesHtml}</div>
          </div>` : `<div id="journal-entries-list" style="margin-top:10px;">${entriesHtml}</div>`}
        </div>`;

    } else if(item.type==='contact'){
      wrap.innerHTML = `
        <div style="border-radius:8px;padding:18px;background:rgba(255,254,248,0.93);box-shadow:0 2px 16px rgba(0,0,0,0.5);">
          <div style="color:#5a3a00;font-size:14px;font-weight:700;margin-bottom:4px;">✉️ Γράψε μου</div>
          <div style="color:#8a7040;font-size:11px;margin-bottom:12px;">Το μήνυμά σου θα ανοίξει το email σου έτοιμο να σταλεί</div>
          <input id="contact-name" type="text" placeholder="Το όνομά σου (προαιρετικό)"
            style="width:100%;padding:9px;border:1px solid #c8a040;border-radius:6px;font-size:13px;background:#fffef0;color:#1a1200;box-sizing:border-box;margin-bottom:8px;font-family:Georgia,serif;">
          <textarea id="contact-msg" placeholder="Γράψε ό,τι θέλεις..." rows="5"
            style="width:100%;padding:10px;border:1px solid #c8a040;border-radius:6px;font-size:14px;font-family:Georgia,serif;resize:none;background:#fffef0;color:#1a1200;box-sizing:border-box;"></textarea>
          <button onclick="sendContactForm()"
            style="margin-top:8px;background:#8b6914;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:13px;font-family:Georgia,serif;width:100%;">📨 Αποστολή</button>
        </div>`;

    } else if(item.type==='aichat'){
      wrap.innerHTML = `
        <div style="border-radius:8px;padding:18px;background:rgba(255,254,248,0.93);box-shadow:0 2px 16px rgba(0,0,0,0.5);">
          <div style="color:#5a3a00;font-size:14px;font-weight:700;margin-bottom:4px;">💬 Μίλα με Κάποιον</div>
          <div style="color:#8a7040;font-size:11px;margin-bottom:12px;">Ένας φιλικός ακροατής — γράψε ό,τι νιώθεις</div>
          <div id="chat-messages" style="min-height:120px;max-height:280px;overflow-y:auto;margin-bottom:10px;padding:8px;background:#fffef0;border-radius:6px;border:1px solid #e0d0a0;"></div>
          <div style="display:flex;gap:6px;">
            <input id="chat-input" type="text" placeholder="Γράψε κάτι..."
              style="flex:1;padding:9px;border:1px solid #c8a040;border-radius:6px;font-size:13px;background:#fffef0;color:#1a1200;font-family:Georgia,serif;"
              onkeypress="if(event.key==='Enter')sendChatMsg()">
            <button onclick="sendChatMsg()"
              style="background:#8b6914;color:white;border:none;padding:9px 16px;border-radius:6px;cursor:pointer;font-size:16px;">➤</button>
          </div>
        </div>`;
      setTimeout(()=>addChatBubble('ai','Γεια σου 🙏 Είμαι εδώ να σε ακούσω. Πώς νιώθεις σήμερα;'),200);

    } else if(item.type==='music-track'){
      /* Χωρίς περιεχόμενο — το play γίνεται από τον τίτλο */
    }

    activeContentEl = wrap;
    const btn = toc.querySelectorAll('.toc-btn')[idx];
    btn.insertAdjacentElement('afterend', wrap);
    setTimeout(function(){
      wrap.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      wrap.style.opacity = '1';
      wrap.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(()=>{
      const doorBox = document.getElementById('door-content-box');
      if(btn && doorBox) doorBox.scrollTop = btn.offsetTop - 4;
    }, 40);
  }

  contentList.forEach((item,idx)=>{
    const icons={text:'📖',image:'🖼️',video:'🎬','video-file':'🎬',pdf:'📄',link:'🔗',journal:'📔',contact:'✉️',aichat:'💬','music-track':'♪'};
    const icon = icons[item.type]||'•';
    const label= item.title||item.caption||item.file||('Περιεχόμενο '+(idx+1));
    const btn = document.createElement('button');
    btn.className='toc-btn';
    btn.id = 'toc-music-'+idx;

    if(item.type==='music-track'){
      btn.style.cssText='display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:9px 12px;background:rgba(0,0,0,0.4);color:#fffbe0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;cursor:pointer;font-size:13px;font-family:Georgia,serif;margin-bottom:5px;transition:all 0.2s;';
      btn.innerHTML='<span id="music-icon-'+item.trackIdx+'" style="font-size:15px;flex-shrink:0;min-width:18px;">♪</span>'
        +'<span style="flex:1;">'+label+'</span>'
        +'<span id="music-play-indicator-'+item.trackIdx+'" style="font-size:14px;color:#d0a0ff;display:none;">▶</span>';
      btn.onclick=function(){ playDoorTrack(item.trackIdx); };
    } else {
      btn.style.cssText='display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:9px 12px;background:rgba(0,0,0,0.4);color:#fffbe0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;cursor:pointer;font-size:13px;font-family:Georgia,serif;margin-bottom:5px;';
      btn.innerHTML=`<span style="font-size:15px;flex-shrink:0;">${icon}</span><span style="flex:1;">${label}</span><span style="opacity:0.4;font-size:11px;">›</span>`;
      btn.onclick=()=>{
        if(activeIdx===idx && activeContentEl){
          activeIdx = -1;
          activeContentEl.remove(); activeContentEl=null;
          toc.querySelectorAll('.toc-btn').forEach(b=>{
            b.style.background  = 'rgba(0,0,0,0.4)';
            b.style.borderColor = 'rgba(255,255,255,0.15)';
            b.style.fontWeight  = '400';
          });
        } else {
          showItem(idx);
        }
      };
    }
    toc.appendChild(btn);
  });

  box.appendChild(toc);
}

/* ════════════════════════════════════════════════════════════════
   epGoTo — ανοίγει κάθε πύλη
   ΑΛΛΑΓΗ: Η Πύλη Προσευχής (church) έχει τώρα μουσική
   από τη λίστα MUSIC (ίδια με την Πύλη Μουσικής).
   ════════════════════════════════════════════════════════════════ */
function epGoTo(dest){
  function hidEntry(){ document.getElementById('entrance-page').style.display='none'; }

  function openChurch(){
    hidEntry();
    document.getElementById('back-to-entrance').style.display='block';
    document.getElementById('edit-name-btn').style.display='flex';
    document.getElementById('donate-btn').style.display='flex';
    document.getElementById('pencil-label').style.display='block';
    document.getElementById('door-page').style.display='none';
    document.getElementById('door-chat-btn').style.display='none';
    document.getElementById('door-chat-panel').style.display='none';
    initChurch(); preloadAllAudio();
  }

  function openDoor(bgImg, titleText, audioCat, contentList, autoPlay, bgColor, textColor){
    hidEntry();
    const dp  = document.getElementById('door-page');
    const img = document.getElementById('door-bg-img');
    img.src   = bgImg || '';
    img.style.display = bgImg ? 'block' : 'none';
    dp.style.background = bgImg ? '#04080f' : (bgColor || '#04080f');
    dp.dataset.textColor = textColor || '#e8ddb8';
    document.getElementById('door-title').textContent = titleText;
    document.getElementById('door-now').textContent   = '';
    document.getElementById('door-prev').onclick = ()=>stepAudio(audioCat,-1);
    document.getElementById('door-next').onclick = ()=>stepAudio(audioCat, 1);
    const hasAudio = audioCat && getList(audioCat).length > 0;
    document.getElementById('door-controls').style.display = hasAudio ? 'flex' : 'none';
    dp.style.display = 'flex';
    const chatBtn = document.getElementById('door-chat-btn');
    if(chatBtn) chatBtn.style.display = 'block';
    const chatPanel = document.getElementById('door-chat-panel');
    if(chatPanel) chatPanel.style.display = 'none';
    document.getElementById('now-playing').style.display = 'none';
    renderDoorContent(contentList, textColor);
    preloadAllAudio();
    if(hasAudio && autoPlay) setTimeout(()=>playCurrentAudio(audioCat), 300);
  }

  if(dest==='church'){
    openChurch();
  } else if(dest==='music-direct'){
    /* Πύλη Μουσικής — λίστα τίτλων με αναπαραγωγή */
    const musicList = MUSIC.map(function(item,i){
      return { type:'music-track', title:item.n, file:item.f, trackIdx:i };
    });
    openDoor(BG_MUSIC, '♪ Μουσική', null, musicList, false,
      'linear-gradient(160deg,#2a0850,#1a0438)', '#f0d8ff');
  } else if(dest==='psalms'){
    openDoor(BG_PSALMS, '✝ Ψαλμοί', 'psalm', [], true,
      'linear-gradient(160deg,#5a1a08,#2a0800)', '#ffe0b0');
  } else if(dest==='wisdom'){
    openDoor(BG_WISDOM, '✦ Σοφία & Ρητά', null, WISDOM_CONTENT, false,
      'linear-gradient(160deg,#8b5e10,#3a2000)', '#fff8d0');
  } else if(dest==='meditation'){
    openDoor(BG_MEDITATION, '◎ Διαλογισμός', null, MEDITATION_CONTENT, false,
      'linear-gradient(160deg,#0a3050,#041020)', '#d0f0ff');
  } else if(dest==='photos'){
    /* ════ ΔΙΟΡΘΩΣΗ: αφαιρέθηκε ο λανθασμένος χαρακτήρας ... ════ */
    openDoor(BG_PHOTOS, '🌿 Υγεία', null, HEALTH_CONTENT, false,
      'linear-gradient(160deg,#0a3820,#021408)', '#d0ffd8');
  } else if(dest==='wisdom2'){
    openDoor(BG_WISDOM, '🕊️ Πίστη & Νόημα', null, FAITH_CONTENT, false,
      'linear-gradient(160deg,#5a1a08,#2a0800)', '#ffe0b0');
  } else if(dest==='mystery'){
    openDoor(BG_MYSTERY, '● Εσωτερική Γαλήνη', null, MYSTERY_CONTENT, false,
      'linear-gradient(160deg,#5a0818,#200008)', '#ffd0d8');
  } else {
    alert('Σύντομα διαθέσιμο! 🌟');
  }
}

function goBackToEntrance(){
  document.getElementById('ep-arch-menu').style.display='none';
  document.getElementById('ep-door').style.display='flex';
  document.getElementById('entrance-page').style.display='flex';
  document.getElementById('back-to-entrance').style.display='none';
  document.getElementById('door-page').style.display='none';
  document.getElementById('now-playing').style.display='block';
  document.getElementById('edit-name-btn').style.display='none';
  document.getElementById('pencil-label').style.display='none';
  document.getElementById('donate-btn').style.display='none';
  audio.pause();
}

function goBackToDoors(){
  document.getElementById('clean-viewer').style.display='none';
  document.getElementById('images-modal').classList.remove('open');
  document.getElementById('naoi-modal').classList.remove('open');
  document.getElementById('kati-allo-modal').style.display='none';
  document.getElementById('door-page').style.display='none';
  document.getElementById('entrance-page').style.display='flex';
  document.getElementById('ep-door').style.display='none';
  const menu = document.getElementById('ep-arch-menu');
  menu.style.background = ARCH_MENU_BG;
  menu.style.display = 'flex';
  document.getElementById('now-playing').style.display='block';
  const chatBtn = document.getElementById('door-chat-btn');
  if(chatBtn) chatBtn.style.display = 'none';
  const chatPanel = document.getElementById('door-chat-panel');
  if(chatPanel) chatPanel.style.display = 'none';
}

if(BG_PHOTO){
  const el=document.getElementById('ep-bg-photo');
  el.style.backgroundImage="url('"+BG_PHOTO+"')";
  el.style.opacity='1';
}

function initChurch(){
  const sb=document.getElementById('shrine-box');
  if(sb.querySelector('#mainKeri')) return;
  sb.style.backgroundImage="url('"+CHURCH_BG+"')";
  sb.innerHTML=`
    <div id="mainKeri" class="keri"><div class="floga" id="mainFloga"></div><div class="keri-body"></div></div>
    <div id="eternal-keri" class="is-lit" style="position:absolute;bottom:16%;left:16%;width:18px;height:110px;z-index:450;cursor:pointer;">
      <div class="floga" style="top:-25px;margin-left:1px;scale:1.2;"></div><div class="keri-body"></div>
    </div>
    <div id="pagari" onclick="pickUp(event)"></div>
    <div id="ammos"  onclick="placeDown(event)"></div>
    <div id="k1" class="kantili" onclick="event.stopPropagation()"><div class="floga static-floga"></div></div>
    <div id="k2" class="kantili" onclick="event.stopPropagation()"><div class="floga static-floga"></div></div>`;
  mKeri=document.getElementById('mainKeri');
  mFloga=document.getElementById('mainFloga');
  resizeChurch();
}

function resizeChurch(){
  const viewport = document.getElementById('church-viewport');
  const wrapper  = document.getElementById('byzantine-frame-wrapper');
  if(!viewport || !wrapper) return;
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  let w, h;
  if(vw / vh > 16/9){ h = vh; w = h * 16/9; } else { w = vw; h = w * 9/16; }
  wrapper.style.width  = w + 'px';
  wrapper.style.height = h + 'px';
}
window.addEventListener('resize', resizeChurch);
window.addEventListener('orientationchange', ()=>setTimeout(resizeChurch, 300));

/* ════ ΑΣΤΕΡΙΑ ΕΙΣΟΔΟΥ ════ */
(function(){
  const sg=document.getElementById('ep-svgstars');
  for(let i=0;i<55;i++){
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    let x,y; do{ x=Math.random()*700; y=Math.random()*290; }while(x>268&&x<460&&y>38&&y<315);
    const r=(Math.random()*1.3+0.3).toFixed(1);
    c.setAttribute('cx',x.toFixed(1)); c.setAttribute('cy',y.toFixed(1)); c.setAttribute('r',r);
    c.setAttribute('fill','#ffffff'); c.setAttribute('opacity',(Math.random()*0.7+0.2).toFixed(2));
    c.style.animation=`twinkle ${(2+Math.random()*4).toFixed(1)}s ${(Math.random()*4).toFixed(1)}s infinite alternate`;
    sg.appendChild(c);
  }
  const ag=document.getElementById('ep-archstars');
  for(let i=0;i<80;i++){
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    const x=295+Math.random()*150; const y=58+Math.random()*328;
    const r=(Math.random()*1.2+0.2).toFixed(1);
    c.setAttribute('cx',x.toFixed(1)); c.setAttribute('cy',y.toFixed(1)); c.setAttribute('r',r);
    c.setAttribute('fill','#ffffff'); c.setAttribute('opacity',(Math.random()*0.75+0.2).toFixed(2));
    c.style.animation=`twinkle ${(1.5+Math.random()*4).toFixed(1)}s ${(Math.random()*4).toFixed(1)}s infinite alternate`;
    ag.appendChild(c);
  }
  const bg=document.getElementById('ep-bgstars');
  for(let i=0;i<35;i++){
    const s=document.createElement('div'); const sz=(Math.random()*1.4+0.3).toFixed(1);
    s.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:#fff;border-radius:50%;top:${(Math.random()*100).toFixed(1)}%;left:${(Math.random()*100).toFixed(1)}%;opacity:${(Math.random()*0.28+0.06).toFixed(2)};animation:twinkle ${(2+Math.random()*4).toFixed(1)}s ${(Math.random()*3).toFixed(1)}s infinite alternate;`;
    bg.appendChild(s);
  }
})();

/* ════ ΗΧΟΣ & ΜΟΥΣΙΚΗ ════ */
const audio=document.getElementById('main-audio');
const nowPlayingEl=document.getElementById('now-playing');
let curCat=null; let idx={music:0,prayer:0,psalm:0};

function getList(cat){ return cat==='music'?MUSIC:cat==='prayer'?PRAYERS:PSALMS; }

function updateLabel(cat){
  const list=getList(cat); const lbl=document.getElementById('lbl-'+cat);
  if(!lbl) return;
  if(!list.length){ lbl.textContent='—'; return; }
  lbl.textContent=list[idx[cat]].n+' ('+(idx[cat]+1)+'/'+list.length+')';
}
function stepAudio(cat,dir){
  const list=getList(cat); if(!list.length) return;
  idx[cat]=(idx[cat]+dir+list.length)%list.length;
  updateLabel(cat); playCurrentAudio(cat);
}
function playCurrentAudio(cat){
  const list=getList(cat); if(!list.length) return;
  const item=list[idx[cat]];
  if(curCat===cat){
    if(!audio.paused){ audio.pause(); return; }
    else { audio.play(); return; }
  }
  curCat=cat;
  audio.src=item.f; audio.loop=false; audio.play();
  nowPlayingEl.textContent='♪  '+item.n;
  const dn=document.getElementById('door-now');
  if(dn) dn.textContent='♪  '+item.n+'  ('+(idx[cat]+1)+'/'+list.length+')';
  const pb=document.getElementById('door-play');
  if(pb) pb.textContent='⏸';
  audio.onended=()=>stepAudio(cat,1);
  updateLabel(cat);
}
updateLabel('music'); updateLabel('prayer'); updateLabel('psalm');
function tM(){ if(audio.paused) audio.play(); else audio.pause(); }
function preloadAllAudio(){
  [...MUSIC,...PRAYERS,...PSALMS].forEach(item=>{
    const existing = document.querySelector('audio[data-src="'+item.f+'"]');
    if(!existing){
      const a=document.createElement('audio');
      a.src=item.f; a.preload='auto';
      a.setAttribute('data-src', item.f);
      document.body.appendChild(a);
    }
  });
}

/* ════ ΚΑΤΙ ΑΛΛΟ ════ */
let _kaIdx = -1;

function kaShowItem(idx){
  const box = document.getElementById('kati-allo-content');
  if(!box) return;
  const cs = box.querySelectorAll('.ka-c');
  const bs = box.querySelectorAll('.ka-b');
  const same = (_kaIdx === idx);
  _kaIdx = -1;
  cs.forEach(c=>c.style.display='none');
  bs.forEach(b=>{ b.style.background='rgba(0,0,0,0.4)'; b.style.borderColor='rgba(255,255,255,0.15)'; b.style.fontWeight='400'; });
  if(same) return;
  _kaIdx = idx;
  const el = document.getElementById('ka-c-'+idx);
  if(el) el.style.display='block';
  if(bs[idx]){ bs[idx].style.background='rgba(255,255,200,0.2)'; bs[idx].style.borderColor='#ffe060'; bs[idx].style.fontWeight='700'; }
  setTimeout(()=>{ if(bs[idx]) bs[idx].scrollIntoView({behavior:'smooth',block:'nearest'}); },50);
}

function openKatiAllo(){
  const modal   = document.getElementById('kati-allo-modal');
  const content = document.getElementById('kati-allo-content');
  modal.style.display = 'flex';
  _kaIdx = -1;
  document.getElementById('clean-viewer').style.display='none';
  document.getElementById('viewer-img').src='';
  viewerList=[];

  const bgImg = document.getElementById('kati-allo-bg');
  if(BG_KATI_ALLO && bgImg){ bgImg.src=BG_KATI_ALLO; bgImg.style.display='block'; }
  else if(bgImg){ bgImg.style.display='none'; }
  modal.style.backgroundImage = 'none';
  modal.style.background = '#04080f';

  if(!KATI_ALLO_CONTENT.length){
    content.innerHTML = '<div style="color:#fffbe0;text-align:center;padding:40px;font-size:15px;">Πρόσθεσε περιεχόμενο στο KATI_ALLO_CONTENT</div>';
    return;
  }

  const ico = {text:'📖',image:'🖼️',pdf:'📄','video-file':'🎬',audio:'🎵',link:'🔗'};
  let h = '';
  KATI_ALLO_CONTENT.forEach(function(item,i){
    var lbl = item.title||item.caption||item.file||('Θέμα '+(i+1));
    var ic  = ico[item.type]||'•';
    h += '<button class="ka-b" onclick="kaShowItem('+i+')" style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:10px 14px;background:rgba(0,0,0,0.4);color:#fffbe0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;cursor:pointer;font-size:13px;font-family:Georgia,serif;margin-bottom:5px;">'
      + '<span>'+ic+'</span><span style="flex:1;">'+lbl+'</span><span style="opacity:0.4;">›</span></button>';
    h += '<div id="ka-c-'+i+'" class="ka-c" style="display:none;margin-bottom:10px;">';
    if(item.type==='text'){
      h += '<div style="border-radius:8px;padding:18px 20px;background:rgba(255,254,248,0.93);box-shadow:0 2px 16px rgba(0,0,0,0.5);">'
        + (item.title ? '<div style="color:#5a3a00;font-size:14px;font-weight:700;letter-spacing:0.08em;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e0d0a0;">'+item.title+'</div>' : '')
        + '<div style="color:#1a1200;font-size:15px;line-height:1.9;">'+(item.body||'').replace(/\n/g,'<br>')+'</div></div>';
    } else if(item.type==='image'){
      h += '<div style="text-align:center;padding:12px;background:rgba(0,0,0,0.75);border:1px solid rgba(212,175,55,0.3);border-radius:8px;">'
        + '<img src="'+item.file+'" style="max-width:100%;max-height:65vh;object-fit:contain;border-radius:6px;">'
        + (item.caption?'<div style="color:#f0d060;font-size:12px;margin-top:8px;">'+item.caption+'</div>':'')+'</div>';
    } else if(item.type==='pdf'){
      h += '<div style="border:1px solid rgba(212,175,55,0.3);border-radius:8px;overflow:hidden;">'
        + '<div style="padding:10px 14px;color:#d4af37;font-size:13px;">📄 '+(item.caption||item.file)+'</div>'
        + '<iframe src="'+item.file+'" style="width:100%;height:400px;border:none;background:#fff;"></iframe></div>';
    } else if(item.type==='video-file'){
      h += '<video controls style="width:100%;border-radius:8px;"><source src="'+item.file+'"></video>'
        + (item.caption?'<div style="color:#fff;font-size:12px;margin-top:6px;text-align:center;">'+item.caption+'</div>':'');
    } else if(item.type==='audio'){
      h += '<div style="padding:14px;background:rgba(0,40,80,0.6);border:1px solid rgba(212,175,55,0.3);border-radius:8px;">'
        + (item.caption?'<div style="color:#d4af37;font-size:13px;margin-bottom:10px;">'+item.caption+'</div>':'')
        + '<audio controls style="width:100%;"><source src="'+item.file+'"></audio></div>';
    } else if(item.type==='link'){
      h += '<div style="text-align:center;"><a href="'+item.url+'" target="_blank" style="color:#a0d8ff;font-size:14px;text-decoration:none;padding:10px 20px;border:1px solid rgba(100,180,255,0.5);border-radius:6px;display:inline-block;">🔗 '+(item.caption||item.url)+'</a></div>';
    }
    h += '</div>';
  });
  content.innerHTML = h;
}

/* ════ ΑΝΑΖΗΤΗΣΗ ════ */
function _wordStarts(text, query){
  if(!text || !query) return false;
  var words = text.split(/[\s,.\-:;!?()\[\]]+/);
  for(var i=0; i<words.length; i++){
    if(words[i].toLowerCase().startsWith(query)) return true;
  }
  return false;
}

function doSearch(query){
  const resultsEl = document.getElementById('search-results');
  query = (query||'').trim().toLowerCase();
  if(query.length < 2){ resultsEl.style.display='none'; resultsEl.innerHTML=''; return; }

  const SEARCH_INDEX = [
    { gateName:'✦ Πύλη Γνώσης',        dest:'wisdom',     content: WISDOM_CONTENT },
    { gateName:'◎ Πύλη Νου & Ειρήνης', dest:'meditation', content: MEDITATION_CONTENT },
    { gateName:'🌿 Πύλη Υγείας',        dest:'photos',     content: HEALTH_CONTENT },
    { gateName:'● Πύλη Εσ. Γαλήνης',   dest:'mystery',    content: MYSTERY_CONTENT },
    { gateName:'☀ Πύλη Ελπίδας',       dest:'wisdom2',    content: FAITH_CONTENT },
    { gateName:'✦ Κάτι Άλλο',           dest:'kati',       content: KATI_ALLO_CONTENT },
  ];

  var results = [];
  SEARCH_INDEX.forEach(function(gate){
    if(_wordStarts(gate.gateName.toLowerCase(), query)){
      results.push({ gateName:gate.gateName, dest:gate.dest, itemTitle:null, itemIdx:-1, preview:'' });
    }
    (gate.content||[]).forEach(function(item, idx){
      var title = (item.title||'').toLowerCase();
      var body  = (item.body||'').toLowerCase();
      var cap   = (item.caption||'').toLowerCase();
      if(_wordStarts(title,query) || _wordStarts(body,query) || _wordStarts(cap,query)){
        var fullText = item.body||item.caption||'';
        var pos = fullText.toLowerCase().indexOf(query);
        var preview = '';
        if(pos >= 0){
          var s=Math.max(0,pos-30), e=Math.min(fullText.length,pos+60);
          preview = (s>0?'...':'')+fullText.substring(s,e)+(e<fullText.length?'...':'');
        }
        results.push({ gateName:gate.gateName, dest:gate.dest, itemTitle:item.title||item.caption||null, itemIdx:idx, preview:preview });
      }
    });
  });

  if(results.length===0){
    resultsEl.innerHTML='<div style="padding:14px;color:#8a7040;text-align:center;font-size:13px;">Δεν βρέθηκε αποτέλεσμα</div>';
    resultsEl.style.display='block'; return;
  }

  var h='';
  results.forEach(function(r){
    var re=new RegExp('('+query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    h+='<div onclick="searchOpen(\''+r.dest+'\','+r.itemIdx+')" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid rgba(212,175,55,0.15);" onmouseover="this.style.background=\'rgba(212,175,55,0.1)\'" onmouseout="this.style.background=\'transparent\'">'
      +'<div style="color:#d4af37;font-size:11px;letter-spacing:0.08em;margin-bottom:2px;">'+r.gateName+'</div>';
    if(r.itemTitle) h+='<div style="color:#fffbe0;font-size:13px;font-weight:600;">'+r.itemTitle+'</div>';
    if(r.preview) h+='<div style="color:#a09070;font-size:11px;margin-top:3px;">'+r.preview.replace(re,'<mark style="background:#d4af37;color:#000;border-radius:2px;padding:0 2px;">$1</mark>')+'</div>';
    h+='</div>';
  });
  resultsEl.innerHTML=h; resultsEl.style.display='block';
}

function searchOpen(dest, itemIdx){
  document.getElementById('search-results').style.display='none';
  document.getElementById('search-input').value='';
  epGoTo(dest);
  if(itemIdx>=0){
    setTimeout(function(){
      var btns=document.querySelectorAll('.toc-btn');
      if(btns[itemIdx]) btns[itemIdx].click();
    },600);
  }
}

/* ════ GLOBAL PAUSE BUTTON ════ */
function _setPauseBtns(txt, show){
  ['global-pause-btn','arch-pause-btn'].forEach(function(id){
    var b=document.getElementById(id);
    if(!b) return;
    b.textContent=txt;
    if(show!==undefined) b.style.display=show?'flex':'none';
  });
}

function toggleGlobalMusic(){
  if(audio.paused){
    audio.play();
    _setPauseBtns('⏸');
    _updateDoorMusicUI(_doorMusicIdx);
  } else {
    audio.pause();
    _setPauseBtns('▶');
    _updateDoorMusicUI(-1);
  }
}

audio.addEventListener('play', function(){
  if(curCat==='music'){
    const btn=document.getElementById('global-pause-btn');
    if(btn){ btn.style.display='block'; btn.textContent='⏸'; }
  }
});
audio.addEventListener('pause', function(){
  const btn=document.getElementById('global-pause-btn');
  if(btn) btn.textContent='▶';
});
audio.addEventListener('ended', function(){
  setTimeout(function(){
    if(audio.paused && curCat==='music'){
      const btn=document.getElementById('global-pause-btn');
      if(btn) btn.style.display='none';
    }
  }, 500);
});

function closeKatiAllo(){
  document.getElementById('kati-allo-modal').style.display = 'none';
  _kaIdx = -1;
}

function openImgModal(cat){
  document.getElementById('clean-viewer').style.display='none';
  document.getElementById('viewer-img').src='';
  viewerList=[];
  if(cat==='icon'){ buildImgGrid('icons-grid',ICONS); document.getElementById('images-modal').classList.add('open'); }
  else            { buildImgGrid('naoi-grid',NAOI);   document.getElementById('naoi-modal').classList.add('open'); }
}
function closeImgModal(cat){
  if(cat==='icon') document.getElementById('images-modal').classList.remove('open');
  else             document.getElementById('naoi-modal').classList.remove('open');
}
function buildImgGrid(containerId,list){
  const grid=document.getElementById(containerId); grid.innerHTML='';
  list.forEach((item,i)=>{
    const div=document.createElement('div'); div.className='image-thumb'; div.onclick=()=>openViewer(list,i);
    const img=document.createElement('img'); img.src=item.f; img.alt=item.n; img.className='thumb-img';
    const slot=document.createElement('div'); slot.className='slot-empty'; slot.innerHTML='＋<span>'+item.f+'</span>';
    img.onload=()=>{ img.style.display='block'; slot.style.display='none'; };
    img.onerror=()=>{ img.style.display='none'; slot.style.display='flex'; };
    img.style.display='none'; slot.style.display='flex';
    div.appendChild(img); div.appendChild(slot); grid.appendChild(div);
  });
}

let viewerList=[],viewerIdx=0;
function openViewer(list,i){ viewerList=list; viewerIdx=i; showViewer(); closeImgModal('icon'); closeImgModal('naos'); }
function showViewer(){
  const item=viewerList[viewerIdx];
  document.getElementById('viewer-img').src=item.f;
  document.getElementById('viewer-caption').textContent=item.n+' ('+(viewerIdx+1)+'/'+viewerList.length+')';
  document.getElementById('clean-viewer').style.display='flex';
}
function viewerStep(dir){ viewerIdx=(viewerIdx+dir+viewerList.length)%viewerList.length; showViewer(); }
function closeViewer(){
  document.getElementById('clean-viewer').style.display='none';
  document.getElementById('viewer-img').src='';
  viewerList=[];
  document.getElementById('images-modal').classList.remove('open');
  document.getElementById('naoi-modal').classList.remove('open');
}

/* ════ ΜΟΥΣΙΚΗ ΛΙΣΤΑ ΠΟΡΤΩΝ ════ */
let _doorMusicIdx = -1;

function playDoorTrack(trackIdx){
  const list = MUSIC;
  if(!list.length) return;
  if(_doorMusicIdx === trackIdx && !audio.paused){
    audio.pause();
    _updateDoorMusicUI(-1);
    _doorMusicIdx = -1;
    _setPauseBtns('▶', false);
    return;
  }
  _doorMusicIdx = trackIdx;
  curCat = 'music';
  idx['music'] = trackIdx;
  audio.src = list[trackIdx].f;
  audio.play();
  _setPauseBtns('⏸', true);
  audio.onended = function(){
    _doorMusicIdx = (_doorMusicIdx + 1) % list.length;
    idx['music'] = _doorMusicIdx;
    audio.src = list[_doorMusicIdx].f;
    audio.play();
    _updateDoorMusicUI(_doorMusicIdx);
    _setPauseBtns('⏸', true);
  };
  _updateDoorMusicUI(trackIdx);
}

function _updateDoorMusicUI(activeIdx){
  MUSIC.forEach(function(item, i){
    var indicator = document.getElementById('music-play-indicator-'+i);
    var icon      = document.getElementById('music-icon-'+i);
    if(indicator) indicator.style.display = (i===activeIdx) ? 'inline' : 'none';
    if(icon) icon.textContent = (i===activeIdx) ? '🎵' : '♪';
    var allBtns = document.querySelectorAll('.toc-btn');
    allBtns.forEach(function(b){
      if(b.id === 'toc-music-'+i){
        b.style.background  = (i===activeIdx) ? 'rgba(180,120,255,0.25)' : 'rgba(0,0,0,0.4)';
        b.style.borderColor = (i===activeIdx) ? '#d0a0ff' : 'rgba(255,255,255,0.15)';
        b.style.color       = (i===activeIdx) ? '#ffffff' : '#fffbe0';
      }
    });
  });
}

/* ════ ΚΕΡΙΑ & ΕΚΚΛΗΣΙΑ ════ */
let mKeri=null, mFloga=null, holding=false, lit=false, prayerForName='';
const match=document.getElementById('sound-match');

function pickUp(e){
  e.stopPropagation(); if(!mKeri) return;
  if(!holding){ holding=true;lit=false;mFloga.style.display='none';mKeri.style.display='block';updatePos(e); }
}
function placeDown(e){
  if(!mKeri||!holding) return;
  const box=document.getElementById('shrine-box');
  const clone=mKeri.cloneNode(true); clone.id=''; clone.classList.add('placed');
  clone.style.left=mKeri.style.left;
  clone.style.top=mKeri.style.top;
  if(lit){ clone.classList.add('is-lit'); incrementCandleCount(); }
  if(prayerForName){
    const lbl=document.createElement('div'); lbl.className='prayer-label';
    lbl.textContent=prayerForName; clone.appendChild(lbl);
  }
  clone.onclick=function(ev){
    ev.stopPropagation();
    if(this.classList.contains('is-lit')){
      this.classList.remove('is-lit'); this.classList.add('unlit');
    } else { this.remove(); pickUp(ev); }
  };
  box.appendChild(clone);
  holding=false; mKeri.style.display='none'; hideCandleLight();
}
const candleLight = document.getElementById('candle-light');

function updatePos(e){
  if(!holding||!mKeri) return;
  const box=document.getElementById('shrine-box');
  const r=box.getBoundingClientRect();
  const cX=e.touches?e.touches[0].clientX:e.clientX;
  const cY=e.touches?e.touches[0].clientY:e.clientY;
  mKeri.style.left=(cX-r.left-6)+'px';
  mKeri.style.top =(cY-r.top-50)+'px';
  mKeri.style.transform='none';
  if(lit && candleLight){
    const px=((cX-r.left)/r.width*100).toFixed(1);
    const py=((cY-r.top-28)/r.height*100).toFixed(1);
    candleLight.style.background=`radial-gradient(circle at ${px}% ${py}%, rgba(255,200,80,0.28) 0%, rgba(255,160,40,0.12) 12%, rgba(255,120,20,0.04) 25%, transparent 45%)`;
    candleLight.style.opacity='1';
  } else if(candleLight){ candleLight.style.opacity='0'; }
  if(!lit){
    document.querySelectorAll('.static-floga,.is-lit,#eternal-keri,#k1 .floga,#k2 .floga').forEach(s=>{
      const sr=s.getBoundingClientRect();
      let distance = Math.hypot(cX-(sr.left+sr.width/2),(cY-50)-sr.top);
      if(distance < 55){ lit=true; mFloga.style.display='block'; match.currentTime=0; match.play(); }
    });
  }
}

function hideCandleLight(){ if(candleLight) candleLight.style.opacity='0'; }
window.addEventListener('mousemove',updatePos);
window.addEventListener('touchmove',e=>{ updatePos(e);if(holding)e.preventDefault(); },{passive:false});
window.addEventListener('mouseup', hideCandleLight);
window.addEventListener('touchend', hideCandleLight);

document.getElementById('edit-name-btn').onclick=()=>{
  const p=document.getElementById('name-input-panel');
  p.style.display=p.style.display==='flex'?'none':'flex';
};
document.getElementById('save-prayer-name').onclick=()=>{
  prayerForName=document.getElementById('prayer-name').value.trim()||'μια ψυχή';
  document.getElementById('prayer-name').value='';
  document.getElementById('name-input-panel').style.display='none';
};

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js')
      .then(()=>console.log('SW registered'))
      .catch(e=>console.log('SW error',e));
  });
}

function googleTranslateInit(){
  new google.translate.TranslateElement({
    pageLanguage: 'el',
    includedLanguages: 'en,ru,ro,de,fr,it,es,ar,zh-CN,ja',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}
(function(){
  const s=document.createElement('style');
  s.textContent='.goog-te-banner-frame{display:none!important}body{top:0!important}.skiptranslate{display:none!important}';
  document.head.appendChild(s);
})();
</script>
<script>
/* ════ PARTICLES + ANIMATIONS ════ */
window.addEventListener('load', function(){
  const canvas = document.getElementById('particle-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    const particles = [];
    for(let i=0;i<50;i++){
      particles.push({
        x:Math.random()*canvas.width, y:Math.random()*canvas.height,
        r:Math.random()*2+0.5, vy:Math.random()*0.35+0.1,
        vx:(Math.random()-0.5)*0.25, life:Math.random(),
        dec:Math.random()*0.003+0.001, hue:Math.random()*30+32
      });
    }
    function resetP(p){
      p.x=Math.random()*canvas.width; p.y=canvas.height+5;
      p.r=Math.random()*2+0.5; p.vy=Math.random()*0.35+0.1;
      p.vx=(Math.random()-0.5)*0.25; p.life=1;
      p.dec=Math.random()*0.003+0.001; p.hue=Math.random()*30+32;
    }
    function drawParticles(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(function(p){
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.shadowBlur=8; ctx.shadowColor='hsla('+p.hue+',90%,70%,1)';
        ctx.fillStyle='hsla('+p.hue+',90%,72%,'+(p.life*0.65)+')';
        ctx.fill(); ctx.shadowBlur=0;
        p.x+=p.vx; p.y-=p.vy; p.life-=p.dec;
        if(p.life<=0||p.y<-8) resetP(p);
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }
});

function resetChurch(){
  document.getElementById('clean-viewer').style.display='none';
  document.getElementById('images-modal').classList.remove('open');
  document.getElementById('naoi-modal').classList.remove('open');
  document.getElementById('kati-allo-modal').style.display='none';
  document.querySelectorAll('#shrine-box .placed').forEach(c=>c.remove());
  audio.pause();
}
</script>
</body>
</html>
