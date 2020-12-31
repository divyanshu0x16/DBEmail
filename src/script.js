document.addEventListener("DOMContentLoaded", function () {

    console.log("Connected!!");

    const { default: Handsontable } = require('handsontable');
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'divyanshu',
        password: 'Divyanshu',
        database: 'testing'
    });

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'apnaDalo',
            pass: 'NopeNope'
        }
    });

    connection.connect();

    var database = [];
    connection.query('SELECT * FROM student', function (error, results, fields) {
        if (error) throw error;
        getDatabase(results);
    });

    function getDatabase(value) {
        /*Displaying array on handsontable*/
        var data = value;
        var container = document.getElementById('example');
        var hot = new Handsontable(container, {
            data: data,
            rowHeaders: true,
            colHeaders: Object.keys(data[0]),
            filters: true,
            dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
            licenseKey: 'non-commercial-and-evaluation'
        });

        document.querySelector('.bt').addEventListener('click', function () {

            var visualObjectRow = function (row) {
                var obj = {};
                for (let i = 0; i < hot.countCols(); i++) {
                    obj[hot.colToProp(i)] = hot.getDataAtCell(row, i);
                }
                return obj
            }
            var filteredData = [];
            for (let i = 0; i < hot.countRows(); i++) {
                filteredData.push(visualObjectRow(i));
            }
            console.log(filteredData);
        });

        document.querySelector('.sendEmail').addEventListener('click', function () {

            var visualObjectRow = function (row) {
                var obj = {};
                for (let i = 0; i < hot.countCols(); i++) {
                    obj[hot.colToProp(i)] = hot.getDataAtCell(row, i);
                }
                return obj
            }
            var filteredData = [];
            for (let i = 0; i < hot.countRows(); i++) {
                filteredData.push(visualObjectRow(i));
            }
            console.log(filteredData);

            filteredData.forEach(function (currentObject) {
                console.log(currentObject.email);
                console.log();

                var mailOptions = {
                    from: 'apnaDalo',
                    to: currentObject.email,
                    subject: 'Sending Multiple Emails using Node.js',
                    text: `Testing using Node.js \n Name: ${currentObject.name} \n Major: ${currentObject.major} \n`,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
        });
    }

    connection.end();

});