import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  price: { type: Number, required: true },
  period: { type: Date, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  buyer: { type: String },
});

productSchema.static("periodCalculate", function (period) {
  let date = new Date();
  date.setDate(date.getDate + period);
  return date;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
