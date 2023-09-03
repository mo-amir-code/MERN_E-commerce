const mongoose = require("mongoose");
const { Schema } = mongoose;

const image = "https://media.licdn.com/dms/image/D4D03AQEPOgH7SgEFZA/profile-displayphoto-shrink_400_400/0/1681530657927?e=1698278400&v=beta&t=7l8ylhEv29AzrUZSF1Vv2ZiQIFO3JsTxZyx84-rnBjQ"

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: Buffer, required: true },
  userImage: { type: String, default: image },
  addresses: { type: [Schema.Types.Mixed], default:[] },
  role: { type: String,  default: "user" },
  salt: Buffer,
  resetPasswordToken: {type:String, default:""}
});

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  verionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
