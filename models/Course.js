const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true, maxLength: 255 },
});

const Course = new mongoose.model("Course", courseSchema);

exports.Course = Course;
