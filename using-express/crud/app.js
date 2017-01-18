var express = require('express')
var jsonfile = require('jsonfile')
var app = express()

const db_path = './db.json';

//middleware that parses just the body of the req object NEEDS TO BE REQUIRED!
app.use(bodyparser.json());

//jsonfile allows you to treat a package as a database, read it
//jsonfile.readFile() blah blah blah

//or with no callbacks... const db = jsonfile.readFileSync(db_path);

//give in the object you wanna create

//what are the routes that we need to show a form on the page
//use GET
//then use POST to receive submission of the form to create data in the database

//next is the optional third parameter that calls the next middleware function
//middleware functions are chained
app.get('/', function(req, res, next){
	console.log("a new request");
	//we need call this to pass the data
	next();
})

//JSON objects need stringify instead of toString()

//doesn't need next because the response goes to the client, not the next "person"
//if you call next, it cannot get '/', because the only relevant route was passed on
//the only way it would work is with app.use('/')...blahblahblah 
app.get('/', function(req, res){
	//sends info to user (post), then receive information from user (/save)
	//whatever you write in the form is added
	res.send(`<form method="POST" action="/save"><input type="text" name="full_name"/></form>
		<input type="submit"/>`)
});

//need bodyparser, which is express middleware that turns req.body into an object

//payload = data that is packaged with the request itself, usually with post or put request = request body

app.post('/save', function(req, res){
	jsonfile.writeFileSync(db_path, {})
	//body stuff
	//redir to home page
	jsonfile.writeFile(db_path, data, function(){
		//304 status, temporary redirect
		res.redirect('/')
	}


})

app.listen(3000, function() {
	console.log("Listening on port 3000!")
})


