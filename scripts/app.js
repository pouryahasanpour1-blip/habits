(function(){
'use strict';
/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const fromIso=s=>{const a=s.split('-').map(Number);return new Date(a[0],a[1]-1,a[2],12)};
const addDays=(s,n)=>{const d=fromIso(s);d.setDate(d.getDate()+n);return iso(d)};
const wd=s=>(fromIso(s).getDay()+1)%7; // Saturday = 0
const todayIso=()=>iso(new Date());
const hi=e=>'<span class="hico" aria-hidden="true">'+HabitIcons.render(e)+'</span>';const iconName=e=>HabitIcons.name(e);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toEn=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g,'.').replace(/[٬,،\s]/g,'');
const num=s=>{const v=parseFloat(toEn(s));return isFinite(v)?v:NaN};
const nf=v=>(Math.round(v*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a+')'};
function habitColor(h){if(!D||D.set.theme!=='bee')return h.c;const dark=document.documentElement.dataset.mode==='dark',c=String(h.c||'').toUpperCase(),bee=dark?{yellow:'#F2C94C',tiffany:'#81D8D0',gray:'#AEB9BB',charcoal:'#3D474A'}:{yellow:'#F2C94C',tiffany:'#0F766E',gray:'#667174',charcoal:'#30383B'};if(['#D97706','#C2410C','#F2C94C'].includes(c))return bee.yellow;if(['#059669','#0F766E','#0369A1'].includes(c))return bee.tiffany;if(['#1D4ED8','#475569'].includes(c))return bee.gray;if(c==='#7C3AED')return bee.charcoal;return bee.tiffany;}

/* ---------- Jalali ---------- */
function g2j(gy,gm,gd){const gdm=[0,31,59,90,120,151,181,212,243,273,304,334];let jy=gy>1600?979:0;gy-=gy>1600?1600:621;const gy2=gm>2?gy+1:gy;let days=365*gy+~~((gy2+3)/4)-~~((gy2+99)/100)+~~((gy2+399)/400)-80+gd+gdm[gm-1];jy+=33*~~(days/12053);days%=12053;jy+=4*~~(days/1461);days%=1461;if(days>365){jy+=~~((days-1)/365);days=(days-1)%365}const jm=days<186?1+~~(days/31):7+~~((days-186)/30);const jd=1+(days<186?days%31:(days-186)%30);return[jy,jm,jd]}
function j2g(jy,jm,jd){let gy=jy>979?1600:621;jy-=jy>979?979:0;let days=365*jy+~~(jy/33)*8+~~(((jy%33)+3)/4)+78+jd+(jm<7?(jm-1)*31:(jm-7)*30+186);gy+=400*~~(days/146097);days%=146097;if(days>36524){gy+=100*~~(--days/36524);days%=36524;if(days>=365)days++}gy+=4*~~(days/1461);days%=1461;if(days>365){gy+=~~((days-1)/365);days=(days-1)%365}let gd=days+1;const sa=[0,31,(gy%4==0&&gy%100!=0)||gy%400==0?29:28,31,30,31,30,31,31,30,31,30,31];let gm;for(gm=0;gm<13;gm++){const v=sa[gm];if(gd<=v)break;gd-=v}return[gy,gm,gd]}
const jp=s=>{const d=fromIso(s);return g2j(d.getFullYear(),d.getMonth()+1,d.getDate())};
const fromJ=(y,m,d)=>{const g=j2g(y,m,d);return g[0]+'-'+pad(g[1])+'-'+pad(g[2])};
const jmLen=(y,m)=>m<7?31:m<12?30:(g2j.apply(null,j2g(y,12,30))[1]===12?30:29);
const JM=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const WD=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
const WS=['ش','ی','د','س','چ','پ','ج'];
const jl=s=>{const j=jp(s);return j[2]+' '+JM[j[1]-1]};

/* ---------- data ---------- */
const KEY='habit-tracker-v1';
const COLORS=['#D97706','#059669','#0F766E','#1D4ED8','#7C3AED','#C2410C','#475569','#0369A1'];
const EMOJI=['💻','📚','💪','💧','🪥','🧘','🏃','🍎','😴','💰','📈','✍️','🎯','🧠','🚶','🥗','💊','🎸','🧹','📵','☀️','🙏','🎨','🌱'];
function seed(){const t=todayIso();const all=[0,1,2,3,4,5,6];return{v:1,habits:[
{id:uid(),n:'کار',e:'💻',c:'#475569',ty:'min',tg:360,u:'',days:[0,1,2,3,4],cr:t},
{id:uid(),n:'پس‌انداز',e:'💰',c:'#D97706',ty:'amt',tg:1000000,u:'تومان',days:all,cr:t},
{id:uid(),n:'مطالعه',e:'📚',c:'#059669',ty:'min',tg:30,u:'',days:all,cr:t},
{id:uid(),n:'مسواک',e:'🪥',c:'#1D4ED8',ty:'cnt',tg:2,u:'',days:all,cr:t},
{id:uid(),n:'آب خوردن',e:'💧',c:'#0F766E',ty:'cnt',tg:8,u:'',days:all,cr:t},
{id:uid(),n:'ورزش',e:'💪',c:'#C2410C',ty:'min',tg:60,u:'',days:[0,2,4,5],cr:t}],
logs:{},notes:{},set:{vib:true},timer:null}}
let D;
let memOnly=false;
function norm(o){o.logs=o.logs||{};o.notes=o.notes||{};o.set=Object.assign({vib:true,theme:'gold',mode:'light',snd:true,notif:false,nudge:true,nudgeT:'21:00',ico:'normal'},o.set||{});o.frozen=o.frozen||{};o.sub=o.sub||{};o.chal=o.chal||[];o.badges=o.badges||{};o.cel=o.cel||{};o.stats=o.stats||{timerMin:0};o.habits.forEach(h=>{if(h.rm===undefined)h.rm='';delete h.lk});return o}
function load(){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);if(o&&Array.isArray(o.habits)){norm(o);const MC={'#ffd60a':'#ffd23f','#14d1c4':'#1fd1c1','#81d8d0':'#7ee8d2','#4fb3d9':'#5bc0ff','#c7c7cc':'#a9b4c8','#8e9aa6':'#7c8da6','#ffb800':'#ffb547','#f0f0f0':'#edeff3'};o.habits.forEach(h=>{if(MC[h.c])h.c=MC[h.c]});return o}}}catch(e){memOnly=true}return norm(seed())}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){if(!memOnly){memOnly=true;toast('حافظه‌ی مرورگر در دسترس نیست؛ داده‌ها بعد از بستن صفحه می‌روند.')}}}
D=load();save();
const R={tab:'home',sel:todayIso(),flt:'all',stF:null,stY:0,stM:0,sheet:null};
{const j=jp(todayIso());R.stY=j[0];R.stM=j[1];R.hy=j[0]}

const H=id=>D.habits.find(h=>h.id===id);
const val=(id,d)=>(D.logs[d]&&D.logs[d][id])||0;
function setVal(id,d,v){v=Math.max(0,Math.round(v*100)/100);if(!D.logs[d])D.logs[d]={};if(v)D.logs[d][id]=v;else delete D.logs[d][id];if(!Object.keys(D.logs[d]).length)delete D.logs[d];save();checkBadges()}
const prog=(h,d)=>Math.min(1,val(h.id,d)/h.tg);
const active=(h,d)=>h.days.includes(wd(d))&&d>=h.cr;
function dayStat(d,hid){if(D.frozen[d])return{n:0,p:0,done:false,fz:true};const hs=hid?D.habits.filter(h=>h.id===hid):D.habits;const a=hs.filter(h=>active(h,d));if(!a.length)return{n:0,p:0,done:false};let s=0,all=true;a.forEach(h=>{const p=prog(h,d);s+=p;if(p<1)all=false});return{n:a.length,p:s/a.length,done:all}}
const vib=()=>{if(D.set.vib&&navigator.vibrate)try{navigator.vibrate(12)}catch(e){}};

/* ---------- formatting ---------- */
function fmin(m){m=Math.round(m);if(m<60)return m+' دقیقه';const h=Math.floor(m/60),r=m%60;return h+' ساعت'+(r?' و '+r+' دقیقه':'')}
function cp(v){const a=Math.abs(v);const t=x=>String(Math.round(x*10)/10);if(a>=1e9)return t(v/1e9)+' میلیارد';if(a>=1e6)return t(v/1e6)+' میلیون';if(a>=1e4)return t(v/1e3)+' هزار';return nf(v)}
function valText(h,v,full){
 if(h.ty==='cnt'||h.ty==='chk')return '<span dir="ltr">'+nf(v)+'/'+nf(h.tg)+'</span>';
 if(h.ty==='min')return fmin(v)+' / '+fmin(h.tg);
 if(full)return '<span dir="ltr">'+nf(v)+' / '+nf(h.tg)+'</span>'+(h.u?' '+esc(h.u):'');return cp(v)+' / '+cp(h.tg)}
function ring(p,r){r=r||15;const C=2*Math.PI*r;return '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="'+r+'" class="rt"/><circle cx="18" cy="18" r="'+r+'" class="rp" transform="rotate(-90 18 18)" style="stroke-dasharray:'+(C*Math.min(1,p)).toFixed(2)+' '+C.toFixed(2)+'"/></svg>'}
const rg=(st,txt,extra)=>'<span class="rg'+(st.n&&st.p>=1?' full':'')+(st.n?'':' none')+(st.n&&st.p<=0?' z':'')+(extra||'')+'">'+ring(st.n?st.p:0)+'<b>'+txt+'</b></span>';
function contrastInk(hex){let h=String(hex||'#000000').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));const lum=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];return lum>.179?'#0F172A':'#FFFDF8'}
function rowHTML(h,v,interactive,sk){
	const color=habitColor(h),p=Math.min(1,v/h.tg),ink=contrastInk(color);
	const content='<span class="ri">'+hi(h.e)+'</span><span class="rn">'+esc(h.n)+(sk>=2?' <em class="sk" dir="ltr">'+uiIcon('🔥')+' '+sk+'</em>':'')+'</span><span class="rv num">'+(p>=1?'✓ ':'')+valText(h,v)+'</span>';
	const action=interactive?'<button type="button" class="rc lt" aria-label="ثبت مقدار برای '+esc(h.n)+'">'+content+'</button>':'<div class="rc lt">'+content+'</div>';
	const more=interactive?'<button type="button" class="mb more-btn" data-more="'+h.id+'" aria-label="جزئیات عادت '+esc(h.n)+'">⋯</button>':'';
	return '<div class="row'+(p>=1?' done':'')+'" '+(interactive?'data-row="'+h.id+'" ':'')+'style="--c:'+color+';--fill-ink:'+ink+';background:'+hexA(color,.16)+'"><div class="fill" style="width:'+(p*100).toFixed(1)+'%"><div class="rc dk'+(interactive?' has-more':'')+'" aria-hidden="true">'+content+'</div></div>'+action+more+'</div>'}

/* ---------- toast / sheet ---------- */
let tt;
let askFn=null;
function askSheet(title,msg,okText,fn){R.sheet={t:'ask'};askFn=fn;openSheet('<div class="sh"><span class="e">'+uiIcon('⚠')+'</span><div><b>'+title+'</b></div></div><p style="color:var(--g);font-size:14px;line-height:2;margin:4px 2px 18px">'+msg+'</p><div class="two"><button class="btn r blk" data-askok="1">'+okText+'</button><button class="btn g blk" data-askno="1">انصراف</button></div>')}
function toast(m,ms){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),ms||2200)}
function openSheet(html){$('#sb').innerHTML=html;$('#bg').classList.add('on');$('#sheet').scrollTop=0}
function closeSheet(){$('#bg').classList.remove('on');R.sheet=null;$('#sb').innerHTML=''}

