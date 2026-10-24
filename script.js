const b=document.getElementById("burger"),m=document.getElementById("menu");
b.addEventListener("click",()=>{const o=m.classList.toggle("open");b.setAttribute("aria-expanded",o)});
m.addEventListener("click",e=>{if(e.target.tagName==="A"){m.classList.remove("open");b.setAttribute("aria-expanded","false")}});
document.querySelectorAll(".v video").forEach(v=>{const f=()=>{const d=document.createElement("div");d.className="ph";d.textContent="Vídeo pendiente: "+v.closest("figure").querySelector("figcaption").textContent;v.replaceWith(d)};v.addEventListener("error",f);if(v.error)f()});
const lb=document.getElementById("lb"),li=lb.querySelector("img"),ct=lb.querySelector(".ct");let grp=[],cur=0,last=null,sx=0;
function show(i){cur=(i+grp.length)%grp.length;const im=grp[cur].querySelector("img");li.src=im.currentSrc||im.src;li.alt=im.alt;ct.textContent=(cur+1)+" / "+grp.length}
function closeLb(){lb.classList.remove("open");document.body.style.overflow="";if(last)last.focus()}
document.addEventListener("click",e=>{const t=e.target.closest(".th");if(t){grp=[...document.querySelectorAll('.th[data-g="'+t.dataset.g+'"]')];last=t;lb.classList.add("open");document.body.style.overflow="hidden";show(grp.indexOf(t));lb.querySelector(".x").focus();return}
if(!lb.classList.contains("open"))return;if(e.target.closest(".x")||e.target===lb)closeLb();else if(e.target.closest(".pv"))show(cur-1);else if(e.target.closest(".nx"))show(cur+1)});
document.addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")closeLb();if(e.key==="ArrowLeft")show(cur-1);if(e.key==="ArrowRight")show(cur+1)});
lb.addEventListener("touchstart",e=>{sx=e.touches[0].clientX},{passive:true});lb.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))});
