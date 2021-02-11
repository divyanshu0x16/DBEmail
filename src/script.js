const { GoogleSpreadsheet } = require('google-spreadsheet');

const electron = require('electron');
const { ipcRenderer } = electron;

const creds = require('./js/client_secret.json');

const doc = new GoogleSpreadsheet('1NJYhbSjA4Yij0COr5QdFIiXOnXRd1Ch0J5PAw9c5_s8');

var fetchData = async () => {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  var rows = await sheet.getRows();
  rows = rows.map(a => a._rawData);
  var headerRow = sheet.headerValues;


  var database = [];
  for (let i = 0; i < rows.length; i++) {
    let firstArray = rows[i];
    let secondArray = headerRow;
    let arrayOfObject = secondArray.map(function (value, index) {
      return [value, firstArray[index]]
    });
    let obj = Object.fromEntries(arrayOfObject);
    database.push(obj);
  }
  return database;
};

(async () => {

  const database = await fetchData();

  var datables = []
  var index = 0;
  database.forEach(function (value) {
    var beh = index.toString();
    var currObj = [beh];
    for (var key of Object.keys(value)) {
      currObj.push(value[key]);
    }
    index++;
    datables.push(currObj);
  })

  $(document).ready(function () {
    var table = $('#table_id').DataTable({
      data: datables,
      'columnDefs': [{
        'targets': 0,
        'checkboxes': true
      }],
      'select':{
        'style': 'multi'
      },
      'order': [[1, 'asc']]
    });

    $('#send-email').on('click', function(e){
      const filters = JSON.parse(languages.getSelectedOptionsAsJson(includeDisabled = true));
      var toSearch = filters.occupation.join('|');
      table.columns(3).search(toSearch, true, false, true).draw();

      var rows_selected = table.column(0).checkboxes.selected();
      var form = [];

      $.each(rows_selected, function(index, rowId){
        form.push(rowId);
     });

      //Get the data in presentable form
      var filteredData = [];
      form.forEach( index => filteredData.push(database[index]));
      console.log(filteredData);

      localStorage.setItem("filteredData", JSON.stringify(filteredData));
      ipcRenderer.send('main:add');
    });

    $('#filter').on('click', function(){
      const filters = JSON.parse(languages.getSelectedOptionsAsJson(includeDisabled = true));
      var toSearch = filters.occupation.join('|');
      table.columns(3).search(toSearch, true, false, true).draw();
    });
  });

  const languages = $('#occupations').filterMultiSelect({
    placeholderText: "nothing selected",
    filterText: "Filter",
    selectAllText: "Select All",
    caseSensitive: false,
    allowEnablingAndDisabling: true
  });

})();



