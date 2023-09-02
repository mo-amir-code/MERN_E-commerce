const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema({
  value: { type: String },
  label: { type: String },
});

const virtual = brandSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

brandSchema.set("toJSON", {
  virtuals: true,
  verionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Brands = mongoose.model("Brands", brandSchema);
