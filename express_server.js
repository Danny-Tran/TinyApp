var express = require('express');
var app = express();
var PORT = 8080;
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
const bcrypt = require ('bcrypt')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");


const urDatabase = {
    b6UTxQ: { longstring: "https://www.tsn.ca", username: "aJ48lW" },
    i3BoGr: { longstring: "https://www.google.ca", username: "aJ48lW" }
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
    },
    "user3RandomID": {
        id: "user3RandomID", 
        email: "danny@gmail.com", 
        password: "123"
      }
}

function urlForUser(username) { 
    let userURL = {}
    for (var shortUrl in urDatabase){
        let url = urDatabase[shortUrl]
        
        if (url.username === username) {
            userURL[shortUrl] = url.longstring;
        }
    }
    return userURL;
} 

app.get("/urls",(req, res) => {
    const username = req.cookies["username"]
    const userURLS = urlForUser(username)
    let templateVars = { 
        urls: userURLS,
        email: users[username] && users[username].email || null
    };

    
    if (username) {
        res.render("urls_index", templateVars);
    } else {
        res.redirect("/login")
    }
    
});

var generateRandomString = () => Math.random().toString(36).substring(2,8)

app.listen(PORT,() => {
    console.log(`Example app litsening on port ${PORT}!`);
});

// register route
app.post ("/register", (req,res) =>{
    var nid = generateRandomString()
    var nEmail = req.body.email
    var nPass = req.body.password
    var hashedPassword = bcrypt.hashSync(nPass,10);
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
        users[nid] = {id:nid, email: nEmail, password:hashedPassword}
        console.log (users)
})
    
// login route and redirect
 app.post('/login', (req,res) =>{
    const email = req.body.email;
    const userID = emailLookup(email)
    const password = req.body.password;

    function emailLookup(email) {
        for (let userID in users) {
            if (email === users[userID].email) {
                return userID;
            }
        }
    }

    if (!userID) {
        res.send("Please eneter valid Email and Password!")
    } else if (!bcrypt.compareSync(password, users[userID].password)) {
        res.send("Please enter a valid Email and Password")
    } else {
        res.cookie("username", users[userID].id)
        res.redirect("urls")
        
    }
});

// urls route
app.post("/urls", (req, res) => {
    var shortstring = generateRandomString();
    var longstring = req.body.longURL;
    urDatabase[shortstring] = {
        longstring: longstring,
        username: req.cookies["username"]
    };
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
    var username = req.cookies["username"]
    if (username) {
        res.render("urls_new", templateVars);
    } else {
        res.redirect("/login")
    }
  });

// URLS PAGE








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



