const getTokenFromHeader =require( './getTokenFromHeaders');
const  verifyToken = require('./verifyToken');

exports.isLoggedIn = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);
  //verify the token
  const decodedUser = verifyToken(token);
  if (!decodedUser) {
    return next(new AppError("Invalid/Expired token, please login again",500));//this murderer
  } else {
    //save the user into req obj
    req.userAuthId = decodedUser?.id;
    next();
  }
};