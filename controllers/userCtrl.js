const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const Users = require('../models/userModel')
const Products = require('../models/productModel')
const Payments = require('../models/paymentModel')
const userVerifyOtps = require('../models/userVerifyOtpModel')
const messageRooms = require('../models/messageRoomModel')
const SendMail = require('../utils/SendMail')

const userCtrl = {
    register: async (req, res) => {
        const reg = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g;
        try {
            const { otp, name, email, password } = req.body;
            const userVerifyOtpRecord = await userVerifyOtps.findOne({ user_email: email });
            const userOtp = userVerifyOtpRecord.otp;
            const expiresAt = userVerifyOtpRecord.expiresAt;
            const isValidOtp = await bcrypt.compare(`${otp}`, userOtp);
            if (!userOtp || !isValidOtp) {
                return res.status(400).json({ msg: "OTP does not match" })
            } else if (expiresAt < Date.now()) {
                await userVerifyOtps.deleteOne({ user_email: email });
                return res.status(400).json({ msg: "Code has expired. Please request again." })
            } else {
                const user = await Users.findOne({ email })
                if (user) return res.status(400).json({ msg: "The email already exists." });

                if (password.length < 6)
                    return res.status(400).json({ msg: "Password is at least 6 characters long." })
                if (!reg.test(email)) {
                    return res.status(400).json({ msg: "Invalid email!" })
                }
                // Password Encryption
                const passwordHash = await bcrypt.hash(password, 10)
                const newUser = new Users({
                    name, email, password: passwordHash
                })

                // Save mongodb
                await newUser.save()

                // Then create jsonwebtoken to authentication
                const accesstoken = createAccessToken({ id: newUser._id })
                const refreshtoken = createRefreshToken({ id: newUser._id })

                res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
                })
                res.status(200).json({ msg: "register succeeded!" })
            }
            // res.json({ accesstoken })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    sendOtp: async (req, res) => {
        try {
            const emailExisted = await Users.findOne({ email: req.body.email });
            if (emailExisted) {
                console.log('email existed')
                return res.status(400).json({ msg: "Email already existed!" });
            }
            const OtpExisted = await userVerifyOtps.findOne({ user_email: req.body.email })
            if (OtpExisted) {
                await userVerifyOtps.deleteOne({ user_email: req.body.email })
            }
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`
            SendMail(req.body.email, otp);

            const saltRounds = 10;
            const hashedOtp = await bcrypt.hash(otp, saltRounds);
            const userVerifyOtp = new userVerifyOtps({
                user_email: req.body.email,
                otp: hashedOtp,
                expiresAt: Date.now() + 3600000,
            })
            // Save mongodb
            await userVerifyOtp.save()
            return res.status(200).json({ msg: "sended Otp" })
        } catch (err) {
            return res.status(500).json({ msg: err })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { name, email, phone, gender, dateOfBirth, imagesId, imagesUrl } = req.body;
            console.log(typeof images)
            await Users.findOneAndUpdate({ email }, {
                name, email, phone, gender, dateOfBirth, images: {
                    public_id: imagesId,
                    url: imagesUrl
                }
            });
            res.status(200).json('success')
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getRoomIds: async (req, res) => {
        const userId = req.user.id;
        try {
            const allRooms = await messageRooms.find();
            const rooms = allRooms.filter(room => room.members.includes(userId));
            let contacts = [];
            const joinedRoomIds = rooms.reduce((prev, curr) => {
                if (curr.members.includes(userId)) {
                    return [...prev, curr.id]
                }
            }, [])
            for (let i = 0; i < rooms.length; i++) {
                const getContactId = () => {
                    const res = rooms[i].members.filter(id => id !== userId);
                    console.log('contactId: ' + res[0])
                    return res[0]
                }
                const contactId = getContactId();
                contacts[i] = {
                    user: await Users.findOne({ _id: contactId }),
                    // lastMessage: rooms[i].messages[rooms[i].messages.length - 1],
                    roomId: rooms[i].id,
                    messages: rooms[i].messages,
                }
            }

            res.status(200).json({
                roomIds: joinedRoomIds,
                contacts: contacts
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    sendMessage: async (req, res) => {
        try {
            const { msg, time, roomId } = req.body;
            const newMessage = {
                id: req.user.id,
                content: msg,
                time: time
            }
            const room = await messageRooms.findOne({ id: roomId ? roomId : req.user.id });
            if (!room) {
                const messageRoom = new messageRooms({
                    id: req.user.id,
                    // id admin =))
                    members: [req.user.id, '6264ca3e31b0196fa04b3238'],
                    messages: [
                        newMessage
                    ]
                })
                // Save mongodb
                await messageRoom.save()
            } else {

                room.messages = [...room.messages, newMessage]
                room.save()
            }

            return res.status(200).json({ userId: req.user.id })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })

            return res.json({ msg: "Added to cart" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    history: async (req, res) => {
        try {
            const history = await Payments.find({ user_id: req.user.id })

            res.json(history)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    productRating: async (req, res) => {
        try {
            const { product_id, stars, comment } = req.body.data;
            const product = await Products.findOne({ _id: product_id });
            const newComment = {
                userId: req.user.id,
                stars: stars,
                comment: comment,
                time: Date.now()
            }
            if (!product.comments) product.comment = [];
            else {
                for (let comment of product.comments) {
                    if (comment.userId === req.user.id) {
                        return res.json({ warning: 'You have rated this product already' })
                    }
                }
                product.comments = [...product.comments, newComment];
            }
            await product.save();
            return res.json({ msg: 'Thanks for your rating!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

// access token refresh each 10m
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl

