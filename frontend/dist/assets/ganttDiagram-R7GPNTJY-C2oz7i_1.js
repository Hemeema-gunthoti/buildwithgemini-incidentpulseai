import{bo as be,bp as He,bq as Te,br as we,bs as _e,bt as Ot,bu as Be,bi as Ft,g as qe,s as Ge,t as Xe,q as je,a as Ue,b as Ze,_ as l,c as ht,k as Tt,bv as Ke,bw as Qe,bx as Je,d as tn,R as en,by as U,l as it,bz as ae,bA as oe,bB as nn,bC as rn,bD as sn,bE as an,bF as on,bG as cn,bH as ln,bI as ce,bJ as le,bK as ue,bL as de,bM as fe,m as un,W as dn,A as fn,u as hn}from"./index-BYoXkdlc.js";const mn=Math.PI/180,kn=180/Math.PI,$t=18,De=.96422,Se=1,Me=.82521,Ce=4/29,mt=6/29,Ee=3*mt*mt,yn=mt*mt*mt;function Ie(t){if(t instanceof nt)return new nt(t.l,t.a,t.b,t.opacity);if(t instanceof st)return $e(t);t instanceof be||(t=He(t));var e=Nt(t.r),n=Nt(t.g),r=Nt(t.b),s=Wt((.2225045*e+.7168786*n+.0606169*r)/Se),m,f;return e===n&&n===r?m=f=s:(m=Wt((.4360747*e+.3850649*n+.1430804*r)/De),f=Wt((.0139322*e+.0971045*n+.7141733*r)/Me)),new nt(116*s-16,500*(m-s),200*(s-f),t.opacity)}function gn(t,e,n,r){return arguments.length===1?Ie(t):new nt(t,e,n,r??1)}function nt(t,e,n,r){this.l=+t,this.a=+e,this.b=+n,this.opacity=+r}Te(nt,gn,we(_e,{brighter(t){return new nt(this.l+$t*(t??1),this.a,this.b,this.opacity)},darker(t){return new nt(this.l-$t*(t??1),this.a,this.b,this.opacity)},rgb(){var t=(this.l+16)/116,e=isNaN(this.a)?t:t+this.a/500,n=isNaN(this.b)?t:t-this.b/200;return e=De*Pt(e),t=Se*Pt(t),n=Me*Pt(n),new be(zt(3.1338561*e-1.6168667*t-.4906146*n),zt(-.9787684*e+1.9161415*t+.033454*n),zt(.0719453*e-.2289914*t+1.4052427*n),this.opacity)}}));function Wt(t){return t>yn?Math.pow(t,1/3):t/Ee+Ce}function Pt(t){return t>mt?t*t*t:Ee*(t-Ce)}function zt(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function Nt(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function pn(t){if(t instanceof st)return new st(t.h,t.c,t.l,t.opacity);if(t instanceof nt||(t=Ie(t)),t.a===0&&t.b===0)return new st(NaN,0<t.l&&t.l<100?0:NaN,t.l,t.opacity);var e=Math.atan2(t.b,t.a)*kn;return new st(e<0?e+360:e,Math.sqrt(t.a*t.a+t.b*t.b),t.l,t.opacity)}function Ht(t,e,n,r){return arguments.length===1?pn(t):new st(t,e,n,r??1)}function st(t,e,n,r){this.h=+t,this.c=+e,this.l=+n,this.opacity=+r}function $e(t){if(isNaN(t.h))return new nt(t.l,0,0,t.opacity);var e=t.h*mn;return new nt(t.l,Math.cos(e)*t.c,Math.sin(e)*t.c,t.opacity)}Te(st,Ht,we(_e,{brighter(t){return new st(this.h,this.c,this.l+$t*(t??1),this.opacity)},darker(t){return new st(this.h,this.c,this.l-$t*(t??1),this.opacity)},rgb(){return $e(this).rgb()}}));function vn(t){return function(e,n){var r=t((e=Ht(e)).h,(n=Ht(n)).h),s=Ot(e.c,n.c),m=Ot(e.l,n.l),f=Ot(e.opacity,n.opacity);return function(T){return e.h=r(T),e.c=s(T),e.l=m(T),e.opacity=f(T),e+""}}}const xn=vn(Be);function bn(t){return t}var _t=1,Vt=2,Bt=3,wt=4,he=1e-6;function Tn(t){return"translate("+t+",0)"}function wn(t){return"translate(0,"+t+")"}function _n(t){return e=>+t(e)}function Dn(t,e){return e=Math.max(0,t.bandwidth()-e*2)/2,t.round()&&(e=Math.round(e)),n=>+t(n)+e}function Sn(){return!this.__axis}function Ae(t,e){var n=[],r=null,s=null,m=6,f=6,T=3,S=typeof window<"u"&&window.devicePixelRatio>1?0:.5,L=t===_t||t===wt?-1:1,_=t===wt||t===Vt?"x":"y",W=t===_t||t===Bt?Tn:wn;function w(D){var R=r??(e.ticks?e.ticks.apply(e,n):e.domain()),z=s??(e.tickFormat?e.tickFormat.apply(e,n):bn),g=Math.max(m,0)+T,C=e.range(),P=+C[0]+S,O=+C[C.length-1]+S,B=(e.bandwidth?Dn:_n)(e.copy(),S),H=D.selection?D.selection():D,I=H.selectAll(".domain").data([null]),x=H.selectAll(".tick").data(R,e).order(),k=x.exit(),E=x.enter().append("g").attr("class","tick"),h=x.select("line"),b=x.select("text");I=I.merge(I.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),x=x.merge(E),h=h.merge(E.append("line").attr("stroke","currentColor").attr(_+"2",L*m)),b=b.merge(E.append("text").attr("fill","currentColor").attr(_,L*g).attr("dy",t===_t?"0em":t===Bt?"0.71em":"0.32em")),D!==H&&(I=I.transition(D),x=x.transition(D),h=h.transition(D),b=b.transition(D),k=k.transition(D).attr("opacity",he).attr("transform",function(v){return isFinite(v=B(v))?W(v+S):this.getAttribute("transform")}),E.attr("opacity",he).attr("transform",function(v){var p=this.parentNode.__axis;return W((p&&isFinite(p=p(v))?p:B(v))+S)})),k.remove(),I.attr("d",t===wt||t===Vt?f?"M"+L*f+","+P+"H"+S+"V"+O+"H"+L*f:"M"+S+","+P+"V"+O:f?"M"+P+","+L*f+"V"+S+"H"+O+"V"+L*f:"M"+P+","+S+"H"+O),x.attr("opacity",1).attr("transform",function(v){return W(B(v)+S)}),h.attr(_+"2",L*m),b.attr(_,L*g).text(z),H.filter(Sn).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===Vt?"start":t===wt?"end":"middle"),H.each(function(){this.__axis=B})}return w.scale=function(D){return arguments.length?(e=D,w):e},w.ticks=function(){return n=Array.from(arguments),w},w.tickArguments=function(D){return arguments.length?(n=D==null?[]:Array.from(D),w):n.slice()},w.tickValues=function(D){return arguments.length?(r=D==null?null:Array.from(D),w):r&&r.slice()},w.tickFormat=function(D){return arguments.length?(s=D,w):s},w.tickSize=function(D){return arguments.length?(m=f=+D,w):m},w.tickSizeInner=function(D){return arguments.length?(m=+D,w):m},w.tickSizeOuter=function(D){return arguments.length?(f=+D,w):f},w.tickPadding=function(D){return arguments.length?(T=+D,w):T},w.offset=function(D){return arguments.length?(S=+D,w):S},w}function Mn(t){return Ae(_t,t)}function Cn(t){return Ae(Bt,t)}var Dt={exports:{}},En=Dt.exports,me;function In(){return me||(me=1,(function(t,e){(function(n,r){t.exports=r()})(En,(function(){var n="day";return function(r,s,m){var f=function(L){return L.add(4-L.isoWeekday(),n)},T=s.prototype;T.isoWeekYear=function(){return f(this).year()},T.isoWeek=function(L){if(!this.$utils().u(L))return this.add(7*(L-this.isoWeek()),n);var _,W,w,D,R=f(this),z=(_=this.isoWeekYear(),W=this.$u,w=(W?m.utc:m)().year(_).startOf("year"),D=4-w.isoWeekday(),w.isoWeekday()>4&&(D+=7),w.add(D,n));return R.diff(z,"week")+1},T.isoWeekday=function(L){return this.$utils().u(L)?this.day()||7:this.day(this.day()%7?L:L-7)};var S=T.startOf;T.startOf=function(L,_){var W=this.$utils(),w=!!W.u(_)||_;return W.p(L)==="isoweek"?w?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):S.bind(this)(L,_)}}}))})(Dt)),Dt.exports}var $n=In();const An=Ft($n);var St={exports:{}},Yn=St.exports,ke;function Fn(){return ke||(ke=1,(function(t,e){(function(n,r){t.exports=r()})(Yn,(function(){var n={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},r=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,s=/\d/,m=/\d\d/,f=/\d\d?/,T=/\d*[^-_:/,()\s\d]+/,S={},L=function(g){return(g=+g)+(g>68?1900:2e3)},_=function(g){return function(C){this[g]=+C}},W=[/[+-]\d\d:?(\d\d)?|Z/,function(g){(this.zone||(this.zone={})).offset=(function(C){if(!C||C==="Z")return 0;var P=C.match(/([+-]|\d\d)/g),O=60*P[1]+(+P[2]||0);return O===0?0:P[0]==="+"?-O:O})(g)}],w=function(g){var C=S[g];return C&&(C.indexOf?C:C.s.concat(C.f))},D=function(g,C){var P,O=S.meridiem;if(O){for(var B=1;B<=24;B+=1)if(g.indexOf(O(B,0,C))>-1){P=B>12;break}}else P=g===(C?"pm":"PM");return P},R={A:[T,function(g){this.afternoon=D(g,!1)}],a:[T,function(g){this.afternoon=D(g,!0)}],Q:[s,function(g){this.month=3*(g-1)+1}],S:[s,function(g){this.milliseconds=100*+g}],SS:[m,function(g){this.milliseconds=10*+g}],SSS:[/\d{3}/,function(g){this.milliseconds=+g}],s:[f,_("seconds")],ss:[f,_("seconds")],m:[f,_("minutes")],mm:[f,_("minutes")],H:[f,_("hours")],h:[f,_("hours")],HH:[f,_("hours")],hh:[f,_("hours")],D:[f,_("day")],DD:[m,_("day")],Do:[T,function(g){var C=S.ordinal,P=g.match(/\d+/);if(this.day=P[0],C)for(var O=1;O<=31;O+=1)C(O).replace(/\[|\]/g,"")===g&&(this.day=O)}],w:[f,_("week")],ww:[m,_("week")],M:[f,_("month")],MM:[m,_("month")],MMM:[T,function(g){var C=w("months"),P=(w("monthsShort")||C.map((function(O){return O.slice(0,3)}))).indexOf(g)+1;if(P<1)throw new Error;this.month=P%12||P}],MMMM:[T,function(g){var C=w("months").indexOf(g)+1;if(C<1)throw new Error;this.month=C%12||C}],Y:[/[+-]?\d+/,_("year")],YY:[m,function(g){this.year=L(g)}],YYYY:[/\d{4}/,_("year")],Z:W,ZZ:W};function z(g){var C,P;C=g,P=S&&S.formats;for(var O=(g=C.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(h,b,v){var p=v&&v.toUpperCase();return b||P[v]||n[v]||P[p].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(a,d,y){return d||y.slice(1)}))}))).match(r),B=O.length,H=0;H<B;H+=1){var I=O[H],x=R[I],k=x&&x[0],E=x&&x[1];O[H]=E?{regex:k,parser:E}:I.replace(/^\[|\]$/g,"")}return function(h){for(var b={},v=0,p=0;v<B;v+=1){var a=O[v];if(typeof a=="string")p+=a.length;else{var d=a.regex,y=a.parser,u=h.slice(p),M=d.exec(u)[0];y.call(b,M),h=h.replace(M,"")}}return(function(i){var $=i.afternoon;if($!==void 0){var o=i.hours;$?o<12&&(i.hours+=12):o===12&&(i.hours=0),delete i.afternoon}})(b),b}}return function(g,C,P){P.p.customParseFormat=!0,g&&g.parseTwoDigitYear&&(L=g.parseTwoDigitYear);var O=C.prototype,B=O.parse;O.parse=function(H){var I=H.date,x=H.utc,k=H.args;this.$u=x;var E=k[1];if(typeof E=="string"){var h=k[2]===!0,b=k[3]===!0,v=h||b,p=k[2];b&&(p=k[2]),S=this.$locale(),!h&&p&&(S=P.Ls[p]),this.$d=(function(u,M,i,$){try{if(["x","X"].indexOf(M)>-1)return new Date((M==="X"?1e3:1)*u);var o=z(M)(u),G=o.year,c=o.month,A=o.day,Y=o.hours,V=o.minutes,F=o.seconds,q=o.milliseconds,N=o.zone,at=o.week,ct=new Date,vt=A||(G||c?1:ct.getDate()),dt=G||ct.getFullYear(),X=0;G&&!c||(X=c>0?c-1:ct.getMonth());var Q,Z=Y||0,lt=V||0,J=F||0,ot=q||0;return N?new Date(Date.UTC(dt,X,vt,Z,lt,J,ot+60*N.offset*1e3)):i?new Date(Date.UTC(dt,X,vt,Z,lt,J,ot)):(Q=new Date(dt,X,vt,Z,lt,J,ot),at&&(Q=$(Q).week(at).toDate()),Q)}catch{return new Date("")}})(I,E,x,P),this.init(),p&&p!==!0&&(this.$L=this.locale(p).$L),v&&I!=this.format(E)&&(this.$d=new Date("")),S={}}else if(E instanceof Array)for(var a=E.length,d=1;d<=a;d+=1){k[1]=E[d-1];var y=P.apply(this,k);if(y.isValid()){this.$d=y.$d,this.$L=y.$L,this.init();break}d===a&&(this.$d=new Date(""))}else B.call(this,H)}}}))})(St)),St.exports}var Ln=Fn();const On=Ft(Ln);var Mt={exports:{}},Wn=Mt.exports,ye;function Pn(){return ye||(ye=1,(function(t,e){(function(n,r){t.exports=r()})(Wn,(function(){return function(n,r){var s=r.prototype,m=s.format;s.format=function(f){var T=this,S=this.$locale();if(!this.isValid())return m.bind(this)(f);var L=this.$utils(),_=(f||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(W){switch(W){case"Q":return Math.ceil((T.$M+1)/3);case"Do":return S.ordinal(T.$D);case"gggg":return T.weekYear();case"GGGG":return T.isoWeekYear();case"wo":return S.ordinal(T.week(),"W");case"w":case"ww":return L.s(T.week(),W==="w"?1:2,"0");case"W":case"WW":return L.s(T.isoWeek(),W==="W"?1:2,"0");case"k":case"kk":return L.s(String(T.$H===0?24:T.$H),W==="k"?1:2,"0");case"X":return Math.floor(T.$d.getTime()/1e3);case"x":return T.$d.getTime();case"z":return"["+T.offsetName()+"]";case"zzz":return"["+T.offsetName("long")+"]";default:return W}}));return m.bind(this)(_)}}}))})(Mt)),Mt.exports}var zn=Pn();const Nn=Ft(zn);var Ct={exports:{}},Vn=Ct.exports,ge;function Rn(){return ge||(ge=1,(function(t,e){(function(n,r){t.exports=r()})(Vn,(function(){var n,r,s=1e3,m=6e4,f=36e5,T=864e5,S=31536e6,L=2628e6,_=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,W=/\[([^\]]+)]|YYYY|YY|Y|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|SSS/g,w={years:S,months:L,days:T,hours:f,minutes:m,seconds:s,milliseconds:1,weeks:6048e5},D=function(I){return I instanceof B},R=function(I,x,k){return new B(I,k,x.$l)},z=function(I){return r.p(I)+"s"},g=function(I){return I<0},C=function(I){return g(I)?Math.ceil(I):Math.floor(I)},P=function(I){return Math.abs(I)},O=function(I,x){return I?g(I)?{negative:!0,format:""+P(I)+x}:{negative:!1,format:""+I+x}:{negative:!1,format:""}},B=(function(){function I(k,E,h){var b=this;if(this.$d={},this.$l=h,k===void 0&&(this.$ms=0,this.parseFromMilliseconds()),E)return R(k*w[z(E)],this);if(typeof k=="number")return this.$ms=k,this.parseFromMilliseconds(),this;if(typeof k=="object")return Object.keys(k).forEach((function(a){b.$d[z(a)]=k[a]})),this.calMilliseconds(),this;if(typeof k=="string"){var v=k.match(_);if(v){var p=v.slice(2).map((function(a){return a!=null?Number(a):0}));return this.$d.years=p[0],this.$d.months=p[1],this.$d.weeks=p[2],this.$d.days=p[3],this.$d.hours=p[4],this.$d.minutes=p[5],this.$d.seconds=p[6],this.calMilliseconds(),this}}return this}var x=I.prototype;return x.calMilliseconds=function(){var k=this;this.$ms=Object.keys(this.$d).reduce((function(E,h){return E+(k.$d[h]||0)*w[h]}),0)},x.parseFromMilliseconds=function(){var k=this.$ms;this.$d.years=C(k/S),k%=S,this.$d.months=C(k/L),k%=L,this.$d.days=C(k/T),k%=T,this.$d.hours=C(k/f),k%=f,this.$d.minutes=C(k/m),k%=m,this.$d.seconds=C(k/s),k%=s,this.$d.milliseconds=k},x.toISOString=function(){var k=O(this.$d.years,"Y"),E=O(this.$d.months,"M"),h=+this.$d.days||0;this.$d.weeks&&(h+=7*this.$d.weeks);var b=O(h,"D"),v=O(this.$d.hours,"H"),p=O(this.$d.minutes,"M"),a=this.$d.seconds||0;this.$d.milliseconds&&(a+=this.$d.milliseconds/1e3,a=Math.round(1e3*a)/1e3);var d=O(a,"S"),y=k.negative||E.negative||b.negative||v.negative||p.negative||d.negative,u=v.format||p.format||d.format?"T":"",M=(y?"-":"")+"P"+k.format+E.format+b.format+u+v.format+p.format+d.format;return M==="P"||M==="-P"?"P0D":M},x.toJSON=function(){return this.toISOString()},x.format=function(k){var E=k||"YYYY-MM-DDTHH:mm:ss",h={Y:this.$d.years,YY:r.s(this.$d.years,2,"0"),YYYY:r.s(this.$d.years,4,"0"),M:this.$d.months,MM:r.s(this.$d.months,2,"0"),D:this.$d.days,DD:r.s(this.$d.days,2,"0"),H:this.$d.hours,HH:r.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:r.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:r.s(this.$d.seconds,2,"0"),SSS:r.s(this.$d.milliseconds,3,"0")};return E.replace(W,(function(b,v){return v||String(h[b])}))},x.as=function(k){return this.$ms/w[z(k)]},x.get=function(k){var E=this.$ms,h=z(k);return h==="milliseconds"?E%=1e3:E=h==="weeks"?C(E/w[h]):this.$d[h],E||0},x.add=function(k,E,h){var b;return b=E?k*w[z(E)]:D(k)?k.$ms:R(k,this).$ms,R(this.$ms+b*(h?-1:1),this)},x.subtract=function(k,E){return this.add(k,E,!0)},x.locale=function(k){var E=this.clone();return E.$l=k,E},x.clone=function(){return R(this.$ms,this)},x.humanize=function(k){return n().add(this.$ms,"ms").locale(this.$l).fromNow(!k)},x.valueOf=function(){return this.asMilliseconds()},x.milliseconds=function(){return this.get("milliseconds")},x.asMilliseconds=function(){return this.as("milliseconds")},x.seconds=function(){return this.get("seconds")},x.asSeconds=function(){return this.as("seconds")},x.minutes=function(){return this.get("minutes")},x.asMinutes=function(){return this.as("minutes")},x.hours=function(){return this.get("hours")},x.asHours=function(){return this.as("hours")},x.days=function(){return this.get("days")},x.asDays=function(){return this.as("days")},x.weeks=function(){return this.get("weeks")},x.asWeeks=function(){return this.as("weeks")},x.months=function(){return this.get("months")},x.asMonths=function(){return this.as("months")},x.years=function(){return this.get("years")},x.asYears=function(){return this.as("years")},I})(),H=function(I,x,k){return I.add(x.years()*k,"y").add(x.months()*k,"M").add(x.days()*k,"d").add(x.hours()*k,"h").add(x.minutes()*k,"m").add(x.seconds()*k,"s").add(x.milliseconds()*k,"ms")};return function(I,x,k){n=k,r=k().$utils(),k.duration=function(b,v){var p=k.locale();return R(b,{$l:p},v)},k.isDuration=D;var E=x.prototype.add,h=x.prototype.subtract;x.prototype.add=function(b,v){return D(b)?H(this,b,1):E.bind(this)(b,v)},x.prototype.subtract=function(b,v){return D(b)?H(this,b,-1):h.bind(this)(b,v)}}}))})(Ct)),Ct.exports}var Hn=Rn();const Bn=Ft(Hn);var qt=(function(){var t=l(function(p,a,d,y){for(d=d||{},y=p.length;y--;d[p[y]]=a);return d},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],n=[1,26],r=[1,27],s=[1,28],m=[1,29],f=[1,30],T=[1,31],S=[1,32],L=[1,33],_=[1,34],W=[1,9],w=[1,10],D=[1,11],R=[1,12],z=[1,13],g=[1,14],C=[1,15],P=[1,16],O=[1,19],B=[1,20],H=[1,21],I=[1,22],x=[1,23],k=[1,25],E=[1,35],h={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:l(function(a,d,y,u,M,i,$){var o=i.length-1;switch(M){case 1:return i[o-1];case 2:this.$=[];break;case 3:i[o-1].push(i[o]),this.$=i[o-1];break;case 4:case 5:this.$=i[o];break;case 6:case 7:this.$=[];break;case 8:u.setWeekday("monday");break;case 9:u.setWeekday("tuesday");break;case 10:u.setWeekday("wednesday");break;case 11:u.setWeekday("thursday");break;case 12:u.setWeekday("friday");break;case 13:u.setWeekday("saturday");break;case 14:u.setWeekday("sunday");break;case 15:u.setWeekend("friday");break;case 16:u.setWeekend("saturday");break;case 17:u.setDateFormat(i[o].substr(11)),this.$=i[o].substr(11);break;case 18:u.enableInclusiveEndDates(),this.$=i[o].substr(18);break;case 19:u.TopAxis(),this.$=i[o].substr(8);break;case 20:u.setAxisFormat(i[o].substr(11)),this.$=i[o].substr(11);break;case 21:u.setTickInterval(i[o].substr(13)),this.$=i[o].substr(13);break;case 22:u.setExcludes(i[o].substr(9)),this.$=i[o].substr(9);break;case 23:u.setIncludes(i[o].substr(9)),this.$=i[o].substr(9);break;case 24:u.setTodayMarker(i[o].substr(12)),this.$=i[o].substr(12);break;case 27:u.setDiagramTitle(i[o].substr(6)),this.$=i[o].substr(6);break;case 28:this.$=i[o].trim(),u.setAccTitle(this.$);break;case 29:case 30:this.$=i[o].trim(),u.setAccDescription(this.$);break;case 31:u.addSection(i[o].substr(8)),this.$=i[o].substr(8);break;case 33:u.addTask(i[o-1],i[o]),this.$="task";break;case 34:this.$=i[o-1],u.setClickEvent(i[o-1],i[o],null);break;case 35:this.$=i[o-2],u.setClickEvent(i[o-2],i[o-1],i[o]);break;case 36:this.$=i[o-2],u.setClickEvent(i[o-2],i[o-1],null),u.setLink(i[o-2],i[o]);break;case 37:this.$=i[o-3],u.setClickEvent(i[o-3],i[o-2],i[o-1]),u.setLink(i[o-3],i[o]);break;case 38:this.$=i[o-2],u.setClickEvent(i[o-2],i[o],null),u.setLink(i[o-2],i[o-1]);break;case 39:this.$=i[o-3],u.setClickEvent(i[o-3],i[o-1],i[o]),u.setLink(i[o-3],i[o-2]);break;case 40:this.$=i[o-1],u.setLink(i[o-1],i[o]);break;case 41:case 47:this.$=i[o-1]+" "+i[o];break;case 42:case 43:case 45:this.$=i[o-2]+" "+i[o-1]+" "+i[o];break;case 44:case 46:this.$=i[o-3]+" "+i[o-2]+" "+i[o-1]+" "+i[o];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:n,13:r,14:s,15:m,16:f,17:T,18:S,19:18,20:L,21:_,22:W,23:w,24:D,25:R,26:z,27:g,28:C,29:P,30:O,31:B,33:H,35:I,36:x,37:24,38:k,40:E},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:n,13:r,14:s,15:m,16:f,17:T,18:S,19:18,20:L,21:_,22:W,23:w,24:D,25:R,26:z,27:g,28:C,29:P,30:O,31:B,33:H,35:I,36:x,37:24,38:k,40:E},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,39])],defaultActions:{},parseError:l(function(a,d){if(d.recoverable)this.trace(a);else{var y=new Error(a);throw y.hash=d,y}},"parseError"),parse:l(function(a){var d=this,y=[0],u=[],M=[null],i=[],$=this.table,o="",G=0,c=0,A=2,Y=1,V=i.slice.call(arguments,1),F=Object.create(this.lexer),q={yy:{}};for(var N in this.yy)Object.prototype.hasOwnProperty.call(this.yy,N)&&(q.yy[N]=this.yy[N]);F.setInput(a,q.yy),q.yy.lexer=F,q.yy.parser=this,typeof F.yylloc>"u"&&(F.yylloc={});var at=F.yylloc;i.push(at);var ct=F.options&&F.options.ranges;typeof q.yy.parseError=="function"?this.parseError=q.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function vt(K){y.length=y.length-2*K,M.length=M.length-K,i.length=i.length-K}l(vt,"popStack");function dt(){var K;return K=u.pop()||F.lex()||Y,typeof K!="number"&&(K instanceof Array&&(u=K,K=u.pop()),K=d.symbols_[K]||K),K}l(dt,"lex");for(var X,Q,Z,lt,J={},ot,tt,se,bt;;){if(Q=y[y.length-1],this.defaultActions[Q]?Z=this.defaultActions[Q]:((X===null||typeof X>"u")&&(X=dt()),Z=$[Q]&&$[Q][X]),typeof Z>"u"||!Z.length||!Z[0]){var Lt="";bt=[];for(ot in $[Q])this.terminals_[ot]&&ot>A&&bt.push("'"+this.terminals_[ot]+"'");F.showPosition?Lt="Parse error on line "+(G+1)+`:
`+F.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[X]||X)+"'":Lt="Parse error on line "+(G+1)+": Unexpected "+(X==Y?"end of input":"'"+(this.terminals_[X]||X)+"'"),this.parseError(Lt,{text:F.match,token:this.terminals_[X]||X,line:F.yylineno,loc:at,expected:bt})}if(Z[0]instanceof Array&&Z.length>1)throw new Error("Parse Error: multiple actions possible at state: "+Q+", token: "+X);switch(Z[0]){case 1:y.push(X),M.push(F.yytext),i.push(F.yylloc),y.push(Z[1]),X=null,c=F.yyleng,o=F.yytext,G=F.yylineno,at=F.yylloc;break;case 2:if(tt=this.productions_[Z[1]][1],J.$=M[M.length-tt],J._$={first_line:i[i.length-(tt||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(tt||1)].first_column,last_column:i[i.length-1].last_column},ct&&(J._$.range=[i[i.length-(tt||1)].range[0],i[i.length-1].range[1]]),lt=this.performAction.apply(J,[o,c,G,q.yy,Z[1],M,i].concat(V)),typeof lt<"u")return lt;tt&&(y=y.slice(0,-1*tt*2),M=M.slice(0,-1*tt),i=i.slice(0,-1*tt)),y.push(this.productions_[Z[1]][0]),M.push(J.$),i.push(J._$),se=$[y[y.length-2]][y[y.length-1]],y.push(se);break;case 3:return!0}}return!0},"parse")},b=(function(){var p={EOF:1,parseError:l(function(d,y){if(this.yy.parser)this.yy.parser.parseError(d,y);else throw new Error(d)},"parseError"),setInput:l(function(a,d){return this.yy=d||this.yy||{},this._input=a,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:l(function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.offset++,this.match+=a,this.matched+=a;var d=a.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),a},"input"),unput:l(function(a){var d=a.length,y=a.split(/(?:\r\n?|\n)/g);this._input=a+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var u=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),y.length-1&&(this.yylineno-=y.length-1);var M=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:y?(y.length===u.length?this.yylloc.first_column:0)+u[u.length-y.length].length-y[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[M[0],M[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){return this._more=!0,this},"more"),reject:l(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(a){this.unput(this.match.slice(a))},"less"),pastInput:l(function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(function(){var a=this.pastInput(),d=new Array(a.length+1).join("-");return a+this.upcomingInput()+`
`+d+"^"},"showPosition"),test_match:l(function(a,d){var y,u,M;if(this.options.backtrack_lexer&&(M={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(M.yylloc.range=this.yylloc.range.slice(0))),u=a[0].match(/(?:\r\n?|\n).*/g),u&&(this.yylineno+=u.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:u?u[u.length-1].length-u[u.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+a[0].length},this.yytext+=a[0],this.match+=a[0],this.matches=a,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(a[0].length),this.matched+=a[0],y=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),y)return y;if(this._backtrack){for(var i in M)this[i]=M[i];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,d,y,u;this._more||(this.yytext="",this.match="");for(var M=this._currentRules(),i=0;i<M.length;i++)if(y=this._input.match(this.rules[M[i]]),y&&(!d||y[0].length>d[0].length)){if(d=y,u=i,this.options.backtrack_lexer){if(a=this.test_match(y,M[i]),a!==!1)return a;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(a=this.test_match(d,M[u]),a!==!1?a:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var d=this.next();return d||this.lex()},"lex"),begin:l(function(d){this.conditionStack.push(d)},"begin"),popState:l(function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},"topState"),pushState:l(function(d){this.begin(d)},"pushState"),stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(function(d,y,u,M){switch(u){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return p})();h.lexer=b;function v(){this.yy={}}return l(v,"Parser"),v.prototype=h,h.Parser=v,new v})();qt.parser=qt;var qn=qt;U.extend(An);U.extend(On);U.extend(Nn);var pe={friday:5,saturday:6},et="",Ut="",Zt=void 0,Kt="",yt=[],gt=[],Qt=new Map,Jt=[],At=[],pt="",te="",Ye=["active","done","crit","milestone","vert"],ee=[],ft="",xt=!1,ne=!1,re="sunday",Yt="saturday",Gt=0,Gn=l(function(){Jt=[],At=[],pt="",ee=[],Et=0,jt=void 0,It=void 0,j=[],et="",Ut="",te="",Zt=void 0,Kt="",yt=[],gt=[],xt=!1,ne=!1,Gt=0,Qt=new Map,ft="",fn(),re="sunday",Yt="saturday"},"clear"),Xn=l(function(t){ft=t},"setDiagramId"),jn=l(function(t){Ut=t},"setAxisFormat"),Un=l(function(){return Ut},"getAxisFormat"),Zn=l(function(t){Zt=t},"setTickInterval"),Kn=l(function(){return Zt},"getTickInterval"),Qn=l(function(t){Kt=t},"setTodayMarker"),Jn=l(function(){return Kt},"getTodayMarker"),tr=l(function(t){et=t},"setDateFormat"),er=l(function(){xt=!0},"enableInclusiveEndDates"),nr=l(function(){return xt},"endDatesAreInclusive"),rr=l(function(){ne=!0},"enableTopAxis"),ir=l(function(){return ne},"topAxisEnabled"),sr=l(function(t){te=t},"setDisplayMode"),ar=l(function(){return te},"getDisplayMode"),or=l(function(){return et},"getDateFormat"),Fe=l((t,e)=>{const n=e.toLowerCase().split(/[\s,]+/).filter(r=>r!=="");return[...new Set([...t,...n])]},"mergeTokens"),cr=l(function(t){yt=Fe(yt,t)},"setIncludes"),lr=l(function(){return yt},"getIncludes"),ur=l(function(t){gt=Fe(gt,t)},"setExcludes"),dr=l(function(){return gt},"getExcludes"),fr=l(function(){return Qt},"getLinks"),hr=l(function(t){pt=t,Jt.push(t)},"addSection"),mr=l(function(){return Jt},"getSections"),kr=l(function(){let t=ve();const e=10;let n=0;for(;!t&&n<e;)t=ve(),n++;return At=j,At},"getTasks"),Le=l(function(t,e,n,r){const s=t.format(e.trim()),m=t.format("YYYY-MM-DD");return r.includes(s)||r.includes(m)?!1:n.includes("weekends")&&(t.isoWeekday()===pe[Yt]||t.isoWeekday()===pe[Yt]+1)||n.includes(t.format("dddd").toLowerCase())?!0:n.includes(s)||n.includes(m)},"isInvalidDate"),yr=l(function(t){re=t},"setWeekday"),gr=l(function(){return re},"getWeekday"),pr=l(function(t){Yt=t},"setWeekend"),Oe=l(function(t,e,n,r){if(!n.length||t.manualEndTime)return;let s;t.startTime instanceof Date?s=U(t.startTime):s=U(t.startTime,e,!0),s=s.add(1,"d");let m;t.endTime instanceof Date?m=U(t.endTime):m=U(t.endTime,e,!0);const[f,T]=vr(s,m,e,n,r);t.endTime=f.toDate(),t.renderEndTime=T},"checkTaskDates"),vr=l(function(t,e,n,r,s){let m=!1,f=null;const T=e.add(1e4,"d");for(;t<=e;){if(m||(f=e.toDate()),m=Le(t,n,r,s),m&&(e=e.add(1,"d"),e>T))throw new Error("Failed to find a valid date that was not excluded by `excludes` after 10,000 iterations.");t=t.add(1,"d")}return[e,f]},"fixTaskDates"),We=l(function(t,e){it.warn(`Gantt: the "${t}" statement references unknown task id(s): ${e.join(", ")}. Make sure the referenced tasks exist and declare an id. Milestones need both an id and a duration, e.g. "Milestone :milestone, m1, 2023-01-01, 0d".`)},"warnAboutUnknownTaskIds"),Xt=l(function(t,e,n){if(n=n.trim(),l(T=>{const S=T.trim();return S==="x"||S==="X"},"isTimestampFormat")(e)&&/^\d+$/.test(n))return new Date(Number(n));const m=/^after\s+(?<ids>[\d\w- ]+)/.exec(n);if(m!==null){let T=null;const S=[],L=m.groups.ids.split(" ").filter(W=>W!=="");for(const W of L){const w=ut(W);if(w===void 0){S.push(W);continue}(!T||w.endTime>T.endTime)&&(T=w)}if(S.length>0&&We("after",S),T)return T.endTime;const _=new Date;return _.setHours(0,0,0,0),_}let f=U(n,e.trim(),!0);if(f.isValid())return f.toDate();{it.debug("Invalid date:"+n),it.debug("With date format:"+e.trim());const T=new Date(n);if(T===void 0||isNaN(T.getTime())||T.getFullYear()<-1e4||T.getFullYear()>1e4)throw new Error("Invalid date:"+n);return T}},"getStartDate"),Pe=l(function(t){const e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return e!==null?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),ze=l(function(t,e,n,r=!1){n=n.trim();const m=/^until\s+(?<ids>[\d\w- ]+)/.exec(n);if(m!==null){let _=null;const W=[],w=m.groups.ids.split(" ").filter(R=>R!=="");for(const R of w){const z=ut(R);if(z===void 0){W.push(R);continue}(!_||z.startTime<_.startTime)&&(_=z)}if(W.length>0&&We("until",W),_)return _.startTime;const D=new Date;return D.setHours(0,0,0,0),D}let f=U(n,e.trim(),!0);if(f.isValid())return r&&(f=f.add(1,"d")),f.toDate();let T=U(t);const[S,L]=Pe(n);if(Number.isNaN(S))it.warn(`Gantt: "${n}" is neither a valid date for the "${e.trim()}" date format nor a valid duration (e.g. "3d"), so it is ignored and the task gets a zero duration. Milestones need a duration too, e.g. "Milestone :milestone, m1, 2023-01-01, 0d".`);else{const _=T.add(S,L);_.isValid()&&(T=_)}return T.toDate()},"getEndDate"),Et=0,kt=l(function(t){return t===void 0?(Et=Et+1,"task"+Et):t},"parseId"),xr=l(function(t,e){let n;e.substr(0,1)===":"?n=e.substr(1,e.length):n=e;const r=n.split(","),s={};ie(r,s,Ye);for(let f=0;f<r.length;f++)r[f]=r[f].trim();let m="";switch(r.length){case 1:s.id=kt(),s.startTime=t.endTime,m=r[0];break;case 2:s.id=kt(),s.startTime=Xt(void 0,et,r[0]),m=r[1];break;case 3:s.id=kt(r[0]),s.startTime=Xt(void 0,et,r[1]),m=r[2];break}return m&&(s.endTime=ze(s.startTime,et,m,xt),s.manualEndTime=U(m,"YYYY-MM-DD",!0).isValid(),Oe(s,et,gt,yt)),s},"compileData"),br=l(function(t,e){let n;e.substr(0,1)===":"?n=e.substr(1,e.length):n=e;const r=n.split(","),s={};ie(r,s,Ye);for(let m=0;m<r.length;m++)r[m]=r[m].trim();switch(r.length){case 1:s.id=kt(),s.startTime={type:"prevTaskEnd",id:t},s.endTime={data:r[0]};break;case 2:s.id=kt(),s.startTime={type:"getStartDate",startData:r[0]},s.endTime={data:r[1]};break;case 3:s.id=kt(r[0]),s.startTime={type:"getStartDate",startData:r[1]},s.endTime={data:r[2]};break}return s},"parseData"),jt,It,j=[],Ne={},Tr=l(function(t,e){const n={section:pt,type:pt,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},r=br(It,e);n.raw.startTime=r.startTime,n.raw.endTime=r.endTime,n.id=r.id,n.prevTaskId=It,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,n.vert=r.vert,n.vert?n.order=-1:(n.order=Gt,Gt++);const s=j.push(n);It=n.id,Ne[n.id]=s-1},"addTask"),ut=l(function(t){const e=Ne[t];return j[e]},"findTaskById"),wr=l(function(t,e){const n={section:pt,type:pt,description:t,task:t,classes:[]},r=xr(jt,e);n.startTime=r.startTime,n.endTime=r.endTime,n.id=r.id,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,n.vert=r.vert,jt=n,At.push(n)},"addTaskOrg"),ve=l(function(){const t=l(function(n){const r=j[n];let s="";switch(j[n].raw.startTime.type){case"prevTaskEnd":{const m=ut(r.prevTaskId);r.startTime=m.endTime;break}case"getStartDate":s=Xt(void 0,et,j[n].raw.startTime.startData),s&&(j[n].startTime=s);break}return j[n].startTime&&(j[n].endTime=ze(j[n].startTime,et,j[n].raw.endTime.data,xt),j[n].endTime&&(j[n].processed=!0,j[n].manualEndTime=U(j[n].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),Oe(j[n],et,gt,yt))),j[n].processed},"compileTask");let e=!0;for(const[n,r]of j.entries())t(n),e=e&&r.processed;return e},"compileTasks"),_r=l(function(t,e){let n=e;ht().securityLevel!=="loose"&&(n=dn.sanitizeUrl(e)),t.split(",").forEach(function(r){ut(r)!==void 0&&(Re(r,()=>{window.open(n,"_self")}),Qt.set(r,n))}),Ve(t,"clickable")},"setLink"),Ve=l(function(t,e){t.split(",").forEach(function(n){let r=ut(n);r!==void 0&&r.classes.push(e)})},"setClass"),Dr=l(function(t,e,n){if(ht().securityLevel!=="loose"||e===void 0)return;let r=[];if(typeof n=="string"){r=n.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let m=0;m<r.length;m++){let f=r[m].trim();f.startsWith('"')&&f.endsWith('"')&&(f=f.substr(1,f.length-2)),r[m]=f}}r.length===0&&r.push(t),ut(t)!==void 0&&Re(t,()=>{hn.runFunc(e,...r)})},"setClickFun"),Re=l(function(t,e){ee.push(function(){const n=ft?`${ft}-${t}`:t,r=document.querySelector(`[id="${n}"]`);r!==null&&r.addEventListener("click",function(){e()})},function(){const n=ft?`${ft}-${t}`:t,r=document.querySelector(`[id="${n}-text"]`);r!==null&&r.addEventListener("click",function(){e()})})},"pushFun"),Sr=l(function(t,e,n){t.split(",").forEach(function(r){Dr(r,e,n)}),Ve(t,"clickable")},"setClickEvent"),Mr=l(function(t){ee.forEach(function(e){e(t)})},"bindFunctions"),Cr={getConfig:l(()=>ht().gantt,"getConfig"),clear:Gn,setDateFormat:tr,getDateFormat:or,enableInclusiveEndDates:er,endDatesAreInclusive:nr,enableTopAxis:rr,topAxisEnabled:ir,setAxisFormat:jn,getAxisFormat:Un,setTickInterval:Zn,getTickInterval:Kn,setTodayMarker:Qn,getTodayMarker:Jn,setAccTitle:Ze,getAccTitle:Ue,setDiagramTitle:je,getDiagramTitle:Xe,setDiagramId:Xn,setDisplayMode:sr,getDisplayMode:ar,setAccDescription:Ge,getAccDescription:qe,addSection:hr,getSections:mr,getTasks:kr,addTask:Tr,findTaskById:ut,addTaskOrg:wr,setIncludes:cr,getIncludes:lr,setExcludes:ur,getExcludes:dr,setClickEvent:Sr,setLink:_r,getLinks:fr,bindFunctions:Mr,parseDuration:Pe,isInvalidDate:Le,setWeekday:yr,getWeekday:gr,setWeekend:pr};function ie(t,e,n){let r=!0;for(;r;)r=!1,n.forEach(function(s){const m="^\\s*"+s+"\\s*$",f=new RegExp(m);t[0].match(f)&&(e[s]=!0,t.shift(1),r=!0)})}l(ie,"getTaskTags");U.extend(Bn);var Er=l(function(){it.debug("Something is calling, setConf, remove the call")},"setConf"),xe={monday:ln,tuesday:cn,wednesday:on,thursday:an,friday:sn,saturday:rn,sunday:nn},Ir=l((t,e)=>{let n=[...t].map(()=>-1/0),r=[...t].sort((m,f)=>m.startTime-f.startTime||m.order-f.order),s=0;for(const m of r)for(let f=0;f<n.length;f++)if(m.startTime>=n[f]){n[f]=m.endTime,m.order=f+e,f>s&&(s=f);break}return s},"getMaxIntersections"),rt,Rt=1e4,$r=l(function(t,e,n,r){const s=ht().gantt;r.db.setDiagramId(e);const m=ht().securityLevel;let f;m==="sandbox"&&(f=Tt("#i"+e));const T=m==="sandbox"?Tt(f.nodes()[0].contentDocument.body):Tt("body"),S=m==="sandbox"?f.nodes()[0].contentDocument:document,L=S.getElementById(e);rt=L.parentElement.offsetWidth,rt===void 0&&(rt=1200),s.useWidth!==void 0&&(rt=s.useWidth);const _=r.db.getTasks(),W=_.filter(h=>!h.vert);let w=[];for(const h of W)w.push(h.type);w=E(w);const D={};let R=2*s.topPadding;if(r.db.getDisplayMode()==="compact"||s.displayMode==="compact"){const h={};for(const v of W)h[v.section]===void 0?h[v.section]=[v]:h[v.section].push(v);let b=0;for(const v of Object.keys(h)){const p=Ir(h[v],b)+1;b+=p,R+=p*(s.barHeight+s.barGap),D[v]=p}}else{R+=W.length*(s.barHeight+s.barGap);for(const h of w)D[h]=W.filter(b=>b.type===h).length}L.setAttribute("viewBox","0 0 "+rt+" "+R);const z=T.select(`[id="${e}"]`),g=Ke().domain([Qe(_,function(h){return h.startTime}),Je(_,function(h){return h.endTime})]).rangeRound([0,rt-s.leftPadding-s.rightPadding]);function C(h,b){const v=h.startTime,p=b.startTime;let a=0;return v>p?a=1:v<p&&(a=-1),a}l(C,"taskCompare"),_.sort(C),P(_,rt,R),tn(z,R,rt,s.useMaxWidth),z.append("text").text(r.db.getDiagramTitle()).attr("x",rt/2).attr("y",s.titleTopMargin).attr("class","titleText");function P(h,b,v){const p=s.barHeight,a=p+s.barGap,d=s.topPadding,y=s.leftPadding,u=en().domain([0,w.length]).range(["#00B9FA","#F95002"]).interpolate(xn);B(a,d,y,b,v,h,r.db.getExcludes(),r.db.getIncludes()),I(y,d,b,v),O(h,a,d,y,p,u,b),x(a,d),k(y,d,b,v)}l(P,"makeGantt");function O(h,b,v,p,a,d,y){h.sort((c,A)=>c.vert===A.vert?0:c.vert?1:-1);const u=h.filter(c=>!c.vert),i=[...new Set(u.map(c=>c.order))].map(c=>u.find(A=>A.order===c));z.append("g").selectAll("rect").data(i).enter().append("rect").attr("x",0).attr("y",function(c,A){return A=c.order,A*b+v-2}).attr("width",function(){return y-s.rightPadding/2}).attr("height",b).attr("class",function(c){for(const[A,Y]of w.entries())if(c.type===Y)return"section section"+A%s.numberSectionStyles;return"section section0"}).enter();const $=z.append("g").selectAll("rect").data(h).enter(),o=r.db.getLinks();if($.append("rect").attr("id",function(c){return e+"-"+c.id}).attr("rx",3).attr("ry",3).attr("x",function(c){return c.milestone?g(c.startTime)+p+.5*(g(c.endTime)-g(c.startTime))-.5*a:g(c.startTime)+p}).attr("y",function(c,A){return A=c.order,c.vert?s.gridLineStartPadding:A*b+v}).attr("width",function(c){return c.milestone?a:c.vert?.08*a:g(c.renderEndTime||c.endTime)-g(c.startTime)}).attr("height",function(c){return c.vert?u.length*(s.barHeight+s.barGap)+s.barHeight*2:a}).attr("transform-origin",function(c,A){return A=c.order,(g(c.startTime)+p+.5*(g(c.endTime)-g(c.startTime))).toString()+"px "+(A*b+v+.5*a).toString()+"px"}).attr("class",function(c){const A="task";let Y="";c.classes.length>0&&(Y=c.classes.join(" "));let V=0;for(const[q,N]of w.entries())c.type===N&&(V=q%s.numberSectionStyles);let F="";return c.active?c.crit?F+=" activeCrit":F=" active":c.done?c.crit?F=" doneCrit":F=" done":c.crit&&(F+=" crit"),F.length===0&&(F=" task"),c.milestone&&(F=" milestone "+F),c.vert&&(F=" vert "+F),F+=V,F+=" "+Y,A+F}),$.append("text").attr("id",function(c){return e+"-"+c.id+"-text"}).text(function(c){return c.task}).attr("font-size",s.fontSize).attr("x",function(c){let A=g(c.startTime),Y=g(c.renderEndTime||c.endTime);if(c.milestone&&(A+=.5*(g(c.endTime)-g(c.startTime))-.5*a,Y=A+a),c.vert)return g(c.startTime)+p;const V=this.getBBox().width;return V>Y-A?Y+V+1.5*s.leftPadding>y?A+p-5:Y+p+5:(Y-A)/2+A+p}).attr("y",function(c,A){return c.vert?s.gridLineStartPadding+u.length*(s.barHeight+s.barGap)+60:(A=c.order,A*b+s.barHeight/2+(s.fontSize/2-2)+v)}).attr("text-height",a).attr("class",function(c){const A=g(c.startTime);let Y=g(c.endTime);c.milestone&&(Y=A+a);const V=this.getBBox().width;let F="";c.classes.length>0&&(F=c.classes.join(" "));let q=0;for(const[at,ct]of w.entries())c.type===ct&&(q=at%s.numberSectionStyles);let N="";return c.active&&(c.crit?N="activeCritText"+q:N="activeText"+q),c.done?c.crit?N=N+" doneCritText"+q:N=N+" doneText"+q:c.crit&&(N=N+" critText"+q),c.milestone&&(N+=" milestoneText"),c.vert&&(N+=" vertText"),V>Y-A?Y+V+1.5*s.leftPadding>y?F+" taskTextOutsideLeft taskTextOutside"+q+" "+N:F+" taskTextOutsideRight taskTextOutside"+q+" "+N+" width-"+V:F+" taskText taskText"+q+" "+N+" width-"+V}),ht().securityLevel==="sandbox"){let c;c=Tt("#i"+e);const A=c.nodes()[0].contentDocument;$.filter(function(Y){return o.has(Y.id)}).each(function(Y){var V=A.querySelector("#"+CSS.escape(e+"-"+Y.id)),F=A.querySelector("#"+CSS.escape(e+"-"+Y.id+"-text"));const q=V.parentNode;var N=A.createElement("a");N.setAttribute("xlink:href",o.get(Y.id)),N.setAttribute("target","_top"),q.appendChild(N),N.appendChild(V),N.appendChild(F)})}}l(O,"drawRects");function B(h,b,v,p,a,d,y,u){if(y.length===0&&u.length===0)return;let M,i;for(const{startTime:Y,endTime:V}of d)(M===void 0||Y<M)&&(M=Y),(i===void 0||V>i)&&(i=V);if(!M||!i)return;if(U(i).diff(U(M),"year")>5){it.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const $=r.db.getDateFormat(),o=[];let G=null,c=U(M);for(;c.valueOf()<=i;)r.db.isInvalidDate(c,$,y,u)?G?G.end=c:G={start:c,end:c}:G&&(o.push(G),G=null),c=c.add(1,"d");z.append("g").selectAll("rect").data(o).enter().append("rect").attr("id",Y=>e+"-exclude-"+Y.start.format("YYYY-MM-DD")).attr("x",Y=>g(Y.start.startOf("day"))+v).attr("y",s.gridLineStartPadding).attr("width",Y=>g(Y.end.endOf("day"))-g(Y.start.startOf("day"))).attr("height",a-b-s.gridLineStartPadding).attr("transform-origin",function(Y,V){return(g(Y.start)+v+.5*(g(Y.end)-g(Y.start))).toString()+"px "+(V*h+.5*a).toString()+"px"}).attr("class","exclude-range")}l(B,"drawExcludeDays");function H(h,b,v,p){if(v<=0||h>b)return 1/0;const a=b-h,d=U.duration({[p??"day"]:v}).asMilliseconds();return d<=0?1/0:Math.ceil(a/d)}l(H,"getEstimatedTickCount");function I(h,b,v,p){const a=r.db.getDateFormat(),d=r.db.getAxisFormat();let y;d?y=d:a==="D"?y="%d":y=s.axisFormat??"%Y-%m-%d";let u=Cn(g).tickSize(-p+b+s.gridLineStartPadding).tickFormat(ae(y));const i=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||s.tickInterval);if(i!==null){const $=parseInt(i[1],10);if(isNaN($)||$<=0)it.warn(`Invalid tick interval value: "${i[1]}". Skipping custom tick interval.`);else{const o=i[2],G=r.db.getWeekday()||s.weekday,c=g.domain(),A=c[0],Y=c[1],V=H(A,Y,$,o);if(V>Rt)it.warn(`The tick interval "${$}${o}" would generate ${V} ticks, which exceeds the maximum allowed (${Rt}). This may indicate an invalid date or time range. Skipping custom tick interval.`);else switch(o){case"millisecond":u.ticks(fe.every($));break;case"second":u.ticks(de.every($));break;case"minute":u.ticks(ue.every($));break;case"hour":u.ticks(le.every($));break;case"day":u.ticks(ce.every($));break;case"week":u.ticks(xe[G].every($));break;case"month":u.ticks(oe.every($));break}}}if(z.append("g").attr("class","grid").attr("transform","translate("+h+", "+(p-50)+")").call(u).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||s.topAxis){let $=Mn(g).tickSize(-p+b+s.gridLineStartPadding).tickFormat(ae(y));if(i!==null){const o=parseInt(i[1],10);if(isNaN(o)||o<=0)it.warn(`Invalid tick interval value: "${i[1]}". Skipping custom tick interval.`);else{const G=i[2],c=r.db.getWeekday()||s.weekday,A=g.domain(),Y=A[0],V=A[1];if(H(Y,V,o,G)<=Rt)switch(G){case"millisecond":$.ticks(fe.every(o));break;case"second":$.ticks(de.every(o));break;case"minute":$.ticks(ue.every(o));break;case"hour":$.ticks(le.every(o));break;case"day":$.ticks(ce.every(o));break;case"week":$.ticks(xe[c].every(o));break;case"month":$.ticks(oe.every(o));break}}}z.append("g").attr("class","grid").attr("transform","translate("+h+", "+b+")").call($).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}l(I,"makeGrid");function x(h,b){let v=0;const p=Object.keys(D).map(a=>[a,D[a]]);z.append("g").selectAll("text").data(p).enter().append(function(a){const d=a[0].split(un.lineBreakRegex),y=-(d.length-1)/2,u=S.createElementNS("http://www.w3.org/2000/svg","text");u.setAttribute("dy",y+"em");for(const[M,i]of d.entries()){const $=S.createElementNS("http://www.w3.org/2000/svg","tspan");$.setAttribute("alignment-baseline","central"),$.setAttribute("x","10"),M>0&&$.setAttribute("dy","1em"),$.textContent=i,u.appendChild($)}return u}).attr("x",10).attr("y",function(a,d){if(d>0)for(let y=0;y<d;y++)return v+=p[d-1][1],a[1]*h/2+v*h+b;else return a[1]*h/2+b}).attr("font-size",s.sectionFontSize).attr("class",function(a){for(const[d,y]of w.entries())if(a[0]===y)return"sectionTitle sectionTitle"+d%s.numberSectionStyles;return"sectionTitle"})}l(x,"vertLabels");function k(h,b,v,p){const a=r.db.getTodayMarker();if(a==="off")return;const d=z.append("g").attr("class","today"),y=new Date,u=d.append("line");u.attr("x1",g(y)+h).attr("x2",g(y)+h).attr("y1",s.titleTopMargin).attr("y2",p-s.titleTopMargin).attr("class","today"),a!==""&&u.attr("style",a.replace(/,/g,";"))}l(k,"drawToday");function E(h){const b={},v=[];for(let p=0,a=h.length;p<a;++p)Object.prototype.hasOwnProperty.call(b,h[p])||(b[h[p]]=!0,v.push(h[p]));return v}l(E,"checkUnique")},"draw"),Ar={setConf:Er,draw:$r},Yr=l(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done task text displayed outside the bar sits against the diagram background,
     not against the done-task bar, so it must use the outside/contrast color. */
  .doneText0.taskTextOutsideLeft,
  .doneText0.taskTextOutsideRight,
  .doneText1.taskTextOutsideLeft,
  .doneText1.taskTextOutsideRight,
  .doneText2.taskTextOutsideLeft,
  .doneText2.taskTextOutsideRight,
  .doneText3.taskTextOutsideLeft,
  .doneText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done-crit task text outside the bar — same reasoning as doneText above. */
  .doneCritText0.taskTextOutsideLeft,
  .doneCritText0.taskTextOutsideRight,
  .doneCritText1.taskTextOutsideLeft,
  .doneCritText1.taskTextOutsideRight,
  .doneCritText2.taskTextOutsideLeft,
  .doneCritText2.taskTextOutsideRight,
  .doneCritText3.taskTextOutsideLeft,
  .doneCritText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles"),Fr=Yr,Or={parser:qn,db:Cr,renderer:Ar,styles:Fr};export{Or as diagram};
