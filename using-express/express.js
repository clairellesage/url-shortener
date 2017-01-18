const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

var urlDatabase = {
 "b2xVn2": "http://www.lighthouselabs.ca",
 "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
	let templateVars = {
		username: req.cookies["username"],
	};
	console.log(req.cookies)
 res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
 res.json(urlDatabase);
});

// app.get("/hello", (req, res) => {
//  res.end("<html><body>Hello <b>World</b></body></html>\n");
// });
	
app.get("/urls", (req, res) => {
	let templateVars = {
		username: req.cookies["username"],
		urls: urlDatabase,
	};
	//check this
 res.render("urls_index", {templateVars: templateVars});
});

app.get("/urls/new", (req, res) => {
	let templateVars = {
username: req.cookies["username"],
	};
 res.render("urls_new");
});

//when you type in urls/ and then the id, 
//it will render urls_show.ejs
app.get("/urls/:id", (req, res) => {
	let templateVars = {
	username: req.cookies["username"],
		};
 let shortURL = req.params.id
 let longURL = urlDatabase[shortURL]
 templateVars += {shortURL: longURL };
 res.render("urls_show", {short: shortURL, long: longURL});
});

//post the function generateRandomString	
app.post("/urls", (req, res) => {
	/*assigning a shortURL to the longURL entry 
	and storing it in the database*/
 urlDatabase[generateRandomString()] = req.body.longURL;
 res.redirect("/urls")
});

/*will "delete" for any id submitted by the delete button
in urls_index.ejs, using app.post*/ 
app.post("/urls/:id/delete", (req, res) => {
	let shortURL= req.params.id;
	//deletes shortURL from the database, and in turn the longURL
	delete urlDatabase[shortURL] 
	res.redirect("/urls");
})
//urls_show 
//:id is the shortURL
//post modifies the corresponding longURL
//redirects client back to /urls
app.post("/urls/:id", (req, res) => {
	let shortURL = req.params.id;
	let longURL = urlDatabase[shortURL];
	urlDatabase[shortURL] = req.body.longURL;
	res.redirect("/urls");
})

///shortURLs in the urlDatabase will redirect to their longURLs
app.get("/u/:shortURL", (req, res) => {
	let shortURL= req.params.shortURL; 
  let longURL = urlDatabase[shortURL];
  if (shortURL = false) {
  	res.redirect("urls_index");
  } else {
  res.redirect(longURL);
	}
});

app.get("/login", (req, res) => {
	res.render("urls_login");
});

app.post("/login", (req, res) => {
	let user = req.body.username;
	res.cookie("username", user);
	res.redirect("/");
});

// Add a route to accept a POST to /login in your Express server.

// We will just track a string value called username using a cookie.

// Use the endpoint to set the cookie parameter called username to the value submitted in the request body via the form.