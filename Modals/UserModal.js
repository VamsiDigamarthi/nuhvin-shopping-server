import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "captain", "seller"],
    default: "user",
  },
  termsAndCondition: { type: Boolean, default: false },
  profilePic: { type: String, default: null },
  signUpDateAndTime: { type: Date, default: Date.now() },
  address: { type: String, default: null },
  fbtoken: { type: String, default: null },
  password: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
});

userSchema.index({ location: "2dsphere" });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
