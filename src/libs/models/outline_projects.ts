import mongoose from "mongoose";

// saving the data in DB
// defining a schema
const outlineProjectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  outline_moral: {
    type: String,
    required: true,
  },
  prompt: {
    type: Array,
    default: [],
  },
  output: {
    type: Array,
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create a model
const outline_project_schema =
  mongoose.models.Outline_Project ||
  mongoose.model("Outline_Project", outlineProjectSchema);
export default outline_project_schema;
