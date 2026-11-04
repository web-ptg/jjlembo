const variants=[
 ["jina default",{}],
 ["jina html",{"X-Return-Format":"html"}],
 ["jina text",{"X-Return-Format":"text"}],
];
for(const [n,h] of variants){
  try{const r=await fetch("https://r.jina.ai/https://johnjlembo.substack.com/feed",{headers:h});const t=await r.text();
    const items=(t.match(/<item>|&lt;item&gt;/g)||[]).length;
    const titles=[...t.matchAll(/<title>(?:<!\[CDATA\[)?([^<\]]{3,90})/g)].slice(0,4).map(m=>m[1]);
    console.log(`::notice title=diag3 ${n}::HTTP ${r.status} len=${t.length} items=${items} titles=${JSON.stringify(titles)} start=${JSON.stringify(t.slice(0,260))}`);
  }catch(e){console.log(`::notice title=diag3 ${n}::ERR ${e.message}`)}
}
try{const r=await fetch("https://r.jina.ai/https://johnjlembo.substack.com/archive?sort=new");const t=await r.text();
 console.log(`::notice title=diag3 jina archive page::HTTP ${r.status} len=${t.length} start=${JSON.stringify(t.slice(0,600))}`);}catch(e){}
