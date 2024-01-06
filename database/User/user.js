const userModel = require('./userSchema')

const addUser = async (data) => {
  try{
    const newUser = new userModel(data)
    await newUser.save()
    return newUser
  } catch (err) {
    console.log(err)
    throw err
  }
}
module.exports = addUser