var data = JSON.parse(localStorage.getItem("filteredData"));
console.log(data);

const { dialog } = require("electron").remote;

const Handlebars = require('handlebars');
var nodemailer = require('nodemailer');

var nameButton = function (context) {
    var ui = $.summernote.ui;

    var button = ui.button({
        contents: '<i class="fa fa-child"/> Name',
        tooltip: 'Inserts Name',
        click: function () {
            context.invoke('editor.insertText', '{{Name}}');
        }
    });
    return button.render(); 
}

var occupationButton = function (context) {
    var ui = $.summernote.ui;

    var button = ui.button({
        contents: '<i class="fa fa-child"/> Occupation',
        tooltip: 'Inserts Occupation',
        click: function () {
            context.invoke('editor.insertText', '{{Occupation}}');
        }
    });
    return button.render(); 
}

$(document).ready(function () {
    $('#summernote').summernote({
        height: 300,
        focus: true,
        placeholder: "Enter body of email",
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']],
            ['mybutton', ['name', 'occupation']]
        ],
        buttons: {
            name: nameButton,
            occupation: occupationButton,
        }
    });

});

document.querySelector('#se').addEventListener('click', function () {

    var email = document.getElementsByName('emailId')[0].value;
    var password = document.getElementsByName('psw')[0].value;
    var subject = document.getElementsByName('subject')[0].value;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password,
        }
    });


    var markupStr = $('#summernote').summernote('code');
    var script = Handlebars.compile(markupStr);
    var mailOptions = {
        from: email,
        subject: subject,
    };

    var flag = 0;
    data.forEach(element => {

        mailOptions.to = element.EmailAddress;
        var current = element;
        var html = script(current);
        mailOptions.html = html;

        var button = document.getElementById("se");

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                flag = 1;
                dialog.showErrorBox('Error', error.message);
            } else {
                console.log('Email sent: ' + info.response);
            }

            if(flag == 0){
                button.className = "btn btn-success";
                button.innerText = "Success!"
            }else{
                button.className = "btn btn-danger";
                button.innerText = "Error!!"
            }
        });

    });

});

