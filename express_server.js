var express = require('express');
var app = express();
var PORT = 8080;
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");


var urDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://google.com"
};

const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  }


var generateRandomString = () => Math.random().toString(36).substring(2,8)

app.listen(PORT,() => {
    console.log(`Example app litsening on port ${PORT}!`);
});

// register route
app.post ("/register", (req,res) =>{
    var nid = generateRandomString()
    var nEmail = req.body.email
    var nPass = req.body.password
    
        let exituserEmail = false
        for (i in users){
            if (users[i].email ==  nEmail){
                exituserEmail = true
            }
        }
        if (!nEmail || !nPass) {
        return res.send("Connection status 400")
        } else if (exituserEmail) {
        return res.send("Account already exit, Please use a new email adress")
        } 
        res.cookie("username", nid)
        
        res.redirect("/urls")
        
        
        users[nid] = {id:nid, email: nEmail, password:nPass}
})
    
// login route and redirect
 app.post('/login', (req,res) =>{
        var nid = generateRandomString()
        var nEmail = req.body.email
        var nPass = req.body.password
        let exituserEmail = false
        for (i in users){
            if (users[i].email ==  nEmail){
                exituserEmail = true
            }
        }
        if (!nEmail || !nPass) {
        return res.send("Connection status 400")
        } 
        res.cookie('username', nid)
        res.redirect("urls")
})


// urls route
app.post("/urls", (req, res) => {
    var shortstring = generateRandomString();
    var longstring = req.body.longURL;
    urDatabase[shortstring] = longstring;
    // console.log(urDatabase);
    res.redirect("/urls")
});

// delete post route
app.post('/urls/:shortURL/delete', (req, res) =>{
    const shortURL = req.params.shortURL
    delete urDatabase[shortURL]
    res.redirect("/urls")
})

// short url route 
app.post('/urls/:shortURL',(req,res) =>{
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urDatabase[shortURL] = longURL;
    res.redirect("/urls")
})


// logout route and redirect
app.post('/logout', (req,res) =>{
    const username = req.body.username
    res.clearCookie("username")
    res.redirect("/login")
})


app.get("/u/:shortURL", (req, res) => {
    const longURL = urDatabase[req.params.shortURL]
    res.redirect(longURL);
  });

app.get("/", (req, res) => {
    res.send("Hello!");
});


app.get("/urls.json",(req, res) => {
    res.json(urDatabase);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// new page
app.get("/urls/new", (req, res) => {
    let templateVars = { username: req.cookies["username"]
    };
    res.render("urls_new", templateVars);
  });

// URLS PAGE
app.get("/urls",(req, res) => {
    const username = req.cookies["username"]
    let templateVars = { urls: urDatabase,
        username: req.cookies["username"],
        email: users[username] && users[username].email || null
    };
    console.log(templateVars);
    res.render("urls_index", templateVars);
    
});

// short url direct to long url page
app.get("/urls/:shortURL", (req, res) => {
    const shortUrl = req.params.shortURL
    let templateVars = { shortUrl, longURL: urDatabase[shortUrl] };
    res.render("urls_show", templateVars);
});

// registration page
app.get("/register", (req, res) => {
    res.render("urls_registration");
})

app.get("/login", (req, res) =>{
    const username = req.cookies["username"]
    let templateVars = { urls: urDatabase,
        username: username,
        email: users[username] && users[username].email || null
    };
    res.render("urls_login", templateVars)
})


