const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/register', userCtrl.register)

router.post('/sendOtp', userCtrl.sendOtp)

router.post('/login', userCtrl.login)

router.post('/updateProfile', auth, userCtrl.updateProfile)

router.get('/getRoomIds', auth, userCtrl.getRoomIds)

router.post('/sendMessage', auth, userCtrl.sendMessage)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/infor', auth, userCtrl.getUser)

router.patch('/addcart', auth, userCtrl.addCart)

router.get('/history', auth, userCtrl.history)

router.post('/product-rating', auth, userCtrl.productRating)

router.get('/logout', userCtrl.logout)

module.exports = router