/* ---------- views ---------- */
const ICONS={
home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
stats:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',
habits:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L6.8 5M3.5 12l1.2 1.2L6.8 11M3.5 18l1.2 1.2L6.8 17"/>',
notes:'<path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h6"/>',
set:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'};
const TABS=[['home','امروز'],['stats','آمار'],['habits','عادت‌ها'],['notes','یادداشت'],['set','تنظیمات']];
function renderNav(){$('#nav').innerHTML=TABS.map(t=>'<button data-nav="'+t[0]+'" class="'+(R.tab===t[0]?'on':'')+'" aria-label="'+t[1]+'"><svg viewBox="0 0 24 24">'+ICONS[t[0]]+'</svg><span>'+t[1]+'</span></button>').join('');
 $('#fab').classList.toggle('on',R.tab==='habits')}

function vHome(){
 const T=todayIso(),sel=R.sel,ws=addDays(sel,-wd(sel));
 const title=sel===T?'امروز':sel===addDays(T,-1)?'دیروز':sel===addDays(T,1)?'فردا':WD[wd(sel)];
 const j=jp(sel);
 let strip='';
 for(let i=0;i<7;i++){const d=addDays(ws,i),st=dayStat(d);
  strip+='<button class="wd'+(d===sel?' sel':'')+(d===T?' today':'')+(d>T?' fut':'')+'" data-d="'+d+'"><span class="wl">'+WS[i]+'</span>'+rg(st,st.fz?uiIcon('❄'):jp(d)[2])+'</button>'}
 const all=D.habits.filter(h=>active(h,sel));
 const doneN=all.filter(h=>prog(h,sel)>=1).length;
 const avg=all.length?all.reduce((s,h)=>s+prog(h,sel),0)/all.length:0;
 let list=all.filter(h=>R.flt==='all'||(R.flt==='todo'?prog(h,sel)<1:prog(h,sel)>=1));
 list=list.filter(h=>prog(h,sel)<1).concat(list.filter(h=>prog(h,sel)>=1));
 const sks={};list.forEach(h=>{sks[h.id]=streaks(h.id).cur});
 let body;
 if(!D.habits.length)body='<div class="empty"><span class="em">'+uiIcon('🌱')+'</span>هنوز عادتی نساخته‌ای.<br><button class="btn" data-add="1" style="margin-top:12px">ساخت اولین عادت</button></div>';
 else if(!all.length)body='<div class="empty"><span class="em">'+uiIcon('🌙')+'</span>برای این روز عادتی برنامه‌ریزی نشده.</div>';
 else if(!list.length)body='<div class="empty"><span class="em">'+uiIcon(R.flt==='todo'?'🎉':'🔍')+'</span>'+(R.flt==='todo'?'همه‌ی عادت‌های این روز کامل شد!':'هنوز هیچ‌کدام کامل نشده.')+'</div>';
 else body=list.map(h=>rowHTML(h,val(h.id,sel),true,sks[h.id])).join('');
 const fl={all:'همه',todo:'ناتمام',done:'کامل‌شده'}[R.flt];
 let tb='';
 if(D.timer){const h=H(D.timer.id);if(h)tb='<div class="tb"><span><span class="inline-ui-icon">'+uiIcon('⏱')+'</span> '+esc(h.n)+' · <b class="num" id="tbt">'+clock(Date.now()-D.timer.start)+'</b></span><button data-more="'+h.id+'">باز کردن</button><button data-focus="'+h.id+'">تمرکز</button></div>'}
 const wj1=jp(ws),wj2=jp(addDays(ws,6));
 const fzLeft=fzRemain(sel);
 const mc=missed().reduce((a,x)=>a+x.hs.length,0);const cuRow=mc?'<button class="cu" data-cu0="1"><span class="inline-ui-icon">'+uiIcon('🕘')+'</span> جبران روزهای گذشته <b class="num">('+mc+')</b></button>':'';
 const fzRow=sel>T?'':(D.frozen[sel]?'<div class="fz on"><span><span class="inline-ui-icon">'+uiIcon('❄')+'</span> این روز فریز شده و رکوردت حفظ می‌شود</span><button data-fz="1">لغو</button></div>':(all.length&&doneN<all.length?'<div class="fz"><span><span class="inline-ui-icon">'+uiIcon('❄')+'</span> نمی‌رسی؟ این روز را فریز کن <b class="num">('+fzLeft+' بار باقی‌مانده این ماه)</b></span><button data-fz="1">فریز</button></div>':''));
 const nudge=(sel===T&&D.set.nudge&&all.length&&doneN<all.length&&hm(new Date())>=D.set.nudgeT&&!D.frozen[sel])?'<div class="tb nd"><span><span class="inline-ui-icon">'+uiIcon('🌙')+'</span> هنوز <b class="num">'+(all.length-doneN)+'</b> عادت امروز مانده</span></div>':'';
 return '<div class="hd"><button class="tdbtn num" data-today="1" aria-label="برو به امروز">'+jp(T)[2]+'</button><div class="ttl"><h1>'+title+'</h1><small>'+WD[wd(sel)]+' '+j[2]+' '+JM[j[1]-1]+' '+j[0]+' · ⭐ سطح '+(D.stats.lv||1)+'</small></div><button class="pill" data-flt="1">'+fl+' ▾</button></div>'
 +'<div class="wk"><button data-wk="-1" aria-label="هفته قبل">›</button><span class="num">'+wj1[2]+' '+JM[wj1[1]-1]+' تا '+wj2[2]+' '+JM[wj2[1]-1]+'</span><button data-wk="1" aria-label="هفته بعد">‹</button></div>'
 +'<div class="strip" id="strip">'+strip+'</div>'
 +'<div class="sum"><div class="l"><span>'+(all.length?'<b class="num">'+doneN+'</b> از <b class="num">'+all.length+'</b> عادت کامل شد':'—')+'</span><b class="num">'+Math.round(avg*100)+'%'+'</b></div><div class="bar"><i style="width:'+(avg*100).toFixed(1)+'%"></i></div></div>'
 +nudge+tb+'<div>'+body+'</div>'+cuRow+fzRow}

function clock(ms){const s=Math.floor(ms/1000);return pad(Math.floor(s/3600))+':'+pad(Math.floor(s%3600/60))+':'+pad(s%60)}

/* stats */
function monthDays(y,m){const a=[],L=jmLen(y,m);for(let d=1;d<=L;d++)a.push(fromJ(y,m,d));return a}
function rate(hid,days){const T=todayIso();let s=0,c=0;days.forEach(d=>{if(d>T)return;const st=dayStat(d,hid);if(st.n){s+=st.p;c++}});return c?s/c:0}
function streaks(hid){const T=todayIso();let start=T;D.habits.forEach(h=>{if(h.cr<start)start=h.cr});const lim=addDays(T,-1200);if(start<lim)start=lim;let d=start,best=0,cur=0,total=0;
 while(d<=T){const st=dayStat(d,hid);if(st.n){if(st.done){cur++;total++;if(cur>best)best=cur}else if(d!==T)cur=0}d=addDays(d,1)}return{best:best,cur:cur,total:total}}
function vStats(){
 const T=todayIso(),f=R.stF&&H(R.stF)?R.stF:null;R.stF=f;
 const days=monthDays(R.stY,R.stM);
 const first=wd(days[0]);
 let cells='';
 WS.forEach(w=>cells+='<span class="h">'+w+'</span>');
 for(let i=0;i<first;i++)cells+='<span></span>';
 days.forEach((d,i)=>{const st=dayStat(d,f);cells+='<button class="cd'+(d>T?' fut':'')+(d===R.sel?' sel':'')+'" data-go="'+d+'">'+rg(st,st.fz?uiIcon('❄'):i+1)+(d===T?'<i></i>':'')+'</button>'});
 const r=rate(f,days);const sk=streaks(f);
 const perfect=days.filter(d=>d<=T&&dayStat(d,f).n&&dayStat(d,f).done).length;
 let chips='<button class="chip txt'+(f?'':' on')+'" data-sf="">همه</button>'+D.habits.map(h=>'<button class="chip'+(f===h.id?' on':'')+'" data-sf="'+h.id+'" aria-label="'+esc(h.n)+'">'+hi(h.e)+'</button>').join('');
 let wb='';
 for(let i=6;i>=0;i--){const d=addDays(T,-i),st=dayStat(d,f);wb+='<div><i class="'+(st.n?(st.p>=1?'f':''):'z')+'" style="height:'+Math.max(4,st.p*100)+'%"></i><span class="num">'+jp(d)[2]+'</span></div>'}
 let brk='';
 if(!f&&D.habits.length)brk='<div class="card"><h3>عملکرد این ماه به تفکیک عادت</h3>'+D.habits.map(h=>{const p=rate(h.id,days);return '<div class="hb"><span class="e">'+hi(h.e)+'</span><div class="m"><div><span>'+esc(h.n)+'</span><b class="num">'+Math.round(p*100)+'%</b></div><div class="bar"><i style="width:'+(p*100)+'%;background:'+habitColor(h)+'"></i></div></div></div>'}).join('')+'</div>';
 const hh=f?H(f):null;
 const w7=[],p7=[];for(let i=0;i<7;i++){w7.push(addDays(T,-i));p7.push(addDays(T,-7-i))}
 const r7=rate(f,w7),rp=rate(f,p7),dl=Math.round((r7-rp)*100);
 let wn='';
 if(!f&&D.habits.length>1){const rs=D.habits.map(h=>({h:h,r:rate(h.id,w7)})).sort((a,b)=>b.r-a.r);const b=rs[0],w=rs[rs.length-1];wn='<div class="wnote"><span class="inline-ui-icon">'+uiIcon('💪')+'</span> قوی‌ترین: '+hi(b.h.e)+' '+esc(b.h.n)+' <b class="num">('+Math.round(b.r*100)+'%)</b><br><span class="inline-ui-icon">'+uiIcon('🌧')+'</span> نیازمند توجه: '+hi(w.h.e)+' '+esc(w.h.n)+' <b class="num">('+Math.round(w.r*100)+'%)</b></div>'}
 const weekly='<div class="card"><h3>هفته‌ی من</h3><div class="wsum"><b class="num">'+Math.round(r7*100)+'%</b><span class="'+(dl>=0?'up':'dn')+' num">'+(dl>=0?'▲ ':'▼ ')+Math.abs(dl)+'% نسبت به هفته‌ی قبل</span></div>'+wn+'</div>';
 return '<div class="hd"><div class="ttl"><h1>'+(hh?hi(hh.e)+' '+esc(hh.n):'آمار کلی')+'</h1><small>پیشرفتت را در طول زمان ببین</small></div></div>'
 +'<div class="chips">'+chips+'</div>'
 +'<div class="card"><div class="mnav"><button data-mn="-1" aria-label="ماه قبل">›</button><b class="num">'+JM[R.stM-1]+' '+R.stY+'</b><button data-mn="1" aria-label="ماه بعد">‹</button></div><div class="cal">'+cells+'</div><button class="btn g blk" data-rep="1" style="margin-top:14px">'+uiIcon('📋')+' کارنامه‌ی '+JM[R.stM-1]+'</button></div>'
 +'<div class="card"><div class="rate"><span class="rg'+(r>=1?' full':'')+'">'+ring(r,16)+'<b class="num">'+(Math.round(r*1000)/10)+'%<small>نرخ ماهانه</small></b></span>'
 +'<div class="stats"><div class="stat"><span class="ic">'+uiIcon('🏆')+'</span><b class="num">'+sk.best+'<small>روز</small></b><span>بهترین رکورد پیاپی</span></div>'
 +'<div class="stat"><span class="ic">'+uiIcon('🔥')+'</span><b class="num">'+sk.cur+'<small>روز</small></b><span>رکورد فعلی</span></div>'
 +'<div class="stat"><span class="ic">'+uiIcon('✅')+'</span><b class="num">'+perfect+'<small>روز</small></b><span>روز کامل در این ماه</span></div>'
 +'<div class="stat"><span class="ic">'+uiIcon('📅')+'</span><b class="num">'+sk.total+'<small>روز</small></b><span>مجموع روزهای کامل</span></div></div></div></div>'
 +heatCard(f)+'<div class="card"><h3>۷ روز اخیر</h3><div class="bars">'+wb+'</div></div>'+weekly+brk+bdgCard()}

/* habits page */
function sched(h){return h.days.length===7?'هر روز':h.days.map(i=>WS[i]).join('، ')}
function tgText(h){if(h.ty==='chk')return h.st.length+' مرحله';return h.ty==='cnt'?nf(h.tg)+' بار':h.ty==='min'?fmin(h.tg):nf(h.tg)+(h.u?' '+h.u:'')}
function sk2(h){return streaks(h.id).cur}
function vHabits(){
 const items=D.habits.map(h=>'<div class="hl" role="group" aria-label="عادت '+esc(h.n)+'"><button type="button" class="hl-edit" data-edit="'+h.id+'" aria-label="ویرایش عادت '+esc(h.n)+'"><span class="e" style="background:'+hexA(habitColor(h),.18)+'">'+hi(h.e)+'</span><span class="m"><b>'+esc(h.n)+'</b><span class="num">'+tgText(h)+' · '+sched(h)+(h.rm?' · '+uiIcon('⏰')+' '+h.rm:'')+(sk2(h)>=2?' · '+uiIcon('🔥')+' '+sk2(h):'')+'</span></span></button><div class="mv"><button type="button" data-mv="'+h.id+':-1" aria-label="بالا">▲</button><button type="button" data-mv="'+h.id+':1" aria-label="پایین">▼</button></div></div>').join('');
 return '<div class="hd"><div class="ttl"><h1>عادت‌های من</h1><small>برای ویرایش روی هر عادت بزن</small></div></div>'+(items||'<div class="empty"><span class="em">'+uiIcon('🌱')+'</span>هنوز عادتی نساخته‌ای.</div>')+'<button class="btn blk" data-add="1" style="margin-top:6px">+ عادت جدید</button>'+chalCard()}

/* notes */
const MOOD_LABELS=['خیلی بد','کمی بد','معمولی','خوب','عالی'];const moodIcon=i=>HabitIcons.mood(i);
function vNotes(){
 const sel=R.sel,n=D.notes[sel]||{t:'',m:0};
 const recent=Object.keys(D.notes).sort().reverse().slice(0,20).map(d=>{const x=D.notes[d];return '<button class="nt" data-nd="'+d+'"><span class="e">'+(x.m?moodIcon(x.m):uiIcon('📝'))+'</span><div><b class="num">'+WD[wd(d)]+' '+jl(d)+'</b><span>'+esc((x.t||'').replace(/\s+/g,' ').slice(0,70)||'بدون متن')+'</span></div></button>'}).join('');
 return '<div class="hd"><div class="ttl"><h1>یادداشت روز</h1><small>امروز چطور گذشت؟</small></div></div>'
 +'<div class="mnav"><button data-nn="-1" aria-label="روز قبل">›</button><b class="num">'+WD[wd(sel)]+' '+jl(sel)+'</b><button data-nn="1" aria-label="روز بعد">‹</button></div>'
 +'<div class="card"><div class="moods">'+MOOD_LABELS.map((label,i)=>'<button type="button" data-mood="'+(i+1)+'" class="'+(n.m===i+1?'on':'')+'" aria-label="حال: '+label+'" title="'+label+'" aria-pressed="'+(n.m===i+1)+'">'+moodIcon(i+1)+'</button>').join('')+'</div><textarea id="ntx" placeholder="هر چیزی که می‌خواهی ثبت کنی…">'+esc(n.t||'')+'</textarea></div>'
 +(recent?'<div class="card"><h3>یادداشت‌های اخیر</h3>'+recent+'</div>':'')}

/* settings */
function render(){
 const f={home:vHome,stats:vStats,habits:vHabits,notes:vNotes,set:vSet}[R.tab];
 const y=window.scrollY;$('#v').innerHTML=f();renderNav();if(R.tab==='stats')heatScroll();
 if(R.keepScroll){window.scrollTo(0,y)}
}

/* ---------- log sheet ---------- */
function niceStep(t){const x=t/10;const p=Math.pow(10,Math.floor(Math.log10(Math.max(x,1))));const m=x/p;return Math.max(1,(m<1.5?1:m<3.5?2:m<7.5?5:10)*p)}
function logSheet(id){
 const h=H(id);if(!h){closeSheet();return}
 R.sheet={t:'log',id:id};
 if(h.ty==='chk'){chkSheet(h);return}
 const d=R.sel,v=val(id,d);
 let q;
 if(h.ty==='cnt')q=[-1,1,2,5];else if(h.ty==='min')q=[-5,5,10,15,30,60];else{const s=niceStep(h.tg);q=[-s,s,2*s,5*s,10*s]}
 const unit=h.ty==='min'?'دقیقه':h.ty==='amt'?(h.u||'مقدار'):'تعداد';
 let timer='';
 if(h.ty==='min'){
  if(D.timer&&D.timer.id===id)timer='<div class="tm num" id="tmv">'+clock(Date.now()-D.timer.start)+'</div><button class="btn t blk" data-tstop="1">■ توقف و ثبت زمان</button>';
  else if(D.timer)timer='<p style="text-align:center;color:var(--mu);font-size:13px;margin:6px 0">تایمر یک عادت دیگر در حال اجراست.</p>';
  else timer='<button class="btn t blk" data-tstart="'+id+'">▶ شروع تایمر</button>'}
 if(h.ty==='min'&&(!D.timer||D.timer.id===id))timer+='<button class="btn g blk" data-focus="'+id+'" style="margin-top:8px">'+uiIcon('🎯')+' حالت تمرکز</button>';
 openSheet('<div class="sh"><span class="e">'+hi(h.e)+'</span><div><b>'+esc(h.n)+'</b><span class="num">'+WD[wd(d)]+' '+jl(d)+'</span></div></div>'
 +'<div class="big">'+rowHTML(h,v,false)+'</div>'+(h.ty==='amt'?'<p class="num" style="text-align:center;color:var(--mu);font-size:13px;margin-top:10px">'+valText(h,v,true)+'</p>':'')
 +'<div class="qs">'+q.map(x=>'<button class="'+(x>0?'p':'m')+' num" data-dl="'+x+'">'+(x>0?'+':'−')+nf(Math.abs(x))+'</button>').join('')+'</div>'
 +timer
 +'<div class="lbl">مقدار دلخواه ('+esc(unit)+')</div><div class="cus"><input id="cv" inputmode="decimal" placeholder="مثلاً 25" autocomplete="off"><button class="btn" data-cadd="1">افزودن</button><button class="btn g" data-cset="1">تنظیم روی</button></div>'
 +'<div class="two"><button class="btn g" data-edit="'+id+'">✎ ویرایش عادت</button><button class="btn r" data-zero="'+id+'">↺ صفر کردن</button></div>')}
function refreshLog(){if(R.sheet&&R.sheet.t==='log'){const y=$('#sheet').scrollTop;logSheet(R.sheet.id);$('#sheet').scrollTop=y}}

/* ---------- edit sheet ---------- */
let F=null;
function newForm(){return{id:null,n:'',e:EMOJI[0],c:COLORS[1],ty:'cnt',tv:'',tu:'m',u:'',rm:'',st:'',days:[0,1,2,3,4,5,6]}}
function formFrom(h){const f={id:h.id,n:h.n,e:h.e,c:h.c,ty:h.ty,u:h.u||'',days:h.days.slice(),rm:h.rm||'',st:(h.st||[]).join('\n'),tu:'m',tv:String(h.tg)};if(h.ty==='min'&&h.tg%60===0){f.tu='h';f.tv=String(h.tg/60)}return f}
function sync(){if(!F||!$('#fn'))return;F.n=$('#fn').value;if($('#ft'))F.tv=$('#ft').value;if($('#fu'))F.u=$('#fu').value;if($('#fe')&&$('#fe').value.trim())F.e=Array.from($('#fe').value.trim())[0]||F.e;if($('#ftu'))F.tu=$('#ftu').value;if($('#fr'))F.rm=$('#fr').value;if($('#fst'))F.st=$('#fst').value}
function formSheet(){
 R.sheet={t:'form'};
 const em=EMOJI.slice();if(!em.includes(F.e))em.unshift(F.e);
 let tg;
 if(F.ty==='cnt')tg='<input id="ft" inputmode="decimal" placeholder="چند بار در روز؟ مثلاً 8" value="'+esc(F.tv)+'">';
 else if(F.ty==='min')tg='<div class="rw"><input id="ft" inputmode="decimal" placeholder="مدت هدف" value="'+esc(F.tv)+'"><select id="ftu"><option value="m"'+(F.tu==='m'?' selected':'')+'>دقیقه</option><option value="h"'+(F.tu==='h'?' selected':'')+'>ساعت</option></select></div>';
 else if(F.ty==='chk')tg='<textarea id="fst" placeholder="هر مرحله را در یک خط بنویس؛ مثلاً:&#10;مسواک&#10;آب خوردن&#10;کش‌وقوس" style="min-height:120px">'+esc(F.st||'')+'</textarea>';
 else tg='<div class="rw"><input id="ft" inputmode="decimal" placeholder="مقدار هدف" value="'+esc(F.tv)+'"><input id="fu" placeholder="واحد (تومان، صفحه…)" value="'+esc(F.u)+'"></div>';
 openSheet('<div class="sh"><span class="e">'+hi(F.e)+'</span><div><b>'+(F.id?'ویرایش عادت':'عادت جدید')+'</b></div></div>'
 +'<input id="fn" placeholder="اسم عادت" maxlength="40" value="'+esc(F.n)+'">'
 +'<div class="lbl">آیکن</div><div class="grid">'+em.map(e=>'<button type="button" data-fe="'+e+'" class="'+(F.e===e?'on':'')+'" aria-label="آیکن عادت: '+iconName(e)+'" title="'+iconName(e)+'">'+hi(e)+'</button>').join('')+'</div>'
 +'<div class="lbl">رنگ</div><div class="grid c">'+COLORS.map(c=>'<button data-fc="'+c+'" class="'+(F.c===c?'on':'')+'" style="background:'+c+'" aria-label="رنگ"></button>').join('')+'</div>'
 +'<div class="lbl">نوع هدف</div><div class="seg"><button data-ft="cnt" class="'+(F.ty==='cnt'?'on':'')+'">تعدادی</button><button data-ft="min" class="'+(F.ty==='min'?'on':'')+'">زمانی</button><button data-ft="amt" class="'+(F.ty==='amt'?'on':'')+'">مقداری</button><button data-ft="chk" class="'+(F.ty==='chk'?'on':'')+'">مراحل</button></div>'
 +'<div class="lbl">هدف روزانه</div>'+tg
 +'<div class="lbl">⏰ یادآور (اختیاری)</div><div class="rw"><input id="fr" type="time" value="'+esc(F.rm||'')+'"><button class="btn g" data-frc="1" style="flex:.5">حذف</button></div>'
 +'<div class="lbl">روزهای هفته</div><div class="dys">'+WS.map((w,i)=>'<button data-fd="'+i+'" class="'+(F.days.includes(i)?'on':'')+'" aria-label="'+WD[i]+'">'+w+'</button>').join('')+'</div>'
 +'<div class="two" style="margin-top:22px"><button class="btn blk" data-fsave="1">'+(F.id?'ذخیره‌ی تغییرات':'ساخت عادت')+'</button>'+(F.id?'<button class="btn r blk" data-fdel="1" style="flex:.55">حذف</button>':'')+'</div>')}
function openForm(id){F=id?formFrom(H(id)):newForm();formSheet();if(!id)setTimeout(()=>{const n=$('#fn');if(n)n.focus()},300)}
function saveForm(){
 sync();const name=F.n.trim();if(!name){toast('اسم عادت را بنویس');return}
 let t;if(F.ty==='chk'){const stp=F.st.split('\n').map(x=>x.trim()).filter(Boolean);if(!stp.length){toast('حداقل یک مرحله بنویس');return}t=stp.length;F._st=stp}else{t=num(F.tv);if(!(t>0)){toast('هدف روزانه باید عددی بزرگ‌تر از صفر باشد');return}}
 if(F.ty==='min'&&F.tu==='h')t*=60;
 if(!F.days.length){toast('حداقل یک روز را انتخاب کن');return}
 const o={n:name,e:F.e,c:F.c,ty:F.ty,tg:t,u:F.ty==='amt'?F.u.trim():'',rm:F.rm||'',st:F.ty==='chk'?F._st:[],days:F.days.slice().sort()};
 if(F.id){Object.assign(H(F.id),o)}
 else{const T=todayIso();D.habits.push(Object.assign({id:uid(),cr:R.sel<T?R.sel:T},o))}
 save();closeSheet();render();toast(F.id?'تغییرات ذخیره شد':'عادت ساخته شد')}

/* ---------- timer ---------- */
function stopTimer(){
 const t=D.timer;if(!t)return;const h=H(t.id);const ms=Date.now()-t.start;D.timer=null;
 if(h&&ms>=30000){const m=Math.max(1,Math.round(ms/60000));const d=iso(new Date(t.start));D.stats.timerMin=(D.stats.timerMin||0)+m;const b4=val(t.id,d);setVal(t.id,d,b4+m);toast(m+' دقیقه ثبت شد');if(b4<h.tg&&val(t.id,d)>=h.tg)setTimeout(()=>cheer(h),1300)}
 else{save();toast('زمان خیلی کوتاه بود؛ ثبت نشد')}
 closeFocus();render();refreshLog();checkAllDone()}
setInterval(()=>{if(!D.timer)return;const a=$('#tbt'),b=$('#tmv'),s=clock(Date.now()-D.timer.start);if(a)a.textContent=s;if(b)b.textContent=s;if(R.focus)updFocus()},1000);

/* ---------- actions ---------- */
function bump(id,delta){const h=H(id);if(!h)return;const d=R.sel;const before=val(id,d);setVal(id,d,before+delta);vib();R.pop=id;render();R.pop=null;
 const el=document.querySelector('[data-row="'+id+'"]');if(el){el.classList.add('pop')}
 if(before<h.tg&&val(id,d)>=h.tg){cheer(h)}checkAllDone()}
function go(tab){R.tab=tab;closeSheet();window.scrollTo(0,0);render()}
function shiftWeek(n){R.sel=addDays(R.sel,7*n);render()}
function shiftMonth(n){let y=R.stY,m=R.stM+n;if(m>12){m=1;y++}if(m<1){m=12;y--}R.stY=y;R.stM=m;render()}
function backup(){const blob=new Blob([JSON.stringify(D)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='habits-backup-'+todayIso()+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('بکاپ ذخیره شد')}
function restore(file){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o||!Array.isArray(o.habits))throw 0;norm(o);D=o;save();render();toast('بازیابی شد: '+o.habits.length+' عادت')}catch(e){toast('فایل بکاپ معتبر نیست')}};r.readAsText(file)}

