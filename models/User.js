const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
});

/** Mongoose Hooks */
// fire a function after doc saved to db // ทำงานหลังจาก save ข้อมูล
userSchema.post("save", function (doc, next) {
  //   do somethinks here
  next();
});

// fire a function before dec saved to db // ทำงานก่อน save ข้อมูล
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error("incorrect password")
    }
    throw Error("incorrect email")
}

const User = mongoose.model("user", userSchema);
module.exports = User;
