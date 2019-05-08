var express = require('express');
var app = express();
var PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var generateRandomString = () => Math.random().toString(36).substring(2,8)

app.post("/urls", (req, res) => {
    // console.log(req.body);  // Log the POST request body to the console
    var shortstring = generateRandomString();
    var longstring = req.body.longURL;
    urDatabase[shortstring] = longstring;
    console.log(urDatabase);
    // res.send('ok');         // Respond with 'Ok' (we will replace this)
    res.redirect("/urls")
});

app.get("/u/:shortURL", (req, res) => {
    const longURL = urDatabase[req.params.shortURL]
    res.redirect(longURL);
  });

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

app.set("view engine", "ejs");
var urDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://google.com"
};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.listen(PORT,() => {
    console.log(`Example app litsening on port ${PORT}!`);
});

app.get("/urls.json",(req, res) => {
    res.json(urDatabase);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls",(req, res) => {
    let templateVars = { urls: urDatabase};
    res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    const shortUrl = req.params.shortURL
    let templateVars = { shortUrl, longURL: urDatabase[shortUrl] };
    res.render("urls_show", templateVars);
});




