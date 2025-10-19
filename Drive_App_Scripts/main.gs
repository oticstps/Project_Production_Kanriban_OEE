// api_dev = https://script.google.com/macros/s/AKfycbx8WUlbMNiM8az-4xuwczjN7XeXrNngHN6XA2cN0Os/dev

const ID = '1X5PzI5MPS9YXeE56coA7re3Rd7hqUR1u8dD_IFkvNnE';

const MYOBJ = [
  { first: 'Wanda', last: 'Bukhari' },
  { first: 'Shela', last: 'Fentika' }
];

function doGet(e) {
  const data = output(e);
  return ContentService.createTextOutput(JSON.stringify(data.vals))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = output(e);
  return ContentService.createTextOutput(JSON.stringify(data.vals))
    .setMimeType(ContentService.MimeType.JSON);
}

function output(e) {
  const data = {};

  if ('type' in e.parameter) {
    let valId = e.parameter['type'];

    if (valId === '1') {
      data.vals = SpreadsheetApp.openById(ID).getSheets()[0].getDataRange().getValues();
    } else if (valId === '2') {
      data.vals = MYOBJ;
    } else if (valId === '3') {
      data.vals = e;
    } else {
      data.vals = { status: 'Nothing found' };
    }

  } else {
    data.vals = { status: 'Missing parameter: type' };
  }

  return data;
}
