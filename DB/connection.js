import mongoose from 'mongoose';
const connectDB= async()=>{
    return await await mongoose.connect(process.env.DB).
    then( ()=>{
        console.log("connect suc");

    }).catch((err)=>{
        console.log(`error ${err}`);
    }
    )
}
export default connectDB;