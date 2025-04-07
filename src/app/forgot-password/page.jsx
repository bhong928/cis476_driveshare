'use client';

import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import Link from "next/link";

export default function ForgotPassword() {
  // Step state: 1 = enter email, 2 = answer security questions, 3 = email sent
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [storedAnswers, setStoredAnswers] = useState(null); // array of correct answers
  const [inputAnswers, setInputAnswers] = useState({ answer1: "", answer2: "", answer3: "" });
  const [message, setMessage] = useState("");

  // Security questions (the same ones used during sign up)
  const securityQuestions = [
    "What year did you graduate Highschool?",
    "What is your first pets name?",
    "How many siblings do you have?",
  ];

  // Step 1: Verify email and fetch stored security answers
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setMessage("No account found with that email.");
      } else {
        // Assume the first document is the correct user document
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        setStoredAnswers(data.securityAnswers);
        setMessage("");
        setStep(2);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setMessage("Error verifying email. Please try again.");
    }
  };

  // Step 2: Verify security question answers and send password reset email
  const handleAnswersSubmit = async (e) => {
    e.preventDefault();
    if (!storedAnswers) return;

    const valid =
      inputAnswers.answer1.trim().toLowerCase() === storedAnswers[0].trim().toLowerCase() &&
      inputAnswers.answer2.trim().toLowerCase() === storedAnswers[1].trim().toLowerCase() &&
      inputAnswers.answer3.trim().toLowerCase() === storedAnswers[2].trim().toLowerCase();

    if (valid) {
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Security answers verified. A password reset email has been sent to your email address.");
        setStep(3);
      } catch (error) {
        console.error("Error sending password reset email:", error);
        setMessage("There was an error sending the password reset email. Please try again.");
      }
    } else {
      setMessage("One or more answers are incorrect. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Forgot Password</h1>
      
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="bg-gray-500 p-6 rounded shadow w-full max-w-md">
          <label className="block mb-2">Enter your email address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Verify Email
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleAnswersSubmit} className="bg-gray-500 p-6 rounded shadow w-full max-w-md">
          {securityQuestions.map((q, i) => (
            <div key={i} className="mb-4">
              <label className="block mb-1">{q}</label>
              <input
                type="text"
                value={inputAnswers[`answer${i + 1}`]}
                onChange={(e) =>
                  setInputAnswers({
                    ...inputAnswers,
                    [`answer${i + 1}`]: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Verify Answers
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center">{message}</p>}
      <Link href="/" className="mt-4 text-blue-500 underline">Back to Home</Link>
    </div>
  );
}