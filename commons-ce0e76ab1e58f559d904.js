(self.webpackChunkjuheon_dev_blog=self.webpackChunkjuheon_dev_blog||[]).push([[351],{8784:function(e,t,n){"use strict";n.d(t,{H:function(){return S},b:function(){return te},c:function(){return B},g:function(){return _},h:function(){return T},p:function(){return u},r:function(){return oe}});let r,o,i=!1,s=!1;const a="undefined"!=typeof window?window:{},l=a.document||{head:{}},c={$flags$:0,$resourcesUrl$:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,r)=>e.addEventListener(t,n,r),rel:(e,t,n,r)=>e.removeEventListener(t,n,r),ce:(e,t)=>new CustomEvent(e,t)},u=e=>Promise.resolve(e),h=(()=>{try{return new CSSStyleSheet,"function"==typeof(new CSSStyleSheet).replaceSync}catch(e){}return!1})(),f=(e,t,n,r)=>{n&&n.map((([n,r,o])=>{const i=d(e,n),s=p(t,o),a=m(n);c.ael(i,r,s,a),(t.$rmListeners$=t.$rmListeners$||[]).push((()=>c.rel(i,r,s,a)))}))},p=(e,t)=>n=>{try{256&e.$flags$?e.$lazyInstance$[t](n):(e.$queuedListeners$=e.$queuedListeners$||[]).push([t,n])}catch(r){ae(r)}},d=(e,t)=>4&t?l:e,m=e=>0!=(2&e),$="http://www.w3.org/1999/xlink",y=new WeakMap,g=e=>{const t=e.$cmpMeta$,n=e.$hostElement$,r=t.$flags$,o=(t.$tagName$,()=>{}),i=((e,t,n,r)=>{let o=b(t);const i=ue.get(o);if(e=11===e.nodeType?e:l,i)if("string"==typeof i){e=e.head||e;let t,n=y.get(e);n||y.set(e,n=new Set),n.has(o)||(t=l.createElement("style"),t.innerHTML=i,e.insertBefore(t,e.querySelector("link")),n&&n.add(o))}else e.adoptedStyleSheets.includes(i)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,i]);return o})(n.shadowRoot?n.shadowRoot:n.getRootNode(),t);10&r&&(n["s-sc"]=i,n.classList.add(i+"-h")),o()},b=(e,t)=>"sc-"+e.$tagName$,v={},w=e=>"object"===(e=typeof e)||"function"===e,T=(e,t,...n)=>{let r=null,o=null,i=!1,s=!1;const a=[],l=t=>{for(let n=0;n<t.length;n++)r=t[n],Array.isArray(r)?l(r):null!=r&&"boolean"!=typeof r&&((i="function"!=typeof e&&!w(r))&&(r=String(r)),i&&s?a[a.length-1].$text$+=r:a.push(i?E(null,r):r),s=i)};if(l(n),t){t.key&&(o=t.key);{const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter((t=>e[t])).join(" "))}}if("function"==typeof e)return e(null===t?{}:t,a,k);const c=E(e,null);return c.$attrs$=t,a.length>0&&(c.$children$=a),c.$key$=o,c},E=(e,t)=>{const n={$flags$:0,$tag$:e,$text$:t,$elm$:null,$children$:null,$attrs$:null,$key$:null};return n},S={},k={forEach:(e,t)=>e.map(C).forEach(t),map:(e,t)=>e.map(C).map(t).map(O)},C=e=>({vattrs:e.$attrs$,vchildren:e.$children$,vkey:e.$key$,vname:e.$name$,vtag:e.$tag$,vtext:e.$text$}),O=e=>{if("function"==typeof e.vtag){const t=Object.assign({},e.vattrs);return e.vkey&&(t.key=e.vkey),e.vname&&(t.name=e.vname),T(e.vtag,t,...e.vchildren||[])}const t=E(e.vtag,e.vtext);return t.$attrs$=e.vattrs,t.$children$=e.vchildren,t.$key$=e.vkey,t.$name$=e.vname,t},A=(e,t,n,r,o,i)=>{if(n!==r){let l=se(e,t),u=t.toLowerCase();if("class"===t){const t=e.classList,o=L(n),i=L(r);t.remove(...o.filter((e=>e&&!i.includes(e)))),t.add(...i.filter((e=>e&&!o.includes(e))))}else if("style"===t){for(const t in n)r&&null!=r[t]||(t.includes("-")?e.style.removeProperty(t):e.style[t]="");for(const t in r)n&&r[t]===n[t]||(t.includes("-")?e.style.setProperty(t,r[t]):e.style[t]=r[t])}else if("key"===t);else if("ref"===t)r&&r(e);else if(l||"o"!==t[0]||"n"!==t[1]){const a=w(r);if((l||a&&null!==r)&&!o)try{if(e.tagName.includes("-"))e[t]=r;else{const o=null==r?"":r;"list"===t?l=!1:null!=n&&e[t]==o||(e[t]=o)}}catch(s){}let c=!1;u!==(u=u.replace(/^xlink\:?/,""))&&(t=u,c=!0),null==r||!1===r?!1===r&&""!==e.getAttribute(t)||(c?e.removeAttributeNS($,t):e.removeAttribute(t)):(!l||4&i||o)&&!a&&(r=!0===r?"":r,c?e.setAttributeNS($,t,r):e.setAttribute(t,r))}else t="-"===t[2]?t.slice(3):se(a,u)?u.slice(2):u[2]+t.slice(3),n&&c.rel(e,t,n,!1),r&&c.ael(e,t,r,!1)}},j=/\s/,L=e=>e?e.split(j):[],x=(e,t,n,r)=>{const o=11===t.$elm$.nodeType&&t.$elm$.host?t.$elm$.host:t.$elm$,i=e&&e.$attrs$||v,s=t.$attrs$||v;for(r in i)r in s||A(o,r,i[r],void 0,n,t.$flags$);for(r in s)A(o,r,i[r],s[r],n,t.$flags$)},M=(e,t,n,o)=>{const s=t.$children$[n];let a,c,u=0;if(null!==s.$text$)a=s.$elm$=l.createTextNode(s.$text$);else{if(i||(i="svg"===s.$tag$),a=s.$elm$=l.createElementNS(i?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml",s.$tag$),i&&"foreignObject"===s.$tag$&&(i=!1),x(null,s,i),null!=r&&a["s-si"]!==r&&a.classList.add(a["s-si"]=r),s.$children$)for(u=0;u<s.$children$.length;++u)c=M(e,s,u),c&&a.appendChild(c);"svg"===s.$tag$?i=!1:"foreignObject"===a.tagName&&(i=!0)}return a},N=(e,t,n,r,i,s)=>{let a,l=e;for(l.shadowRoot&&l.tagName===o&&(l=l.shadowRoot);i<=s;++i)r[i]&&(a=M(null,n,i),a&&(r[i].$elm$=a,l.insertBefore(a,t)))},I=(e,t,n,r,o)=>{for(;t<=n;++t)(r=e[t])&&(o=r.$elm$,D(r),o.remove())},P=(e,t)=>e.$tag$===t.$tag$&&e.$key$===t.$key$,R=(e,t)=>{const n=t.$elm$=e.$elm$,r=e.$children$,o=t.$children$,s=t.$tag$,a=t.$text$;null===a?(i="svg"===s||"foreignObject"!==s&&i,"slot"===s||x(e,t,i),null!==r&&null!==o?((e,t,n,r)=>{let o,i,s=0,a=0,l=0,c=0,u=t.length-1,h=t[0],f=t[u],p=r.length-1,d=r[0],m=r[p];for(;s<=u&&a<=p;)if(null==h)h=t[++s];else if(null==f)f=t[--u];else if(null==d)d=r[++a];else if(null==m)m=r[--p];else if(P(h,d))R(h,d),h=t[++s],d=r[++a];else if(P(f,m))R(f,m),f=t[--u],m=r[--p];else if(P(h,m))R(h,m),e.insertBefore(h.$elm$,f.$elm$.nextSibling),h=t[++s],m=r[--p];else if(P(f,d))R(f,d),e.insertBefore(f.$elm$,h.$elm$),f=t[--u],d=r[++a];else{for(l=-1,c=s;c<=u;++c)if(t[c]&&null!==t[c].$key$&&t[c].$key$===d.$key$){l=c;break}l>=0?(i=t[l],i.$tag$!==d.$tag$?o=M(t&&t[a],n,l):(R(i,d),t[l]=void 0,o=i.$elm$),d=r[++a]):(o=M(t&&t[a],n,a),d=r[++a]),o&&h.$elm$.parentNode.insertBefore(o,h.$elm$)}s>u?N(e,null==r[p+1]?null:r[p+1].$elm$,n,r,a,p):a>p&&I(t,s,u)})(n,r,t,o):null!==o?(null!==e.$text$&&(n.textContent=""),N(n,null,t,o,0,o.length-1)):null!==r&&I(r,0,r.length-1),i&&"svg"===s&&(i=!1)):e.$text$!==a&&(n.data=a)},D=e=>{e.$attrs$&&e.$attrs$.ref&&e.$attrs$.ref(null),e.$children$&&e.$children$.map(D)},H=(e,t)=>{const n=e.$hostElement$,i=e.$cmpMeta$,s=e.$vnode$||E(null,null),a=(l=t)&&l.$tag$===S?t:T(null,null,t);var l;o=n.tagName,i.$attrsToReflect$&&(a.$attrs$=a.$attrs$||{},i.$attrsToReflect$.map((([e,t])=>a.$attrs$[t]=n[e]))),a.$tag$=null,a.$flags$|=4,e.$vnode$=a,a.$elm$=s.$elm$=n.shadowRoot||n,r=n["s-sc"],R(s,a)},_=e=>re(e).$hostElement$,B=(e,t,n)=>{const r=_(e);return{emit:e=>U(r,t,{bubbles:!!(4&n),composed:!!(2&n),cancelable:!!(1&n),detail:e})}},U=(e,t,n)=>{const r=c.ce(t,n);return e.dispatchEvent(r),r},z=(e,t)=>{t&&!e.$onRenderResolve$&&t["s-p"]&&t["s-p"].push(new Promise((t=>e.$onRenderResolve$=t)))},q=(e,t)=>{if(e.$flags$|=16,4&e.$flags$)return void(e.$flags$|=512);z(e,e.$ancestorComponent$);return ye((()=>W(e,t)))},W=(e,t)=>{const n=(e.$cmpMeta$.$tagName$,()=>{}),r=e.$lazyInstance$;let o;return t&&(e.$flags$|=256,e.$queuedListeners$&&(e.$queuedListeners$.map((([e,t])=>V(r,e,t))),e.$queuedListeners$=null),o=V(r,"componentWillLoad")),n(),J(o,(()=>F(e,r,t)))},F=async(e,t,n)=>{const r=e.$hostElement$,o=(e.$cmpMeta$.$tagName$,()=>{}),i=r["s-rc"];n&&g(e);const s=(e.$cmpMeta$.$tagName$,()=>{});Y(e,t),i&&(i.map((e=>e())),r["s-rc"]=void 0),s(),o();{const t=r["s-p"],n=()=>X(e);0===t.length?n():(Promise.all(t).then(n),e.$flags$|=4,t.length=0)}},Y=(e,t,n)=>{try{t=t.render(),e.$flags$&=-17,e.$flags$|=2,H(e,t)}catch(r){ae(r,e.$hostElement$)}return null},X=e=>{e.$cmpMeta$.$tagName$;const t=e.$hostElement$,n=()=>{},r=e.$lazyInstance$,o=e.$ancestorComponent$;64&e.$flags$?(V(r,"componentDidUpdate"),n()):(e.$flags$|=64,G(t),V(r,"componentDidLoad"),n(),e.$onReadyResolve$(t),o||K()),e.$onInstanceResolve$(t),e.$onRenderResolve$&&(e.$onRenderResolve$(),e.$onRenderResolve$=void 0),512&e.$flags$&&$e((()=>q(e,!1))),e.$flags$&=-517},K=e=>{G(l.documentElement),$e((()=>U(a,"appload",{detail:{namespace:"deckdeckgo-highlight-code"}})))},V=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(r){ae(r)}},J=(e,t)=>e&&e.then?e.then(t):t(),G=e=>e.classList.add("hydrated"),Q=(e,t,n,r)=>{const o=re(e),i=o.$hostElement$,s=o.$instanceValues$.get(t),a=o.$flags$,l=o.$lazyInstance$;var c,u;c=n,u=r.$members$[t][0],n=null==c||w(c)?c:4&u?"false"!==c&&(""===c||!!c):1&u?String(c):c;const h=Number.isNaN(s)&&Number.isNaN(n);if((!(8&a)||void 0===s)&&(n!==s&&!h)&&(o.$instanceValues$.set(t,n),l)){if(r.$watchers$&&128&a){const e=r.$watchers$[t];e&&e.map((e=>{try{l[e](n,s,t)}catch(r){ae(r,i)}}))}2==(18&a)&&q(o,!1)}},Z=(e,t,n)=>{if(t.$members$){e.watchers&&(t.$watchers$=e.watchers);const r=Object.entries(t.$members$),o=e.prototype;if(r.map((([e,[r]])=>{31&r||2&n&&32&r?Object.defineProperty(o,e,{get(){return t=e,re(this).$instanceValues$.get(t);var t},set(n){Q(this,e,n,t)},configurable:!0,enumerable:!0}):1&n&&64&r&&Object.defineProperty(o,e,{value(...t){const n=re(this);return n.$onInstancePromise$.then((()=>n.$lazyInstance$[e](...t)))}})})),1&n){const n=new Map;o.attributeChangedCallback=function(e,t,r){c.jmp((()=>{const t=n.get(e);if(this.hasOwnProperty(t))r=this[t],delete this[t];else if(o.hasOwnProperty(t)&&"number"==typeof this[t]&&this[t]==r)return;this[t]=(null!==r||"boolean"!=typeof this[t])&&r}))},e.observedAttributes=r.filter((([e,t])=>15&t[0])).map((([e,r])=>{const o=r[1]||e;return n.set(o,e),512&r[0]&&t.$attrsToReflect$.push([e,o]),o}))}}return e},ee=async(e,t,n,r,o)=>{if(0==(32&t.$flags$)){{if(t.$flags$|=32,(o=ce(n)).then){const e=()=>{};o=await o,e()}o.isProxied||(n.$watchers$=o.watchers,Z(o,n,2),o.isProxied=!0);const e=(n.$tagName$,()=>{});t.$flags$|=8;try{new o(t)}catch(a){ae(a)}t.$flags$&=-9,t.$flags$|=128,e()}if(o.style){let e=o.style;const t=b(n);if(!ue.has(t)){const r=(n.$tagName$,()=>{});((e,t,n)=>{let r=ue.get(e);h&&n?(r=r||new CSSStyleSheet,"string"==typeof r?r=t:r.replaceSync(t)):r=t,ue.set(e,r)})(t,e,!!(1&n.$flags$)),r()}}}const i=t.$ancestorComponent$,s=()=>q(t,!0);i&&i["s-rc"]?i["s-rc"].push(s):s()},te=(e,t={})=>{const n=()=>{},r=[],o=t.exclude||[],i=a.customElements,s=l.head,u=s.querySelector("meta[charset]"),h=l.createElement("style"),p=[];let d,m=!0;Object.assign(c,t),c.$resourcesUrl$=new URL(t.resourcesUrl||"./",l.baseURI).href,e.map((e=>{e[1].map((t=>{const n={$flags$:t[0],$tagName$:t[1],$members$:t[2],$listeners$:t[3]};n.$members$=t[2],n.$listeners$=t[3],n.$attrsToReflect$=[],n.$watchers$={};const s=n.$tagName$,a=class extends HTMLElement{constructor(e){super(e),ie(e=this,n),1&n.$flags$&&e.attachShadow({mode:"open"})}connectedCallback(){d&&(clearTimeout(d),d=null),m?p.push(this):c.jmp((()=>(e=>{if(0==(1&c.$flags$)){const t=re(e),n=t.$cmpMeta$,r=(n.$tagName$,()=>{});if(1&t.$flags$)f(e,t,n.$listeners$);else{t.$flags$|=1;{let n=e;for(;n=n.parentNode||n.host;)if(n["s-p"]){z(t,t.$ancestorComponent$=n);break}}n.$members$&&Object.entries(n.$members$).map((([t,[n]])=>{if(31&n&&e.hasOwnProperty(t)){const n=e[t];delete e[t],e[t]=n}})),ee(0,t,n)}r()}})(this)))}disconnectedCallback(){c.jmp((()=>(e=>{if(0==(1&c.$flags$)){const t=re(e);t.$rmListeners$&&(t.$rmListeners$.map((e=>e())),t.$rmListeners$=void 0)}})(this)))}componentOnReady(){return re(this).$onReadyPromise$}};n.$lazyBundleId$=e[0],o.includes(s)||i.get(s)||(r.push(s),i.define(s,Z(a,n,1)))}))})),h.innerHTML=r+"{visibility:hidden}.hydrated{visibility:inherit}",h.setAttribute("data-styles",""),s.insertBefore(h,u?u.nextSibling:s.firstChild),m=!1,p.length?p.map((e=>e.connectedCallback())):c.jmp((()=>d=setTimeout(K,30))),n()},ne=new WeakMap,re=e=>ne.get(e),oe=(e,t)=>ne.set(t.$lazyInstance$=e,t),ie=(e,t)=>{const n={$flags$:0,$hostElement$:e,$cmpMeta$:t,$instanceValues$:new Map};return n.$onInstancePromise$=new Promise((e=>n.$onInstanceResolve$=e)),n.$onReadyPromise$=new Promise((e=>n.$onReadyResolve$=e)),e["s-p"]=[],e["s-rc"]=[],f(e,n,t.$listeners$),ne.set(e,n)},se=(e,t)=>t in e,ae=(e,t)=>(0,console.error)(e,t),le=new Map,ce=(e,t,r)=>{const o=e.$tagName$.replace(/-/g,"_"),i=e.$lazyBundleId$,s=le.get(i);if(s)return s[o];if(!r||!BUILD.hotModuleReplacement){const e=e=>(le.set(i,e),e[o]);if("deckgo-highlight-code_2"===i)return n.e(60).then(n.bind(n,6060)).then(e,ae)}return n(9047)(`./${i}.entry.js`).then((e=>(le.set(i,e),e[o])),ae)},ue=new Map,he=[],fe=[],pe=(e,t)=>n=>{e.push(n),s||(s=!0,t&&4&c.$flags$?$e(me):c.raf(me))},de=e=>{for(let n=0;n<e.length;n++)try{e[n](performance.now())}catch(t){ae(t)}e.length=0},me=()=>{de(he),de(fe),(s=he.length>0)&&c.raf(me)},$e=e=>u().then(e),ye=pe(fe,!0)},9047:function(e,t,n){var r={"./deckgo-highlight-code_2.entry.js":[6060,60]};function o(e){if(!n.o(r,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=r[e],o=t[0];return n.e(t[1]).then((function(){return n(o)}))}o.keys=function(){return Object.keys(r)},o.id=9047,e.exports=o},4852:function(e){"use strict";e.exports=Object.assign},1345:function(e,t,n){"use strict";n.d(t,{Z:function(){return $}});var r=n(7294),o=n(8784);const i=(e,t)=>"undefined"==typeof window?Promise.resolve():(0,o.p)().then((()=>(0,o.b)([["deckgo-highlight-code_2",[[1,"deckgo-highlight-code",{language:[513],highlightLines:[513,"highlight-lines"],lineNumbers:[516,"line-numbers"],terminal:[513],editable:[4],editableLabel:[1,"editable-label"],theme:[513],revealProgress:[1025,"reveal-progress"],themeStyle:[32],loaded:[32],highlightRows:[32],load:[64],reveal:[64],hide:[64],revealAll:[64],hideAll:[64],nextHighlight:[64],prevHighlight:[64]},[[5,"prismLanguageLoaded","onLanguageLoaded"],[5,"prismLanguageError","onLanguageError"]]],[1,"deckgo-highlight-code-edit",{label:[1]}]]]],t)));!function(){if("undefined"!=typeof window&&void 0!==window.Reflect&&void 0!==window.customElements){var e=HTMLElement;window.HTMLElement=function(){return Reflect.construct(e,[],this.constructor)},HTMLElement.prototype=e.prototype,HTMLElement.prototype.constructor=HTMLElement,Object.setPrototypeOf(HTMLElement,e)}}();var s=n(1883);const a=("undefined"!=typeof window?window:{}).localStorage;function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}var c=r.createElement("svg",{viewBox:"-2 -5 14 20",height:"100%",width:"100%",style:{position:"absolute",top:0}},r.createElement("path",{d:"M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12",fill:"#fff",fillRule:"evenodd"})),u=r.createElement("svg",{height:"100%",width:"100%",viewBox:"-2 -5 17 21",style:{position:"absolute",top:0}},r.createElement("path",{d:"M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0",fill:"#fff",fillRule:"evenodd"}));function h(e){if(7===e.length)return e;for(var t="#",n=1;n<4;n+=1)t+=e[n]+e[n];return t}function f(e,t,n,r,o){return function(e,t,n,r,o){var i=(e-n)/(t-n);if(0===i)return r;if(1===i)return o;for(var s="#",a=1;a<6;a+=2){var l=parseInt(r.substr(a,2),16),c=parseInt(o.substr(a,2),16),u=Math.round((1-i)*l+i*c).toString(16);1===u.length&&(u="0"+u),s+=u}return s}(e,t,n,h(r),h(o))}var p=function(e){function t(t){e.call(this,t);var n=t.height,r=t.width,o=t.checked;this.t=t.handleDiameter||n-2,this.i=Math.max(r-n,r-(n+this.t)/2),this.o=Math.max(0,(n-this.t)/2),this.state={h:o?this.i:this.o},this.l=0,this.u=0,this.p=this.p.bind(this),this.v=this.v.bind(this),this.g=this.g.bind(this),this.k=this.k.bind(this),this.m=this.m.bind(this),this.M=this.M.bind(this),this.T=this.T.bind(this),this.$=this.$.bind(this),this.C=this.C.bind(this),this.D=this.D.bind(this),this.O=this.O.bind(this),this.S=this.S.bind(this)}return e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t,t.prototype.componentDidMount=function(){this.W=!0},t.prototype.componentDidUpdate=function(e){e.checked!==this.props.checked&&this.setState({h:this.props.checked?this.i:this.o})},t.prototype.componentWillUnmount=function(){this.W=!1},t.prototype.I=function(e){this.H.focus(),this.setState({R:e,j:!0,B:Date.now()})},t.prototype.L=function(e){var t=this.state,n=t.R,r=t.h,o=(this.props.checked?this.i:this.o)+e-n;t.N||e===n||this.setState({N:!0});var i=Math.min(this.i,Math.max(this.o,o));i!==r&&this.setState({h:i})},t.prototype.U=function(e){var t=this.state,n=t.h,r=t.N,o=t.B,i=this.props.checked,s=(this.i+this.o)/2;this.setState({h:this.props.checked?this.i:this.o});var a=Date.now()-o;(!r||a<250||i&&n<=s||!i&&n>=s)&&this.A(e),this.W&&this.setState({N:!1,j:!1}),this.l=Date.now()},t.prototype.p=function(e){e.preventDefault(),"number"==typeof e.button&&0!==e.button||(this.I(e.clientX),window.addEventListener("mousemove",this.v),window.addEventListener("mouseup",this.g))},t.prototype.v=function(e){e.preventDefault(),this.L(e.clientX)},t.prototype.g=function(e){this.U(e),window.removeEventListener("mousemove",this.v),window.removeEventListener("mouseup",this.g)},t.prototype.k=function(e){this.X=null,this.I(e.touches[0].clientX)},t.prototype.m=function(e){this.L(e.touches[0].clientX)},t.prototype.M=function(e){e.preventDefault(),this.U(e)},t.prototype.$=function(e){Date.now()-this.l>50&&(this.A(e),Date.now()-this.u>50&&this.W&&this.setState({j:!1}))},t.prototype.C=function(){this.u=Date.now()},t.prototype.D=function(){this.setState({j:!0})},t.prototype.O=function(){this.setState({j:!1})},t.prototype.S=function(e){this.H=e},t.prototype.T=function(e){e.preventDefault(),this.H.focus(),this.A(e),this.W&&this.setState({j:!1})},t.prototype.A=function(e){var t=this.props;(0,t.onChange)(!t.checked,e,t.id)},t.prototype.render=function(){var e=this.props,t=e.checked,n=e.disabled,o=e.className,i=e.offColor,s=e.onColor,a=e.offHandleColor,c=e.onHandleColor,u=e.checkedIcon,h=e.uncheckedIcon,p=e.checkedHandleIcon,d=e.uncheckedHandleIcon,m=e.boxShadow,$=e.activeBoxShadow,y=e.height,g=e.width,b=e.borderRadius,v=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&-1===t.indexOf(r)&&(n[r]=e[r]);return n}(e,["checked","disabled","className","offColor","onColor","offHandleColor","onHandleColor","checkedIcon","uncheckedIcon","checkedHandleIcon","uncheckedHandleIcon","boxShadow","activeBoxShadow","height","width","borderRadius","handleDiameter"]),w=this.state,T=w.h,E=w.N,S=w.j,k={position:"relative",display:"inline-block",textAlign:"left",opacity:n?.5:1,direction:"ltr",borderRadius:y/2,WebkitTransition:"opacity 0.25s",MozTransition:"opacity 0.25s",transition:"opacity 0.25s",touchAction:"none",WebkitTapHighlightColor:"rgba(0, 0, 0, 0)",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",userSelect:"none"},C={height:y,width:g,margin:Math.max(0,(this.t-y)/2),position:"relative",background:f(T,this.i,this.o,i,s),borderRadius:"number"==typeof b?b:y/2,cursor:n?"default":"pointer",WebkitTransition:E?null:"background 0.25s",MozTransition:E?null:"background 0.25s",transition:E?null:"background 0.25s"},O={height:y,width:Math.min(1.5*y,g-(this.t+y)/2+1),position:"relative",opacity:(T-this.o)/(this.i-this.o),pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},A={height:y,width:Math.min(1.5*y,g-(this.t+y)/2+1),position:"absolute",opacity:1-(T-this.o)/(this.i-this.o),right:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},j={height:this.t,width:this.t,background:f(T,this.i,this.o,a,c),display:"inline-block",cursor:n?"default":"pointer",borderRadius:"number"==typeof b?b-1:"50%",position:"absolute",transform:"translateX("+T+"px)",top:Math.max(0,(y-this.t)/2),outline:0,boxShadow:S?$:m,border:0,WebkitTransition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",MozTransition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",transition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s"},L={height:this.t,width:this.t,opacity:Math.max(2*(1-(T-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},x={height:this.t,width:this.t,opacity:Math.max(2*((T-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"};return r.createElement("div",{className:o,style:k},r.createElement("div",{className:"react-switch-bg",style:C,onClick:n?null:this.T,onMouseDown:function(e){return e.preventDefault()}},u&&r.createElement("div",{style:O},u),h&&r.createElement("div",{style:A},h)),r.createElement("div",{className:"react-switch-handle",style:j,onClick:function(e){return e.preventDefault()},onMouseDown:n?null:this.p,onTouchStart:n?null:this.k,onTouchMove:n?null:this.m,onTouchEnd:n?null:this.M,onTouchCancel:n?null:this.O},d&&r.createElement("div",{style:L},d),p&&r.createElement("div",{style:x},p)),r.createElement("input",l({},{type:"checkbox",role:"switch","aria-checked":t,checked:t,disabled:n,style:{border:0,clip:"rect(0 0 0 0)",height:1,margin:-1,overflow:"hidden",padding:0,position:"absolute",width:1}},v,{ref:this.S,onFocus:this.D,onBlur:this.O,onKeyUp:this.C,onChange:this.$})))},t}(r.Component);p.defaultProps={disabled:!1,offColor:"#888",onColor:"#080",offHandleColor:"#fff",onHandleColor:"#fff",uncheckedIcon:c,checkedIcon:u,boxShadow:null,activeBoxShadow:"0 0 2px 3px #3bf",height:28,width:56};var d=function(){const e="isFlickering",{getItem:t,setItem:n}={getItem:e=>{const t=null==a?void 0:a.getItem(e);if(t)return JSON.parse(t)},setItem:(e,t)=>{null==a||a.setItem(e,JSON.stringify(t))}},{0:o,1:i}=(0,r.useState)(!1),{0:l,1:c}=(0,r.useState)(!1);return(0,r.useEffect)((()=>{c(t(e)),i(!0)}),[]),r.createElement("header",{className:"global-header"},r.createElement("div",{className:"header-neon"},r.createElement(s.Link,{to:"/"},r.createElement("b",null,"Ju",r.createElement("span",{className:!l&&"off"},"Heon"),"'s ",r.createElement("span",{className:!l&&"off"},"Dev")))),r.createElement("div",{className:"header-switch"},o&&r.createElement(p,{onChange:()=>{c(!l),n(e,!l)},checked:l,checkedIcon:r.createElement("span",{className:"header-switch__text left"},"off"),uncheckedIcon:r.createElement("span",{className:"header-switch__text right"},"on"),onColor:"#6282e3"})))},m=n(4593);var $=e=>{let{location:t,title:n,children:o}=e;return i(),r.createElement("div",{className:"global-wrapper"},r.createElement(m.q,null,r.createElement("meta",{name:"google-site-verification",content:"ipkpV-iikKXN2GXEGSSXzjz8hakoFDcOsS6QCUUvS18"})),r.createElement(d,null),r.createElement("main",null,o),r.createElement("footer",{className:"global-footer"},"© ",r.createElement("a",{href:"https://github.com/hjhj97"},"Neon"),", Built with"," ",r.createElement("a",{href:"https://www.gatsbyjs.com"},"Gatsby")))}},9357:function(e,t,n){"use strict";var r=n(7294),o=n(1883);t.Z=e=>{var t,n,i;let{description:s,title:a,children:l}=e;const{site:c}=(0,o.useStaticQuery)("2841359383"),u=s||c.siteMetadata.description,h=null===(t=c.siteMetadata)||void 0===t?void 0:t.title;return r.createElement(r.Fragment,null,r.createElement("title",null,h?a+" | "+h:a),r.createElement("meta",{name:"description",content:u}),r.createElement("meta",{property:"og:title",content:a}),r.createElement("meta",{property:"og:description",content:u}),r.createElement("meta",{property:"og:type",content:"website"}),r.createElement("meta",{property:"og:site_name",content:"하주헌 개발 블로그"}),r.createElement("meta",{name:"twitter:card",content:"summary"}),r.createElement("meta",{name:"twitter:creator",content:(null===(n=c.siteMetadata)||void 0===n||null===(i=n.social)||void 0===i?void 0:i.twitter)||""}),r.createElement("meta",{name:"twitter:title",content:a}),r.createElement("meta",{name:"twitter:description",content:u}),r.createElement("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify({"@context":"https://schema.org","@type":"Website",name:"하주헌 개발 블로그",url:"https://juheon.dev"})}}),l)}},9590:function(e){var t="undefined"!=typeof Element,n="function"==typeof Map,r="function"==typeof Set,o="function"==typeof ArrayBuffer&&!!ArrayBuffer.isView;function i(e,s){if(e===s)return!0;if(e&&s&&"object"==typeof e&&"object"==typeof s){if(e.constructor!==s.constructor)return!1;var a,l,c,u;if(Array.isArray(e)){if((a=e.length)!=s.length)return!1;for(l=a;0!=l--;)if(!i(e[l],s[l]))return!1;return!0}if(n&&e instanceof Map&&s instanceof Map){if(e.size!==s.size)return!1;for(u=e.entries();!(l=u.next()).done;)if(!s.has(l.value[0]))return!1;for(u=e.entries();!(l=u.next()).done;)if(!i(l.value[1],s.get(l.value[0])))return!1;return!0}if(r&&e instanceof Set&&s instanceof Set){if(e.size!==s.size)return!1;for(u=e.entries();!(l=u.next()).done;)if(!s.has(l.value[0]))return!1;return!0}if(o&&ArrayBuffer.isView(e)&&ArrayBuffer.isView(s)){if((a=e.length)!=s.length)return!1;for(l=a;0!=l--;)if(e[l]!==s[l])return!1;return!0}if(e.constructor===RegExp)return e.source===s.source&&e.flags===s.flags;if(e.valueOf!==Object.prototype.valueOf&&"function"==typeof e.valueOf&&"function"==typeof s.valueOf)return e.valueOf()===s.valueOf();if(e.toString!==Object.prototype.toString&&"function"==typeof e.toString&&"function"==typeof s.toString)return e.toString()===s.toString();if((a=(c=Object.keys(e)).length)!==Object.keys(s).length)return!1;for(l=a;0!=l--;)if(!Object.prototype.hasOwnProperty.call(s,c[l]))return!1;if(t&&e instanceof Element)return!1;for(l=a;0!=l--;)if(("_owner"!==c[l]&&"__v"!==c[l]&&"__o"!==c[l]||!e.$$typeof)&&!i(e[c[l]],s[c[l]]))return!1;return!0}return e!=e&&s!=s}e.exports=function(e,t){try{return i(e,t)}catch(n){if((n.message||"").match(/stack|recursion/i))return console.warn("react-fast-compare cannot handle circular refs"),!1;throw n}}},4593:function(e,t,n){"use strict";n.d(t,{q:function(){return pe}});var r,o,i,s,a=n(5697),l=n.n(a),c=n(3524),u=n.n(c),h=n(9590),f=n.n(h),p=n(7294),d=n(4852),m=n.n(d),$="bodyAttributes",y="htmlAttributes",g="titleAttributes",b={BASE:"base",BODY:"body",HEAD:"head",HTML:"html",LINK:"link",META:"meta",NOSCRIPT:"noscript",SCRIPT:"script",STYLE:"style",TITLE:"title"},v=(Object.keys(b).map((function(e){return b[e]})),"charset"),w="cssText",T="href",E="http-equiv",S="innerHTML",k="itemprop",C="name",O="property",A="rel",j="src",L="target",x={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},M="defaultTitle",N="defer",I="encodeSpecialCharacters",P="onChangeClientState",R="titleTemplate",D=Object.keys(x).reduce((function(e,t){return e[x[t]]=t,e}),{}),H=[b.NOSCRIPT,b.SCRIPT,b.STYLE],_="data-react-helmet",B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},U=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),z=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},q=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n},W=function(e){return!1===(!(arguments.length>1&&void 0!==arguments[1])||arguments[1])?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")},F=function(e){var t=J(e,b.TITLE),n=J(e,R);if(n&&t)return n.replace(/%s/g,(function(){return Array.isArray(t)?t.join(""):t}));var r=J(e,M);return t||r||void 0},Y=function(e){return J(e,P)||function(){}},X=function(e,t){return t.filter((function(t){return void 0!==t[e]})).map((function(t){return t[e]})).reduce((function(e,t){return z({},e,t)}),{})},K=function(e,t){return t.filter((function(e){return void 0!==e[b.BASE]})).map((function(e){return e[b.BASE]})).reverse().reduce((function(t,n){if(!t.length)for(var r=Object.keys(n),o=0;o<r.length;o++){var i=r[o].toLowerCase();if(-1!==e.indexOf(i)&&n[i])return t.concat(n)}return t}),[])},V=function(e,t,n){var r={};return n.filter((function(t){return!!Array.isArray(t[e])||(void 0!==t[e]&&te("Helmet: "+e+' should be of type "Array". Instead found type "'+B(t[e])+'"'),!1)})).map((function(t){return t[e]})).reverse().reduce((function(e,n){var o={};n.filter((function(e){for(var n=void 0,i=Object.keys(e),s=0;s<i.length;s++){var a=i[s],l=a.toLowerCase();-1===t.indexOf(l)||n===A&&"canonical"===e[n].toLowerCase()||l===A&&"stylesheet"===e[l].toLowerCase()||(n=l),-1===t.indexOf(a)||a!==S&&a!==w&&a!==k||(n=a)}if(!n||!e[n])return!1;var c=e[n].toLowerCase();return r[n]||(r[n]={}),o[n]||(o[n]={}),!r[n][c]&&(o[n][c]=!0,!0)})).reverse().forEach((function(t){return e.push(t)}));for(var i=Object.keys(o),s=0;s<i.length;s++){var a=i[s],l=m()({},r[a],o[a]);r[a]=l}return e}),[]).reverse()},J=function(e,t){for(var n=e.length-1;n>=0;n--){var r=e[n];if(r.hasOwnProperty(t))return r[t]}return null},G=(r=Date.now(),function(e){var t=Date.now();t-r>16?(r=t,e(t)):setTimeout((function(){G(e)}),0)}),Q=function(e){return clearTimeout(e)},Z="undefined"!=typeof window?window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||G:n.g.requestAnimationFrame||G,ee="undefined"!=typeof window?window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||Q:n.g.cancelAnimationFrame||Q,te=function(e){return console&&"function"==typeof console.warn&&console.warn(e)},ne=null,re=function(e,t){var n=e.baseTag,r=e.bodyAttributes,o=e.htmlAttributes,i=e.linkTags,s=e.metaTags,a=e.noscriptTags,l=e.onChangeClientState,c=e.scriptTags,u=e.styleTags,h=e.title,f=e.titleAttributes;se(b.BODY,r),se(b.HTML,o),ie(h,f);var p={baseTag:ae(b.BASE,n),linkTags:ae(b.LINK,i),metaTags:ae(b.META,s),noscriptTags:ae(b.NOSCRIPT,a),scriptTags:ae(b.SCRIPT,c),styleTags:ae(b.STYLE,u)},d={},m={};Object.keys(p).forEach((function(e){var t=p[e],n=t.newTags,r=t.oldTags;n.length&&(d[e]=n),r.length&&(m[e]=p[e].oldTags)})),t&&t(),l(e,d,m)},oe=function(e){return Array.isArray(e)?e.join(""):e},ie=function(e,t){void 0!==e&&document.title!==e&&(document.title=oe(e)),se(b.TITLE,t)},se=function(e,t){var n=document.getElementsByTagName(e)[0];if(n){for(var r=n.getAttribute(_),o=r?r.split(","):[],i=[].concat(o),s=Object.keys(t),a=0;a<s.length;a++){var l=s[a],c=t[l]||"";n.getAttribute(l)!==c&&n.setAttribute(l,c),-1===o.indexOf(l)&&o.push(l);var u=i.indexOf(l);-1!==u&&i.splice(u,1)}for(var h=i.length-1;h>=0;h--)n.removeAttribute(i[h]);o.length===i.length?n.removeAttribute(_):n.getAttribute(_)!==s.join(",")&&n.setAttribute(_,s.join(","))}},ae=function(e,t){var n=document.head||document.querySelector(b.HEAD),r=n.querySelectorAll(e+"["+_+"]"),o=Array.prototype.slice.call(r),i=[],s=void 0;return t&&t.length&&t.forEach((function(t){var n=document.createElement(e);for(var r in t)if(t.hasOwnProperty(r))if(r===S)n.innerHTML=t.innerHTML;else if(r===w)n.styleSheet?n.styleSheet.cssText=t.cssText:n.appendChild(document.createTextNode(t.cssText));else{var a=void 0===t[r]?"":t[r];n.setAttribute(r,a)}n.setAttribute(_,"true"),o.some((function(e,t){return s=t,n.isEqualNode(e)}))?o.splice(s,1):i.push(n)})),o.forEach((function(e){return e.parentNode.removeChild(e)})),i.forEach((function(e){return n.appendChild(e)})),{oldTags:o,newTags:i}},le=function(e){return Object.keys(e).reduce((function(t,n){var r=void 0!==e[n]?n+'="'+e[n]+'"':""+n;return t?t+" "+r:r}),"")},ce=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,n){return t[x[n]||n]=e[n],t}),t)},ue=function(e,t,n){switch(e){case b.TITLE:return{toComponent:function(){return e=t.title,n=t.titleAttributes,(r={key:e})[_]=!0,o=ce(n,r),[p.createElement(b.TITLE,o,e)];var e,n,r,o},toString:function(){return function(e,t,n,r){var o=le(n),i=oe(t);return o?"<"+e+" "+_+'="true" '+o+">"+W(i,r)+"</"+e+">":"<"+e+" "+_+'="true">'+W(i,r)+"</"+e+">"}(e,t.title,t.titleAttributes,n)}};case $:case y:return{toComponent:function(){return ce(t)},toString:function(){return le(t)}};default:return{toComponent:function(){return function(e,t){return t.map((function(t,n){var r,o=((r={key:n})[_]=!0,r);return Object.keys(t).forEach((function(e){var n=x[e]||e;if(n===S||n===w){var r=t.innerHTML||t.cssText;o.dangerouslySetInnerHTML={__html:r}}else o[n]=t[e]})),p.createElement(e,o)}))}(e,t)},toString:function(){return function(e,t,n){return t.reduce((function(t,r){var o=Object.keys(r).filter((function(e){return!(e===S||e===w)})).reduce((function(e,t){var o=void 0===r[t]?t:t+'="'+W(r[t],n)+'"';return e?e+" "+o:o}),""),i=r.innerHTML||r.cssText||"",s=-1===H.indexOf(e);return t+"<"+e+" "+_+'="true" '+o+(s?"/>":">"+i+"</"+e+">")}),"")}(e,t,n)}}}},he=function(e){var t=e.baseTag,n=e.bodyAttributes,r=e.encode,o=e.htmlAttributes,i=e.linkTags,s=e.metaTags,a=e.noscriptTags,l=e.scriptTags,c=e.styleTags,u=e.title,h=void 0===u?"":u,f=e.titleAttributes;return{base:ue(b.BASE,t,r),bodyAttributes:ue($,n,r),htmlAttributes:ue(y,o,r),link:ue(b.LINK,i,r),meta:ue(b.META,s,r),noscript:ue(b.NOSCRIPT,a,r),script:ue(b.SCRIPT,l,r),style:ue(b.STYLE,c,r),title:ue(b.TITLE,{title:h,titleAttributes:f},r)}},fe=u()((function(e){return{baseTag:K([T,L],e),bodyAttributes:X($,e),defer:J(e,N),encode:J(e,I),htmlAttributes:X(y,e),linkTags:V(b.LINK,[A,T],e),metaTags:V(b.META,[C,v,E,O,k],e),noscriptTags:V(b.NOSCRIPT,[S],e),onChangeClientState:Y(e),scriptTags:V(b.SCRIPT,[j,S],e),styleTags:V(b.STYLE,[w],e),title:F(e),titleAttributes:X(g,e)}}),(function(e){ne&&ee(ne),e.defer?ne=Z((function(){re(e,(function(){ne=null}))})):(re(e),ne=null)}),he)((function(){return null})),pe=(o=fe,s=i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.shouldComponentUpdate=function(e){return!f()(this.props,e)},t.prototype.mapNestedChildrenToProps=function(e,t){if(!t)return null;switch(e.type){case b.SCRIPT:case b.NOSCRIPT:return{innerHTML:t};case b.STYLE:return{cssText:t}}throw new Error("<"+e.type+" /> elements are self-closing and can not contain children. Refer to our API for more information.")},t.prototype.flattenArrayTypeChildren=function(e){var t,n=e.child,r=e.arrayTypeChildren,o=e.newChildProps,i=e.nestedChildren;return z({},r,((t={})[n.type]=[].concat(r[n.type]||[],[z({},o,this.mapNestedChildrenToProps(n,i))]),t))},t.prototype.mapObjectTypeChildren=function(e){var t,n,r=e.child,o=e.newProps,i=e.newChildProps,s=e.nestedChildren;switch(r.type){case b.TITLE:return z({},o,((t={})[r.type]=s,t.titleAttributes=z({},i),t));case b.BODY:return z({},o,{bodyAttributes:z({},i)});case b.HTML:return z({},o,{htmlAttributes:z({},i)})}return z({},o,((n={})[r.type]=z({},i),n))},t.prototype.mapArrayTypeChildrenToProps=function(e,t){var n=z({},t);return Object.keys(e).forEach((function(t){var r;n=z({},n,((r={})[t]=e[t],r))})),n},t.prototype.warnOnInvalidChildren=function(e,t){return!0},t.prototype.mapChildrenToProps=function(e,t){var n=this,r={};return p.Children.forEach(e,(function(e){if(e&&e.props){var o=e.props,i=o.children,s=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,n){return t[D[n]||n]=e[n],t}),t)}(q(o,["children"]));switch(n.warnOnInvalidChildren(e,i),e.type){case b.LINK:case b.META:case b.NOSCRIPT:case b.SCRIPT:case b.STYLE:r=n.flattenArrayTypeChildren({child:e,arrayTypeChildren:r,newChildProps:s,nestedChildren:i});break;default:t=n.mapObjectTypeChildren({child:e,newProps:t,newChildProps:s,nestedChildren:i})}}})),t=this.mapArrayTypeChildrenToProps(r,t)},t.prototype.render=function(){var e=this.props,t=e.children,n=q(e,["children"]),r=z({},n);return t&&(r=this.mapChildrenToProps(t,r)),p.createElement(o,r)},U(t,null,[{key:"canUseDOM",set:function(e){o.canUseDOM=e}}]),t}(p.Component),i.propTypes={base:l().object,bodyAttributes:l().object,children:l().oneOfType([l().arrayOf(l().node),l().node]),defaultTitle:l().string,defer:l().bool,encodeSpecialCharacters:l().bool,htmlAttributes:l().object,link:l().arrayOf(l().object),meta:l().arrayOf(l().object),noscript:l().arrayOf(l().object),onChangeClientState:l().func,script:l().arrayOf(l().object),style:l().arrayOf(l().object),title:l().string,titleAttributes:l().object,titleTemplate:l().string},i.defaultProps={defer:!0,encodeSpecialCharacters:!0},i.peek=o.peek,i.rewind=function(){var e=o.rewind();return e||(e=he({baseTag:[],bodyAttributes:{},encodeSpecialCharacters:!0,htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}})),e},s);pe.renderStatic=pe.rewind},3524:function(e,t,n){"use strict";var r,o=n(7294),i=(r=o)&&"object"==typeof r&&"default"in r?r.default:r;function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a=!("undefined"==typeof window||!window.document||!window.document.createElement);e.exports=function(e,t,n){if("function"!=typeof e)throw new Error("Expected reducePropsToState to be a function.");if("function"!=typeof t)throw new Error("Expected handleStateChangeOnClient to be a function.");if(void 0!==n&&"function"!=typeof n)throw new Error("Expected mapStateOnServer to either be undefined or a function.");return function(r){if("function"!=typeof r)throw new Error("Expected WrappedComponent to be a React component.");var l,c=[];function u(){l=e(c.map((function(e){return e.props}))),h.canUseDOM?t(l):n&&(l=n(l))}var h=function(e){var t,n;function o(){return e.apply(this,arguments)||this}n=e,(t=o).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,o.peek=function(){return l},o.rewind=function(){if(o.canUseDOM)throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");var e=l;return l=void 0,c=[],e};var s=o.prototype;return s.UNSAFE_componentWillMount=function(){c.push(this),u()},s.componentDidUpdate=function(){u()},s.componentWillUnmount=function(){var e=c.indexOf(this);c.splice(e,1),u()},s.render=function(){return i.createElement(r,this.props)},o}(o.PureComponent);return s(h,"displayName","SideEffect("+function(e){return e.displayName||e.name||"Component"}(r)+")"),s(h,"canUseDOM",a),h}}}}]);
//# sourceMappingURL=commons-ce0e76ab1e58f559d904.js.map