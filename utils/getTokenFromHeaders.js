exports.getTokenFromHeader = (req) =>//(req,res,next)=>
{
    //get token from header
    const token = req?.headers?.authorization?.split(" ")[1]; 
    //const token = req.headers.authorization.split(" ")[1];
    if (token === undefined) {
      return "No token found in the header";
    } else {
      return token;
    }
  };