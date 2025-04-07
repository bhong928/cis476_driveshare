'use client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState(['', '', '']);
  const [error, setError] = useState("");
  const router = useRouter();

  const securityQuestions = [
    "What year did you graduate Highschool?",
    "What is your first pets name?",
    "How many siblings do you have?",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);
      // Store security questions and email in Firestore under a "users" collection
      await setDoc(doc(db, "users", user.uid), {
        email,
        securityAnswers: questions, // You might consider hashing these in a real app
      });
      // After successful sign-up, redirect to login page.
      router.push("/login");
    } catch (err) {
      console.error("Error during sign up:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please log in or use a different email.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col items-center justify-centent min-h-screen p-6">
      <h2 className="text-5xl mb-4 ">Sign Up</h2>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
        className="block w-full mb-2 p-2 border" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
        className="block w-full mb-2 p-2 border"
      />
      {questions.map((q, i) => (
        <input 
          key={i} 
          value={q} 
          onChange={(e) => {
            const newQ = [...questions];
            newQ[i] = e.target.value;
            setQuestions(newQ);
          }} 
          placeholder={securityQuestions[i]} 
          required 
          className="block w-full mb-2 p-2 border"
        />
      ))}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button type="submit" className='border bg-blue-500 p-3 w-full'>Sign Up</button>
      <p className="mt-4 text-sm">
        Back to Login Page <a href="/login" className="text-blue-500 underline">Login</a>
      </p>
    </form>
  );
}