let lpT=null,lp=false;
document.addEventListener('pointerdown',e=>{const r=e.target.closest('[data-row]');if(!r||e.target.closest('[data-more]'))return;lp=false;clearTimeout(lpT);lpT=setTimeout(()=>{lp=true;vib();logSheet(r.dataset.row)},480)});
['pointerup','pointercancel','pointerleave','pointermove'].forEach(ev=>document.addEventListener(ev,e=>{if(ev==='pointermove'&&Math.abs(e.movementX)+Math.abs(e.movementY)<3)return;clearTimeout(lpT)}));

let dg=null;
function snapV(h,v,v0){const mx=Math.max(h.tg,v0);v=Math.max(0,Math.min(mx,v));if(h.ty==='cnt')return Math.round(v);if(h.ty==='min'){const st=h.tg>=60?5:1;return Math.min(mx,Math.round(v/st)*st)}const st=niceStep(h.tg);return Math.min(mx,Math.round(v/st)*st)}
function paintRow(el,h,v){const p=Math.min(1,v/h.tg);el.querySelector('.fill').style.width=(p*100).toFixed(1)+'%';el.querySelectorAll('.rv').forEach(x=>{x.innerHTML=(p>=1?'✓ ':'')+valText(h,v)});el.classList.toggle('done',p>=1)}
document.addEventListener('pointerdown',e=>{const r=e.target.closest('[data-row]');if(!r||e.target.closest('[data-more]'))return;const hh=H(r.dataset.row);if(!hh||hh.ty==='chk')return;dg={el:r,id:r.dataset.row,x:e.clientX,y:e.clientY,w:r.getBoundingClientRect().width,v0:val(r.dataset.row,R.sel),on:false,v:null,pid:e.pointerId}});
document.addEventListener('pointermove',e=>{if(!dg)return;const dx=e.clientX-dg.x,dy=e.clientY-dg.y;
 if(!dg.on){if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.3){dg.on=true;clearTimeout(lpT);lp=false;R.dragged=true;dg.el.classList.add('dg');try{dg.el.setPointerCapture(dg.pid)}catch(x){}}else return}
 const h=H(dg.id);if(!h)return;const nv=snapV(h,dg.v0+(-dx/dg.w)*h.tg,dg.v0);if(nv!==dg.v){dg.v=nv;paintRow(dg.el,h,nv);if(navigator.vibrate&&D.set.vib&&(h.ty==='cnt'||Math.abs(nv-dg.v0)%(h.tg/4)<1e-9))try{navigator.vibrate(5)}catch(x){}}});
