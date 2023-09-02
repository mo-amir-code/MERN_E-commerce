const model = require('../Model/Brands')
const Brands = model.Brands

exports.fetchAllBrands = async (req, res) => {
    try{
        const brands = await Brands.find({})
        res.status(200).json(brands)
    }catch(error){
        res.status(400).json("Some Internal Error!")
    }
}