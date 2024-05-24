import { Router } from 'express';
import * as wishlistController from './wishlistController.js';
import { endPoint } from './wishlist.endpoint.js';
import { auth } from '../../middleware/auth.js';
import fileUpload, { fileValidation } from '../../services/multer.js';

const router = Router();

router.post('/',fileUpload(fileValidation.image).single("image"),wishlistController.addToWishlist);
router.get('/',auth(endPoint.get) ,wishlistController.getAllWishlists);
router.delete('/:userId/:productId', wishlistController.removeFromWishlist);

export default router;
