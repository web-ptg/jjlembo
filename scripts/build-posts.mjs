// Reads John's Substack posts and writes posts.json for the website.
// Tries the RSS feed first, then Substack's public archive API.
// If both fail, it writes nothing and the site shows its built-in list.
import { writeFileSync } from "node:fs";

const PUB = "https://johnjlembo.substack.com";
const OUT = process.argv[2] || "posts.json";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; johnjlembo-site/1.1; +https://web-ptg.github.io/jjlembo/)",
  "Accept": "application/rss+xml, application/xml, application/json;q=0.9, */*;q=0.8",
};
const note = (lvl, msg) => console.log(`::${lvl} title=Substack posts::${msg}`);

const decode = (s = "") =>
  s.replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/<[^>]+>/g, "")
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "’").replace(/&nbsp;/g, " ")
   .replace(/\s+/g, " ").trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
};
const month = (d) => {
  const t = new Date(d);
  return isNaN(t) ? "" : t.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
};

async function fromRss() {
  const res = await fetch(`${PUB}/feed`, { headers: HEADERS });
  if (!res.ok) throw new Error(`RSS feed returned HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => ({
    title: tag(it, "title"), subtitle: "", date: month(tag(it, "pubDate")),
    summary: tag(it, "description"), url: tag(it, "link"),
  }));
}

async function fromApi() {
  const all = [];
  for (let offset = 0; offset < 200; offset += 50) {
    const res = await fetch(`${PUB}/api/v1/archive?sort=new&offset=${offset}&limit=50`, { headers: HEADERS });
    if (!res.ok) throw new Error(`Archive API returned HTTP ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || !batch.length) break;
    all.push(...batch);
    if (batch.length < 50) break;
  }
  return all.filter(p => !p.type || p.type === "newsletter").map(p => ({
    title: p.title || "", subtitle: "", date: month(p.post_date),
    summary: p.subtitle || p.description || "", url: p.canonical_url || (p.slug ? `${PUB}/p/${p.slug}` : ""),
  }));
}

let posts = [], errors = [];
for (const [name, fn] of [["archive API", fromApi], ["RSS feed", fromRss]]) {
  try {
    posts = (await fn()).filter(p => p.title && p.url);
    if (posts.length) { note("notice", `Loaded ${posts.length} posts from the ${name}. Newest: "${posts[0].title}" (${posts[0].date}).`); break; }
    errors.push(`${name}: no posts found`);
  } catch (e) { errors.push(`${name}: ${e.message}`); }
}
if (posts.length) {
  writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), posts }, null, 2));
} else {
  note("warning", `Could not load posts, so the site is showing its built-in list. ${errors.join(" | ")}`);
}
