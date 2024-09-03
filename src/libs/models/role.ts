import mongoose from "mongoose";

// saving the data in DB
// defining a schema
const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create a model
const role_schema = mongoose.models.Role || mongoose.model("Role", roleSchema);
export default role_schema;
