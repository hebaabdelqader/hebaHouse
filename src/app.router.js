
import connectDB from '../DB/connection.js';
import categoriesRouter from './modules/category/categories.router.js'
import authRouter from './modules/auth/auth.router.js'
import subcategoryRouter from './modules/subcategory/subcategory.router.js'
import cartRouter from './modules/cart/cart.router.js';
import couponRoutr from './modules/coupon/coupon.router.js'
import productsRouter from './modules/product/prodcut.router.js'
import orderRouter from "./modules/order/order.router.js";
const initApp=(app,express)=>{
    app.use(express.json());
    connectDB();
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"welcome"});
    })
     app.use('/product',productsRouter);
    app.use('/categories',categoriesRouter);
    app.use('/subcategory',subcategoryRouter);
     app.use('/auth',authRouter);
     app.use('/coupon',couponRoutr);
     app.use("/order", orderRouter);
     app.use('/cart',cartRouter);
app.get("*",(req,res)=>{
    return res.status(500).json({message:"page not found"});
})
}

export default initApp;