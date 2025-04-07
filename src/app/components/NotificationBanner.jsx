'use client';

import { useEffect, useState } from "react";
import notificationService from "../../lib/notification";

export default function NotificationBanner() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleNotification = (data) => {
      setNotification(data);
      // Clear notification after 10 seconds
      setTimeout(() => setNotification(null), 10000);
    };

    notificationService.subscribe(handleNotification);
    return () => {
      notificationService.unsubscribe(handleNotification);
    };
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow">
      {notification.message}
    </div>
  );
}