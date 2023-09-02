const model = require("../Model/Order");
const Order = model.Order;

exports.createOrder = async (req, res) => {
  try {
    const order = new Order({...req.body, user:req.user.id});
    const doc = await order.save();
    res.status(200).json(doc);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.fetchOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('item');
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.fetchAllOrders = async (req, res) => {
  try {
    const {page, limit} = req.query
    const count = await Order.find({}).count()
    const orders = await Order.find({}).skip(limit*(page-1)).limit(limit).populate('item');
    res.set("X-Total-Count", count)
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
 
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.body.id, req.body, {new:true}).populate('item')
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
 
exports.deleteOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndDelete(req.body.id)
    res.status(200).json("Item Deleted Successfully");
  } catch (error) {
    res.status(400).json(error.message);
  }
};
 