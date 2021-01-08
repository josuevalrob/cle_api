import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL;
// const URL_PATTERN = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
export const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
export const USER_ROL = ['patron', 'admin', 'sudo']

const userSchema = new Schema({
  rol: {
    type: String,
    enum: USER_ROL,
    default: 'patron'
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: [true, 'email unique 🙅🏻‍♂️'], 
    trim: true,
    match: EMAIL_PATTERN
  },
  password: {
    type: String,
    required: [true, 'we need a password'],
    minlength: 3 //? validate
  },
  firstName: {
    type:String,
    required: [true, 'give me your name, at least 3 letters'],
    minlength: 3
  },
  lastName: {
    type: String,
    minlength: 3
  },
  phone : { 
    type: String, /*not required by default**/ 
    validate: {
        validator: value => {
            var regex = /^\d{10}$/;
            return (value == null || !!value.trim()) || regex.test(value)
        },
        message: '🙅🏻‍♂️📞 Provided phone number is invalid.'
    }
  },
  Country: {
    type: String,
    minlength: 3
  },
  City: {
    type: String,
    minlength: 3
  },
  birth: Date,
  profilePhoto: String
}, {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret
      }
    }
  })

userSchema.pre('save', function (next) {
  const user = this;
  if (user.email === FIRST_ADMIN_EMAIL) {
    user.role = 'sudo'; // super user do
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