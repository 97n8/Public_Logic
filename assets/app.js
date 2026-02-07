
(function(){
  const y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }
  var skip = document.querySelector('a[href="#main-content"]');
  if(skip){ skip.addEventListener('click', function(){ setTimeout(()=>{ document.getElementById('main-content').focus(); }, 0); }); }
})();
