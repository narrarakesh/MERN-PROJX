const multer = require('multer');

// configure storage

const storage = multer.diskStorage({
    destination: (req, file , cb)=>{
        cb(null, 'uploads/'); // destination folder
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`); // unique file name
    }
})

const fileFilter = (req, file, cb)=>{
    const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('only  .jpeg .jpg and .png formats are allowed'), false);

    }
}


const upload = multer({ storage, fileFilter});
module.exports = upload;