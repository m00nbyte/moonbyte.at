if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let c={};const o=e=>n(e,t),l={module:{uri:t},exports:c,require:o};i[t]=Promise.all(r.map((e=>l[e]||o(e)))).then((e=>(s(...e),c)))}}define(["./workbox-e033a2e2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"bundle.min.js",revision:"ce558c732101bd01b9f4b394d6275ffd"},{url:"disclaimer.html",revision:"d856f41a1ca39cdb6b3b03449aa2c959"},{url:"index.html",revision:"5cb4bc761d577566725bf6e1065f0e7c"},{url:"privacy.html",revision:"dff4a63fbd59b5fbf2b4614c67b71611"}],{}),e.registerRoute(/\.(?:webp|png|svg)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:100})]}),"GET")}));
//# sourceMappingURL=sw.js.map