['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,()=>{if(!dg)return;const d=dg;dg=null;if(!d.on)return;setTimeout(()=>{R.dragged=false},60);const h=H(d.id);if(!h)return;const nv=d.v==null?d.v0:d.v;setVal(h.id,R.sel,nv);vib();render();if(d.v0<h.tg&&nv>=h.tg)cheer(h);checkAllDone()}));
document.addEventListener('click',e=>{
 const t=e.target;let el;
 if(R.dragged){R.dragged=false;e.preventDefault();return}
 if(t.id==='bg'){closeSheet();return}
 if(t.closest('#fab')){openForm(null);return}
 if(el=t.closest('[data-nav]')){go(el.dataset.nav);return}
 if(el=t.closest('[data-more]')){logSheet(el.dataset.more);return}
 if(el=t.closest('[data-row]')){if(lp){lp=false;return}const h=H(el.dataset.row);if(!h)return;if(h.ty==='cnt')bump(h.id,1);else logSheet(h.id);return}
 if(el=t.closest('[data-d]')){R.sel=el.dataset.d;render();return}
 if(t.closest('[data-today]')){R.sel=todayIso();render();return}
 if(t.closest('[data-flt]')){R.flt={all:'todo',todo:'done',done:'all'}[R.flt];render();return}
 if(el=t.closest('[data-wk]')){shiftWeek(+el.dataset.wk);return}
 if(t.closest('[data-add]')){openForm(null);return}
 if(el=t.closest('[data-go]')){R.sel=el.dataset.go;R.tab='home';window.scrollTo(0,0);render();return}
 if(el=t.closest('[data-sf]')){R.stF=el.dataset.sf||null;render();return}
 if(el=t.closest('[data-mn]')){shiftMonth(+el.dataset.mn);return}
 if(el=t.closest('[data-mv]')){const p=el.dataset.mv.split(':'),i=D.habits.findIndex(h=>h.id===p[0]),j=i+ +p[1];if(i>-1&&j>=0&&j<D.habits.length){const x=D.habits[i];D.habits[i]=D.habits[j];D.habits[j]=x;save();render()}return}
 if(el=t.closest('[data-edit]')){openForm(el.dataset.edit);return}
 if(el=t.closest('[data-nn]')){R.sel=addDays(R.sel,+el.dataset.nn);render();return}
 if(el=t.closest('[data-nd]')){R.sel=el.dataset.nd;render();return}
 if(el=t.closest('[data-mood]')){const d=R.sel,n=D.notes[d]||{t:'',m:0},m=+el.dataset.mood;n.m=n.m===m?0:m;if(n.t||n.m)D.notes[d]=n;else delete D.notes[d];save();checkBadges();vib();const x=$('#ntx');const keep=x?x.value:'';render();if($('#ntx'))$('#ntx').value=keep;return}
 if(t.closest('[data-vib]')){D.set.vib=!D.set.vib;save();if(D.set.vib)vib();render();return}
 if(t.closest('[data-bk]')){backup();return}
 if(t.closest('[data-rs]')){$('#rsf').click();return}
 if(t.closest('[data-wipe]')){askSheet('پاک کردن همه‌ی داده‌ها','همه‌ی عادت‌ها، سوابق، چالش‌ها، نشان‌ها و یادداشت‌ها پاک می‌شود. این کار برگشت‌پذیر نیست؛ اگر لازم داری، اول بکاپ بگیر.','بله، همه را پاک کن',()=>{D=norm({v:1,habits:[],logs:{},notes:{},set:D.set,timer:null});save();closeSheet();R.sel=todayIso();R.tab='set';render();toast('همه‌چیز پاک شد')});return}
 if(t.closest('[data-askok]')){const f=askFn;askFn=null;if(f)f();return}
 if(t.closest('[data-askno]')){askFn=null;closeSheet();return}
 if(t.closest('[data-fz]')){toggleFreeze();return}
 if(el=t.closest('[data-th]')){D.set.theme=el.dataset.th;save();applyTheme();render();return}
 if(t.closest('[data-notif]')){toggleNotif();return}
 if(t.closest('[data-nudge]')){D.set.nudge=!D.set.nudge;save();render();return}
 if(el=t.closest('[data-focus]')){showFocus(el.dataset.focus);return}
 if(t.closest('[data-fclose]')){closeFocus();return}
 if(t.closest('[data-fstop]')){stopTimer();return}
 if(t.closest('#cheer')){hideCheer();return}
 if(t.closest('[data-celx]')||t.id==='cel'){$('#cel').classList.remove('on');return}
 if(t.closest('[data-frc]')){sync();F.rm='';formSheet();return}
 if(t.closest('[data-rep]')){reportSheet(R.stY,R.stM);return}
 if(t.closest('[data-rimg]')){drawReport(R.stY,R.stM);return}
 if(el=t.closest('[data-yn]')){R.hy+=+el.dataset.yn;render();return}
 if(el=t.closest('[data-md]')){D.set.mode=el.dataset.md;save();applyTheme();render();return}
 if(el=t.closest('[data-ic]')){D.set.ico=el.dataset.ic;save();applyTheme();render();return}
 if(t.closest('[data-snd]')){D.set.snd=!D.set.snd;save();if(D.set.snd)chime(false);render();return}
 if(t.closest('[data-csv]')){exportCsv();return}
 if(t.closest('[data-csvin]')){$('#csvf').click();return}
 if(t.closest('[data-cu0]')){catchSheet();return}
 if(el=t.closest('[data-cu]')){const p=el.dataset.cu.split('|'),h=H(p[0]);if(h){fillDone(h,p[1]);vib();render();catchSheet()}return}
 if(el=t.closest('[data-stp]')){const h=H(R.sheet.id),i=+el.dataset.stp;let ck=subOf(h.id,R.sel).slice();const b4=ck.length>=h.tg;ck=ck.includes(i)?ck.filter(x=>x!==i):ck.concat(i);if(!D.sub[R.sel])D.sub[R.sel]={};D.sub[R.sel][h.id]=ck;setVal(h.id,R.sel,ck.length);vib();render();refreshLog();if(!b4&&ck.length>=h.tg)cheer(h);checkAllDone();return}
 if(t.closest('[data-chnew]')){openChal(null);return}
 if(el=t.closest('[data-chal]')){openChal(el.dataset.chal);return}
 if(el=t.closest('[data-ct]')){syncC();C.t=+el.dataset.ct;chalSheet();return}
 if(t.closest('[data-chsave]')){saveChal();return}
 if(t.closest('[data-chdel]')){const cid=C.id;askSheet('حذف چالش','این چالش حذف می‌شود. عادت و سوابقش سر جایشان می‌مانند.','حذف',()=>{D.chal=D.chal.filter(x=>x.id!==cid);save();closeSheet();render();toast('چالش حذف شد')});return}
 /* log sheet */
 if(el=t.closest('[data-dl]')){const h=H(R.sheet.id),b4=val(h.id,R.sel);setVal(h.id,R.sel,b4+ +el.dataset.dl);vib();render();refreshLog();if(b4<h.tg&&val(h.id,R.sel)>=h.tg)cheer(h);checkAllDone();return}
 if(t.closest('[data-cadd]')||t.closest('[data-cset]')){const h=H(R.sheet.id);let v=num($('#cv').value);if(!isFinite(v)||v<0){toast('یک عدد معتبر وارد کن');return}const set=!!t.closest('[data-cset]'),b4=val(h.id,R.sel);setVal(h.id,R.sel,set?v:b4+v);vib();render();refreshLog();if(b4<h.tg&&val(h.id,R.sel)>=h.tg)cheer(h);checkAllDone();return}
 if(el=t.closest('[data-zero]')){setVal(el.dataset.zero,R.sel,0);if(D.sub[R.sel])delete D.sub[R.sel][el.dataset.zero];render();refreshLog();return}
 if(el=t.closest('[data-tstart]')){D.timer={id:el.dataset.tstart,start:Date.now()};save();vib();render();refreshLog();toast('تایمر شروع شد');return}
 if(t.closest('[data-tstop]')){stopTimer();return}
 /* form */
 if(el=t.closest('[data-fe]')){sync();F.e=el.dataset.fe;formSheet();return}
 if(el=t.closest('[data-fc]')){sync();F.c=el.dataset.fc;formSheet();return}
 if(el=t.closest('[data-ft]')){sync();F.ty=el.dataset.ft;formSheet();return}
 if(el=t.closest('[data-fd]')){sync();const i=+el.dataset.fd;F.days=F.days.includes(i)?F.days.filter(x=>x!==i):F.days.concat(i);formSheet();return}
 if(t.closest('[data-fsave]')){saveForm();return}
 if(t.closest('[data-fdel]')){const id=F.id,hn=(H(id)||{}).n||'';askSheet('حذف عادت','عادت «'+esc(hn)+'» و همه‌ی سوابقش حذف می‌شود.','حذف',()=>{D.habits=D.habits.filter(h=>h.id!==id);Object.keys(D.logs).forEach(d=>{delete D.logs[d][id];if(!Object.keys(D.logs[d]).length)delete D.logs[d]});if(D.timer&&D.timer.id===id)D.timer=null;save();closeSheet();render();toast('عادت حذف شد')});return}
});
document.addEventListener('input',e=>{
 if(e.target.id==='ntx'){clearTimeout(R.nt);const v=e.target.value,d=R.sel;R.nt=setTimeout(()=>{const n=D.notes[d]||{t:'',m:0};n.t=v;if(n.t.trim()||n.m)D.notes[d]=n;else delete D.notes[d];save();checkBadges()},350)}
});
document.addEventListener('change',e=>{
 if(e.target.id==='csvf'&&e.target.files[0]){importCsv(e.target.files[0]);e.target.value=''}
 if(e.target.id==='nt'&&e.target.value){D.set.nudgeT=e.target.value;save();toast('ساعت یادآور شبانه ذخیره شد')}
 if(e.target.id==='rsf'&&e.target.files[0]){restore(e.target.files[0]);e.target.value=''}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet();if(e.key==='Enter'&&e.target.id==='cv'){e.preventDefault();const b=document.querySelector('[data-cadd]');if(b)b.click()}});
/* week swipe */
let sx=null;
document.addEventListener('touchstart',e=>{sx=e.target.closest('#strip')?e.touches[0].clientX:null},{passive:true});
document.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>60)shiftWeek(dx>0?1:-1)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!R.sheet)render()});

