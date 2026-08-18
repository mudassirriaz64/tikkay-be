/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import { getProfile, updateProfile, getAllUsers, getUserById, updateUserRole, deleteUser, addToFavorites, getFavorites, getMyReviews, getAccountsPageData, } from './users.controller';
const router = Router();
router.route('/profile')
    .get(protect, getProfile)
    .patch(protect, updateProfile);
router.route('/accounts-page').get(protect, getAccountsPageData);
router.route('/favorites')
    .get(protect, getFavorites)
    .post(protect, addToFavorites);
router.route('/my-reviews').get(protect, getMyReviews);
router.route('/').get(protect, verifyAdmin, getAllUsers);
router.route('/:id')
    .get(protect, verifyAdmin, getUserById)
    .patch(protect, verifyAdmin, updateUserRole)
    .delete(protect, verifyAdmin, deleteUser);
export default router;
//# sourceMappingURL=users.routes.js.map