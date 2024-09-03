import mongoose from "mongoose";

// saving the data in DB
// defining a schema
const outlinePromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create a model
const outline_prompt_schema =
  mongoose.models.Outline_Prompt ||
  mongoose.model("Outline_Prompt", outlinePromptSchema);
export default outline_prompt_schema;