/* ---------- themes ---------- */
const THEMES={gold:{n:'کهربایی',y:'#D97706',yr:'217,119,6',t:'#059669',tr:'5,150,105'},tiffany:{n:'جنگلی',y:'#0F766E',yr:'15,118,110',t:'#D97706',tr:'217,119,6'},sky:{n:'لاجوردی',y:'#1D4ED8',yr:'29,78,216',t:'#0F766E',tr:'15,118,110'},bee:{n:'زنبور',y:'#F2C94C',yr:'242,201,76',t:'#0F766E',tr:'15,118,110',tDark:'#81D8D0',tDarkRgb:'129,216,208',tiffany:'#81D8D0',tiffanyRgb:'129,216,208'}};
function applyTheme(){const key=THEMES[D.set.theme]?D.set.theme:'gold',th=THEMES[key];let m=D.set.mode||'light';if(m==='auto')m=(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark';const accent=key==='bee'&&m==='dark'?th.tDark:th.t,accentRgb=key==='bee'&&m==='dark'?th.tDarkRgb:th.tr;document.documentElement.dataset.palette=key;document.documentElement.dataset.mode=m;document.documentElement.dataset.ico=D.set.ico==='line'?'line':'normal';const r=document.documentElement.style;r.setProperty('--y',th.y);r.setProperty('--yr',th.yr);r.setProperty('--t',accent);r.setProperty('--tr',accentRgb);r.setProperty('--bee-tiffany',th.tiffany||'#81D8D0');r.setProperty('--bee-tiffany-rgb',th.tiffanyRgb||'129,216,208');r.setProperty('--color-primary',th.y);r.setProperty('--color-on-primary',contrastInk(th.y));r.setProperty('--color-accent',accent);r.setProperty('--color-on-accent',contrastInk(accent));r.setProperty('--color-ring',th.y);const tc=document.getElementById('tcm');if(tc)tc.content=m==='light'?(key==='bee'?'#F1F3F3':'#FFFBEB'):(key==='bee'?'#121719':'#101712')}
/* ---------- freeze ---------- */
function fzRemain(d){const j=jp(d);let c=0;Object.keys(D.frozen).forEach(k=>{const x=jp(k);if(x[0]===j[0]&&x[1]===j[1])c++});return Math.max(0,2-c)}
function toggleFreeze(){const d=R.sel;if(D.frozen[d]){delete D.frozen[d];save();render();toast('فریز لغو شد');return}
 if(d>todayIso())return;if(!fzRemain(d)){toast('در این ماه هر دو فریزت را مصرف کرده‌ای');return}
 D.frozen[d]=1;save();vib();render();checkBadges();toast('روز فریز شد؛ رکوردت حفظ شد')}
/* ---------- badges ---------- */
const BADGES=[
{id:'first',e:'🌱',n:'اولین قدم',d:'تکمیل اولین عادت',f:c=>c.comp>=1},
{id:'day1',e:'✨',n:'روز بی‌نقص',d:'یک روز کامل',f:c=>c.days>=1},
{id:'s3',e:'🔥',n:'سه‌روزه',d:'۳ روز کامل پیاپی',f:c=>c.best>=3},
{id:'s7',e:'🏅',n:'هفته‌ی طلایی',d:'۷ روز کامل پیاپی',f:c=>c.best>=7},
{id:'s14',e:'💎',n:'دو هفته پایدار',d:'۱۴ روز پیاپی',f:c=>c.best>=14},
{id:'s30',e:'👑',n:'ماه آهنین',d:'۳۰ روز پیاپی',f:c=>c.best>=30},
{id:'c50',e:'🎯',n:'پنجاه‌تایی',d:'۵۰ تکمیل عادت',f:c=>c.comp>=50},
{id:'c200',e:'🚀',n:'دویست‌تایی',d:'۲۰۰ تکمیل عادت',f:c=>c.comp>=200},
{id:'d10',e:'🏆',n:'ده روز کامل',d:'۱۰ روز بی‌نقص',f:c=>c.days>=10},
{id:'h5',e:'⚡',n:'پرانرژی',d:'۵ عادت فعال',f:c=>c.hab>=5},
{id:'n7',e:'📝',n:'یادداشت‌نویس',d:'۷ یادداشت',f:c=>c.notes>=7},
{id:'tm',e:'🎧',n:'متمرکز',d:'۶۰ دقیقه تایمر',f:c=>c.tm>=60},
{id:'fz',e:'❄️',n:'هوشمند',d:'استفاده از فریز',f:c=>c.fz>=1},
{id:'chal',e:'🥇',n:'قهرمان چالش',d:'پایان یک چالش',f:c=>c.chal>=1}];
function bctx(){const sk=streaks(null);let comp=0;Object.keys(D.logs).forEach(d=>Object.keys(D.logs[d]).forEach(id=>{const h=H(id);if(h&&D.logs[d][id]>=h.tg)comp++}));return{best:sk.best,days:sk.total,comp:comp,hab:D.habits.length,notes:Object.keys(D.notes).length,tm:D.stats.timerMin||0,fz:Object.keys(D.frozen).length,chal:D.chal.filter(x=>x.done).length}}
function checkBadges(silent){if(R.noChk)return;D.chal.forEach(ch=>{if(!ch.done&&chalCount(ch)>=ch.t){ch.done=todayIso();if(!silent)setTimeout(()=>celebrate('چالش «'+ch.n+'» تمام شد!'),900)}});const c=bctx();let n=0;BADGES.forEach(b=>{if(!D.badges[b.id]&&b.f(c)){D.badges[b.id]=todayIso();n++;if(!silent)setTimeout(()=>toast('نشان جدید: '+b.n),1700)}});const xp=c.comp*10+c.days*30+Math.floor(c.tm/10)+Object.keys(D.badges).length*50+D.chal.filter(x=>x.done).length*100,lv=Math.floor(Math.sqrt(xp/50))+1;D.stats.xp=xp;if(lv>(D.stats.lv||1)&&!silent)setTimeout(()=>{toast('سطح '+lv+' شد!');chime(true)},2600);D.stats.lv=lv;save()}
function bdgCard(){const n=BADGES.filter(b=>D.badges[b.id]).length;return '<div class="card"><h3>نشان‌ها <span class="num" style="color:var(--mu);font-weight:600;font-size:13px">('+n+' از '+BADGES.length+')</span></h3><div class="bdg">'+BADGES.map(b=>'<div class="'+(D.badges[b.id]?'on':'')+'"><span>'+hi(b.e)+'</span><b>'+b.n+'</b><small>'+b.d+'</small></div>').join('')+'</div></div>'}
/* ---------- celebration ---------- */
const QUOTES=['هر روز یک قدم کوچک؛ در آخر یک مسیر بزرگ.','امروز را بردی. فردا هم همین‌طور ادامه بده.','ثبات از استعداد قوی‌تر است.','کارِ امروزت، جایزه‌ی فردای توست.','عادت‌های خوب آرام‌آرام زندگی را عوض می‌کنند.','یک روز کامل دیگر و رکوردت بالاتر می‌رود.','به خودت افتخار کن؛ همه‌ی کارهای امروز انجام شد.','امروز همه‌ی کارها را انجام دادی؛ این یعنی تعهد واقعی.','یک روز کامل دیگر به نام تو ثبت شد.','وقتی همه‌ی عادت‌ها تیک می‌خورند، آرامش خاصی می‌آید؛ از آن لذت ببر.','امشب با خیال راحت بخواب؛ امروز را درست زندگی کردی.','این همان ثباتی است که زندگی را تغییر می‌دهد.','همه‌ی عادت‌هایت انجام شد؛ تو واقعاً قهرمانی.','هیچ بهانه‌ای امروز برنده نشد.','امروز را کامل بستی؛ فردا از همین‌جا شروع می‌کنی.','روزی که با همه‌ی کارها تمام می‌شود، ارزش یادآوری دارد.','این کارنامه‌ی امروز توست: کامل.','امروز نشان دادی که حرف و عملت یکی است.','زنجیره‌ات محکم‌تر شد؛ نگذار پاره شود.','وقتش است کمی به خودت پاداش بدهی.','همه‌ی کارها تمام شد؛ حالا استراحت حق توست.','تو از کسانی هستی که قولشان را نگه می‌دارند.','امروز یک روز عالی بود و تو ساختیش.','هر روز کامل، یک آجر محکم برای ساختمان آینده است.','نظمِ امروز، آزادیِ فرداست؛ آفرین!','به این حس خوب عادت کن؛ شایسته‌اش هستی.','کسی که تا آخر می‌رود، همین است.','همه‌ی مراحل را رفتی؛ خط پایان امروز مال توست.','سخت بود؟ شاید. ولی تمامش کردی.','روز کامل امروز پیامی است برای فردا: «من آماده‌ام».','چنین روزهایی تو را می‌سازند.','صد در صد! این اتفاق ساده‌ای نیست.','هر ستاره‌ی امروز را خودت به دست آوردی.','آدم‌های بزرگ روزهای کامل می‌سازند؛ مثل همین امروز.','چه روز درخشانی! یک نفس عمیق بکش و لذت ببر.','امروز بیش از آنچه فکر می‌کنی پیشرفت کردی.','تو الگوی خودِ فردایت هستی.','انضباط یعنی این: انجام دادن، حتی وقتی نمی‌خواهی.','هر روز کامل، پیوندی محکم‌تر با نسخه‌ی بهتر خودت.','هیچ تیکی جا نماند؛ به‌به!','با این روند، سال دیگر جای دیگری هستی.','امروز بی‌نقص بودی؛ و همین کافی است.','افتخار کن؛ از عهده‌ی همه‌ی کارها برآمدی.','روزت را برنده تمام کردی.','عادت‌هایت را می‌سازی و آن‌ها تو را می‌سازند.','یک روز دیگر، یک پله بالاتر.','همین روزهای کامل، یک زندگی کامل می‌سازند.','امروز به قولت وفادار ماندی؛ فردا هم می‌شود.','آرام و محکم، تمام شد.','هر وقت خسته شدی، یادت بیاید که امروز همه را انجام دادی.','نتیجه‌ی ثبات، روزهای کاملی مثل امروز است.','این انرژی را به فردا ببر.','هرچه کاشتی، دارد ریشه می‌دواند.','روز خوبی بود؛ خودت را تحسین کن!','امروز یک نفر به هدفش وفادار ماند؛ و آن تو بودی.','قشنگ بود! امشب حق داری سرحال باشی.','چرخه‌ی خوب ادامه دارد؛ فردا هم می‌توانی.','مثل ساعت دقیق عمل می‌کنی.','این روز کامل را به یاد بسپار و تکرارش کن.','امروز را بردی، و این برد مال خودت است.'];
function checkAllDone(){const T=todayIso();if(R.sel!==T||D.cel[T])return;const a=D.habits.filter(h=>active(h,T));if(!a.length||!a.every(h=>prog(h,T)>=1))return;D.cel[T]=1;save();setTimeout(celebrate,450)}
function celebrate(title){hideCheer();$('#celh').textContent=title||'همه‌ی عادت‌های امروز کامل شد!';chime(true);$('#celq').textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)];$('#cel').classList.add('on');const cols=D.set.theme==='bee'?['#242a2d','#899395','#F2C94C','#81D8D0','#edf2f2']:['#ffd23f','#1fd1c1','#7ee8d2','#5bc0ff','#edeff3','#ffb547'];let h='';for(let i=0;i<70;i++)h+='<i style="left:'+(Math.random()*100)+'%;background:'+cols[i%cols.length]+';--dx:'+Math.round(Math.random()*160-80)+'px;--r:'+Math.round(Math.random()*720-360)+'deg;animation-delay:'+(Math.random()*.5).toFixed(2)+'s;animation-duration:'+(1.8+Math.random()*1.4).toFixed(2)+'s"></i>';$('#conf').innerHTML=h;setTimeout(()=>{$('#conf').innerHTML=''},4200);vib();checkBadges()}
/* ---------- reminders ---------- */
function hm(d){return pad(d.getHours())+':'+pad(d.getMinutes())}
function notify(t,b){toast(t+' — '+b);if(D.set.notif&&window.Notification&&Notification.permission==='granted'){try{new Notification(t,{body:b,tag:t+b})}catch(e){}}}
function toggleNotif(){if(D.set.notif){D.set.notif=false;save();render();return}
 if(!window.Notification){toast('این مرورگر از اعلان پشتیبانی نمی‌کند');return}
 try{Notification.requestPermission().then(p=>{if(p==='granted'){D.set.notif=true;save();render();toast('اعلان‌ها فعال شد')}else toast('اجازه‌ی اعلان داده نشد')}).catch(()=>toast('اعلان در این حالت در دسترس نیست'))}catch(e){toast('اعلان در این حالت در دسترس نیست')}}
