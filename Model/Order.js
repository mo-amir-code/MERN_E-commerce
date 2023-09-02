const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  item: { type: Schema.Types.ObjectId, required:true, ref: "Product"},
  quantity: { type: Number, required:true },
  totalAmount: { type: Number, required:true },
  address: { type: Schema.Types.Mixed, required:true },
  user: { type: Schema.Types.ObjectId, required:true, ref: "User" },
  paymentMethod: { type: String, required:true },
  paymentStatus: {type: String, default:"Pending"},
  status: { type: String, required:true, default: "Pending" },
});

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  verionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
