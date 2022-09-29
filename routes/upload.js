const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')


// we will upload image on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// Upload image only admin can use
router.post('/upload', auth, authAdmin, (req, res) => { // 
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No files were uploaded.' })
        /**{
        *[0]   file: {
        *[0]     name: 'IMG_1350.JPG',
        *[0]     data: <Buffer >,
        *[0]     size: 23487,
        *[0]     encoding: '7bit',
        *[0]     tempFilePath: 'C:\\Users\\KHANG\\OneDrive\\Desktop\\Full_Stack\\mern-ecommerce\\tmp\\tmp-1-1650710580128',  
        *[0]     truncated: false,
        *[0]     mimetype: 'image/jpeg',
        *[0]     md5: '9544a2bb8b39a7e3d85aeead36079a45',
        *[0]     mv: [Function: mv]
        *[0]   }
        *[0] }
        */

        const file = req.files.file;
        // if file size > 1mb
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Size too large" })
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "File format is incorrect." })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (err, result) => {
            if (err) throw err;

            // after upload will have tmp (C:\Users\KHANG\OneDrive\Desktop\Full_Stack\mern-ecommerce\tmp)
            // => removeTmp (custom fnc using fs.unlink)
            removeTmp(file.tempFilePath)

            res.json({ public_id: result.public_id, url: result.secure_url })
        })


    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

// Delete image only admin can use
router.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: 'No images Selected' })

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;

            res.json({ msg: "Deleted Image" })
        })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }

})

//user upload avatar
router.post('/userUploadAvatar', auth, (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: 'No files were uploaded.' })
        }
        /**{
        *[0]   file: {
        *[0]     name: 'IMG_1350.JPG',
        *[0]     data: <Buffer >,
        *[0]     size: 23487,
        *[0]     encoding: '7bit',
        *[0]     tempFilePath: 'C:\\Users\\KHANG\\OneDrive\\Desktop\\Full_Stack\\mern-ecommerce\\tmp\\tmp-1-1650710580128',  
        *[0]     truncated: false,
        *[0]     mimetype: 'image/jpeg',
        *[0]     md5: '9544a2bb8b39a7e3d85aeead36079a45',
        *[0]     mv: [Function: mv]
        *[0]   }
        *[0] }
        */
        const file = req.files.file;
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Size too large" })
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "File format is incorrect." })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "user-avatar" }, async (err, result) => {
            if (err) throw err;

            // after upload will have tmp (C:\Users\KHANG\OneDrive\Desktop\Full_Stack\mern-ecommerce\tmp)
            // => removeTmp (custom fnc using fs.unlink)
            removeTmp(file.tempFilePath)

            res.json({ public_id: result.public_id, url: result.secure_url })
        })


    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

router.post('/userDestroyAvatar', auth, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: 'No images Selected' })

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;

            res.json({ msg: "Deleted Image" })
        })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }

})


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}


module.exports = router