/**
 * NeuCorelytix Google Apps Script — Lead Collector & Pre-Call Qualification
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet ("NeuCorelytix Leads").
 * 2. Add header row in Row 1:
 *    Col A: Timestamp | Col B: Name | Col C: Phone / Email | Col D: Business Description | Col E: Website / Link | Col F: Business Problem | Col G: Source Page
 * 3. Go to Extensions -> Apps Script.
 * 4. Paste this exact code.
 * 5. Click "Deploy" -> "New deployment" -> Select "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone".
 * 8. Click "Deploy" and grant permissions when prompted.
 * 9. Copy the Web App URL and paste into js/forms.js (Line 2).
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter || {};

    if (e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        data = parsed;
      } catch (err) {}
    }

    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name = data.user_name || data.name || "N/A";
    
    // Prefix phone/contact with single quote to prevent Google Sheets from interpreting '+' as a formula
    var rawContact = (data.user_contact || data.contact || "N/A").toString();
    var contact = rawContact.startsWith("+") ? "'" + rawContact : rawContact;

    var businessDesc = data.business_description || "N/A";
    var businessWebsite = data.business_website || "N/A";
    var problemDesc = data.problem_description || data.problem || "N/A";
    var sourcePage = data.source_page || data._subject || "NeuCorelytix Website";

    sheet.appendRow([timestamp, name, contact, businessDesc, businessWebsite, problemDesc, sourcePage]);

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Lead logged successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("NeuCorelytix Google Sheets Lead Collector Endpoint is Active!");
}
