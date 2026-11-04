const PUB="https://johnjlembo.substack.com";
const UA={"browser":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36","feedreader":"Feedly/1.0 (+http://www.feedly.com/fetcher.html; like FeedFetcher-Google)"};
const tests=[
 ["rss browser-UA",`${PUB}/feed`,{"User-Agent":UA.browser,"Accept":"application/rss+xml,application/xml,text/xml,*/*"}],
 ["rss feedreader-UA",`${PUB}/feed`,{"User-Agent":UA.feedreader}],
 ["api browser-UA",`${PUB}/api/v1/archive?sort=new&limit=5`,{"User-Agent":UA.browser,"Accept":"application/json"}],
 ["rss2json",`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(PUB+"/feed")}`,{}],
 ["allorigins",`https://api.allorigins.win/raw?url=${encodeURIComponent(PUB+"/feed")}`,{}],
 ["substack.com profile api",`https://substack.com/api/v1/publication/search?query=johnjlembo`,{"User-Agent":UA.browser}],
];
for(const [n,u,h] of tests){
  try{const r=await fetch(u,{headers:h});const t=await r.text();
    const items=(t.match(/<item>/g)||[]).length; let extra='';
    try{const j=JSON.parse(t); extra=Array.isArray(j)?`json array ${j.length}`:(j.items?`items ${j.items.length} first: ${j.items[0]?.title}`:Object.keys(j).slice(0,5).join(','));}catch{}
    console.log(`::notice title=diag ${n}::HTTP ${r.status} rssItems=${items} ${extra} firstTitle=${(t.match(/<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([^<\]]*)/)||[])[1]||''}`);
  }catch(e){console.log(`::notice title=diag ${n}::ERR ${e.message}`)}
}
