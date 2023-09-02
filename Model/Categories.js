const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  value: { type: String, unique: true },
  label: { type: String },
});

const virtual = categorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  verionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Categories = mongoose.model("Categories", categorySchema);
