const mongoose = require("mongoose");
const { Schema } = mongoose;

const sizesSchema = new Schema({
  value: { type: String },
  label: { type: String },
});

const virtual = sizesSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

sizesSchema.set("toJSON", {
  virtuals: true,
  verionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Sizes = mongoose.model("Sizes", sizesSchema);
