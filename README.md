# johnjlembo.com

Website for John J. Lembo: author, consultant and Solution Navigator.

- `index.html` is the whole site (styles, scripts and images are built in).
- Every 6 hours, and on every push, GitHub Actions reads the Substack feed at
  johnjlembo.substack.com/feed, saves the latest posts as `posts.json`, and redeploys the site.
- For an instant refresh after publishing a post: **Actions → Update posts and deploy site → Run workflow**.
- If the feed can't be read, the site falls back to the post list built into `index.html`.
