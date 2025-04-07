'use client';

import { useState, useEffect } from "react";
import uiMediator from "../../lib/uiMediator";

export default function Toast() {
  const [message, setMessage] = useState("");

  // Define the method to handle events from the mediator
  const handleEvent = (event, data) => {
    if (event === "showToast") {
      setMessage(data);
      setTimeout(() => setMessage(""), 3000); // Automatically clear after 3 seconds
    }
  };

  useEffect(() => {
    // Register this Toast component with the mediator
    uiMediator.register("Toast", { handleEvent });
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-pink-500 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}