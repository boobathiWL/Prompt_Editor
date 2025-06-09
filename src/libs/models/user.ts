// src/models/user.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: string;
  deleted_at: boolean;
  created_at: Date;
  token_user_login?: string;
  token_reset_password?: string;
}

const userSchema: Schema<IUser> = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role_id: { type: String, required: true },
  deleted_at: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  token_user_login: { type: String },
  token_reset_password: { type: String },
});

// Correctly type the model
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;