const fired={};
function tick(){const now=new Date(),T=iso(now),t=hm(now);
 D.habits.forEach(h=>{if(h.rm&&h.rm===t&&active(h,T)&&prog(h,T)<1&&!D.frozen[T]){const k=h.id+T+t;if(!fired[k]){fired[k]=1;notify(h.n,'وقتش رسیده!')}}});
 if(D.set.nudge&&t>=D.set.nudgeT&&!fired['n'+T]){fired['n'+T]=1;if(!D.frozen[T]){const a=D.habits.filter(h=>active(h,T)&&prog(h,T)<1);if(a.length)notify('یادآور شبانه','هنوز '+a.length+' عادت امروز مانده')}}}
setInterval(tick,20000);
/* ---------- focus mode ---------- */
let wl=null;
function showFocus(id){const h=H(id);if(!h)return;if(D.timer&&D.timer.id!==id){toast('تایمر یک عادت دیگر در حال اجراست');return}
 if(!D.timer){D.timer={id:id,start:Date.now()};save()}
 R.focus=id;closeSheet();render();
 $('#foc').innerHTML='<span class="fe">'+hi(h.e)+'</span><b class="fn">'+esc(h.n)+'</b><span class="rg fr" id="fring"><span id="fsv"></span><b class="num" id="fcl"></b></span><p class="num fh" id="fh"></p><div class="two" style="width:100%;max-width:340px"><button class="btn t blk" data-fstop="1">■ پایان و ثبت</button><button class="btn g blk" data-fclose="1">کوچک کردن</button></div>';
 $('#foc').classList.add('on');updFocus();
 try{if(navigator.wakeLock)navigator.wakeLock.request('screen').then(l=>{wl=l}).catch(()=>{})}catch(e){}}
function updFocus(){const h=H(R.focus);if(!h||!D.timer||!$('#fcl'))return;const ms=Date.now()-D.timer.start,T=iso(new Date(D.timer.start)),done=val(h.id,T)+ms/60000,p=Math.min(1,done/h.tg);
 $('#fcl').textContent=clock(ms);$('#fsv').innerHTML=ring(p,16);$('#fring').classList.toggle('full',p>=1);
 $('#fh').textContent=p>=1?'به هدف رسیدی! می‌توانی ادامه بدهی یا پایان بزنی':'تا رسیدن به هدف: '+fmin(Math.max(0,h.tg-done))}
function closeFocus(){R.focus=null;$('#foc').classList.remove('on');$('#foc').innerHTML='';try{if(wl){wl.release();wl=null}}catch(e){}}

/* ---------- sound ---------- */
let ac=null;
function chime(big){if(!D.set.snd)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const t0=ac.currentTime;(big?[523,659,784,1047]:[660,880]).forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain(),t=t0+i*.11;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(.15,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.4)})}catch(e){}}
const MOTIV=['آفرین! یک قدم دیگر به هدفت نزدیک\u200cتر شدی.','عالی بود! همین ثبات است که تو را می\u200cسازد.','کارت درست بود؛ همین\u200cطور ادامه بده.','تمام شد! حق داری به خودت افتخار کنی.','هر روز یک قدم کوچک، آخرش یک تغییر بزرگ.','تو می\u200cتوانی، و داری ثابتش می\u200cکنی.','دمت گرم! امروز هم سنگ\u200cتمام گذاشتی.','یک پیروزی دیگر در کارنامه\u200cات ثبت شد.','استمرار از استعداد قوی\u200cتر است؛ ادامه بده.','همین حالا یک عادت خوب را محکم\u200cتر کردی.','«{n}» امروز مال توست!','بدون بهانه و بدون وقفه؛ این یعنی قهرمان.','کار را انجام دادی؛ حالا حس خوبش را بچش.','پیشرفت یعنی همین کارهای ساده که هر روز تکرار می\u200cشوند.','خودِ فردایت از تو ممنون است.','امروز هم به قولی که به خودت دادی عمل کردی.','این همان کاری است که آدم\u200cهای موفق هر روز می\u200cکنند.','کوچک شروع کردی، بزرگ ادامه می\u200cدهی.','انگیزه می\u200cآید و می\u200cرود، اما تو با عادت جلو می\u200cروی.','یک تیک دیگر؛ مسیرت روشن\u200cتر شد.','بابت «{n}» دستت درد نکند!','هیچ چیز ارزشمندتر از ادامه دادن نیست.','امروز بهتر از دیروز شدی.','همین قدم\u200cهای کوچک زندگی را عوض می\u200cکنند.','تمرکزت تحسین\u200cبرانگیز بود.','این انرژی را نگه دار!','وقتی ادامه می\u200cدهی، دیگر کسی جلودارت نیست.','یک بار دیگر ثابت کردی که می\u200cتوانی.','داری نسخه\u200cی بهتری از خودت را می\u200cسازی.','آرام و پیوسته؛ برنده همین است.','«{n}» انجام شد؛ بقیه\u200cاش هم شدنی است.','عالی! یک نفس عمیق و سراغ بعدی.','هر بار که تمامش می\u200cکنی، اعتمادبه\u200cنفست بیشتر می\u200cشود.','پشتکارت الهام\u200cبخش است.','امروز هم از کسانی بودی که تسلیم نشدند.','هرچه جلوتر می\u200cروی، راحت\u200cتر می\u200cشود.','این یعنی نظم، و نظم یعنی آزادی.','خسته نباشی! کار کوچکی نبود.','یک امتیاز دیگر برای تو، صفر برای بهانه\u200cها.','تو همین حالا از دیروزِ خودت جلوتری.','عادت\u200cها را تو می\u200cسازی، بعدش آن\u200cها تو را می\u200cسازند.','قشنگ بود! همین مسیر را ادامه بده.','امروز یک خشت دیگر روی ساختمان آینده\u200cات گذاشتی.','هر تیک، یک رأی به نسخه‌ی بهتر خودت است.','کارِ کوچک، اثرِ بزرگ؛ همین را ادامه بده.','امروز هم دست‌خالی برنگشتی.','همین الان ثابت کردی که حرفت را جدی می‌گیری.','آفرین بر اراده‌ات!','قدم‌های کوچک، پاهای محکم می‌سازند.','عالی پیش می‌روی؛ سرعتت را حفظ کن.','«{n}» هم رفت توی کارنامه‌ات!','این یکی هم از بهانه‌ها جلو زد.','تو برای مسیر ارزش قائلی، نه فقط نتیجه.','امروز هم یک گام جلوتر از دیروز.','خوب است که برای خودت وقت می‌گذاری.','ادامه بده؛ نتیجه‌اش را بعداً خواهی دید.','چه کار قشنگی! همین‌طور پیش برو.','وفاداری به خودت، بهترین سرمایه‌گذاری است.','هیچ‌کس جای تو این کار را نمی‌کند، و تو کردی.','دستت درد نکند؛ خودت را تشویق کن.','پیوسته بودن، سخت‌ترین و باارزش‌ترین کار است.','نظم امروز، آرامش فردا.','با «{n}» یک قدم محکم‌تر شدی.','هر بار که انجامش می‌دهی، مسیر هموارتر می‌شود.','تو سازنده‌ی زندگی‌ای هستی که می‌خواهی.','چه روز خوبی برای ثابت‌قدم ماندن!','این پیروزی کوچک، پایه‌ی پیروزی‌های بزرگ است.','بدون هیاهو، فقط با پیوستگی؛ و همین کافی است.','حالا می‌توانی با خیال راحت لبخند بزنی.','اراده‌ات را دوباره به رخ کشیدی.','کار امروز را همین امروز تمام کردی؛ بی‌نظیر!','استقامتت یک روز دیگر برنده شد.','رمز موفقیت همین است: ادامه دادن.','یک گام کوچک دیگر، یک روز بهتر.','لذتِ انجام‌دادن را حس کن؛ حقت است.','«{n}» حالا بخشی از روتین توست.','هر عادت خوب یک هدیه به آینده‌ی توست.','تلاش امروزت، حال خوب فردایت است.','خسته نباشی، قهرمان!','با این روند، هیچ هدفی دور نیست.','مثل یک حرفه‌ای عمل کردی.','از پس‌اش برآمدی!','تمام‌کردن یک مهارت است و تو در آن ماهری.','نگفتی «بعداً»، نگفتی «فردا»؛ گفتی «همین حالا».','هر روز که ادامه می‌دهی، عادتت قوی‌تر می‌شود.','خودت را دست‌کم نگیر؛ دیدی که شد؟','این حس خوب را به یاد بسپار؛ فردا هم می‌خواهیش.','همین سادگی، همین قدرت.','پیشرفت همیشه پرسروصدا نیست؛ مثل همین کار آرام است.','هنوز راه مانده، اما تو راه را بلدی.','به خودت بگو: آفرین!','امروز را با یک تیک دیگر زیباتر کردی.','کسی که شروع کند و ادامه دهد، بالاخره می‌رسد.','قدرتِ تکرار همین‌جاست.','چه ثباتی! ادامه بده.','هر روز کمی بهتر؛ شعارِ تو.','با «{n}» روزت رنگ و بوی دیگری گرفت.','بدون انگیزه هم انجامش دادی؛ این یعنی انضباط.','باز هم خودت را شگفت‌زده کردی.','دمت گرم؛ بقیه‌ی روز هم با همین انرژی.'];
let motBag=[],motLast=-1,cheerT=null;
function nextMot(){if(!motBag.length){motBag=MOTIV.map((_,i)=>i);for(let i=motBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[motBag[i],motBag[j]]=[motBag[j],motBag[i]]}if(motBag[motBag.length-1]===motLast){motBag.unshift(motBag.pop())}}motLast=motBag.pop();return MOTIV[motLast]}
function hideCheer(){clearTimeout(cheerT);const c=$('#cheer');if(c)c.classList.remove('on')}
function cheer(h){
 const T=todayIso(),sk=R.sel===T?streaks(h.id).cur:0,msg=nextMot().replace(/\{n\}/g,h.n);
 const dir=[[-48,-32],[0,-54],[48,-32],[58,6],[46,42],[0,56],[-46,42],[-58,6]];
 const sp=dir.map((q,i)=>'<i style="--dx:'+q[0]+'px;--dy:'+q[1]+'px;animation-delay:'+(.18+i*.03).toFixed(2)+'s'+(i%2?';background:var(--y)':'')+'"></i>').join('');
 const c=$('#cheer');c.style.setProperty('--c',habitColor(h));c.style.setProperty('--d','4.8s');
 c.innerHTML='<div class="chc"><span class="chb">'+sp+hi(h.e)+'<em>✓</em></span><div class="cht"><div class="cht1"><b>«'+esc(h.n)+'» کامل شد</b>'+(sk>=2?'<span class="chs num">'+uiIcon('🔥')+' '+sk+' روز پیاپی</span>':'')+'</div><p class="cht2">'+esc(msg)+'</p></div><span class="chw"><i class="chm"></i></span></div>';
 c.classList.add('on');clearTimeout(cheerT);cheerT=setTimeout(hideCheer,4800);chime(false);vib()}
/* ---------- steps (multi-step habits) ---------- */
function subOf(id,d){const h=H(id);return((D.sub[d]&&D.sub[d][id])||[]).filter(i=>h&&i<h.st.length)}
function chkSheet(h){const d=R.sel,ck=subOf(h.id,d);
 openSheet('<div class="sh"><span class="e">'+hi(h.e)+'</span><div><b>'+esc(h.n)+'</b><span class="num">'+WD[wd(d)]+' '+jl(d)+'</span></div></div><div class="big">'+rowHTML(h,ck.length,false)+'</div><div class="stl">'+h.st.map((s,i)=>'<button class="stp'+(ck.includes(i)?' on':'')+'" data-stp="'+i+'"><span class="bx">'+(ck.includes(i)?'✓':'')+'</span>'+esc(s)+'</button>').join('')+'</div><div class="two"><button class="btn g" data-edit="'+h.id+'">✎ ویرایش عادت</button><button class="btn r" data-zero="'+h.id+'">↺ صفر کردن</button></div>')}
