// Service worker: lấy bản mới từ mạng trước, mất mạng thì dùng bản đã lưu. Không lưu dữ liệu Google Sheets.
const CACHE='thaptaisan-v70';
const SHELL=['./','index.html','manifest.webmanifest','icons/chip-192.png','icons/chip-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
  // cache:'no-cache': luôn hỏi lại máy chủ (ETag), không lấy bản cũ trong bộ nhớ HTTP của trình duyệt (GitHub Pages để max-age 600)
  e.respondWith(fetch(e.request.url,{cache:'no-cache',credentials:'same-origin'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
