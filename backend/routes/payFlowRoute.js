// routes/payFlowRoute.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { createCheckout, handleNotification } from '../payFlow.js';

const router = express.Router();

// Create checkout (protected route)
router.post('/create-checkout', authenticateToken, createCheckout);

// Webhook for payment notifications (open route)
router.post('/notifications', handleNotification);

export default router;