function fillDone(h,d){if(h.ty==='chk'){if(!D.sub[d])D.sub[d]={};D.sub[d][h.id]=h.st.map((_,i)=>i)}setVal(h.id,d,h.tg)}
/* ---------- catch-up ---------- */
function missed(){const T=todayIso(),out=[];for(let i=1;i<=7;i++){const d=addDays(T,-i);if(D.frozen[d])continue;const hs=D.habits.filter(h=>active(h,d)&&prog(h,d)<1);if(hs.length)out.push({d:d,hs:hs})}return out}
function catchSheet(){const m=missed();R.sheet={t:'catch'};
 openSheet('<div class="sh"><span class="e">'+uiIcon('🕘')+'</span><div><b>جبران روزهای گذشته</b><span>هر کدام را که انجام داده بودی، بزن</span></div></div>'+(m.length?m.map(x=>'<div class="lbl num">'+WD[wd(x.d)]+' '+jl(x.d)+'</div><div class="cuw">'+x.hs.map(h=>'<button data-cu="'+h.id+'|'+x.d+'" style="--c:'+h.c+'">'+hi(h.e)+' '+esc(h.n)+'</button>').join('')+'</div>').join(''):'<div class="empty"><span class="em">'+uiIcon('✅')+'</span>همه‌ی ۷ روز گذشته کامل است.</div>'))}
/* ---------- challenges ---------- */
let C=null;
function chalCount(c){let d=c.st,n=0;const T=todayIso();while(d<=T){const s=dayStat(d,c.hid);if(s.n&&s.done)n++;d=addDays(d,1)}return n}
function chalCard(){const items=D.chal.map(c=>{const h=H(c.hid);const n=c.done?c.t:Math.min(c.t,chalCount(c));return '<button class="ch" data-chal="'+c.id+'"><span class="e">'+(h?hi(h.e):uiIcon('🎯'))+'</span><div class="m"><div><b>'+esc(c.n)+'</b><span class="num">'+(c.done?'✓ تکمیل شد':n+' از '+c.t+' روز')+'</span></div><div class="bar"><i style="width:'+(n/c.t*100).toFixed(1)+'%"></i></div></div></button>'}).join('');
 return '<div class="card" style="margin-top:20px"><h3 class="hrow">چالش‌ها<button class="mini" data-chnew="1">+ چالش جدید</button></h3>'+(items||'<p style="color:var(--mu);font-size:13px;line-height:2">یک هدف چندروزه بساز، مثلاً «۲۱ روز مطالعه».</p>')+'</div>'}
function syncC(){if(!C)return;if($('#cn'))C.n=$('#cn').value;if($('#chh'))C.hid=$('#chh').value;if($('#ct')&&$('#ct').value.trim()){const v=Math.round(num($('#ct').value));if(v>0)C.t=v}}
function chalSheet(){R.sheet={t:'chal'};const T=[7,14,21,30,60,100];
 openSheet('<div class="sh"><span class="e">'+uiIcon('🎯')+'</span><div><b>'+(C.id?'ویرایش چالش':'چالش جدید')+'</b></div></div>'
 +'<input id="cn" placeholder="اسم چالش (مثلاً ۲۱ روز مطالعه)" maxlength="40" value="'+esc(C.n)+'">'
 +'<div class="lbl">کدام عادت؟</div><select id="chh">'+D.habits.map(h=>'<option value="'+h.id+'"'+(C.hid===h.id?' selected':'')+'>'+esc(h.n)+'</option>').join('')+'</select>'
 +'<div class="lbl">چند روز؟</div><div class="seg" style="flex-wrap:wrap">'+T.map(n=>'<button data-ct="'+n+'" class="num'+(C.t===n?' on':'')+'">'+n+'</button>').join('')+'</div><input id="ct" inputmode="numeric" placeholder="یا عدد دلخواه" value="'+(C.t&&!T.includes(C.t)?C.t:'')+'" style="margin-top:10px">'
 +'<p style="color:var(--mu);font-size:12.5px;line-height:1.9;margin-top:10px">هر روزی که آن عادت کامل شود، یک روز به چالش اضافه می‌شود؛ لازم نیست پشت‌سرهم باشد.</p>'
 +'<div class="two" style="margin-top:14px"><button class="btn blk" data-chsave="1">'+(C.id?'ذخیره':'شروع چالش')+'</button>'+(C.id?'<button class="btn r blk" data-chdel="1" style="flex:.55">حذف</button>':'')+'</div>')}
function openChal(id){if(!D.habits.length){toast('اول یک عادت بساز');return}const c=id&&D.chal.find(x=>x.id===id);C=c?{id:c.id,n:c.n,hid:c.hid,t:c.t}:{id:null,n:'',hid:D.habits[0].id,t:21};chalSheet()}
function saveChal(){syncC();const h=H(C.hid);if(!h){toast('یک عادت انتخاب کن');return}if(!(C.t>0)){toast('تعداد روز را مشخص کن');return}
 const n=C.n.trim()||(C.t+' روز '+h.n);
 if(C.id){const c=D.chal.find(x=>x.id===C.id);if(c){c.n=n;c.hid=C.hid;c.t=C.t;if(c.done&&chalCount(c)<c.t)c.done=null}}
 else D.chal.push({id:uid(),n:n,hid:C.hid,t:C.t,st:todayIso(),done:null});
 save();closeSheet();render();checkBadges();toast(C.id?'چالش ذخیره شد':'چالش شروع شد')}
/* ---------- heatmap ---------- */
function heatCard(f){const y=R.hy,T=todayIso();let days=[];for(let m=1;m<=12;m++)days=days.concat(monthDays(y,m));
 const first=wd(days[0]);const cols=[];let col=[];for(let i=0;i<first;i++)col.push(null);
 days.forEach(d=>{col.push(d);if(col.length===7){cols.push(col);col=[]}});if(col.length){while(col.length<7)col.push(null);cols.push(col)}
 let full=0;
 const html=cols.map(c=>{let lab='';c.forEach(d=>{if(d&&jp(d)[2]===1)lab=JM[jp(d)[1]-1]});
  return '<div class="hcol"><span class="hl2">'+lab+'</span>'+c.map(d=>{if(!d)return '<i class="hc hx"></i>';const st=dayStat(d,f);let k;
   if(d>T)k='fu';else if(st.fz)k='hz';else if(!st.n)k='hn';else if(st.p>=1){k='l4';full++}else if(st.p>=.67)k='l3';else if(st.p>=.34)k='l2';else if(st.p>0)k='l1';else k='l0';
   return '<button class="hc '+k+(d===T?' td':'')+'" data-go="'+d+'" aria-label="'+jl(d)+'"></button>'}).join('')+'</div>'}).join('');
 return '<div class="card"><div class="mnav"><button data-yn="-1" aria-label="سال قبل">›</button><b class="num">نقشه‌ی سال '+y+'</b><button data-yn="1" aria-label="سال بعد">‹</button></div><div class="hm" id="hm">'+html+'</div><div class="hlg"><span>کمتر</span><i class="hc l0"></i><i class="hc l1"></i><i class="hc l2"></i><i class="hc l3"></i><i class="hc l4"></i><span>بیشتر</span></div><p class="hnote num">'+full+' روز کامل در سال '+y+'</p></div>'}
function heatScroll(){const el=document.querySelector('.hc.td');if(el){const y=window.scrollY;try{el.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}window.scrollTo(0,y)}}
/* ---------- monthly report ---------- */
function grade(r){return r>=.9?['عالی',uiIcon('🏆')]:r>=.75?['خیلی خوب',uiIcon('✨')]:r>=.5?['خوب',uiIcon('👍')]:r>=.25?['در مسیر',uiIcon('🌱')]:['شروع دوباره',uiIcon('💪')]}
function reportData(y,m){const days=monthDays(y,m),T=todayIso(),pm=m===1?[y-1,12]:[y,m-1];
 const r=rate(null,days),rp=rate(null,monthDays(pm[0],pm[1]));let perfect=0,comp=0;
 days.forEach(d=>{if(d>T)return;const s=dayStat(d,null);if(s.n&&s.done)perfect++;if(!s.fz)D.habits.forEach(h=>{if(active(h,d)&&prog(h,d)>=1)comp++})});
 const hs=D.habits.map(h=>({h:h,r:rate(h.id,days)})).filter(x=>days.some(d=>d<=T&&active(x.h,d)&&!D.frozen[d])).sort((a,b)=>b.r-a.r);
 const wk=[];let cur=[];days.forEach(d=>{if(wd(d)===0&&cur.length){wk.push(cur);cur=[]}cur.push(d)});if(cur.length)wk.push(cur);
 const wr=wk.map((w,i)=>({i:i+1,r:rate(null,w),has:w.some(d=>d<=T&&dayStat(d,null).n)})).filter(x=>x.has).sort((a,b)=>b.r-a.r);
 return{r:r,rp:rp,perfect:perfect,comp:comp,hs:hs,bw:wr[0]}}
function reportSheet(y,m){R.sheet={t:'rep'};const d=reportData(y,m),g=grade(d.r),dl=Math.round((d.r-d.rp)*100);
 openSheet('<div class="sh"><span class="e">'+g[1]+'</span><div><b>کارنامه‌ی '+JM[m-1]+' '+y+'</b><span>'+g[0]+'</span></div></div>'
 +'<div class="rate" style="margin-bottom:14px"><span class="rg'+(d.r>=1?' full':'')+(d.r<=0?' z':'')+'">'+ring(d.r,16)+'<b class="num">'+Math.round(d.r*100)+'%<small>میانگین ماه</small></b></span><span class="num" style="color:'+(dl>=0?'var(--t)':'#ff8a80')+'">'+(dl>=0?'▲ ':'▼ ')+Math.abs(dl)+'% نسبت به ماه قبل</span></div>'
 +'<div class="stats"><div class="stat"><span class="ic">'+uiIcon('✅')+'</span><b class="num">'+d.perfect+'<small>روز</small></b><span>روز کامل</span></div><div class="stat"><span class="ic">'+uiIcon('🎯')+'</span><b class="num">'+d.comp+'</b><span>تکمیل عادت</span></div>'
 +'<div class="stat"><span class="ic">'+uiIcon('💪')+'</span><b style="font-size:16px">'+(d.hs[0]?hi(d.hs[0].h.e)+' '+esc(d.hs[0].h.n):'—')+'</b><span>بهترین عادت</span></div><div class="stat"><span class="ic">'+uiIcon('📅')+'</span><b class="num" style="font-size:18px">'+(d.bw?'هفته‌ی '+d.bw.i:'—')+'</b><span>بهترین هفته</span></div></div>'
 +'<div class="lbl">به تفکیک عادت</div>'+d.hs.map(x=>'<div class="hb"><span class="e">'+hi(x.h.e)+'</span><div class="m"><div><span>'+esc(x.h.n)+'</span><b class="num">'+Math.round(x.r*100)+'%</b></div><div class="bar"><i style="width:'+(x.r*100).toFixed(1)+'%;background:'+habitColor(x.h)+'"></i></div></div></div>').join('')
 +'<button class="btn blk" data-rimg="1" style="margin-top:14px">'+uiIcon('🖼')+' ذخیره به‌صورت تصویر</button>')}
