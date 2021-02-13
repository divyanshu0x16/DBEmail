const electron = require("electron");
const { ipcRenderer } = electron;
const { dialog } = require("electron").remote;
var XLSX = require("xlsx");
var _ = require("lodash");

window.onload = function () {

  var sampleData = [
    [
      "0",
      1123,
      "Stutend A",
      "Occupation A",
      "Sample Question",
      "xyz@gmail.com",
      "Organization A",
    ],
    [
      "0",
      456,
      "Stutend B",
      "Occupation B",
      "Sample Question",
      "abc@gmail.com",
      "Organization B",
    ],
  ];

  var database;

  $(document).ready(function () {
    var table = $("#table_id").DataTable({
      data: sampleData,
      columnDefs: [
        {
          targets: 0,
          checkboxes: true,
        },
      ],
      select: {
        style: "multi",
      },
      order: [[2, "asc"]],
    });

    $("#send-email").on("click", function (e) {
      const filters = JSON.parse(
        languages.getSelectedOptionsAsJson((includeDisabled = true))
      );
      var toSearch = filters.occupation.join("|");
      table.columns(3).search(toSearch, true, false, true).draw();

      var rows_selected = table.column(0).checkboxes.selected();
      var form = [];

      $.each(rows_selected, function (index, rowId) {
        form.push(rowId);
      });

      //Get the data in presentable form
      var filteredData = [];
      form.forEach((index) => filteredData.push(database[index]));
      console.log(filteredData);

      localStorage.setItem("filteredData", JSON.stringify(filteredData));
      ipcRenderer.send("main:add");
    });

    $("#filter").on("click", function () {
      const filters = JSON.parse(
        languages.getSelectedOptionsAsJson((includeDisabled = true))
      );
      var toSearch = filters.occupation.join("|");
      table.columns(3).search(toSearch, true, false, true).draw();
    });
  });

  function renderTable(database) {
    console.log(database);

    var datables = [];
    var index = 0;
    database.forEach(function (value) {
      var beh = index.toString();
      var currObj = [beh];
      for (var key of Object.keys(value)) {
        currObj.push(value[key]);
      }
      index++;
      datables.push(currObj);
    });

    $("#table_id").DataTable().clear();
    datables.forEach(function (value) {
      $("#table_id").DataTable().row.add(value);
    });
    $("#table_id").DataTable().draw();
  }

  var languages = $("#occupations").filterMultiSelect({
    placeholderText: "nothing selected",
    filterText: "Filter",
    selectAllText: "Select All",
    caseSensitive: false,
    allowEnablingAndDisabling: true,
  });

  document.getElementById("import-data").onclick = function loadExcel() {
    dialog
      .showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "All Files", extensions: ["xlsx"] }],
      })
      .then((result) => {
        workbook = XLSX.readFile(result.filePaths[0]);
        var sheet_name_list = workbook.SheetNames;
        database = XLSX.utils
          .sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" })
          .map((row) => _.mapKeys(row, (value, key) => key.trim().replace(/\s/g, "")));
        renderTable(database);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
