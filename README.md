# A&J Engineering Solutions – Website

Static website (HTML, CSS, JavaScript). No Node.js, no build step, no database.

## Structure
- `index.html` – Home
- `about/`, `services/`, `staffing/`, `it/`, `defence-engineering/`, `gem/`, `amc/`, `psu/`, `contact/`, `requirement/` – one folder per page (each has its own `index.html`, title, description and content so Google can index every page)
- `assets/` – logo and photos only
- `source/` – editable copies of `site.css` / `site.js` (already built INTO every page; run `python3 source/build.py` after editing them)
- `404.html` – friendly "page not found" page (Netlify uses it automatically)
- `sitemap.xml`, `robots.txt` – for Google
- `netlify.toml` – hosting settings

## Deploy (free) – Netlify
1. Upload ALL of these files and folders to your GitHub repository (replace the old ones).
2. Netlify redeploys automatically on every commit. Publish directory: `.`  Build command: empty.
3. After connecting your domain, set it in Netlify > Domain management.

## After going live (SEO)
1. Google Search Console: add the site, then submit `https://YOUR-DOMAIN/sitemap.xml`.
2. Create / verify the Google Business Profile for the Bangalore and Dehradun offices.
3. Change the website address everywhere only by asking for a rebuild (the domain is set in the page tags and sitemap).

## Requirement form (CRM)
The Submit Requirement form posts to a Google Apps Script web app that saves each entry in a Google Sheet and emails ajengineeringsolutions8@gmail.com. See `CRM-SETUP.md` and `google-apps-script.gs`. The web app URL is set in `source/site.js` (`CRM_URL`) and is already built into every page.
