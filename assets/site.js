/* SEO Experts Denver — shared behaviour: menu, dropdowns, lead forms (FormSubmit AJAX) */
(function(){
  var menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  document.querySelectorAll('.has-dd > .dd-btn').forEach(function(b){
    b.addEventListener('click',function(e){
      e.preventDefault();
      var li=b.parentNode,open=!li.classList.contains('open');
      document.querySelectorAll('.has-dd.open').forEach(function(o){if(o!==li){o.classList.remove('open');o.querySelector('.dd-btn').setAttribute('aria-expanded','false');}});
      li.classList.toggle('open',open);b.setAttribute('aria-expanded',open?'true':'false');
    });
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('.has-dd')){document.querySelectorAll('.has-dd.open').forEach(function(o){o.classList.remove('open');o.querySelector('.dd-btn').setAttribute('aria-expanded','false');});}
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){document.querySelectorAll('.has-dd.open').forEach(function(o){o.classList.remove('open');var b=o.querySelector('.dd-btn');b.setAttribute('aria-expanded','false');b.focus();});}
  });

  /* Prefill from the diagnosis tool: /contact/?d=<summary> */
  try{
    var params=new URLSearchParams(location.search),d=params.get('d');
    if(d){
      d=d.slice(0,400);
      document.querySelectorAll('form[data-fs]').forEach(function(f){
        var hid=f.querySelector('[name="diagnosis"]');if(hid)hid.value=d;
        var msg=f.querySelector('textarea');if(msg&&!msg.value)msg.value='Diagnosis tool result: '+d+'\n\n';
      });
      var ban=document.getElementById('diagBanner');
      if(ban){ban.hidden=false;var t=ban.querySelector('[data-diag]');if(t)t.textContent=d;}
    }
  }catch(err){}

  /* Lead forms: FormSubmit AJAX; address assembled at runtime */
  var t0=Date.now();
  function addr(el){return atob(el.getAttribute('data-a'))+String.fromCharCode(64)+atob(el.getAttribute('data-b'));}
  document.querySelectorAll('form[data-fs]').forEach(function(f){
    var pg=f.querySelector('[name="page"]');if(pg)pg.value=location.pathname;
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var st=f.querySelector('.fs-status');
      st.className='fs-status';
      var hp=f.querySelector('[name="_honey"]');
      if(hp&&hp.value){st.textContent='Thanks, your message was sent.';st.classList.add('ok');f.reset();return;}
      if(Date.now()-t0<3000){st.textContent='One moment, please. Wait a few seconds, then press send again.';st.classList.add('err');return;}
      var bad=[].filter.call(f.querySelectorAll('[required]'),function(i){return !String(i.value||'').trim();});
      if(bad.length){st.textContent='Please fill in the fields marked with a star.';st.classList.add('err');bad[0].focus();return;}
      var em=f.querySelector('[type="email"]');
      if(em&&em.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)){st.textContent='Please check the email address.';st.classList.add('err');em.focus();return;}
      var btn=f.querySelector('[type="submit"]');
      if(btn){btn.disabled=true;}
      st.textContent='Sending...';
      fetch('https://formsubmit.co/ajax/'+addr(f),{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)})
        .then(function(r){if(!r.ok){throw new Error('http');}return r.json();})
        .then(function(j){if(j&&(j.success===false||j.success==='false')){throw new Error('fs');}
          st.textContent='Thanks, your message was sent. A person will get back to you soon.';st.classList.add('ok');f.reset();})
        .catch(function(){st.innerHTML='That did not go through. Please try again, or call <a href="tel:18004818638">1-800-481-8638</a>.';st.classList.add('err');})
        .then(function(){if(btn){btn.disabled=false;}});
    });
  });
})();
