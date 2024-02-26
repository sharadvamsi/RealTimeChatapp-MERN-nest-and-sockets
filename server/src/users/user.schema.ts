import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profileImage: {
    type: String,
    default: '', // Default profile image URL or empty string
  },
});

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  profileImage: string; // Changed field name from avatarImage to profileImage
  
}
