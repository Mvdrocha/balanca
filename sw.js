/* Balança: guarda o app para abrir sem internet. Os dados vão para o GitHub pelo próprio app. */
var CACHE='balanca-v2';
var SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var req=e.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;
  e.respondWith(fetch(req).then(function(r){
    if(r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});}
    return r;
  }).catch(function(){
    return caches.match(req,{ignoreSearch:true}).then(function(m){return m||caches.match('./index.html');});
  }));
});
