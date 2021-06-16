var data = JSON.parse(localStorage.getItem("filteredData"));
console.log(data);
const { dialog } = require("electron").remote;
function getFileExtension(filename){

    // get file extension
    const extension = filename.split('.').pop();
    return extension;
}
const Handlebars = require("handlebars");
var nodemailer = require("nodemailer");

var nameButton = function (context) {
    var ui = $.summernote.ui;

    var button = ui.button({
        contents: '<i class="fa fa-child"/> Name',
        tooltip: "Inserts Name",
        click: function () {
            context.invoke("editor.insertText", "{{Name}}");
        },
    });
    return button.render();
};

var occupationButton = function (context) {
    var ui = $.summernote.ui;

    var button = ui.button({
        contents: '<i class="fa fa-child"/> Occupation',
        tooltip: "Inserts Occupation",
        click: function () {
            context.invoke("editor.insertText", "{{Occupation}}");
        },
    });
    return button.render();
};

$(document).ready(function () {
    $("#summernote").summernote({
        height: 300,
        focus: true,
        placeholder: "Enter body of email",
        toolbar: [
            ["style", ["style"]],
            ["font", ["bold", "underline", "clear"]],
            ["fontname", ["fontname"]],
            ["color", ["color"]],
            ["para", ["ul", "ol", "paragraph"]],
            ["table", ["table"]],
            ["insert", ["link", "picture", "video"]],
            ["view", ["fullscreen", "codeview", "help"]],
            ["mybutton", ["name", "occupation"]],
        ],
        buttons: {
            name: nameButton,
            occupation: occupationButton,
        },
    });
});
var all_attachments=[]
var path_got;var file_name;
document.getElementById("add-att").onclick=function add(){
    dialog
    .showOpenDialog(
        {
            properties:["openFile"]
        }
    )
    .then((result)=>{
        
         
        path_got=result.filePaths[0]
      //  console.log(path_got)
        file_name=path_got.split('/').pop()
        console.log(file_name)
        all_attachments.push({filename:file_name,path:path_got})
      //  console.log("%%%%%%%%%%")
        //console.log(all_attachments)
       
    })
}
document.querySelector("#se").addEventListener("click", function () {
    
    var email = document.getElementsByName("emailId")[0].value;
    var password = document.getElementsByName("psw")[0].value;
    var subject = document.getElementsByName("subject")[0].value;

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: email,
            pass: password,
        },
    });

    var markupStr = $("#summernote").summernote("code");
    var script = Handlebars.compile(markupStr);
    var mailOptions = {
        from: email,
        subject: subject,
    };


    var errorFlag = 0;
    var iterater=0;const data_len=data.length;
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        
        mailOptions.to = element.EmailAddress;
     
      mailOptions.attachments=all_attachments.map(attachment=>attachment)
       var current = element;
        var html = script(current);
        
        mailOptions.html = html;
       
        
        var button = document.getElementById("se");
        
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                flag = 1;
            } else {
                console.log("Email sent: " + info.response);
                iterater++;
                if(iterater==data_len){window.alert('All mails send')}
            }

            if (flag == 0 && errorFlag == 0) {
                button.className = "btn btn-success";
                button.innerText = "Success!";
            } else {
                button.className = "btn btn-danger";
                button.innerText = "Error!!";
                if (errorFlag == 0) {
                    dialog.showErrorBox("Error", error.message);
                    errorFlag = 1;
                }
            }
        });
        // window.alert("All emails send!")
    }
    
});
