// Imports
const http = require('http')
var fs = require('fs');
var url = require('url');

function mainPage(res) {
    let mainHTML = fs.readFileSync('index.html', 'utf8');
    console.log("<"+mainHTML.toString()+">");
    res.write(mainHTML);
    res.end();

}

function loadmaincss(res) {
    let mainCSS = fs.readFileSync('main.css', 'utf8');
    console.log("<"+mainCSS.toString()+">");
    res.write(mainCSS);
    res.end();
    
}

function loadimg(res) {
    let btnPic = fs.readFileSync('menuBtn.png');
    res.write(btnPic);
    res.end();
}

function appendData(res, query) {
    let header = fs.readFileSync('header.html', 'utf8');
    var charname = query.charname;
    var nameclass = query.nameclass;
    res.write("Your character name is " + charname + " and your class is " + nameclass +".");
    fs.appendFileSync('charlist.lis', charname + " " + nameclass + ",\n");
    
    let data = fs.readFileSync('charlist.lis', 'utf8');
    let lines = [];
    lines = data.toString().split(",");
    lines.forEach(element => {
        res.write("<td>"+element+"</td>")
    });

    res.write(header);
    res.end();
}
function charPage(res) { 
    let header = fs.readFileSync('header.html', 'utf8');
    let data = fs.readFileSync('charlist.lis', 'utf8');
    let lines = [];
    data = data.slice(0, -2);
    lines = data.toString().split(",");

    if (lines == "" || lines == null){
        res.write("<p>\Your list is empty\</p>")
    }
    else  {
        let printlist = fs.readFileSync('printlist.html', 'utf8');
        lines.forEach(element => {
            res.write("<p>")
            res.write("<label>"+element+"</label>")
            res.write("<input type=\"checkbox\"></p>")
        })  
    }
    res.write(header);
    res.end();
}

/* Register server: */
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var q = url.parse(req.url, true);
    var path = q.pathname;
    console.log("Serving " + req.url);
    res.write(req.url);

    if(path == "/") {
    	mainPage(res);
    }
    else if (path == "/append") {
        appendData(res, q.query);
    }
    else if (path == "/character") {
        charPage(res);
    }
    else if (path == "/main.css") {
        loadmaincss(res);
    }
    else if (path == "/menuBtn.png") {
        loadimg(res);
    }

    
    res.end();
}).listen(8080);
