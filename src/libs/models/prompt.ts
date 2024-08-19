import mongoose from "mongoose";

// saving the data in DB
// defining a schema
const promptSchema = new mongoose.Schema({
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
const prompt_schema =
  mongoose.models.Prompt || mongoose.model("Prompt", promptSchema);
export default prompt_schema;
