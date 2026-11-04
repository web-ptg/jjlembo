// Reads John's Substack RSS feed and writes posts.json for the website.
// If the feed can't be read, it writes nothing and the site shows its built-in list.
import { writeFileSync } from "node:fs";

const FEED = "https://johnjlembo.substack.com/feed";
const OUT = process.argv[2] || "posts.json";

const decode = (s = "") =>
  s.replace(/^<!\[CDATA\[|\]\]>$/g, "")
   .replace(/<[^>]+>/g, "")
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "’").replace(/&nbsp;/g, " ")
   .replace(/\s+/g, " ").trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
};

try {
  const res = await fetch(FEED, { headers: { "User-Agent": "johnjlembo-site/1.0" } });
  if (!res.ok) throw new Error(`Feed returned ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const d = new Date(tag(it, "pubDate"));
    return {
      title: tag(it, "title"),
      subtitle: "",
      date: isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
      summary: tag(it, "description"),
      url: tag(it, "link"),
    };
  }).filter(p => p.title && p.url);
  if (!items.length) throw new Error("No posts found in feed");
  writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), posts: items }, null, 2));
  console.log(`Wrote ${items.length} posts to ${OUT}`);
} catch (err) {
  console.warn(`Skipping posts.json: ${err.message}`);
}
