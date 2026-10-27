/* Shared email signup: AJAX submit to Web3Forms, success state, GA4 event, blog slide-in. */
(function(){
  /* Web3Forms access key: the ONLY place it lives. */
  var WEB3FORMS_ACCESS_KEY='WEB3FORMS_ACCESS_KEY_PLACEHOLDER';
  var ENDPOINT='https://api.web3forms.com/submit';
  function bind(f){
    if(f.__sb)return;f.__sb=1;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var fd=new FormData(f),data={};fd.forEach(function(v,k){data[k]=v;});
      var name=data['form-name']||f.getAttribute('name')||'form';
      var src=data.source||(location.pathname+'#'+name);
      data.form_name=name;data.source=src;
      data.access_key=WEB3FORMS_ACCESS_KEY;
      data.subject=(name==='newsletter'?'New website signup: ':'New website form ('+name+'): ')+src;
      data.from_name='DeMull Financial website';
      data.page=location.href;
      if(!data.botcheck)delete data.botcheck;else return; /* honeypot filled: drop silently */
      delete data['form-name'];
      var btn=f.querySelector('button[type=submit],button:not([type])');if(btn){btn.disabled=true;}
      fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().then(function(j){if(!r.ok||j.success===false)throw new Error(j.message||r.status);});})
        .then(function(){
          var box=f.closest('.sgn')||f.parentNode;
          var sel=f.getAttribute('data-success');
          var ok=(sel&&document.querySelector(sel))||box.querySelector('.sgn-ok')||(name==='newsletter'&&document.getElementById('newsletter-msg'));
          if(!ok){ok=document.createElement('div');ok.style.cssText='font-size:15px;color:#18343f;line-height:1.7;padding:12px 0';ok.innerHTML='<strong>Got it, thanks!</strong> I&rsquo;ll be in touch soon.';f.parentNode.insertBefore(ok,f.nextSibling);}
          f.style.display='none';ok.style.display='block';
          if(typeof gtag==='function'){
            if(name==='newsletter'){gtag('event','email_signup',{source:src});try{localStorage.setItem('sgn_done','1');}catch(x){}}
            else if(name!=='lead-contact')gtag('event','lead_form_submit',{page_location:location.pathname,form:name});
          }
        })
        .catch(function(){if(btn)btn.disabled=false;var er=(f.closest('.sgn')||f.parentNode).querySelector('.sgn-err');if(er)er.style.display='block';else alert('Sorry, something went wrong. Please try again or email sage@demullfinancial.com.');});
    });
  }
  function init(){
    document.querySelectorAll('form').forEach(function(f){if(f.querySelector('input[name="form-name"]'))bind(f);});
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
