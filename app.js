var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash")

// requring routes 
var commentRoutes = require("./routes/comments")
	campgroundRoutes = require("./routes/campgrounds")
	indexRoutes = require("./routes/index")


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v8"
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true});

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())


// seedDB(); // seed the database

// Passport Configuration
app.use(require("express-session")({
	secret:"pubg",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// middleware to add currentUser to every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();

})

// express router
app.use("/",indexRoutes)
app.use("/campgrounds",campgroundRoutes) // add /campgrounds before all routes
app.use("/campgrounds/:id/comments",commentRoutes)

app.listen(3000, function(){
	console.log("YelpCamp Server has started!");
})
// app.listen(process.env.PORT, process.env.IP);


