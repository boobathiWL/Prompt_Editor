// src/models/role.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the TypeScript interface for Role
export interface IRole extends Document {
  role_name: string;
  created_at: Date;
}

// Create the Mongoose schema using the interface
const roleSchema: Schema<IRole> = new Schema({
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

// Create a properly typed Mongoose model
const RoleModel: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>('Role', roleSchema);

export default RoleModel;
