const model = require("../Model/Cart");
const Cart = model.Cart;

exports.addToCart = async (req, res) => {
    const newItem = new Cart({...req.body, user:req.user.id});
  try {
    const doc = await newItem.save();
    const result = await doc.populate('product')
    res.status(200).json(result);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

exports.fetchCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user.id }).populate('product');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.body.id);
    res.status(200).send(deletedItem);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(req.body.id, req.body, {new:true}).populate('product')
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(401).send(error.message);
  }
};
