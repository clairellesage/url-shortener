const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
//I used bcrptjs because bcrypt wouldn't install!
const bcrypt = require('bcryptjs');
const password = "purple-monkey-dinosaur";
const hashed_password = bcrypt.hashSync(password, 10);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
 "b2xVn2": "http://www.lighthouselabs.ca",
 "9sm5xK": "http://www.google.com",
};

const userDb = { randId : { 
    id : null,
	email : null,
	password : null,
	urls : {"b2xVn2": "someUserId",
			"9sm5xK": "someUserId"}
	}
};

function allowCookies(req, res, userDb) {
	if (userDb[req.cookies.userId]) {
		userDb.randId.email = userDb[req.cookies.userId].email;
	} 
	return userDb;
}

function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

//HOME
app.get("/", (req, res) => {
	allowCookies(req, res, userDb);
 	res.end("Hello!", userDb);
});

//URLS
app.get("/urls", (req, res) => {
	//if there's a userId cookie and it's in the db
	if (req.cookies.userId && userDb[req.cookies.userId]) {
		var templateVars = {
			email: userDb[req.cookies.userId].email,
			urls: userDb[req.cookies.userId].urls
		}
		res.render("urls_index", templateVars);
	} else {
		res.redirect("/login");
	}
});

app.post("/urls", (req, res) => {
	/*assigning a shortURL to the longURL entry and storing it in the userDb*/
	let shortURL = generateRandomString();
	userDb[req.cookies.userId].urls[shortURL] = req.body.longURL
	res.redirect("/urls")
});

//NEW
app.get("/urls/new", (req, res) => {
	if (req.cookies.userId && userDb[req.cookies.userId]) {
		var templateVars = {
			email: userDb[req.cookies.userId].email,
			urls: userDb[req.cookies.userId].urls
		}
		res.render("urls_new", templateVars);
	} else {
		res.redirect("/login")
	}
});
	
/*will delete for any id submitted by the delete button
in urls_index.ejs, using app.post*/ 
app.post("/urls/:id/delete", (req, res) => {
	let shortURL = req.params.id;
	//deletes shortURL from the database, and in turn the longURL
	delete userDb[req.cookies.userId].urls[shortURL];
	res.redirect("/urls");
})

///shortURLs in the urlDatabase redirect to their longURLs
app.get("/u/:shortURL", (req, res) => {
	let shortURL= req.params.shortURL; 
  let longURL = userDb.urls[shortURL];
  if (shortURL = false) {
  	res.redirect("urls_index");
  } else {
  res.redirect(longURL);
	}
});

//REGISTER
app.get("/register", (req, res) => {	
	res.render("urls_register");
});

app.post("/register", (req, res) => {
	let randId = generateRandomString();
	userDb[randId] = {};
	userDb[randId].email = req.body.email;
	userDb[randId].password = req.body.password;
	userDb[randId].urls = {};

	const hashed_password = bcrypt.hashSync(password, 10);
	console.log(hashed_password)
	res.cookie("userId", randId);

	if (req.body.email === "" || req.body.password === "") {
		res.status(400);
		res.send("Error 400 : Please fill in all fields.");
		//there's probably a problem here
	} else if (userDb.randId.email === req.body.email) {
		res.status(400);
		res.send("Sorry, that email is already registered!");
	}
	res.redirect("/urls");

});

//LOGIN
app.get("/login", (req, res) => {
	//if statement if already logged in
	if (userDb[req.cookies.userId]) {
		res.redirect("/urls")
	}
	res.render("urls_login", userDb)
})

app.post("/login", (req, res) => {
	var templateVars = {
		email: req.body.email,
		password: req.body.password,
	}
	if (email === "" || password === "") {
		res.status(400);
		res.send("Error 400 : Please fill in all fields.");
  	}
  Object.keys(userDb).forEach(id => {
		if (userDb[id].email == email) {
			if (bcrypt.compareSync(req.body.password, userDb[id].password)) {
				res.cookie("userId", userDb[id].id)
				res.redirect("/")
			}
		} 
	});
	res.status(403);
	res.send("Error 403: Wrong username or password.")
});

//LOGOUT
app.post("/logout", (req, res) => {
	res.clearCookie("userId");
	res.redirect("/");
});

//TINY URL
app.get("/urls/:id", (req, res) => {
	let randId = req.cookies.userId
	let shortURL = req.params.id
	let longURL = userDb[randId].urls[shortURL]
	let templateVars = {
			shortURL : shortURL,
			longURL : longURL,
			email: userDb[randId].email,
		}
		//allowCookies(req, res, templateVars)
  res.render("urls_show", templateVars);
});

//post modifies the corresponding longURL
app.post("/urls/:id", (req, res) => {
	let randId = req.cookies.userId
	let shortURL = req.params.id;
 	let longURL = req.body.longURL
 	userDb[randId].urls[shortURL] = longURL
 	let templateVars = {
	 	email: userDb[randId].email,
		urls : userDb[randId].urls,
		shortURL : shortURL,
		longURL : longURL
	}
	//allowCookies(req, res, templateVars)
  res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}!`);
});