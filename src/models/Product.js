import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: [{ type: String, required: true }],
  description: { type: String, required: true, trim: true, minLength: 10 },
  startPrice: { type: Number, required: true },
  currentPrice: { type: Number },
  period: { type: Date, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, default: 0, required: true },
    bidsCount: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  buyer: { type: String },
  endCheck: { type: Boolean, default: false },
});

productSchema.static("periodCalculate", function (period) {
  let date = new Date();
  date.setDate(date.getDate() + Number(period));
  return date.getTime();
});

productSchema.static("photoArrayPath", function (fileUrl) {
  const result = [];
  for (const item of fileUrl) {
    result.push(item.path);
  }
  return result;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
