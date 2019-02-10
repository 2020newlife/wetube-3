import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  facebookId: Number,
  githubId: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    }
  ]
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

UserSchema.statics.serializeUser = () => (user, cb) => cb(null, user.id);

UserSchema.statics.deserializeUser = function() {
  const self = this;
  return (id, cb) => self.findById(id, cb);
};

const model = mongoose.model('User', UserSchema);

export default model;
