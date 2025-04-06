'use client';

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

export default function SearchListings() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all listings on mount
  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(data);
      } catch (error) {
        console.error("Error fetching all listings: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllListings();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const conditions = [];
      if (make) conditions.push(where("make", "==", make));
      if (model) conditions.push(where("model", "==", model));
      if (location) conditions.push(where("location", "==", location));
      if (maxPrice) conditions.push(where("price", "<=", maxPrice));

      const order = orderBy("createdAt", "desc");
      const q = conditions.length
        ? query(collection(db, "listings"), ...conditions, order)
        : query(collection(db, "listings"), order);

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    } catch (error) {
      console.error("Error searching listings: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white w-full flex justify-center p-4">
      {/* Container for the search form and results */}
      <div className="bg-gray-700 border border-gray-600 rounded p-4 w-full max-w-2xl">
        <h1 className="text-3xl text-center mb-4">Search Listings</h1>
        <form onSubmit={handleSearch} className="flex flex-col space-y-4 mb-6">
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Make"
            className="p-2 rounded border border-gray-500 bg-gray-800"
          />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="p-2 rounded border border-gray-500 bg-gray-800"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="p-2 rounded border border-gray-500 bg-gray-800"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="p-2 rounded border border-gray-500 bg-gray-800"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-center">No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-800 p-4 rounded shadow hover:shadow-lg transition-shadow duration-300"
              >
                <p className="font-bold">Make:</p>
                <p>{listing.make}</p>
                <p className="font-bold mt-2">Model:</p>
                <p>{listing.model}</p>
                <p className="font-bold mt-2">Location:</p>
                <p>{listing.location}</p>
                <p className="font-bold mt-2">Price:</p>
                <p>{listing.price}</p>
                <Link href={`/booking?listingId=${listing.id}`}>
                  <button className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-green-700 transition duration-300 w-full">
                    Book Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}