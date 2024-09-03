import mongoose from "mongoose";

// saving the data in DB
// defining a schema
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token_user_login: {
    type: String,
  },
  token_reset_password: {
    type: String,
  },
  role_id: {
    type: String,
    required: true,
  },
  deleted_at: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create a model
const user_schema = mongoose.models.User || mongoose.model("User", userSchema);
export default user_schema;
