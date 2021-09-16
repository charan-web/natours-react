const User = require("./../Models/userModel");
const AppError = require("./../Utilities/APIclass");
const catchAsync = require("./../Utilities/catch");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const Email = require("../Utilities/sendMails");

const SECRET_KEY = "my_ultra_secret_key";

const signIn = (id) => {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: "90d",
  });
};
const sendCookie = (token, res) => {
  res.cookie("jwt", token, {
    expires: new Date(Date.now + 90 * 24 * 60 * 60 * 1000),
    // secure:true,
    httpOnly: true,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
 
  const user = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signIn(user._id);
  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(user, url).sendWelcome();
  sendCookie(token, res);
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //* Get the email and password from body
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Provide Email or Password", 403));
  }

  //* Get the user from the database based on email

  const user = await User.findOne({ email }).select("+password");

  //* Check the password

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Invalid Email or Password", 401));
  }

  //* is Everythink Ok, send the token

  const token = signIn(user._id);

  sendCookie(token, res);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //* Get the token from incoming request.header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You're not logged In", 401));
  }

  //* check its valid token and get the user
  const decoded = await promisify(jwt.verify)(token, SECRET_KEY);

  if (!decoded) {
    return next(new AppError("Invalid user", 403));
  }

  //* check the user is still in db

  const user = await User.findById(decoded.id);
 
  if (!user) {
    return next(new AppError("Token is invalid.Please log in again", 403));
  }

  //* check if password changed and send new token
  if (user.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError("User recently changed Password.Please login again", 403)
    );
  }
  //* if everything good
  req.user = user;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //* Get the user with provided email
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("There is no user with that email", 401));
  }
  //*Generate a random code

  const token = user.resetToken();

  await user.save({ validateBeforeSave: false })(token);

  //* send it to the users mail
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/user/resetpassword/${token}`;

  const message = `Forgot your Password, Please click the link below to reset your password : ${resetURL}`;

  try {
    await new Email(user, resetURL).sendPassword();
    res.status(200).json({
      status: "success",
      message: "Token sent to mail",
    });
  } catch (error) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was errror sendign a email"));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //* Get the token from req.params
  try {
    let token = crypto.createHash("sha256").update(req.params.id).digest("hex");

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gte: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    //  user.passwordAt = Date.now()
    await save();

    let newToken = signIn(user._id);
    sendCookie(newToken, res);

    res.status(200).json({
      status: "success",
      newToken,
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await save();
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //* get the current password from the user
 
  const user = await User.findById(req.user._id).select("+password");

  //* check the current Password
 

  if (!(await user.checkPassword(req.body.currentpassword, user.password))) {
    return next(new AppError("Current Password is wrong", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = signIn(user._id);
  sendCookie(token, res);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.logout = (req, res) => {
 
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() * 10 * 1000),
    httpOnly: true,
  });
};
