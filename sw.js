if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let c={};const o=e=>n(e,t),l={module:{uri:t},exports:c,require:o};i[t]=Promise.all(r.map((e=>l[e]||o(e)))).then((e=>(s(...e),c)))}}define(["./workbox-e033a2e2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"bundle.min.js",revision:"f17b5a97989a74ee5b389c5ca5ed3362"},{url:"disclaimer.html",revision:"9f8b64b9111f021efa7d2faeeecd9fce"},{url:"index.html",revision:"729c62c9424b4c707bd09da68df30d49"},{url:"privacy.html",revision:"e09b617f16f98f308060b4570178cc35"}],{}),e.registerRoute(/\.(?:webp|png|svg)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:100})]}),"GET")}));
//# sourceMappingURL=sw.js.map
