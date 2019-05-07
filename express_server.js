var express = require('express');
var app = express();
var PORT = 8080;

var urDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://google.com"
};

app.get("/", (req, res) => {
    res.send("Hello!")
});

app.listen(PORT,() => {
    console.log(`Example app litsening on port ${PORT}!`);
});

app.get("/urls.json",(req, res) => {
    res.json(urDatabase);
});

app.get("/hello", (req, res) =>{
    res.send("<html><body>Hello <b>World</b></body></html>\n")
})