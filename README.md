# WriteCraft — ₹0 AI Document Generator

Create Notices, Emails, Letters, Dialogues, Reports & Essays.  
Works **offline** (template fallback) and supports a **free backend** for real AI output.

## Quick Start (GitHub Pages)
1. Upload these files to a GitHub repo.
2. Enable **Settings → Pages → Deploy from a branch**.
3. Open your GitHub Pages URL and test the generator.

## Add Free Backend (Google Apps Script + Gemini Free Tier)
1. Open https://script.google.com → **New project**.
2. Create file `Code.gs` and paste the contents of **backend_apps_script.gs.txt** (from this folder).
3. (Optional but recommended) In **Project properties → Script properties**, set `GEMINI_API_KEY` (from Google AI Studio). If you skip this, backend will return the same offline-style template.
4. **Deploy → New deployment → Web app** → Who has access: **Anyone**. Copy the Web App URL.
5. In `config.js`, set:
   ```js
   const BACKEND_URL = "YOUR_WEB_APP_URL";
   ```
6. Push this change to GitHub; refresh your site.

## File Overview
- `index.html` – UI
- `styles.css` – basic styling
- `script.js` – logic + offline fallback
- `config.js` – set BACKEND_URL here
- `backend_apps_script.gs.txt` – copy into Apps Script as `Code.gs`
- `README.md` – these instructions

## Customize
- Add more document types in `templates` object inside `script.js`.
- Change theme in `styles.css`.
- Add more languages to `lipsum()` strings in `script.js`.

## License
MIT — do anything, just don’t blame us if it breaks.
