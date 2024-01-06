const User = require('../database/User/userSchema')
const Player = require('../database/Player/playerSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


const userMethods = {
  add: async function(data){
    const {email, name, password, captcha} = data
    const saltRounds = 8
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const userInfo = {
      email: email, 
      name: name,
      passwordHash: passwordHash
    }
    const user = new User(userInfo)
    await user.save()
    return user
  },
  getByEmail: async function(email){
    return new Promise((resolve, reject) => {
      User.find({'email': email})
        .then(results => {
          resolve(results)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  authenticate: async function(password, user){
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if(!passwordCorrect){
      return false
    } 
    const userForToken = {
      email: user.email,
      id: user._id,
      name: user.name
    }

    const token = jwt.sign(userForToken, 'secretkey', { expiresIn: 3600*24 })
    return token
  },
  authenticateToken: async function(token){
    try{
      const decodedToken = jwt.verify(token, 'secretkey')
      return decodedToken
    } catch (error){
      if(error.name === 'JsonWebTokenError'){
        return false
      }
    }
  },
  addFavoritePlayer: async function(userId, playerId){
    console.log('addFavoritePlayer called')
    const favoriteInfo = {
      userId: userId,
      playerId: playerId
    }
    const favoritePlayer = new Player(favoriteInfo)
    await favoritePlayer.save()
    return favoritePlayer
  },
  deleteFavoritePlayer: async function(userId, playerId){
    const result = await Player.deleteMany({
      'userId': userId,
      'playerId': playerId
    })
    return result
  },
  getFavoritePlayers: async function(userId){
    return new Promise((resolve, reject) => {
      Player.find({'userId': userId})
        .then(results=> {
          resolve(results.map(result => result.playerId))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  
  checkExistingFavoritePlayer: async function(userId, playerId){
    const exists = await Player.findOne({'userId': userId, 'playerId': playerId})
    return exists !== null
  }
}

module.exports = userMethods
