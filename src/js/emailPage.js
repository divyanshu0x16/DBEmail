var data = JSON.parse(localStorage.getItem("filteredData"));
console.log(data);

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
    console.log(markupStr);

    var mailOptions = {
        from: 'divyanshu.m@iitgn.ac.in',
        to: data.map(({ EmailAddress }) => EmailAddress),
        subject: 'Sending Email using Node.js',
        html: markupStr
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

});

