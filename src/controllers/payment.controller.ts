import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export const createPayment = (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) {
    return res.status(400).json({ success: false, message: 'userId and amount are required' });
  }
  const payment = PaymentService.createPayment(userId, amount);
  res.status(201).json({ success: true, data: payment });
};

export const completePayment = (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const payment = PaymentService.completePayment(paymentId);
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.json({ success: true, data: payment });
};

export const failPayment = (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const payment = PaymentService.failPayment(paymentId);
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.json({ success: true, data: payment });
};

export const getPayment = (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const payment = PaymentService.getPayment(paymentId);
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.json({ success: true, data: payment });
}; 