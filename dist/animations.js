!function(e){function n(n){for(var r,a,o=n[0],i=n[1],c=n[2],l=0,u=[];l<o.length;l++)a=o[l],Object.prototype.hasOwnProperty.call(x,a)&&x[a]&&u.push(x[a][0]),x[a]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);for(q&&q(n);u.length;)u.shift()();return F.push.apply(F,c||[]),t()}function t(){for(var e,n=0;n<F.length;n++){for(var t=F[n],r=!0,a=1;a<t.length;a++){var o=t[a];0!==x[o]&&(r=!1)}r&&(F.splice(n--,1),e=H(H.s=t[0]))}return e}var r=window.webpackHotUpdate;window.webpackHotUpdate=function(e,n){!function(e,n){if(!w[e]||!E[e])return;for(var t in E[e]=!1,n)Object.prototype.hasOwnProperty.call(n,t)&&(h[t]=n[t]);0==--y&&0===g&&S()}(e,n),r&&r(e,n)};var a,o=!0,i="bbea46f76fb17eda76a2",c={},l=[],u=[];function s(e){var n={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],_main:a!==e,active:!0,accept:function(e,t){if(void 0===e)n._selfAccepted=!0;else if("function"==typeof e)n._selfAccepted=e;else if("object"==typeof e)for(var r=0;r<e.length;r++)n._acceptedDependencies[e[r]]=t||function(){};else n._acceptedDependencies[e]=t||function(){}},decline:function(e){if(void 0===e)n._selfDeclined=!0;else if("object"==typeof e)for(var t=0;t<e.length;t++)n._declinedDependencies[e[t]]=!0;else n._declinedDependencies[e]=!0},dispose:function(e){n._disposeHandlers.push(e)},addDisposeHandler:function(e){n._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=n._disposeHandlers.indexOf(e);t>=0&&n._disposeHandlers.splice(t,1)},check:A,apply:j,status:function(e){if(!e)return d;f.push(e)},addStatusHandler:function(e){f.push(e)},removeStatusHandler:function(e){var n=f.indexOf(e);n>=0&&f.splice(n,1)},data:c[e]};return a=void 0,n}var f=[],d="idle";function p(e){d=e;for(var n=0;n<f.length;n++)f[n].call(null,e)}var m,h,v,y=0,g=0,b={},E={},w={};function O(e){return+e+""===e?+e:e}function A(e){if("idle"!==d)throw new Error("check() is only allowed in idle status");return o=e,p("check"),(n=1e4,n=n||1e4,new Promise((function(e,t){if("undefined"==typeof XMLHttpRequest)return t(new Error("No browser support"));try{var r=new XMLHttpRequest,a=H.p+""+i+".hot-update.json";r.open("GET",a,!0),r.timeout=n,r.send(null)}catch(e){return t(e)}r.onreadystatechange=function(){if(4===r.readyState)if(0===r.status)t(new Error("Manifest request to "+a+" timed out."));else if(404===r.status)e();else if(200!==r.status&&304!==r.status)t(new Error("Manifest request to "+a+" failed."));else{try{var n=JSON.parse(r.responseText)}catch(e){return void t(e)}e(n)}}}))).then((function(e){if(!e)return p("idle"),null;E={},b={},w=e.c,v=e.h,p("prepare");var n=new Promise((function(e,n){m={resolve:e,reject:n}}));for(var t in h={},x)D(t);return"prepare"===d&&0===g&&0===y&&S(),n}));var n}function D(e){w[e]?(E[e]=!0,y++,function(e){var n=document.createElement("script");n.charset="utf-8",n.src=H.p+""+e+"."+i+".hot-update.js",document.head.appendChild(n)}(e)):b[e]=!0}function S(){p("ready");var e=m;if(m=null,e)if(o)Promise.resolve().then((function(){return j(o)})).then((function(n){e.resolve(n)}),(function(n){e.reject(n)}));else{var n=[];for(var t in h)Object.prototype.hasOwnProperty.call(h,t)&&n.push(O(t));e.resolve(n)}}function j(n){if("ready"!==d)throw new Error("apply() is only allowed in ready status");var t,r,a,o,u;function s(e){for(var n=[e],t={},r=n.map((function(e){return{chain:[e],id:e}}));r.length>0;){var a=r.pop(),i=a.id,c=a.chain;if((o=_[i])&&!o.hot._selfAccepted){if(o.hot._selfDeclined)return{type:"self-declined",chain:c,moduleId:i};if(o.hot._main)return{type:"unaccepted",chain:c,moduleId:i};for(var l=0;l<o.parents.length;l++){var u=o.parents[l],s=_[u];if(s){if(s.hot._declinedDependencies[i])return{type:"declined",chain:c.concat([u]),moduleId:i,parentId:u};-1===n.indexOf(u)&&(s.hot._acceptedDependencies[i]?(t[u]||(t[u]=[]),f(t[u],[i])):(delete t[u],n.push(u),r.push({chain:c.concat([u]),id:u})))}}}}return{type:"accepted",moduleId:e,outdatedModules:n,outdatedDependencies:t}}function f(e,n){for(var t=0;t<n.length;t++){var r=n[t];-1===e.indexOf(r)&&e.push(r)}}n=n||{};var m={},y=[],g={},b=function(){console.warn("[HMR] unexpected require("+A.moduleId+") to disposed module")};for(var E in h)if(Object.prototype.hasOwnProperty.call(h,E)){var A;u=O(E);var D=!1,S=!1,j=!1,F="";switch((A=h[E]?s(u):{type:"disposed",moduleId:E}).chain&&(F="\nUpdate propagation: "+A.chain.join(" -> ")),A.type){case"self-declined":n.onDeclined&&n.onDeclined(A),n.ignoreDeclined||(D=new Error("Aborted because of self decline: "+A.moduleId+F));break;case"declined":n.onDeclined&&n.onDeclined(A),n.ignoreDeclined||(D=new Error("Aborted because of declined dependency: "+A.moduleId+" in "+A.parentId+F));break;case"unaccepted":n.onUnaccepted&&n.onUnaccepted(A),n.ignoreUnaccepted||(D=new Error("Aborted because "+u+" is not accepted"+F));break;case"accepted":n.onAccepted&&n.onAccepted(A),S=!0;break;case"disposed":n.onDisposed&&n.onDisposed(A),j=!0;break;default:throw new Error("Unexception type "+A.type)}if(D)return p("abort"),Promise.reject(D);if(S)for(u in g[u]=h[u],f(y,A.outdatedModules),A.outdatedDependencies)Object.prototype.hasOwnProperty.call(A.outdatedDependencies,u)&&(m[u]||(m[u]=[]),f(m[u],A.outdatedDependencies[u]));j&&(f(y,[A.moduleId]),g[u]=b)}var T,k=[];for(r=0;r<y.length;r++)u=y[r],_[u]&&_[u].hot._selfAccepted&&g[u]!==b&&k.push({module:u,errorHandler:_[u].hot._selfAccepted});p("dispose"),Object.keys(w).forEach((function(e){!1===w[e]&&function(e){delete x[e]}(e)}));for(var P,q,L=y.slice();L.length>0;)if(u=L.pop(),o=_[u]){var R={},I=o.hot._disposeHandlers;for(a=0;a<I.length;a++)(t=I[a])(R);for(c[u]=R,o.hot.active=!1,delete _[u],delete m[u],a=0;a<o.children.length;a++){var M=_[o.children[a]];M&&((T=M.parents.indexOf(u))>=0&&M.parents.splice(T,1))}}for(u in m)if(Object.prototype.hasOwnProperty.call(m,u)&&(o=_[u]))for(q=m[u],a=0;a<q.length;a++)P=q[a],(T=o.children.indexOf(P))>=0&&o.children.splice(T,1);for(u in p("apply"),i=v,g)Object.prototype.hasOwnProperty.call(g,u)&&(e[u]=g[u]);var N=null;for(u in m)if(Object.prototype.hasOwnProperty.call(m,u)&&(o=_[u])){q=m[u];var C=[];for(r=0;r<q.length;r++)if(P=q[r],t=o.hot._acceptedDependencies[P]){if(-1!==C.indexOf(t))continue;C.push(t)}for(r=0;r<C.length;r++){t=C[r];try{t(q)}catch(e){n.onErrored&&n.onErrored({type:"accept-errored",moduleId:u,dependencyId:q[r],error:e}),n.ignoreErrored||N||(N=e)}}}for(r=0;r<k.length;r++){var B=k[r];u=B.module,l=[u];try{H(u)}catch(e){if("function"==typeof B.errorHandler)try{B.errorHandler(e)}catch(t){n.onErrored&&n.onErrored({type:"self-accept-error-handler-errored",moduleId:u,error:t,originalError:e}),n.ignoreErrored||N||(N=t),N||(N=e)}else n.onErrored&&n.onErrored({type:"self-accept-errored",moduleId:u,error:e}),n.ignoreErrored||N||(N=e)}}return N?(p("fail"),Promise.reject(N)):(p("idle"),new Promise((function(e){e(y)})))}var _={},x={1:0},F=[];function H(n){if(_[n])return _[n].exports;var t=_[n]={i:n,l:!1,exports:{},hot:s(n),parents:(u=l,l=[],u),children:[]};return e[n].call(t.exports,t,t.exports,function(e){var n=_[e];if(!n)return H;var t=function(t){return n.hot.active?(_[t]?-1===_[t].parents.indexOf(e)&&_[t].parents.push(e):(l=[e],a=t),-1===n.children.indexOf(t)&&n.children.push(t)):(console.warn("[HMR] unexpected require("+t+") from disposed module "+e),l=[]),H(t)},r=function(e){return{configurable:!0,enumerable:!0,get:function(){return H[e]},set:function(n){H[e]=n}}};for(var o in H)Object.prototype.hasOwnProperty.call(H,o)&&"e"!==o&&"t"!==o&&Object.defineProperty(t,o,r(o));return t.e=function(e){return"ready"===d&&p("prepare"),g++,H.e(e).then(n,(function(e){throw n(),e}));function n(){g--,"prepare"===d&&(b[e]||D(e),0===g&&0===y&&S())}},t.t=function(e,n){return 1&n&&(e=t(e)),H.t(e,-2&n)},t}(n)),t.l=!0,t.exports}H.m=e,H.c=_,H.d=function(e,n,t){H.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},H.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},H.t=function(e,n){if(1&n&&(e=H(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(H.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)H.d(t,r,function(n){return e[n]}.bind(null,r));return t},H.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return H.d(n,"a",n),n},H.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},H.p="/br-experiments/dist/",H.h=function(){return i};var T=window.webpackJsonp=window.webpackJsonp||[],k=T.push.bind(T);T.push=n,T=T.slice();for(var P=0;P<T.length;P++)n(T[P]);var q=k;F.push([211,0]),t()}({211:function(e,n,t){t(42),e.exports=t(434)},434:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),o=t(8);function i(e,n,t,r,a,o,i){try{var c=e[o](i),l=c.value}catch(e){return void t(e)}c.done?n(l):Promise.resolve(l).then(r,a)}function c(e){return function(){var n=this,t=arguments;return new Promise((function(r,a){var o=e.apply(n,t);function c(e){i(o,r,a,c,l,"next",e)}function l(e){i(o,r,a,c,l,"throw",e)}c(void 0)}))}}function l(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if(!(Symbol.iterator in Object(e))&&"[object Arguments]"!==Object.prototype.toString.call(e))return;var t=[],r=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function u(e){var n=e.svgUrl,t=e.svgHolderRef,a=e.onAppend,o=l(r.useState(!1),2),i=o[0],u=o[1];function s(){return(s=c(regeneratorRuntime.mark((function e(){var r,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(n);case 2:return r=e.sent,e.next=5,r.text();case 5:o=e.sent,t.current&&(t.current.innerHTML=o,(i=t.current.querySelector("svg")).removeAttribute("width"),i.removeAttribute("height"),a&&a(i),u(!0));case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return r.useEffect((function(){!function(){s.apply(this,arguments)}()}),[]),i}function s(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return"\n@keyframes ".concat(e," {\n  from {\n    ").concat(n,"\n  }\n  to {\n    ").concat(t,"\n  }\n}\n")}function f(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function d(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function p(e,n,t){return function(r){r.preventDefault(),n(function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?f(Object(t),!0).forEach((function(n){d(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}({},e,d({},t,r.target.value)))}}function m(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if(!(Symbol.iterator in Object(e))&&"[object Arguments]"!==Object.prototype.toString.call(e))return;var t=[],r=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function h(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.2,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,a=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];Array.isArray(e)||(e=[e]);var o=[],i="",c=[],l="".concat(n,"_animation"),u=s(l,"\n  opacity: 0;\n      ","\n  opacity: 1;\n      ");return i+="\n"+u,e.forEach((function(e,u){var s="".concat(n,"_item_").concat(u),f="\n.".concat(s," {\n  animation: ").concat(l," ").concat(t,"s linear;\n  animation-delay: ").concat(r,"s;\n  animation-fill-mode: forwards;\n  opacity: 0;\n}");i+="\n"+f,c.push({el:e,className:s}),o.push(r),a&&(r+=t)})),{css:i,animElements:c,offset:r,offsets:o}}function v(e,n,t,r){return h([e.querySelector("#SHEFFIELD-text"),e.querySelector("#swish-white")],n,t,r,!1)}function y(e){return function(e){if(Array.isArray(e)){for(var n=0,t=new Array(e.length);n<e.length;n++)t[n]=e[n];return t}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function g(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if(!(Symbol.iterator in Object(e))&&"[object Arguments]"!==Object.prototype.toString.call(e))return;var t=[],r=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function b(e){return function(e){if(Array.isArray(e)){for(var n=0,t=new Array(e.length);n<e.length;n++)t[n]=e[n];return t}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function E(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if(!(Symbol.iterator in Object(e))&&"[object Arguments]"!==Object.prototype.toString.call(e))return;var t=[],r=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function w(e){return function(e){if(Array.isArray(e)){for(var n=0,t=new Array(e.length);n<e.length;n++)t[n]=e[n];return t}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function O(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if(!(Symbol.iterator in Object(e))&&"[object Arguments]"!==Object.prototype.toString.call(e))return;var t=[],r=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function A(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if(!(Symbol.iterator in Object(e))&&"[object Arguments]"!==Object.prototype.toString.call(e))return;var t=[],r=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var D=[{parent:null,title:"Draw letters 1",description:"Fade-in and stroke Bladerunner logo letters, then fade in the 'swish'.",component:function(e){var n=e.id,t=e.reRenderToken,a=g(r.useState({letterDuration:"0.2",swishFadeDuration:"1"}),2),o=a[0],i=a[1];console.log("render",t);var c=r.useRef(),l=r.useRef(),f=u({svgUrl:"../img/ty/Bladerunners-original-logo.svg",svgHolderRef:l});function d(e){var t=[],r=c.current;r.innerHTML="";var a=parseFloat(o.letterDuration),i=function(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.2,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;Array.isArray(e)||(e=[e]);var a=[],o="",i=[];return e.forEach((function(e,c){var l=e.getTotalLength(),u="".concat(n,"_item_").concat(c),f="".concat(n,"_animation_").concat(c),d=s(f,"\nstroke-dashoffset: -".concat(l,";\nopacity: 0;\n    "),"\nstroke-dashoffset: 0;\nopacity: 1;\n    "),p="\n.".concat(u," {\n  stroke-dasharray: ").concat(l,";\n  animation: ").concat(f," ").concat(t,"s linear;\n  animation-delay: ").concat(r,"s;\n  animation-fill-mode: forwards;\n  opacity: 0;\n}");o+="\n"+d+"\n"+p,i.push({el:e,className:u}),a.push(r),r+=t})),{css:o,animElements:i,offset:r,offsets:a}}(Array.from(e.querySelectorAll("#Bladerunners-text-black path")),"".concat(n,"_black_letters"),a),l=i.css,u=i.animElements,f=i.offset;r.innerHTML+="\n"+l,t.push.apply(t,y(u));var d=h(Array.from(e.querySelectorAll("#Bladerunners-text-white path")),"".concat(n,"_white_letters"),a),p=d.css,m=d.animElements;r.innerHTML+="\n"+p,t.push.apply(t,y(m));var g=v(e,"".concat(n,"_fade_in_swish"),parseFloat(o.swishFadeDuration),f),b=g.css,E=g.animElements;r.innerHTML+="\n"+b,t.push.apply(t,y(E)),requestAnimationFrame((function(){t.forEach((function(e){var n=e.el,t=e.className;return n.classList.remove(t)})),requestAnimationFrame((function(){return t.forEach((function(e){var n=e.el,t=e.className;return n.classList.add(t)}))}))}))}return r.useEffect((function(){(console.log("effect",t),f)&&d(l.current.querySelector("svg"))}),[t]),r.createElement(r.Fragment,null,r.createElement("div",null,r.createElement("label",null,"Letter anim duration (s): ",r.createElement("input",{onChange:p(o,i,"letterDuration"),"data-type":"number",size:3,value:o.letterDuration}))),r.createElement("div",null,r.createElement("label",null,"Swish fade anim duration (s): ",r.createElement("input",{onChange:p(o,i,"swishFadeDuration"),"data-type":"number",size:3,value:o.swishFadeDuration}))),r.createElement("style",{ref:c}),r.createElement("div",{id:n,ref:l,style:{marginTop:"10px"}}))}},{parent:null,title:"Draw letters 2",description:"Fade-in white Bladerunner logo letters on black background, then fade in the 'swish'.",component:function(e){var n=e.id,t=e.reRenderToken,a=E(r.useState({letterDuration:"0.2",swishFadeDuration:"1"}),2),o=a[0],i=a[1];console.log("render",t);var c=r.useRef(),l=r.useRef(),s=u({svgUrl:"../img/ty/Bladerunners-original-logo.svg",svgHolderRef:l});return r.useEffect((function(){(console.log("effect",t),s)&&function(e){var t=[],r=c.current;r.innerHTML="";var a=parseFloat(o.letterDuration),i=h(Array.from(e.querySelectorAll("#Bladerunners-text-white path")),"".concat(n,"_white_letters"),a),l=i.css,u=i.animElements,s=i.offset;r.innerHTML+="\n"+l,t.push.apply(t,b(u));var f=v(e,"".concat(n,"_fade_in_swish"),parseFloat(o.swishFadeDuration),s),d=f.css,p=f.animElements;r.innerHTML+="\n"+d,t.push.apply(t,b(p)),requestAnimationFrame((function(){t.forEach((function(e){var n=e.el,t=e.className;return n.classList.remove(t)})),requestAnimationFrame((function(){return t.forEach((function(e){var n=e.el,t=e.className;return n.classList.add(t)}))}))}))}(l.current.querySelector("svg"))}),[t]),r.createElement(r.Fragment,null,r.createElement("div",null,r.createElement("label",null,"Letter anim duration (s): ",r.createElement("input",{onChange:p(o,i,"letterDuration"),"data-type":"number",size:3,value:o.letterDuration}))),r.createElement("div",null,r.createElement("label",null,"Swish fade anim duration (s): ",r.createElement("input",{onChange:p(o,i,"swishFadeDuration"),"data-type":"number",size:3,value:o.swishFadeDuration}))),r.createElement("style",{ref:c}),r.createElement("div",{id:n,ref:l,style:{marginTop:"10px"}}))}},{parent:null,title:"Whole logo fade-in/scale-up",description:"Fade-in and scale-up whole logo.",component:function(e){var n=e.id,t=e.reRenderToken,a=O(r.useState({fadeDuration:"1",scaleDuration:"1",scaleFrom:"0.0",scaleTo:"1.0"}),2),o=a[0],i=a[1];console.log("render",t);var c=function(e,n){var t=r.useRef(),a=r.useRef();return r.useEffect((function(){console.log("effect",e);var r=a.current.querySelector("svg");n({svg:r,styleElement:t.current})}),[e]),{svgHolderRef:a,styleRef:t}}(t,(function(e){var t=e.svg,r=e.styleElement;if(t){var a=t.querySelector("g"),i=a.querySelector("g"),c=[];r.innerHTML="";var l=parseFloat(o.fadeDuration),u=parseFloat(o.scaleDuration),f=parseFloat(o.scaleFrom),d=parseFloat(o.scaleTo),p=h(i,"".concat(n,"_svg_fadeIn"),l),m=p.css,v=p.animElements;r.innerHTML+="\n"+m,c.push.apply(c,w(v)),a.style.transformOrigin="50% 50%";var y=function(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.2,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:1;Array.isArray(e)||(e=[e]);var i="",c=[],l="".concat(n,"_animation"),u=s(l,"\n  transform: scale(".concat(a,");\n      "),"\n  transform: scale(".concat(o,");\n      "));return i+="\n"+u,e.forEach((function(e,a){var o="".concat(n,"_item_").concat(a),u="\n.".concat(o," {\n  animation: ").concat(l," ").concat(t,"s linear;\n  animation-delay: ").concat(r,"s;\n  animation-fill-mode: forwards;\n  transform: scale(0);\n}");i+="\n"+u,c.push({el:e,className:o})})),{css:i,animElements:c,offset:r}}(a,"".concat(n,"_svg_scale"),u,0,f,d),g=y.css,b=y.animElements;r.innerHTML+="\n"+g,c.push.apply(c,w(b)),requestAnimationFrame((function(){c.forEach((function(e){var n=e.el,t=e.className;return n.classList.remove(t)})),requestAnimationFrame((function(){return c.forEach((function(e){var n=e.el,t=e.className;return n.classList.add(t)}))}))}))}})),l=c.svgHolderRef,f=c.styleRef;return u({svgUrl:"../img/ty/Bladerunners-original-logo.svg",svgHolderRef:l,onAppend:function(e){!function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,t=function(e){return e[e.length-1]},r=e.querySelector("g");r.remove();for(var a=[];n-- >0;){var o=e.ownerDocument.createElementNS("http://www.w3.org/2000/svg","g");a.length>0&&t(a).append(o),a.push(o)}t(a).append(r),e.append(a[0])}(e,2)}}),r.createElement(r.Fragment,null,r.createElement("div",null,r.createElement("label",null,"Fade duration (s): ",r.createElement("input",{onChange:p(o,i,"fadeDuration"),"data-type":"number",size:3,value:o.fadeDuration}))),r.createElement("div",null,r.createElement("label",null,"Scale duration (s): ",r.createElement("input",{onChange:p(o,i,"scaleDuration"),"data-type":"number",size:3,value:o.scaleDuration}))," ",r.createElement("label",null,"Scale from: ",r.createElement("input",{onChange:p(o,i,"scaleFrom"),"data-type":"number",size:3,value:o.scaleFrom}))," ",r.createElement("label",null,"Scale to: ",r.createElement("input",{onChange:p(o,i,"scaleTo"),"data-type":"number",size:3,value:o.scaleTo}))),r.createElement("style",{ref:f}),r.createElement("div",{id:n,ref:l,style:{marginTop:"10px"}}))}},{parent:null,title:"Badge 1",description:"Badge 1",component:function(e){var n=e.id,t=e.reRenderToken,a=m(r.useState({fadeDuration:"1",scaleDuration:"1"}),2),o=a[0],i=a[1];console.log("render",t);var c=r.useRef(),l=r.useRef(),f=u({svgUrl:"../img/ty/Bladerunners-original-badge.svg",svgHolderRef:l});function d(e){var t=[],r=c.current;r.innerHTML+=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return s(e,"opacity: ".concat(n,";"),"opacity: ".concat(t,";"))}("".concat(n,"_fadein"),0,1);var a=parseFloat(o.fadeDuration);[e.querySelector("#top-arc-text"),e.querySelector("#bottom-arc-text")].forEach((function(e,o){var i="".concat(n,"_arc_").concat(o),c="\n        .".concat(i," {\n          animation: ").concat(n,"_fadein ").concat(a,"s linear;\n          animation-fill-mode: forwards;\n          opacity: 0;\n        }");r.innerHTML+="\n"+c,t.push({el:e,className:i})}));var i,l,u,f,d,p=parseFloat(o.scaleDuration),m=e.querySelector("#b-logo-inner");i=m,l="".concat(n,"_bLogo"),u="".concat(n,"_bLogo"),f=s(u,"\n        opacity: 0;\n        transform: scale(0);\n      ","\n        opacity: 1;\n        transform: scale(1);\n      "),d="\n      .".concat(l," {\n        animation: ").concat(u," ").concat(p,"s linear;\n        animation-fill-mode: forwards;\n        opacity: 0;\n        transform-origin: 50% 125%;\n      }"),r.innerHTML+="\n"+f+"\n"+d,t.push({el:i,className:l}),requestAnimationFrame((function(){t.forEach((function(e){var n=e.el,t=e.className;return n.classList.remove(t)})),requestAnimationFrame((function(){return t.forEach((function(e){var n=e.el,t=e.className;return n.classList.add(t)}))}))}))}return r.useEffect((function(){(console.log("effect",t),f)&&d(l.current.querySelector("svg"))}),[t]),r.createElement(r.Fragment,null,r.createElement("div",null,r.createElement("label",null,"Fade anim duration (s): ",r.createElement("input",{onChange:p(o,i,"fadeDuration"),"data-type":"number",size:3,value:o.fadeDuration}))),r.createElement("div",null,r.createElement("label",null,"Scale anim duration (s): ",r.createElement("input",{onChange:p(o,i,"scaleDuration"),"data-type":"number",size:3,value:o.scaleDuration}))),r.createElement("style",{ref:c}),r.createElement("div",{id:n,ref:l,style:{marginTop:"10px"}}))}}];t.n(o).a.render(a.a.createElement((function(){var e=A(r.useState(null),2),n=e[0],t=e[1],a=A(r.useState(!1),2),o=a[0],i=a[1],c=A(r.useState(+new Date),2),l=c[0],u=c[1],s=r.useRef(),f=s.current&&s.current.querySelector("svg");return r.useEffect((function(){console.log("effect",s.current,o,f,n),f&&f.classList[o?"add":"remove"]("fill-background")}),[o,n,f]),r.createElement("div",{id:"app"},r.createElement("style",null,"\n  .fill-background {\n    background: lightgoldenrodyellow;\n  }\n\n  .anim-container {\n    margin-top: 1em;\n  }\n  "),r.createElement("h2",null,"Animations"),r.createElement("div",null,r.createElement("div",null,r.createElement("label",null,"Animation: ",r.createElement("select",{onChange:function(e){var n=e.target.selectedIndex-1;n>=0&&t(D[n])}},[{title:""}].concat(D).map((function(e,n){var t=e.title;return r.createElement("option",{key:n,value:n},t)}))))),r.createElement("div",null,r.createElement("label",null,"Fill SVG background:",r.createElement("input",{type:"checkbox",onChange:function(e){return i(e.target.checked)},checked:o})))),n&&r.createElement("div",{ref:s},r.createElement("h3",null,r.createElement("button",{onClick:function(e){return u(+new Date)}},"Run")," ",n.title),r.createElement("div",null,n.description),r.createElement(n.component,{id:"anim",reRenderToken:l})))}),null),document.getElementById("app"))}});
//# sourceMappingURL=animations.js.map