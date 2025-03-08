const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
// const crypto=require('crypto');
// const { type } = require('os');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a Name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: [true,'This Email already exists, try other one!!'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    institute:{
      type:String,
      required:[true,"A user must provide his institute name"]
    },
    photo: String,
    role:{
      type:String,
      enum:['user','admin'],
      default:'user',
      require:true
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      // select: false, // Prevents password from being returned in queries
    },
    confirm_password:{
        type:String,
        require:true,
        minlength:8,
        validate:{
            validator:function(ele){
                return ele===this.password
            },
            message:"Enter correct Confirm Password!!"
        }
    },
    changed_password: {
      type:Date
    },
  }
);

// Middleware: Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it was modified
  if (!this.isModified('password')) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirm_password field
  this.confirm_password = undefined;
  next();
});

// Instance method: Check if passwords match
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User=mongoose.model('User',userSchema)

module.exports=User
