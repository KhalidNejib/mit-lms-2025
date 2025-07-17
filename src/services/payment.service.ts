import { v4 as uuidv4 } from 'uuid';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const payments: Payment[] = [];

export class PaymentService {
  static createPayment(userId: string, amount: number): Payment {
    const payment: Payment = {
      id: uuidv4(),
      userId,
      amount,
      status: 'pending',
      createdAt: new Date(),
    };
    payments.push(payment);
    return payment;
  }

  static completePayment(paymentId: string): Payment | null {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = 'completed';
      return payment;
    }
    return null;
  }

  static failPayment(paymentId: string): Payment | null {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = 'failed';
      return payment;
    }
    return null;
  }

  static getPayment(paymentId: string): Payment | undefined {
    return payments.find(p => p.id === paymentId);
  }
} 