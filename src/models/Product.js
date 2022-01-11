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
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  endCheck: { type: Boolean, default: false },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

productSchema.static("periodCalculate", function (period) {
  let date = new Date();
  date.setDate(date.getDate() + Number(period));
  return date.getTime();
});

productSchema.static("updatePeriodCalculate", function (existing, period) {
  let date = new Date(existing);
  date.setDate(date.getDate() + Number(period));
  return date.getTime();
});

productSchema.static("updatePeriodEndCheck", function (existing, period) {
  let date = new Date(existing);
  const endAt = date.setDate(date.getDate() + Number(period));
  const nowAt = new Date().getTime();
  const result = endAt - nowAt;
  if (result > 0) {
    return false;
  }
  return true;
});

productSchema.static("photoArrayPath", function (fileUrl, isHeroku) {
  const result = [];
  for (const item of fileUrl) {
    result.push(isHeroku ? item.location : item.path);
  }
  return result;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
