const userRouter = require('express').Router()
const userMethods = require('../util/Users')



userRouter.get('/',(req, res) => {
  res.send('userRouter')
})

userRouter.post('/add', async (req, res) => {
  const exists = await userMethods.getByEmail(req.body.email)

  if(exists.length > 0){
    return res.status(400).send({message: 'email already exists'})
  }

  const newUser = userMethods.add(req.body)
  newUser.then(result => {
    return res.status(201).send(result)
  })
})

userRouter.post('/login', async (req, res) => {
  const {email, password} = req.body
  const user = await userMethods.getByEmail(email)
  //return error code if user not found
  if(user.length === 0){
    console.log('account not found')
    return res.status(400).send({message: 'Account does not exist, please register'})
  }

  //try authenticating user
  const result = await userMethods.authenticate(password, user[0])
  if(!result){
    console.log('failed')
    return res.status(400).send({message: 'Incorrect password'})
  } else {
    console.log('success')
    return res.status(200).send({token: result, email: user[0].email, name: user[0].name, id: user[0]._id})
  }
})

userRouter.post('/authtoken', async(req, res) => {
  const {token} = req.body
  const user = await userMethods.authenticateToken(token)
  if (!user){
    return res.status(400).send({message: 'Invalid Token'})
  } else {
    return res.status(200).send(user)
  }
})

userRouter.get('/favoriteplayers/:token', async(req, res) => {
  const token = req.params.token
  const user = await userMethods.authenticateToken(token)
  const favoritePlayers = await userMethods.getFavoritePlayers(user.id)
  res.status(200).send(favoritePlayers)
})

userRouter.post('/favoriteplayers', async(req, res) => {
  console.log('add favorite player')
  const {token, playerId} = req.body
  const user = await userMethods.authenticateToken(token)
  const exists = await userMethods.checkExistingFavoritePlayer(user.id, playerId)


  if(exists){
    const result = await userMethods.deleteFavoritePlayer(user.id, playerId)
    setTimeout(() => {
      res.status(200).send(result)
    },1000)
  } else if (!exists){
    const favoritePlayer = await userMethods.addFavoritePlayer(user.id, playerId)
    console.log(favoritePlayer)
    setTimeout(() => {
      res.status(200).send(favoritePlayer)
    },1000)
  } else {
    res.status(400).send('error')
  }
})

module.exports = userRouter