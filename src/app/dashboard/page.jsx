'use client'
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Dashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Fetch all documents from the listings collection ordered by creation date
                const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setListings(data);
            } catch (error){
                console.error("Error fetching listings: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
      <h2 className="text-3xl text-center mb-4">My Listings</h2>
      {listings.length === 0 ? (
        <p className="text-center">No listings found.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {listings.map(listing => (
            <div key={listing.id} className="bg-gray-500 p-4 mb-4 shadow rounded">
              <p><strong>Make:</strong> {listing.make}</p>
              <p><strong>Model:</strong> {listing.model}</p>
              <p><strong>Year:</strong> {listing.year}</p>
              <p><strong>Mileage:</strong> {listing.mileage}</p>
              <p><strong>Availability:</strong> {listing.availability}</p>
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Price:</strong> {listing.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    )
}