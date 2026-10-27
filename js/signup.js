/* Shared email signup: AJAX submit to Netlify Forms, success state, GA4 event, blog slide-in. */
(function(){
  function enc(d){return Object.keys(d).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(d[k]);}).join('&');}
  function bind(f){
    if(f.__sb)return;f.__sb=1;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var fd=new FormData(f),data={};fd.forEach(function(v,k){data[k]=v;});
      if(!data['form-name'])data['form-name']=f.getAttribute('name')||'newsletter';
      var btn=f.querySelector('button');if(btn){btn.disabled=true;}
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:enc(data)})
        .then(function(r){if(!r.ok)throw new Error(r.status);
          var box=f.closest('.sgn')||f.parentNode;
          var ok=box.querySelector('.sgn-ok')||document.getElementById('newsletter-msg');
          f.style.display='none';if(ok)ok.style.display='block';
          try{localStorage.setItem('sgn_done','1');}catch(x){}
          if(typeof gtag==='function')gtag('event','email_signup',{source:data.source||location.pathname});
        })
        .catch(function(){if(btn)btn.disabled=false;var er=(f.closest('.sgn')||f.parentNode).querySelector('.sgn-err');if(er)er.style.display='block';});
    });
  }
  function init(){
    document.querySelectorAll('form[name="newsletter"]').forEach(bind);
    var s=document.getElementById('sgn-slide');if(!s)return;
    var K='sgn_slide_ts',now=Date.now(),seen=0;
    try{seen=+localStorage.getItem(K)||0;if(localStorage.getItem('sgn_done'))return;}catch(x){}
    if(now-seen<14*864e5)return;
    function onScroll(){
      var h=document.documentElement,p=(h.scrollTop||document.body.scrollTop)/((h.scrollHeight-h.clientHeight)||1);
      if(p>=.5){window.removeEventListener('scroll',onScroll);s.classList.add('show');try{localStorage.setItem(K,String(Date.now()));}catch(x){}}
    }
    window.addEventListener('scroll',onScroll,{passive:true});
    s.querySelector('.sgn-x').addEventListener('click',function(){s.classList.remove('show');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
