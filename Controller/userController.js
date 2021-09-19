const User = require("../Models/userModel");
const catchAsync = require("./../Utilities/catch");
const multer = require("multer");
const AppError = require("../Utilities/APIclass");
const sharp = require("sharp");
//!File needs to change in buffer
// const multerStorage= multer.diskStorage({
//   destination: (res,file,cb)=>{
//     cb(null,'views/public/img/users')
//   },
//   filename:(req,file,cb)=>{
//     let ext = file.mimetype.split('/')[1]
//     cb(null,`user-${req.user._id}-${Date.now()}.${ext}`)

//   }
// })

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not an Image.Please select image", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single("photo");

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .toFile(`Views/public/img/users/${req.file.filename}`);
  next();
});

const filterObject = (obj, ...rest) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (rest.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
// console.log(req)
  const filterObj = filterObject(req.body, "name", "email");
  if (req.file) filterObj.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filterObj, {
    new: true,
    runValidators: true,  
  });
  res.status(200).json({
    status: "success",
    data: { 
      user, 
    },        
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  
  if (!req.params.id) req.params.id = req.user.id;

  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    result: 1,
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
  });
});
