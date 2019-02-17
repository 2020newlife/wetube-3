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

// ISSUE: email을 변경할 경우 즉시 로그아웃 되는 현상 발생.
// serialize, deserialize에 usernameField가 아닌 id를 사용하도록 변경
// https://github.com/saintedlama/passport-local-mongoose/issues/46
UserSchema.statics.serializeUser = () => (user, cb) => cb(null, user.id);

UserSchema.statics.deserializeUser = function() {
  const self = this;
  return (id, cb) => self.findById(id, cb);
};

const model = mongoose.model('User', UserSchema);

export default model;
