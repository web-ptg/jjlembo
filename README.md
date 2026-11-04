# John J. Lembo website

Live at https://web-ptg.github.io/jjlembo/

## Pages
- `index.html` — Home
- `writing/` — The Solution Navigator essays
- `navitas/` — The Navitas Group
- `contact/` — Contact
- `assets/` — Photos, book image and the social sharing image

## Automatic Substack posts
Every 6 hours, and on every push, GitHub Actions reads johnjlembo.substack.com/feed,
saves the latest posts as `posts.json`, and redeploys the site. For an instant refresh after
publishing: **Actions → Update posts and deploy site → Run workflow**.
If the feed can't be read, the site falls back to the post list built into the pages.

## SEO
Each page has its own title, description, canonical URL, Open Graph/Twitter tags and
schema.org JSON-LD (Person, ProfilePage, Book, ProfessionalService, WebSite, breadcrumbs).
`sitemap.xml`, `robots.txt` and `llms.txt` are included. Crawlers only read robots.txt and llms.txt
at the root of a domain, so they take effect once a custom domain is set up.

**If you add a custom domain:** replace `https://web-ptg.github.io/jjlembo/` with the new address
in every page, `sitemap.xml`, `robots.txt` and `llms.txt`, then add a `CNAME` file containing the domain.
