'use client';

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Link from 'next/link';

export default function CarListingForm() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled in
    if (!make || !model || !year || !mileage || !availability || !location || !price) {
        setErrorMessage("Please fill out all fields.");
        setSuccessMessage("");
        return;
    }
      
    // Clear any previous error
    setErrorMessage("");

    // Get the current authenticated user
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "listings"), {
        make,
        model,
        year,
        mileage,
        availability,
        location,
        price,
        ownerId: user.uid, // Tying the listing to the user
        createdAt: new Date()
      });
      console.log("Listing added with ID: ", docRef.id);
      setSuccessMessage("Listing added successfully!");

      // Clear the form fields
      setMake('');
      setModel('');
      setYear('');
      setMileage('');
      setAvailability('');
      setLocation('');
      setPrice('');
    } catch (error) {
      console.error("Error adding listing: ", error);
      setErrorMessage("Error adding listing. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-gray-500 p-6 rounded shadow-md w-full max-w-md">
         <h2 className="text-2xl mb-4 text-center">Create Car Listing</h2>
         {errorMessage && (
           <p className="text-red-500 text-center mb-4">{errorMessage}</p>
         )}
         {successMessage && (
           <p className="text-green-500 text-center mb-4">{successMessage}</p>
         )}
         <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Make"
            className="w-full p-2 mb-4 border rounded"
         />
         <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="w-full p-2 mb-4 border rounded"
         />
         <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="w-full p-2 mb-4 border rounded"
         />
         <input
            type="text"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Mileage"
            className="w-full p-2 mb-4 border rounded"
         />
         <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="Availability (Dates)"
            className="w-full p-2 mb-4 border rounded"
         />
         <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Pick-up Location"
            className="w-full p-2 mb-4 border rounded"
         />
         <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Rental Price"
            className="w-full p-2 mb-4 border rounded"
         />
         <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-green-800 duration-300">
            Submit
         </button>
        <Link href={"/dashboard"} className="flex justify-center mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded text-center w-full hover:bg-gray-900 duration-300">
                Dashboard
            </button>
        </Link>
      </form>
    </div>
  );
}