/* Booking tracking for GA4 (G-GVZK5ZB3NQ). No visible changes. */
(function(){
  function send(name,params){
    if(typeof window.gtag==='function'){window.gtag('event',name,params);}
    else{(window.dataLayer=window.dataLayer||[]).push(['event',name,params]);}
  }
  function loc(a){
    var map=[['.cro-sticky','sticky_mobile'],['nav,.nav,header','nav'],['footer','footer'],
      ['.page-hero,.hero,[class*="hero"]','hero'],['[class*="cta"]','cta']];
    for(var i=0;i<map.length;i++){try{if(a.closest(map[i][0]))return map[i][1];}catch(e){}}
    var p=location.pathname;
    if(/about/.test(p))return 'about';
    if(/get-started/.test(p))return 'schedule';
    return 'inline';
  }
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[href*="oncehub.com/meetsage"]'):null;
    if(!a)return;
    send('book_call_click',{
      page_path:location.pathname,
      link_text:(a.textContent||'').replace(/\s+/g,' ').trim().slice(0,100),
      location:loc(a),
      link_url:a.href,
      transport_type:'beacon'
    });
  },true);
  /* OnceHub embed events: https://developers.oncehub.com/docs/client-side-api/embedded-booking-calendar-events/ */
  var done=false;
  window.addEventListener('message',function(e){
    if(e.origin!=='https://oncehub.com'||!e.data||typeof e.data.type!=='string')return;
    if(e.data.type==='oncehub.booking.scheduled'&&!done){
      done=true;
      var p=e.data.payload||{};
      /* No personal data (names, emails) is sent to GA. */
      send('book_call_complete',{page_path:location.pathname,booking_subject:p.subject||'',duration_minutes:p.duration_minutes||0});
    }else if(e.data.type==='oncehub.booking_calendar.time_slot_selected'){
      send('book_call_slot_selected',{page_path:location.pathname});
    }
  });
})();
