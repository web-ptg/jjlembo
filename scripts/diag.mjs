const UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const tests=[
 ["other substack: astralcodexten","https://astralcodexten.substack.com/feed"],
 ["other substack: platformer","https://www.platformer.news/feed"],
 ["john home page","https://johnjlembo.substack.com/"],
 ["john feed","https://johnjlembo.substack.com/feed"],
 ["rss2json msg",`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://johnjlembo.substack.com/feed")}`],
 ["rss2json other",`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://astralcodexten.substack.com/feed")}`],
 ["jina reader","https://r.jina.ai/https://johnjlembo.substack.com/feed"],
];
for(const [n,u] of tests){
  try{const r=await fetch(u,{headers:{"User-Agent":UA},redirect:"follow"});const t=await r.text();
    const items=(t.match(/<item>/g)||[]).length;
    const first=(t.match(/<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([^<\]]*)/)||[])[1]||'';
    const server=r.headers.get('server')||'', cf=r.headers.get('cf-mitigated')||'';
    let msg='';try{const j=JSON.parse(t);msg=(j.message||j.status||'')+' items:'+(j.items?j.items.length:'-')+' '+(j.items?.[0]?.title||'')}catch{}
    const tt=(t.match(/<title>([^<]{0,80})/)||[])[1]||'';
    console.log(`::notice title=diag2 ${n}::HTTP ${r.status} final=${r.url} server=${server} cf-mitigated=${cf} items=${items} first=${first} json=${msg} pageTitle=${tt}`);
  }catch(e){console.log(`::notice title=diag2 ${n}::ERR ${e.message}`)}
}
