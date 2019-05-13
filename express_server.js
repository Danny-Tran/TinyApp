const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require ('bcrypt');
const cookieSession = require('cookie-session');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cookieSession({
    name: 'session',
    keys: ["key1"],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


const urDatabase = {
    b6UTxQ: { longURL: "https://www.tsn.ca", username: "aJ48lW" },
    i3BoGr: { longURL: "https://www.google.ca", username: "aJ48lW" }
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
};

// APP FUNCTIONS
function urlForUser(id) { 
    let userURL = {}
    for (var shortURL in urDatabase){
        let url = urDatabase[shortURL]
            if (url.username === id) {
                userURL[shortURL] = url.longURL;
        }
    }
    return userURL;
};

function emailLookup(email) {
    for (let userID in users) {
        if (email === users[userID].email) {
            return userID;
        }
    }
};
var generateRandomString = () => Math.random().toString(36).substring(2,8)

app.listen(PORT,() => {
    console.log(`Example app litsening on port ${PORT}!`);
});


// register route
app.post ("/register", (req,res) =>{
    var nid = generateRandomString();
    var nEmail = req.body.email;
    var nPass = req.body.password;
    var hashedPassword = bcrypt.hashSync(nPass,10);
        let exituserEmail = false;
        for (i in users){
            if (users[i].email ==  nEmail){
                exituserEmail = true;
            }
        }
        if (!nEmail || !nPass) {
            return res.send("Connection status 400")
        } else if (exituserEmail) {
            return res.send("Account already exit, Please use a new email adress")
        } 
        req.session.username = nid;
        res.redirect("/urls");
        users[nid] = {id:nid, email: nEmail, password:hashedPassword}
        console.log (users);
});

    
// login route and redirect
 app.post('/login', (req,res) =>{
    const email = req.body.email;
    const userID = emailLookup(email);
    const password = req.body.password;

    if (!userID) {
        res.send("Please eneter valid Email and Password!")
    } else if (!bcrypt.compareSync(password, users[userID].password)) {
        res.send("Please enter a valid Email and Password")
    } else {
        req.session.username = userID;
        res.redirect("urls");
    }
});


// urls route
app.post("/urls", (req, res) => {
    var shortURL = generateRandomString();
    var longURL = req.body.longURL;
    urDatabase[shortURL] = {
        longURL: longURL,
        username: req.session.username
    };
    const templateVars = {
        shortURL: shortURL,
        longURL: req.body.longURL,
        username: req.session.username,
        users: users
    }
    res.redirect("/urls");
});


// delete post route
app.post('/urls/:shortURL/delete', (req, res) =>{
    const shortURL = req.params.shortURL
    delete urDatabase[shortURL]
    res.redirect("/urls");
});


// short url route 
app.post('/urls/:shortURL',(req,res) =>{
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urDatabase[shortURL] = longURL;
    res.redirect("/urls");
});



// logout route and redirect
app.post('/logout', (req,res) =>{
    req.session.username = null;
    res.redirect("/login");
});


// GET ROUTE
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
    const templateVars = { username: req.session.username
    };
    const username = req.session.username
    if (username) {
        res.render("urls_new", templateVars);
    } else {
        res.redirect("/login")
    }
});

// URLS PAGE
app.get("/urls",(req, res) => {
    const username = req.session.username;
    const userURLS = urlForUser(username);
    let templateVars = { 
        urls: userURLS,
        email: users[username] && users[username].email || null,
        id: req.session.username 
    };

    
    if (username) {
        res.render("urls_index", templateVars);
    } else {
        res.redirect("/login")
    }
    
});


// short url direct to long url page
app.get("/urls/:shortURL", (req, res) => {
    const username = req.session.username
    const shortURL = req.params.shortURL
    const user = user[username]
    if (username === user) {
        let templateVars = { 
            shortURL , 
            longURL: urDatabase[shortURL].longURL,
            id: req.session.username,
            user:users
        };
        res.render("urls_show", templateVars);
    } else {
        res.send("Access Denied")
    }
});

// registration page
app.get("/register", (req, res) => {
    const templateVars = {
        user:users,
        id:req.session.username
    }
    res.render("urls_registration",templateVars);
})

app.get("/login", (req, res) =>{
    const username = req.session.username
    let templateVars = { urls: urDatabase,
        username: username,
        email: users[username] && users[username].email || null
    };
    res.render("urls_login", templateVars)
})



