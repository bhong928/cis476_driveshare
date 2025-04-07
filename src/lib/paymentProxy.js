// /src/lib/paymentProxy.js
class PaymentProxy {
    async processPayment(amount, bookingId) {
      console.log(`Processing payment of $${amount} for booking ${bookingId}...`);
      // Simulate network/payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`Payment of $${amount} for booking ${bookingId} processed successfully.`);
      return true;
    }
  }
  
  const paymentProxy = new PaymentProxy();
  export default paymentProxy;