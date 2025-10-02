import mongoose from 'mongoose';
import { authConnection } from '../lib/mongodb';

const AuthUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
}, { timestamps: true });

export default authConnection.model('AuthUser', AuthUserSchema);