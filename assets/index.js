
(function(){
var $=function(s){return document.querySelector(s)},grid=$('#grid'),cards=[].slice.call(grid.querySelectorAll('.card')),
q=$('#q'),cat=$('#cat'),st=$('#st'),sort=$('#sort'),count=$('#count'),empty=$('#empty'),
chips=[].slice.call(document.querySelectorAll('.chip[data-o]')),outcome='all';
var by={
 name:function(a,b){return a.dataset.n.localeCompare(b.dataset.n)},
 ret:function(a,b){return (b.dataset.r-a.dataset.r)||(b.dataset.t-a.dataset.t)||by.name(a,b)},
 total:function(a,b){return (b.dataset.t-a.dataset.t)||by.name(a,b)},
 old:function(a,b){return (a.dataset.l-b.dataset.l)||by.name(a,b)},
 'new':function(a,b){var x=a.dataset.l==9999?-1:+a.dataset.l,y=b.dataset.l==9999?-1:+b.dataset.l;return (y-x)||by.name(a,b)}
};
function load(){
 var p=new URLSearchParams(location.hash.slice(1));
 q.value=p.get('q')||'';outcome=p.get('o')||'all';cat.value=p.get('c')||'';st.value=p.get('s')||'';sort.value=by[p.get('sort')]?p.get('sort'):'name';
}
function apply(){
 var terms=q.value.trim().toLowerCase().split(/\s+/).filter(Boolean),n=0;
 cards.slice().sort(by[sort.value]).forEach(function(c){
  var ok=(outcome==='all'||c.dataset.o===outcome)&&(!cat.value||c.dataset.c===cat.value)&&(!st.value||c.dataset.s===st.value)&&terms.every(function(t){return c.dataset.q.indexOf(t)>=0});
  c.hidden=!ok;if(ok)n++;grid.appendChild(c);
 });
 chips.forEach(function(ch){ch.setAttribute('aria-pressed',String(ch.dataset.o===outcome))});
 count.textContent='Showing '+n+' of '+cards.length;empty.hidden=n>0;
 var p=new URLSearchParams();
 if(q.value.trim())p.set('q',q.value.trim());if(outcome!=='all')p.set('o',outcome);if(cat.value)p.set('c',cat.value);if(st.value)p.set('s',st.value);if(sort.value!=='name')p.set('sort',sort.value);
 var h=p.toString()?'#'+p.toString():'';
 try{history.replaceState(null,'',h||location.pathname+location.search)}catch(e){}
 try{sessionStorage.setItem('bc-hash',h)}catch(e){}
}
load();apply();
q.addEventListener('input',apply);[cat,st,sort].forEach(function(el){el.addEventListener('change',apply)});
chips.forEach(function(ch){ch.addEventListener('click',function(){outcome=ch.dataset.o;apply()})});
window.addEventListener('hashchange',function(){load();apply()});
})();
