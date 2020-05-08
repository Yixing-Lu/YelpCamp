var express = require("express")
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
	// get all campgrounds from DB
	Campground.find({},function(err,allCampgrounds){
		if (err) {
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	})
});

// create: add new campground to DB
router.post("/", middleware.isLoggedIn,function(req,res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var dsc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, img:image, description:dsc, author:author};
	// create a new campground and save to DB
	// campgrounds.push(newCampground);
	Campground.create(newCampground, function(err, newCreatCampground){
		if (err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	})
	
})

// New: show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new")
})

// Show: show more info about the campground
router.get("/:id",function(req,res){
	// find the campground with ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err) {
			console.log(err);
		} else {
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
	
})

// Edit campground route
router.get("/:id/edit",middleware.checkCampGroundOwnership, function(req,res){
	Campground.findById(req.params.id,function(err, foundCampground){
		res.render("campgrounds/edit",{campground: foundCampground})
	})	
})
// Update campground route
router.put("/:id",middleware.checkCampGroundOwnership,function(req,res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
	
})

// Destroy campground route
router.delete("/:id",middleware.checkCampGroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds")
		}
	})
})

module.exports = router

