import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: 'comment is required'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }
});

const model = mongoose.model('Comment', CommentSchema);
export default model;
