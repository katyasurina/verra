# Save every enquiry to Google Sheets (free, 5 minutes)

1. Create a Google Sheet. In row 1 write: `time, name, contact, subject, date, time_slot, questions, message, page, lang`.
2. In the sheet open **Extensions → Apps Script** and paste:

```js
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    new Date(), d.name, d.contact, d.subject, d.date, d.time,
    (d.questions || []).join("; "), d.message, d.page, d.lang
  ]);
  return ContentService.createTextOutput("ok");
}
```

3. **Deploy → New deployment → Web app**. Execute as: *Me*. Who has access: *Anyone*. Copy the web-app URL.
4. In Vercel → Settings → Environment Variables add `FORM_WEBHOOK_URL` = that URL, then redeploy.

Every enquiry now lands in the sheet as well as in Telegram.
