import wishlistModel from "../../../DB/models/wishlistModel.js";
import cloudinary from "../../services/cloudinary.js";

// إضافة منتج إلى قائمة الرغبات
export const addToWishlist = async (req, res) => {
    try {
        const { userId, productName } = req.body;

        // تحقق من عدم وجود المنتج في القائمة للمستخدم
        const existingItem = await wishlistModel.findOne({ userId, productName });
        if (existingItem) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // إنشاء قائمة رغبات جديدة وإضافة المنتج
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.cloud_name}/wishlist`
        });

        const newWishlistItem = new wishlistModel({ userId, productName, image: uploadedImage });
        await newWishlistItem.save();

        res.status(201).json(newWishlistItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// جلب جميع قوائم الرغبات
export const getAllWishlists = async (req, res) => {
    try {
        const wishlists = await wishlistModel.find();
        if (wishlists.length === 0) return res.status(404).json({ message: 'No wishlists found' });

        // جمع أسماء المنتجات من جميع قوائم الرغبات
        const productNames = wishlists.map(wishlist => wishlist.productName);
  
        res.status(200).json(productNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// حذف منتج من قائمة الرغبات
export const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productName } = req.params;
        const wishlist = await wishlistModel.findOne({ userId });
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

        const productIndex = wishlist.products.indexOf(productName);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        wishlist.products.splice(productIndex, 1);
        await wishlist.save();
        res.status(200).json({ message: 'Product removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
