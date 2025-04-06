'use client';

import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../lib/firebase";

export default function CarListingForm() {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [mileage, setMileage] = useState('');
    const [availability, setAvailability] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ make, model, year, mileage, availability, location, price });
        try {
            const docRef = await addDoc(collection(db, "listings"), {
                make, model, year, mileage, availability, location, price, createdAt: new Date()
            });
            console.log("Listing added with ID: ", docRef.id);
            // Clear the form fields and display a success message here
            setSuccessMessage("Listing Added Succesfully");
            // Clear the form fields
            setMake('');
            setModel('');
            setYear('');
            setMileage('');
            setAvailability('');
            setLocation('');
            setPrice('');
        } catch (error) {
            console.error("Error adding listing: ", error)
        }
    };
    
    return(
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-gray-500 p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl text-center mb-4">
                    Please Enter Your Car Details To Create A Listing
                </h2>

                {successMessage && (
                    <p className="text-green-500 text-center mb-4">{successMessage}</p>
                )}

                <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="Make"
                    className="w-full p-2 mb-4 border rounded text-center"
                />

                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Model"
                    className="w-full p-2 mb-4 border rounded text-center"
                />

                <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                    className="w-full p-2 mb-4 border rounded text-center"
                />

                <input
                    type="text"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="Mileage"
                    className="w-full p-2 mb-4 border rounded text-center"
                />

                <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="Availability (Dates)"
                    className="w-full p-2 mb-4 border rounded text-center"
                />

                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Pick Up Location"
                    className="w-full p-2 mb-4 border rounded text-center"
                />       

                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Rental Price"
                    className="w-full p-2 mb-4 border rounded text-center"
                />   

                <button type="submit" className="bg-blue-500 border rounded p-2 w-full">
                    Submit
                </button>
            </form>
        </div>
    )
}