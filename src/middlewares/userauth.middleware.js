import { apierrorhandler } from "../utils/ApiError";
import asynhandler from "../utils/asynchandler";
import { JsonWebTokenError } from "jsonwebtoken";
import User from "../model/user.model";
const verifyjwt=asynhandler(async(req,rest)=>{
    const token=req.cookies?.accesstoken||req.header
    ("Authorization")?.replace("bearer","");
    //access is eventually done
    if(!token){
        throw apierrorhandler(404,"error not found")
    }
   const decode= jwt.verifyjwt("verify",process.env.CLOUD_APISECRET);//check if the token is valid ro not 

   if(!decode){
    throw apierrorhandler("invaid token")
   }
   const user=await User.findbyid(decode?._id)
   .select("-password -refreshtoken")

   if(!user){
    throw new apierrorhandler("not found");
   }

   req.user=user
   next();
})
export default verifyjwt