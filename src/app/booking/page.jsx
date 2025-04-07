'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, doc, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Link from "next/link";
import notificationService from "../../lib/notification";
import uiMediator from "../../lib/uiMediator";  // Mediator implementation
import PaymentButton from "../../app/components/PaymentButton"; // Ensure correct path

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get("listingId");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [listingDetails, setListingDetails] = useState(null);
  const [bookingId, setBookingId] = useState(null);

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

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      setMessage("");
      return;
    }

    if (!listingDetails) {
      setError("Listing details not available for validation.");
      return;
    }

    const bookingStart = new Date(startDate);
    const bookingEnd = new Date(endDate);
    const availableStart = new Date(listingDetails.availabilityStart);
    const availableEnd = new Date(listingDetails.availabilityEnd);

    if (bookingStart < availableStart || bookingEnd > availableEnd) {
      setError(`Booking dates must be within the available period: from ${listingDetails.availabilityStart} to ${listingDetails.availabilityEnd}.`);
      setMessage("");
      return;
    }

    try {
      const bookingsQuerySnapshot = await getDocs(
        query(collection(db, "bookings"), where("listingId", "==", listingId))
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

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to book a listing.");
      return;
    }
    
    try {
      const docRef = await addDoc(collection(db, "bookings"), {
        listingId,
        renterId: user.uid,
        startDate,
        endDate,
        createdAt: new Date(),
      });
      setBookingId(docRef.id);
      setMessage("Booking confirmed! Please complete the payment.");
      setError("");
      
      await updateDoc(doc(db, "listings", listingId), { isBooked: true });
      
      // Trigger Observer Pattern notification
      notificationService.notify({
        type: "bookingConfirmed",
        listingId,
        renterId: user.uid,
        message: "Your booking is confirmed!"
      });
      
      // Trigger Mediator Pattern notification for the Toast component
      uiMediator.notify("Toast", "showToast", "Your booking is confirmed!");

      // Optionally, navigate to a confirmation page:
      // router.push(`/booking-confirmation?bookingId=${docRef.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Error creating booking. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-900 text-white space-y-4">
      {listingDetails && (
        <div className="bg-gray-600 p-4 rounded shadow w-full max-w-md">
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
      <form onSubmit={handleBooking} className="p-6 rounded shadow w-full max-w-md bg-gray-500">
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
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Home
          </button>
        </Link>
      </form>
      {bookingId && listingDetails && (
        <div className="bg-gray-500 p-4 rounded shadow w-full max-w-md">
          <p className="text-center text-green-500 mb-2">
            Please complete the payment to confirm your booking.
          </p>
          <PaymentButton 
            amount={listingDetails.price} 
            bookingId={bookingId} 
            onPaymentSuccess={() => console.log("Payment successful!")} 
          />
        </div>
      )}
    </div>
  );
}