import userModel from "../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../../services/cloudinary.js";
import jwt  from "jsonwebtoken";
import  {sendEmail}  from "../../services/email.js";
import  {nanoid,customAlphabet }  from "nanoid";
export const signup=async(req,res)=>{
    try{
const {userName,email,password}=req.body;
const user= await userModel.findOne({email}); 
if(user){
    return res.status(409).json({message:"email already exist"});
} 
const hashedPassword=await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
//const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
  //  folder:`${process.env.APP_NAME}/CATEGORIES`}),image:{secure_url,public_id}
    const token= jwt.sign({email},process.env.CONFIRMEMAILSECRET);
    await sendEmail(email,"confarim email",`<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>verify<a>`)
const createUser=await userModel.create({userName,email,password:hashedPassword});
   return res.status(201).json({message:'succ',createUser});
}catch(err){
return res.json(err);
}}
export const sendCode = async(req,res)=>{
const {email} =req.body;
let code =customAlphabet('1234567890abcdef');
code= code();
const user =await userModel.findOneAndUpdate({email},{sendCode:code},{new:true});
const html = `<h2>code is : ${code}</h2>`;
await sendEmail(email,'rest password',html);
return res.status(200).json({message:"succ",html});
}
export const forgotPassword =async(req,res)=>{
const {email,password,code} =req.body;
const user = await userModel.findOne({email});
if(!user){
    return res.status(404).json({message:"not regested"});
}
if(user.sendCode != code){
    return res.status(400).json({message:"invalid code"})
}
let match =await bcrypt.compare(password,user.password);
if(match){
    return res.status(409).json({message:"same password"})
}
user.password= await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
user.sendCode =null;
user.changePasswordTime = Date.now(); //to  log out from accounts that sign in with old password
  await user.save();
  return res.status(200).json({ message: "success" });
}
export const deleteInvalidConfirm = async (req, res) => {
    const users = await userModel.deleteMany({ confirmEmail: false });
    return res.status(200).json({ message: "success" });
  };
export const confirmEmail = async(req,res)=>{
    const token =req.params.token;
    const decoded=jwt.verify(token,process.env.CONFIRMEMAILSECRET);
    if(!decoded){
        return res.status(404).json({message:"invalid token"})
    }
    const user = await userModel.findOneAndUpdate({email:decoded.email,confirmEmail:false},
        {confirmEmail:true});
        if(!user){
            return res.status(400).json({message:"invalid verify your email or your email is verified"})
        }
        return res.status(200).json({message:"your email is verified"})
}

export const signIn=async(req,res)=>{
    const {email,password} =req.body;
    const user=await userModel.findOne({email});
    if(!user){
        return res.status(400).json({meesage:"data invalid"});
    }
    const match =await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(400).json({meesage:'data invalid'});
    }//                            شو بدي اخزن فيها - كلمة السر ممنوع حدا يعرفها - وبعد خمس دقايق بتنتهي
    const token = jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINSECRET);//,{expiresIn:'5m'});
    const refreshToken = jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINSECRET,{expiresIn:60*60*24*30});
    return res.status(200).json({message:"succ",token});
}