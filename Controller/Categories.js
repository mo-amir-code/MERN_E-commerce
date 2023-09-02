const model = require('../Model/Categories')
const Categories = model.Categories

exports.fetchAllCategories = async (req, res) => {
    try{
        const categories = await Categories.find({})
        res.status(200).json(categories)
    }catch(error){
        res.status(400).json("Some Internal Error!")
    }
}