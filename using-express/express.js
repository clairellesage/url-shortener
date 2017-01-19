const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
 "b2xVn2": "http://www.lighthouselabs.ca",
 "9sm5xK": "http://www.google.com",
};

const users = {}

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
 res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
	let templateVars = {
username: req.cookies["username"],
	};
 res.render("urls_new", templateVars);
});

//when you type in urls/ and then the id, 
//it will render urls_show.ejs
app.get("/urls/:id", (req, res) => {
	let shortURL = req.params.id
 	let longURL = urlDatabase[shortURL]
	let templateVars = {
	username: req.cookies["username"],
	shortURL : shortURL,
	longURL : longURL
		};	
 res.render("urls_show", templateVars);
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
app.get("/u/:shortURL", (req, res) => {re
	let shortURL= req.params.shortURL; 
  let longURL = urlDatabase[shortURL];
  if (shortURL = false) {
  	res.redirect("urls_index");
  } else {
  res.redirect(longURL);
	}
});

app.get("/register", (req, res) => {
		let templateVars = {
	username: req.cookies["username"],
	password: req.cookies["password"],
		};	
	res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let randId = generateRandomString();
	res.cookie("username", randId)
	if (email === "" || password === "") {
		res.status(400);
		res.send("Error 400 : Please fill in all fields.");
	}
	for (key in users) {
		if (users[key].email === req.body.email) {
			res.status(400);
			res.send("Sorry, that email is already registered!");
		}
	}	users[randId] = {id : randId,
					email : email,
					password : password};
	
	res.redirect("/urls");
})

app.get("/login", (req, res) => {
	res.render("login")
})

app.post("/login", (req, res) => {
	let user = req.body.username;
	res.cookie("username", user);
	res.redirect("/");
});

app.post("/logout", (req, res) => {
	res.clearCookie("username")
	res.redirect("/");
});
// Add a route to accept a POST to /login in your Express server.

// We will just track a string value called username using a cookie.

// Use the endpoint to set the cookie parameter called username to the value submitted in the request body via the form.

