const multer = require('multer')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        let validType = ['JPG', 'JPEG', 'PNG']

        let isValid = validType.filter((type) => {
            return file.originalname.toUpperCase().endsWith(type); 
        })
        isValid[0] !== undefined ? cb(null, true) : cb(new Error('upload a valid image file'))
        
    }
})

module.exports = upload;