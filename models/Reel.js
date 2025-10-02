import mongoose from 'mongoose';
import { reelsConnection } from '../lib/mongodb';

const ReelSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: [true, 'Please provide a video URL.'],
  },
  caption: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  shareCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default reelsConnection.model('Reel', ReelSchema);