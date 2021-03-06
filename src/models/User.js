import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  social: {
    socialOnly: { type: Boolean, default: false },
    socialName: { type: String },
  },
  name: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  address: { type: String },
  address2: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  bid: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
