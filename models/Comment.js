import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: 'comment is required'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const model = mongoose.model('Comment', CommentSchema);
export default model;
