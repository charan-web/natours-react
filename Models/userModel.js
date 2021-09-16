const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a unique name"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      select: false,
    },

    email: {
      type: String,
      required: [true, "A user must have a unique name"],
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return val === this.passwordConfirm;
        },
        message: "PassWords are not matching",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "lead-guide", "guide"],
      default: "user",
    },

    passwordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
   
  },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next()
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || !this.isNew) return next();
  this.passwordAt = Date.now() - 1000;
  next()
});

userSchema.pre(/^find/,function(next){
  this.find({active:{$ne : false}})
  next()
}
)

userSchema.methods.checkPassword = async (Cpassword, Upassword) => {
  return await bcrypt.compare(Cpassword, Upassword);
};

userSchema.methods.isPasswordChanged = (jwttimestamp) => {
  if (this.passwordAt) {
    let passwordChanged = parseInt(this.passwordAt.getTime() / 1000,10); 

    return jwttimestamp < passwordChanged;
  }

  return false;
};

userSchema.methods.resetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;  
 
     
  return token; 
};

const User = mongoose.model("User",userSchema);

module.exports = User;
