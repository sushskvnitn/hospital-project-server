const jwt = require("jsonwebtoken");
const {Doctor  }  = require("../schema/userschema");
const authenticate=async(req,res,next)=>{
try {
    const token = req.cookies.jwtoken;
    const verifytoken = jwt.verify(token,process.env.JWT_KEY);
      const rootuser = await Doctor.findOne({_id:verifytoken._id,"tokens.token":token});
     if(!rootuser){
       throw new Error('user not found');
     }
      req.user=rootuser;
      req.token=token;
      req.userID=rootuser._id;
      next();
      
} catch (error) {
      res.status(401).send("unauthorized: no token provided");
     console.log(error); 
}

}
module.exports=authenticate;