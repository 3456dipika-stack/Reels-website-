import mongoose from 'mongoose';
import { usersConnection } from '../lib/mongodb';

const UserSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
  },
  // You can add other non-sensitive profile information here in the future
  // e.g., bio: String, profilePictureUrl: String
}, { timestamps: true });

export default usersConnection.model('User', UserSchema);