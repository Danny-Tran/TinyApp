var express = require('express');
var app = express();
var PORT = 8080;

app.set("view engine", "ejs");

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

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.get("/urls",(req, res) => {
    let templateVars = { urls: urDatabase};
    res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    const shortUrl = req.params.shortURL
    let templateVars = { shortUrl, longURL: urDatabase[shortUrl] };
    res.render("urls_show", templateVars)
})