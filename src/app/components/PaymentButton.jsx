'use client';

import { useState } from "react";
import paymentProxy from "../../lib/paymentProxy";
import notificationService from "../../lib/notification";

export default function PaymentButton({ amount, bookingId, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const result = await paymentProxy.processPayment(amount, bookingId);
      if (result) {
        notificationService.notify({
          type: 'paymentCompleteRenter',
          message: `Payment of $${amount} successful for booking ${bookingId}.`
        });
        notificationService.notify({
          type: 'paymentCompleteOwner',
          message: `Payment of $${amount} received for booking ${bookingId}.`
        });
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handlePayment} 
      className="block mx-auto bg-purple-600 text-white px-4 py-2 rounded"
    >
      {loading ? "Processing Payment..." : "Pay Now"}
    </button>
  );
}