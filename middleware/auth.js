const jwt = require('jsonwebtoken')

// middle ware: auth user => set req.user = user
const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization") || req.header("authorization")
        if (!token) return res.status(400).json({ msg: "Invalid Authentication 1" })

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ msg: "Invalid Authentication 2" })

            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = auth