'use client';

import { useState, useEffect } from "react";
import uiMediator from "../../lib/uiMediator";

export default function Toast() {
  const [message, setMessage] = useState("");

  // Define a function that shows the toast
  const show = (data) => {
    setMessage(data);
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  useEffect(() => {
    // Register this Toast component with the mediator under the name "Toast"
    uiMediator.register("Toast", { show });
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}