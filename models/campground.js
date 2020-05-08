var mongoose = require("mongoose")
// set up schema
var campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
})
var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground