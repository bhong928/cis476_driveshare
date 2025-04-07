// /src/lib/notification.js
class NotificationService {
    constructor() {
      this.observers = [];
    }
  
    subscribe(callback) {
      this.observers.push(callback);
    }
  
    unsubscribe(callback) {
      this.observers = this.observers.filter(fn => fn !== callback);
    }
  
    notify(data) {
      this.observers.forEach(fn => fn(data));
    }
  }
  
  const notificationService = new NotificationService();
  export default notificationService;