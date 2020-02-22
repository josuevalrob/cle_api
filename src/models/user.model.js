import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL;
// const URL_PATTERN = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['teacher', 'student', 'admin'],
    default: 'student'
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: [true, 'email unique'], 
    trim: true,
    match: EMAIL_PATTERN
  },
  password: {
    type: String,
    required: [true, 'we need a password'],
    minlength: 3 //? validate
  }, 
  name:{
    type:String,
    required: [true, 'give me your name, at least 3 letters'],
    minlength: 3
  },   
}, {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.password;
        return ret
      }
    }
  })

userSchema.pre('save', function (next) {
  const user = this;
  if (user.email === FIRST_ADMIN_EMAIL) {
    user.role = 'admin';
  }
  if (!user.isModified('password')) { 
    next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            next();
          })
      })
      .catch(error => next(error))
  }
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}


const User = mongoose.model('User', userSchema);
export default User;