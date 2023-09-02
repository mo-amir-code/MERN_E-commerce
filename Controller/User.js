const model = require('../Model/User')
const User = model.User

exports.addUserAddress = async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.user.id, req.body, {new:true})   
        res.status(200).json({name:user.name, email:user.email, role:user.role, addresses:user.addresses, userImage:user.userImage})
    }catch (error){
        res.status(400).json(error.message)
    }
}

exports.fetchUserAddress = async (req, res) => {
    try{
        const addresses = await User.findById(req.user.id).select('addresses')   
        res.status(200).json(addresses)
    }catch (error){
        res.status(400).json(error.message)
    }
}

exports.fetchUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        res.status(200).json({name:user.name, email:user.email, role:user.role, addresses:user.addresses, userImage:user.userImage})
    }catch (error){
        res.status(400).json(error.message)
    }
}