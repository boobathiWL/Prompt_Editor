import mongoose from "mongoose";

// saving the data in DB
// defining a schema
const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  script_moral: {
    type: String,
    required: true,
  },
  script: {
    type: Array,
    default: [],
  },
  outline: {
    type: Array,
    default: [],
  },
  prompt: {
    type: Array,
    default: [],
  },
  output: {
    type: Array,
    default: [],
  },
  script_update: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create a model
const project_schema =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
export default project_schema;
