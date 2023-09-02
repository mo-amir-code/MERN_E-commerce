const model = require('../Model/Sizes')
const Sizes = model.Sizes

exports.fetchAllSizes = async (req, res) => {
    try{
        const sizes = await Sizes.find({})
        res.status(200).json(sizes)
    }catch(error){
        res.status(400).json("Some Internal Error!")
    }
}