var Campground = require("../models/campground")
var Comment = require("../models/comment")

// all the middlware goes here
var middlewareObj = {}

middlewareObj.checkCampGroundOwnership = function(req,res,next){
	// is user logged in
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id,function(err, foundCampground){
			if (err) {
				req.flash("error","Campground not found");
				res.redirect("back")
			} else {
				// does user own the camp?
				// foundCampground.author.id is Object
				// req.user._id is String
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error","You don't have permission to do that");
					res.redirect("back")
				}
			}
		})
	} else {
		req.flash("error","You need to be logged in to do that");
		res.redirect("back")
	}
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	// is user logged in
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id,function(err, foundComment){
			if (err) {
				res.redirect("back")
			} else {
				// does user own the comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error","You don't have permission to do that");
					res.redirect("back")
				}
				
			}
		})
	} else {
		req.flash("error","You need to be logged in to do that");
		res.redirect("back")
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that")
	res.redirect("/login")
}


module.exports = middlewareObj