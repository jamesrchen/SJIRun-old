const mongoose = require("mongoose")

const schema = mongoose.Schema({
	email: { type : String , unique : true, required : true, dropDups: true},
	full_name: String,
	classroom: String,
	strava_id: Number,
  distance: Number,
})

module.exports = mongoose.model("User", schema)