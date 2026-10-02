# Requirement form -> Google Sheet + email notification (one-time setup, ~5 minutes)

Sign in to the Google account that should OWN the sheet (use ajengineeringsolutions8@gmail.com).

1. Go to https://sheets.google.com and create a blank spreadsheet. Name it "A&J Requirements CRM".
2. In the sheet: Extensions > Apps Script.
3. Delete the sample code, paste the full contents of `google-apps-script.gs`, click Save.
4. Select the function `testSetup` in the toolbar and click Run.
   Google asks for permission: Review permissions > choose the account > Advanced > "Go to ... (unsafe)" > Allow.
   (This is normal for your own script.) A "Requirements" tab with a test row appears and a test email arrives.
5. Click Deploy > New deployment > gear icon > Web app:
   - Execute as: Me
   - Who has access: Anyone
   Click Deploy and copy the Web app URL (starts with https://script.google.com/macros/s/.../exec).
6. Open `assets/site.js`, find `const CRM_URL='PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';` and replace the text with your URL.
7. Upload the files to GitHub as usual (Netlify redeploys). Open /requirement/, submit a test entry, check the Sheet and your inbox.

If you ever edit the Apps Script code: Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy. The URL stays the same.
Check spam once if the first notification does not appear in the inbox.
