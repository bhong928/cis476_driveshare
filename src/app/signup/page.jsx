'use client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../../lib/firebase';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [questions, setQuestions] = useState(['', '', '']);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created:', user);
        // store security questions in Firestore or DB
    };

    const securityQuestions = [
      "What year did you graduate Highschool?",
      "What is your first pets name?",
      "How many siblings do you have?",
    ]

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col items-center justify-centent min-h-screen p-6">
          <h2 className="text-5xl mb-4 ">Sign Up</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="block w-full mb-2 p-2 border" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="block w-full mb-2 p-2 border"/>
          {questions.map((q, i) => (
            <input key={i} value={q} onChange={(e) => {
              const newQ = [...questions];
              newQ[i] = e.target.value;
              setQuestions(newQ);
            }} placeholder={securityQuestions[i]} required className="block w-full mb-2 p-2 border"/>
          ))}
          <button type="submit" className='border bg-blue-500 p-3 w-full'>Sign Up</button>
          <p className="mt-4 text-sm">
            Back to Login Page <a href="/login" className="text-blue-500 underline">Login</a>
          </p>
        </form>
      );
}