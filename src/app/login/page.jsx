'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import LoginSection from "./loginsection";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard'); // Still need to create a dashboard page
        } catch (err){
            setError('Login Failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <h1 className="text-5xl flex flex-col items-center">
                Drive Share
            </h1>
        
            <LoginSection
            handleLogin={handleLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            />
        </div>
    )
}