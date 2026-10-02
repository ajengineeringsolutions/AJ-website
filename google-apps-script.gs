/**
 * A&J Engineering Solutions - Requirement CRM backend
 * Saves every "Submit Requirement" form entry into this Google Sheet
 * and emails a notification to NOTIFY_EMAIL.
 *
 * Setup: see CRM-SETUP.md
 */
const NOTIFY_EMAIL = 'ajengineeringsolutions8@gmail.com';
const SHEET_NAME   = 'Requirements';
const TIMEZONE     = 'Asia/Kolkata';
const HEADERS = ['Date & Time', 'Name', 'Company / Organization', 'Email', 'Phone', 'Requirement Type', 'Requirement Details', 'Status'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const p = (e && e.parameter) || {};
    const d = {
      name:    clean(p.name, 150),
      company: clean(p.company, 200),
      email:   clean(p.email, 200),
      phone:   clean(p.phone, 40),
      type:    clean(p.type, 100) || 'Not specified',
      details: clean(p.details, 5000)
    };
    if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      return reply({ ok: false, error: 'Invalid data' });
    }

    const sheet = getSheet();
    const when = Utilities.formatDate(new Date(), TIMEZONE, 'dd-MMM-yyyy HH:mm:ss');
    sheet.appendRow([when, d.name, d.company, d.email, d.phone, d.type, d.details, 'New']);

    sendNotification(d, when);
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app URL in a browser just shows this message (handy for testing).
function doGet() {
  return ContentService.createTextOutput('A&J requirement form endpoint is running.');
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold').setBackground('#061f40').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    // Plain-text columns so entries like "+91..." or "=..." are never treated as formulas
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, HEADERS.length).setNumberFormat('@');
    sheet.setColumnWidths(1, 6, 170);
    sheet.setColumnWidth(7, 420);
    sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1).setWrap(true);
  }
  return sheet;
}

function sendNotification(d, when) {
  const subject = 'New Requirement: ' + d.type + ' - ' + d.name + (d.company ? ' (' + d.company + ')' : '');
  const rows = [
    ['Date & Time', when], ['Name', d.name], ['Company / Organization', d.company || '-'],
    ['Email', d.email], ['Phone', d.phone || '-'], ['Requirement Type', d.type],
    ['Requirement Details', d.details || '-']
  ];
  const text = rows.map(r => r[0] + ': ' + r[1]).join('\n');
  const html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">' +
    '<h2 style="margin:0 0 12px;color:#061f40">New requirement received</h2>' +
    '<table cellpadding="8" style="border-collapse:collapse;border:1px solid #ddd">' +
    rows.map(r => '<tr><td style="border:1px solid #ddd;background:#f4f6fa"><b>' + esc(r[0]) +
      '</b></td><td style="border:1px solid #ddd">' + esc(r[1]).replace(/\n/g, '<br>') + '</td></tr>').join('') +
    '</table><p style="color:#777;font-size:12px">Saved in your Google Sheet "' + SHEET_NAME + '" tab. Reply to this email to answer the customer directly.</p></div>';
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: d.email,
    name: 'A&J Website',
    subject: subject,
    body: text,
    htmlBody: html
  });
}

function clean(v, max) { return String(v || '').replace(/\r/g, '').trim().slice(0, max); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** Run this ONCE from the editor to grant permissions and send yourself a test entry. */
function testSetup() {
  doPost({ parameter: { name: 'Test Customer', company: 'Test Company', email: NOTIFY_EMAIL, phone: '+91 90000 00000', type: 'IT Solution', details: 'This is a test entry. You can delete this row.' } });
}
