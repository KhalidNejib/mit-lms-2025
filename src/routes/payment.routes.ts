import { Router } from 'express';
import { createPayment, completePayment, failPayment, getPayment } from '../controllers/payment.controller';

const router = Router();

router.post('/', createPayment);
router.post('/:paymentId/complete', completePayment);
router.post('/:paymentId/fail', failPayment);
router.get('/:paymentId', getPayment);

export default router; 