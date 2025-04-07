'use client';

import { useState, useEffect } from "react";
import { collection, query, orderBy, addDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function MessagingPage() {
  // Using a fixed conversation ID for demonstration; you can extend this later.
  const conversationId = "defaultConversation";
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  // Listen for authentication changes to always have the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to messages in the conversation in real time
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include messages for the specified conversation
        if (data.conversationId === conversationId) {
          msgs.push({ id: doc.id, ...data });
        }
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await addDoc(collection(db, "messages"), {
        conversationId,
        text: newMessage,
        senderId: user ? user.uid : "anonymous",
        createdAt: new Date(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Messaging</h1>
      <div className="mb-4">
        {user ? (
          <p>Logged in as: {user.email}</p>
        ) : (
          <p className="text-red-400">Not logged in</p>
        )}
      </div>
      <div className="w-full max-w-md bg-gray-700 p-4 rounded shadow mb-4">
        <div className="mb-4 max-h-96 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded ${
                msg.senderId === user?.uid ? "bg-gray-500 text-right" : "bg-gray-800 text-left"
              }`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        {user ? (
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow border rounded p-2 mr-2 bg-gray-600 text-white"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Send
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-300">Log in to send messages.</p>
        )}
      </div>
      <Link href="/" className="text-blue-400 underline">
        Back to Home
      </Link>
    </div>
  );
}