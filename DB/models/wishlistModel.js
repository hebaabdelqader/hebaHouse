import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const wishlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    image:{
        type:Object,
        required:false,
      },
});

const wishlistModel = mongoose.models.Wishlist || model('Wishlist', wishlistSchema);
export default wishlistModel;
