if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let c={};const o=e=>n(e,t),l={module:{uri:t},exports:c,require:o};i[t]=Promise.all(r.map((e=>l[e]||o(e)))).then((e=>(s(...e),c)))}}define(["./workbox-e033a2e2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"bundle.min.js",revision:"1e1ee88098e3cbb53612dcf2868fb358"},{url:"disclaimer.html",revision:"8cf87cacaa64f7d23c7aa47b961955db"},{url:"index.html",revision:"9159f52e26b81a30796f263198968be6"},{url:"privacy.html",revision:"8b50677c5f53d78c9fe8f19b78c62f41"}],{}),e.registerRoute(/\.(?:webp|png|svg)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:100})]}),"GET")}));
//# sourceMappingURL=sw.js.map
