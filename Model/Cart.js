const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required:true, ref: "User" },
  product: { type: Schema.Types.ObjectId, required:true, ref: "Product"},
  quantity: { type: Number, required:true},
});

const virtual = cartSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

cartSchema.set("toJSON", {
  virtuals: true,
  verionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Cart = mongoose.model("Cart", cartSchema);
