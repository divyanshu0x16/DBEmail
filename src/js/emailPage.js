var data = JSON.parse(localStorage.getItem("filteredData"));
console.log(data);

const Handlebars = require('handlebars');
var nodemailer = require('nodemailer');

$(document).ready(function () {
    $('#summernote').summernote({
        height: 300,
        focus: true,
        placeholder: "Enter body of email"
    });
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

document.querySelector('.se').addEventListener('click', function () {

    var markupStr = $('#summernote').summernote('code');
    var script = Handlebars.compile(markupStr);
    var mailOptions = {
        from: 'divyanshu.m@iitgn.ac.in',
        subject: 'Sending Email using Node.js',
    };

    data.forEach(element => {
        console.log(element);
        mailOptions.to = element.EmailAddress;
        var current = element;
        var html = script(current);
        mailOptions.html = html;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
    console.log(html);

});

