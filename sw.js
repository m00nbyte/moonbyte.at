if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let c={};const o=e=>n(e,t),l={module:{uri:t},exports:c,require:o};i[t]=Promise.all(r.map((e=>l[e]||o(e)))).then((e=>(s(...e),c)))}}define(["./workbox-e033a2e2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"bundle.min.js",revision:"8731e2ec4d2e7571f14673bddbc8e69b"},{url:"disclaimer.html",revision:"a2fe7dfd61cdf4eca6fe0e4de8daeccf"},{url:"index.html",revision:"09b43e3031e49a5b6c07955130e8c922"},{url:"privacy.html",revision:"e0ff905be44e86223570ba837066884c"}],{}),e.registerRoute(/\.(?:webp|png|svg)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:100})]}),"GET")}));
//# sourceMappingURL=sw.js.map
