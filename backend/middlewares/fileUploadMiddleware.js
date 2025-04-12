const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();  
// since we don't store file on disk we use memory storage
// this will store the file in memory as a buffer

const fileUploadMiddleware = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.xlsx') return cb(new Error('Only .xlsx files allowed'));
        cb(null, true);
    }
}); 

module.exports = fileUploadMiddleware ;
