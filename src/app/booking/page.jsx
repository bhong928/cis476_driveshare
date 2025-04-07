'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, doc, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Link from "next/link";
import notificationService from "../../lib/notification";  // Observer service

export default function BookingPage() {
  // Get listingId from query parameters
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get("listingId");

  // Booking form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [listingDetails, setListingDetails] = useState(null);

  // Fetch listing details when listingId is available
  useEffect(() => {
    const fetchListingDetails = async () => {
      if (listingId) {
        try {
          const listingDoc = await getDoc(doc(db, "listings", listingId));
          if (listingDoc.exists()) {
            setListingDetails({ id: listingDoc.id, ...listingDoc.data() });
          } else {
            console.error("No such listing!");
          }
        } catch (error) {
          console.error("Error fetching listing details:", error);
        }
      }
    };
    fetchListingDetails();
  }, [listingId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    // Validate that both dates are provided
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      setMessage("");
      return;
    }

    if (!listingDetails) {
      setError("Listing details not available for validation.");
      return;
    }

    // Convert the dates to Date objects
    const bookingStart = new Date(startDate);
    const bookingEnd = new Date(endDate);
    const availableStart = new Date(listingDetails.availabilityStart);
    const availableEnd = new Date(listingDetails.availabilityEnd);

    // Validate booking period is within the available dates
    if (bookingStart < availableStart || bookingEnd > availableEnd) {
      setError(`Booking dates must be within the available period: from ${listingDetails.availabilityStart} to ${listingDetails.availabilityEnd}.`);
      setMessage("");
      return;
    }

    // Check for overlapping bookings for this listing
    try {
      const bookingsQuerySnapshot = await getDocs(
        query(
          collection(db, "bookings"),
          where("listingId", "==", listingId)
        )
      );
      let overlap = false;
      bookingsQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        const existingStart = new Date(data.startDate);
        const existingEnd = new Date(data.endDate);
        if (bookingStart <= existingEnd && bookingEnd >= existingStart) {
          overlap = true;
        }
      });
      if (overlap) {
        setError("This car is already booked for the selected dates.");
        setMessage("");
        return;
      }
    } catch (queryError) {
      console.error("Error checking existing bookings:", queryError);
      setError("Error verifying availability. Please try again.");
      return;
    }

    // Ensure the user is logged in
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to book a listing.");
      return;
    }
    
    try {
      // Create a new booking document
      const docRef = await addDoc(collection(db, "bookings"), {
        listingId,
        renterId: user.uid,
        startDate,
        endDate,
        createdAt: new Date(),
      });
      console.log("Booking created with ID:", docRef.id);
      setMessage("Booking confirmed!");
      setError("");
      
      // Mark the listing as booked
      await updateDoc(doc(db, "listings", listingId), { isBooked: true });
      
      // Notify observers about the booking
      notificationService.notify({
        type: "bookingConfirmed",
        listingId,
        renterId: user.uid,
        message: "Your booking is confirmed!"
      });
      
      // Optionally, navigate to a confirmation page:
      // router.push(`/booking-confirmation?bookingId=${docRef.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Error creating booking. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {listingDetails && (
        <div className="bg-gray-600 p-4 rounded mb-4">
          <h3 className="text-xl font-bold mb-2">Car Details</h3>
          <p><strong>Make:</strong> {listingDetails.make}</p>
          <p><strong>Model:</strong> {listingDetails.model}</p>
          <p><strong>Year:</strong> {listingDetails.year}</p>
          <p><strong>Mileage:</strong> {listingDetails.mileage}</p>
          <p><strong>Location:</strong> {listingDetails.location}</p>
          <p><strong>Price:</strong> {listingDetails.price}</p>
          <p className="mt-2">
            <strong>Available from:</strong> {listingDetails.availabilityStart} to {listingDetails.availabilityEnd}
          </p>
        </div>
      )}
      <form onSubmit={handleBooking} className="p-6 rounded shadow-md w-full max-w-md bg-gray-500">
        <h2 className="text-2xl mb-4 text-center">Book Listing</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <p className="mb-4 text-center">
          Booking for listing: <span className="font-bold">{listingId}</span>
        </p>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700 transition duration-300"
        >
          Confirm Booking
        </button>
        <Link href="/" className="flex justify-center mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded text-center">
            Home
          </button>
        </Link>
      </form>
    </div>
  );
}