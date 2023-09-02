const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [1, "Wrong min price value"],
      max: [10000, "Wrong max price value"],
    },
    discountPercentage: {
      type: Number,
      min: [0, "Wrong min discount value"],
      max: [100, "Wrong max discount value"],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, "Wrong min rating value"],
      max: [5, "Wrong max rating value"],
      default: 0,
    },
    stock: {
      type: Number,
      min: [0, "Wrong min stock value"],
      max: [10000, "Wrong max rating value"],
      default: 0,
    },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    deleted: { type: Boolean, default: false },
  }
);

const virtual = productSchema.virtual('id');
virtual.get(function () {
  return this._id;
})
productSchema.set('toJSON', {
  virtuals: true,
  verionKey: false,
  transform: function (doc, ret) {delete ret._id}
});

exports.Product = mongoose.model("Product", productSchema)
