if(!self.define){let e,i={};const c=(c,n)=>(c=new URL(c+".js",n).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(n,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let t={};const o=e=>c(e,s),l={module:{uri:s},exports:t,require:o};i[s]=Promise.all(n.map((e=>l[e]||o(e)))).then((e=>(r(...e),t)))}}define(["./workbox-e033a2e2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"bundle.min.js",revision:"4054c5250939c9c4474af16988e03fc1"},{url:"disclaimer.html",revision:"f8544424ce9c29285c7dd1fb981ae8d0"},{url:"index.html",revision:"985ea1fd874e2c1c5b0e818eb9b4cb1e"},{url:"privacy.html",revision:"c1b1ac2acc0dd401bf18b2c0dc4e2673"}],{}),e.registerRoute(/\.(?:webp|png|svg)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:100})]}),"GET")}));
//# sourceMappingURL=sw.js.map
