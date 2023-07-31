const multer = require("multer");
const path = require("path");

// Multer config=multer(storage,fileFilter);
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
/*
Uploading multiple image 

 and images

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
if (file.mimetype.startsWith('image')) {
cb(null, true);
} else
cb(new AppError('Not an image! Please upload only images.', 400), false);
};

const uplaod = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadTourImages = uplaod.fields([
{ name: 'imageCover', maxCount: 1 },
{ name: 'images', maxCount: 3 },
]);

// uplaod.single('image'); req.file
// uplaod.array('images', 5); req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
console.log(req.files);

if (!req.files.imageCover || !req.files.images) {
return next();
}

// 1) Cover image

req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

await sharp(req.files.imageCover[0].buffer)
.resize(2000, 1333)
.toFormat('jpeg')
.jpeg({ quality: 90 })
.toFile(`public/img/tours/${req.body.imageCover}`);

// 2) Images

req.body.images = [];
await Promise.all(
req.files.images.map(async (file, i) => {
const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
await sharp(file.buffer)
.resize(2000, 1333)
.toFormat('jpeg')
.jpeg({ quality: 90 })
.toFile(`public/img/tours/${filename}`);

req.body.images.push(filename);
})
);

next();
});
*/