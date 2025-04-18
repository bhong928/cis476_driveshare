'use client';

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Link from 'next/link';
import CarListingBuilder from "../../lib/CarListingBuilder";

export default function CarListingForm() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled in
    if (!make || !model || !year || !mileage || !availabilityStart || !availabilityEnd || !location || !price) {
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
      // Use the Builder pattern to construct the car listing object
      const builder = new CarListingBuilder();
      const newListing = builder
        .setMake(make)
        .setModel(model)
        .setYear(year)
        .setMileage(mileage)
        .setAvailabilityStart(availabilityStart)
        .setAvailabilityEnd(availabilityEnd)
        .setLocation(location)
        .setPrice(price)
        .setOwnerId(user.uid)
        .setIsBooked(false)
        .setCreatedAt(new Date())
        .build();

      const docRef = await addDoc(collection(db, "listings"), newListing);
      console.log("Listing added with ID: ", docRef.id);
      setSuccessMessage("Listing added successfully!");

      // Clear the form fields
      setMake('');
      setModel('');
      setYear('');
      setMileage('');
      setAvailabilityStart('');
      setAvailabilityEnd('');
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
            type="date"
            value={availabilityStart}
            onChange={(e) => setAvailabilityStart(e.target.value)}
            placeholder="Availability Start Date"
            className="w-full p-2 mb-4 border rounded"
         />
         <input
            type="date"
            value={availabilityEnd}
            onChange={(e) => setAvailabilityEnd(e.target.value)}
            placeholder="Availability End Date"
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