function dlFile(name,data,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},600)}
function drawReport(y,m){const d=reportData(y,m),g=grade(d.r),th=THEMES[D.set.theme]||THEMES.gold;const W=1080,HH=1500,c=document.createElement('canvas');c.width=W;c.height=HH;const x=c.getContext('2d');
 const rr=(a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()};
 const bg=x.createLinearGradient(0,0,0,HH);bg.addColorStop(0,'#10212a');bg.addColorStop(1,'#050607');x.fillStyle=bg;x.fillRect(0,0,W,HH);
 const F='system-ui,Tahoma,"Segoe UI",sans-serif';x.direction='rtl';
 x.textAlign='right';x.fillStyle=th.y;x.font='800 66px '+F;x.fillText('کارنامه‌ی '+JM[m-1]+' '+y,W-80,150);
 x.fillStyle='#a9b4c8';x.font='600 38px '+F;x.fillText(g[0]+' '+g[1],W-80,215);
 const cx=W/2,cy=520,r=190;x.lineWidth=36;x.lineCap='round';x.strokeStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.stroke();
 if(d.r>0){x.strokeStyle=d.r>=1?th.y:th.t;x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,d.r));x.stroke()}
 x.textAlign='center';x.fillStyle='#fff';x.font='800 120px '+F;x.fillText(Math.round(d.r*100)+'%',cx,cy+30);x.fillStyle='#a9b4c8';x.font='600 34px '+F;x.fillText('میانگین ماه',cx,cy+85);
 const dl=Math.round((d.r-d.rp)*100);x.fillStyle=dl>=0?th.t:'#ff8a80';x.font='700 36px '+F;x.fillText((dl>=0?'▲ ':'▼ ')+Math.abs(dl)+'% نسبت به ماه قبل',cx,790);
 const items=[['روز کامل',String(d.perfect)],['تکمیل عادت',String(d.comp)],['بهترین هفته',d.bw?'هفته‌ی '+d.bw.i:'—']],bw=290,gap=25;
 items.forEach((it,i)=>{const right=W-80-i*(bw+gap),left=right-bw;x.fillStyle='rgba(255,255,255,.07)';rr(left,850,bw,150,28);x.fill();x.fillStyle='#fff';x.font='800 52px '+F;x.textAlign='center';x.fillText(it[1],left+bw/2,925);x.fillStyle='#a9b4c8';x.font='600 28px '+F;x.fillText(it[0],left+bw/2,972)});
 d.hs.slice(0,6).forEach((it,i)=>{const y0=1070+i*62;x.textAlign='right';x.fillStyle='#fff';x.font='700 32px '+F;x.fillText(it.h.n,W-80,y0);x.textAlign='left';x.fillStyle='#a9b4c8';x.fillText(Math.round(it.r*100)+'%',80,y0);
  x.fillStyle='rgba(255,255,255,.1)';rr(80,y0+12,W-160,12,6);x.fill();if(it.r>0){x.fillStyle=habitColor(it.h);const w=Math.max(12,(W-160)*Math.min(1,it.r));rr(W-80-w,y0+12,w,12,6);x.fill()}});
 x.textAlign='center';x.fillStyle='#667085';x.font='600 26px '+F;x.fillText('ساخته‌شده با برنامه‌ی عادت‌ها',W/2,HH-50);
 c.toBlob(b=>{if(b){dlFile('report-'+y+'-'+pad(m)+'.png',b,'image/png');toast('تصویر کارنامه ذخیره شد')}else toast('ساخت تصویر ممکن نشد')})}
/* ---------- csv ---------- */
function csvQ(s){return '"'+String(s).replace(/"/g,'""')+'"'}
function exportCsv(){const r=['تاریخ شمسی,تاریخ میلادی,عادت,مقدار,هدف,درصد'];Object.keys(D.logs).sort().forEach(d=>{const j=jp(d);Object.keys(D.logs[d]).forEach(id=>{const h=H(id);if(!h)return;const v=D.logs[d][id];r.push([j[0]+'/'+pad(j[1])+'/'+pad(j[2]),d,csvQ(h.n),v,h.tg,Math.round(Math.min(1,v/h.tg)*100)].join(','))})});dlFile('habits-'+todayIso()+'.csv','\uFEFF'+r.join('\n'),'text/csv;charset=utf-8');toast('فایل CSV ذخیره شد')}
function parseCsvLine(l){const o=[];let c='',q=false;for(let i=0;i<l.length;i++){const ch=l[i];if(q){if(ch==='"'){if(l[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}else if(ch==='"')q=true;else if(ch===','){o.push(c);c=''}else c+=ch}o.push(c);return o}
function importCsv(file){const rd=new FileReader();rd.onload=()=>{const lines=String(rd.result).replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean);let ok=0,skip=0;R.noChk=true;
 lines.slice(1).forEach(l=>{const c=parseCsvLine(l),d=(c[1]||'').trim(),h=D.habits.find(x=>x.n===(c[2]||'').trim()),v=num(c[3]);if(/^\d{4}-\d{2}-\d{2}$/.test(d)&&h&&v>=0){setVal(h.id,d,v);ok++}else skip++});
 R.noChk=false;checkBadges(true);render();toast('وارد شد: '+ok+' ردیف'+(skip?' ('+skip+' ردیف نامعتبر یا بدون عادتِ هم‌نام)':''))};rd.readAsText(file)}
/* ---------- settings view ---------- */
function sw(attr,on,label){return '<button class="sw'+(on?' on':'')+'" '+attr+'="1" role="switch" aria-checked="'+!!on+'" aria-label="'+label+'"></button>'}
function uiIcon(key){const p={
'⚠':'<path d="M10.3 4.2 2.8 17.5A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.5L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 3h.01"',
'🌗':'<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/><path d="M16 3v4M14 5h4"/>',
'🧩':'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
'🎨':'<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.3-3.5 1.7 1.7 0 0 1 1.1-3h1.9A4.5 4.5 0 0 0 22 10c0-4-4.5-7-10-7Z"/><path d="M7.5 10h.01M10 7.5h.01M15 7.5h.01M17.5 10h.01"/>',
'🔔':'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
'🌙':'<path d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z"/>',
'⏰':'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M5 3 3 5M19 3l2 2M9 2h6"/>',
'📳':'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M4 8v8M20 8v8M10 17h4"/>',
'🔊':'<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a5 5 0 0 1 0 6M19 5a10 10 0 0 1 0 14"/>',
'💾':'<path d="M5 3h12l4 4v14H3V3h2Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
'📥':'<path d="M12 3v11m0 0 4-4m-4 4-4-4"/><path d="M4 16v4h16v-4"/>',
'📤':'<path d="M12 15V4m0 0 4 4m-4-4-4 4"/><path d="M4 16v4h16v-4"/>',
'📊':'<path d="M4 20V10m5 10V4m5 16v-7m5 7V7"/><path d="M2 20h20"/>',
'🗑':'<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
'🏆':'<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/>',
'🔥':'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-3-10-2 2-3 4-3 6-2-1-3-3-3-5-4 3-5 6-5 9a7 7 0 0 0 7 7Z"/><path d="M12 22a3 3 0 0 0 3-3c0-2-2-3-2-5-2 2-4 3-4 5a3 3 0 0 0 3 3Z"/>',
'✅':'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
'📅':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
'💪':'<path d="M6 8v8m12-8v8M3 10v4m18-4v4M6 12h12"/>',
'🕘':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
'🎯':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
'🖼':'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
'🌧':'<path d="M7 16a4 4 0 0 1 .7-8 5.5 5.5 0 0 1 10.7 1.4A3.5 3.5 0 0 1 18 16"/><path d="m9 19-1 2m6-2-1 2m6-2-1 2"/>'
,
'❄':'<path d="M12 2v20M4 7l16 10M20 7 4 17"/><path d="m9 4 3-2 3 2m-6 16 3 2 3-2M4 10 4 7l3-1m10 12 3-1v-3M20 10V7l-3-1M7 18l-3-1v-3"',
'⏱':'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6m-3 0v3"',
'🌱':'<path d="M12 21v-8"/><path d="M12 15c-5 0-8-2.8-8-7.5 4.8 0 8 2.7 8 7.5Z"/><path d="M12 11c0-4.7 3-7.5 8-7.5 0 4.7-3 7.5-8 7.5Z"/>',
'🎉':'<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16ZM5 2l.6 2.4L8 5l-2.4.6L5 8l-.6-2.4L2 5l2.4-.6L5 2Z"/>',
'🔍':'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
'📋':'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8 9h8M8 13h8M8 17h5"/>',
'📝':'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8m-8 4h8"/>',
'✨':'<path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
'👍':'<path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Zm0 0 5-8a3 3 0 0 1 2 3v4h4a3 3 0 0 1 3 3l-2 7a3 3 0 0 1-3 2H7"/>'
};return '<svg class="ui-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(p[key]||'<circle cx="12" cy="12" r="8"/>')+'</svg>'}
function srow(ico,cls,title,sub,ctl){return '<div class="rw2"><span class="ico '+cls+'">'+uiIcon(ico)+'</span><div class="tx"><b>'+title+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div>'+(ctl||'')+'</div>'}
function sbtn(ico,cls,title,sub,attr){return '<button class="rw2" '+attr+'="1"><span class="ico '+cls+'">'+uiIcon(ico)+'</span><div class="tx"><b>'+title+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div><span class="ar">‹</span></button>'}
function vSet(){
 const xp=D.stats.xp||0,lv=D.stats.lv||1,lo=50*(lv-1)*(lv-1),hi=50*lv*lv,p=Math.max(0,Math.min(1,(xp-lo)/(hi-lo))),nb=Object.keys(D.badges).length,mode=D.set.mode||'dark';
 const icoSeg='<div class="mseg">'+[['normal','عادی'],['line','خطی']].map(a=>'<button data-ic="'+a[0]+'" class="'+((D.set.ico||'normal')===a[0]?'on':'')+'">'+a[1]+'</button>').join('')+'</div>';
 const modeSeg='<div class="mseg">'+[['dark','تاریک'],['light','روشن'],['auto','خودکار']].map(a=>'<button data-md="'+a[0]+'" class="'+(mode===a[0]?'on':'')+'">'+a[1]+'</button>').join('')+'</div>';
 const themes='<div class="ths">'+Object.keys(THEMES).map(k=>'<button data-th="'+k+'" class="'+(D.set.theme===k?'on':'')+'" style="--a:'+THEMES[k].y+';--b:'+(THEMES[k].tiffany||THEMES[k].t)+'" aria-label="تم '+THEMES[k].n+'"><i></i><span>'+THEMES[k].n+'</span></button>').join('')+'</div>';
 return '<div class="hd"><div class="ttl"><h1>تنظیمات</h1></div></div>'
 +'<div class="prof"><span class="av num">'+lv+'</span><div class="pi"><b>سطح '+lv+'</b><span class="num">'+xp+' امتیاز · '+nb+' نشان · '+Math.max(0,hi-xp)+' امتیاز تا سطح بعد</span><div class="bar"><i style="width:'+(p*100).toFixed(1)+'%"></i></div></div></div>'
 +'<div class="gt">ظاهر</div><div class="grp">'+srow('🌗','b','حالت نمایش','',modeSeg)+srow('🧩','t','سبک آیکن عادت‌ها','',icoSeg)+'<div class="rw2 wr"><span class="ico">'+uiIcon('🎨')+'</span><div class="tx"><b>رنگ اصلی</b></div>'+themes+'</div></div>'
 +'<div class="gt">یادآوری‌ها</div><div class="grp">'+srow('🔔','t','اعلان مرورگر','فقط وقتی برنامه باز یا در پس‌زمینه‌ی مرورگر است',sw('data-notif',D.set.notif,'اعلان'))+srow('🌙','b','یادآور شبانه','اگر عادتی ناتمام ماند',sw('data-nudge',D.set.nudge,'یادآور شبانه'))+(D.set.nudge?srow('⏰','g','ساعت یادآور','','<input type="time" id="nt" value="'+D.set.nudgeT+'" style="width:104px;padding:8px">'):'')+'</div>'
 +'<div class="gt">بازخورد</div><div class="grp">'+srow('📳','g','لرزش','',sw('data-vib',D.set.vib,'لرزش'))+srow('🔊','g','صدا','موقع کامل شدن عادت',sw('data-snd',D.set.snd,'صدا'))+'</div>'
 +'<div class="gt">داده‌ها</div><div class="grp">'+sbtn('💾','t','ذخیره‌ی بکاپ','فایل کامل برای نگهداری','data-bk')+sbtn('📥','t','بازیابی از بکاپ','','data-rs')+sbtn('📊','b','خروجی CSV','برای اکسل و گوگل‌شیت','data-csv')+sbtn('📤','b','واردکردن CSV','با همان قالب خروجی','data-csvin')+'</div>'
 +'<div class="gt">پاک‌سازی</div><div class="grp"><button class="rw2 dng" data-wipe="1"><span class="ico r">'+uiIcon('🗑')+'</span><div class="tx"><b>پاک کردن همه‌ی داده‌ها</b><small>این کار برگشت‌پذیر نیست</small></div></button></div>'
 +'<input type="file" id="rsf" accept=".json,application/json" hidden><input type="file" id="csvf" accept=".csv,text/csv" hidden>'
 +'<div class="ver">عادت‌ها · نسخه‌ی <span dir="ltr">1.2.0</span></div>'}
if(window.matchMedia)try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if((D.set.mode||'dark')==='auto')applyTheme()})}catch(e){}

applyTheme();checkBadges(true);render();setTimeout(tick,1500);

window.__app={D:()=>D,R:R,render:render};
})();
