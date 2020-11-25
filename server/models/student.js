let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let estudianteSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  note: {
    tyep: String,
  },
});

module.exports = mongoose.model("Student", estudianteSchema);
