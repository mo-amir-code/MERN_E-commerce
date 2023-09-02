const productModel = require("../Model/Product");
const Product = productModel.Product;

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const response = await product.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

// exports.fetchAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find({})
//     res.set("X-Total-Count", products.length);
//     res.status(200).send(products);
//   } catch (error) {
//     res.status(401).send(error.message);
//   }
// };

exports.fetchAllProductsByFilter = async (req, res) => {
  try {
    const { page, limit, category, brand, sort, order } = req.query;
    async function filter() {
      if (category && brand) {
        const count = await Product.find({ category, brand }).count()
        if(sort && order){
          const items = await Product.find({ category, brand }).skip(limit*(page-1)).limit(limit).sort({[sort]:order})
          return {items, count}
        }else{
          const items = await Product.find({ category, brand }).skip(limit*(page-1)).limit(limit)
          return {items, count}
        }
      } else if (category) {
        const count = await Product.find({ category }).count()
        if(sort && order){
          const items = await Product.find({ category }).skip(limit*(page-1)).limit(limit).sort({[sort]:order})
          return {items, count}
        }else{
          const items = await Product.find({ category }).skip(limit*(page-1)).limit(limit)
          return {items, count}
        }
      } else if (brand) {
        const count = await Product.find({ brand }).count()
        if(sort && order){
          const items = await Product.find({ brand }).skip(limit*(page-1)).limit(limit).sort({[sort]:order})
          return {items, count}
        }else{
          const items = await Product.find({ brand }).skip(limit*(page-1)).limit(limit)
          return {items, count}
        }
      } else {
        const count = await Product.find({}).count()
        if(sort && order){
          const items = await Product.find({}).skip(limit*(page-1)).limit(limit).sort({[sort]:order})
          return {items, count}
        }else{
          const items = await Product.find({}).skip(limit*(page-1)).limit(limit)
          return {items, count}
        }
      }
    }
    const products = await filter();
    res.set("X-Total-Count", products.count);
    res.status(200).json(products.items);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.fetchProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.body.id, req.body, {new:true});
    res.status(200).json(product);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.body.id, {
      deleted: true,
    }, {new:true});
    res.status(200).json(product);
  } catch (error) {
    res.status(401).send(error.message);
  }
};
