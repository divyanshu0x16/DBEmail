const { GoogleSpreadsheet } = require('google-spreadsheet');

const { default: Handsontable } = require('handsontable');

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

function initiliaze(database) {
  var options = {
    valueNames: Object.keys(database[0]),
    // Since there are no elements in the list, this will be used as template.
    item: `<table>
    <!-- IMPORTANT, class="list" have to be at tbody -->
    <tbody class="list">
      <tr class="even">
        <td id="cols" class="Timestamp"></td>
        <td id="cols" class="Name"></td>
        <td id="cols" class="Occupation"></td>
        <td id="cols" class="Question"></td>
        <td id="cols" class="Email Address"></td>
        <td id="cols" class="College/Organization"></td>
      </tr>
    </tbody>
  </table>`,
  page: 8,
  pagination: true

  };
  var searchInputs = document.querySelectorAll('input');
  var userList = new List('users', options, database);

  function search(e) {
    userList.search(this.value, e.target.dataset.searchType)
  };
  searchInputs.forEach(function (input) {
    input.addEventListener('input', search);
  });

  return userList;
}

(async () => {

  const database = await fetchData();

  userList = initiliaze(database);

  document.querySelector('.bt').addEventListener('click', function () {
    var array = [];
    userList.visibleItems.forEach(element => array.push(element._values));
    console.log(array);
  });

  const languages = $('#occupations').filterMultiSelect({
    placeholderText: "nothing selected",
    filterText: "Filter",
    selectAllText: "Select All",
    caseSensitive: false,
    allowEnablingAndDisabling: true
  });

  document.querySelector('.ft').addEventListener('click', function () {
    var filters = JSON.parse(languages.getSelectedOptionsAsJson(includeDisabled = true));
    userList.filter(function (item) {
      if (filters.occupation.length == 0) {
        return true;
      } else if (filters.occupation.includes(item.values().Occupation.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });
  });

})();



