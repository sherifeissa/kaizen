/**
 * Kaizen — Google Apps Script backend.
 * Serves the tracker app AND stores its data in your Sheet.
 * Setup steps are in SETUP.md. You don't need to edit anything here —
 * settings live in Config.gs (copied from Config.example.gs).
 */

// Serves the tracker web page when you open the web-app URL.
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Kaizen')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Returns the JSON blob the app saved (or empty string if none yet).
function loadData() {
  var cell = storeCell_();
  var v = cell.getValue();
  return v ? String(v) : '';
}

// Saves the app's JSON blob into the Sheet.
function saveData(json) {
  storeCell_().setValue(json);
  return true;
}

// Internal: the single cell where the data blob lives (sheet "data", cell A1).
function storeCell_() {
  // Bound script (default): use the Sheet this script lives in.
  // Standalone script: set SHEET_ID in Config.gs and it's opened by ID instead.
  var ss = (typeof SHEET_ID !== 'undefined' && SHEET_ID)
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('data');
  if (!sh) {
    sh = ss.insertSheet('data');
    sh.getRange('A1').setNote('Kaizen stores all your tracker data here as JSON. Do not edit by hand.');
  }
  return sh.getRange('A1');
}
