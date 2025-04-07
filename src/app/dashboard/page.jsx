'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch listings when user is available
  useEffect(() => {
    if (user) {
      console.log("Current user UID:", user.uid);
      fetchListings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchListings = async () => {
    try {
      const q = query(
        collection(db, "listings"),
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched listings:", data);
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "listings", id));
      setListings(listings.filter(listing => listing.id !== id));
    } catch (error) {
      console.error("Error deleting listing: ", error);
    }
  };

  const startEditing = (listing) => {
    setEditingId(listing.id);
    setEditValues(listing);
  };

  const handleEditChange = (e) => {
    setEditValues({
      ...editValues,
      [e.target.name]: e.target.value,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleUpdate = async (id) => {
    try {
      const listingRef = doc(db, "listings", id);
      await updateDoc(listingRef, editValues);
      const updatedListings = listings.map(listing =>
        listing.id === id ? { ...listing, ...editValues } : listing
      );
      setListings(updatedListings);
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error("Error updating listing: ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your listings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h2 className="text-3xl text-center mb-4">My Listings</h2>
        <Link href="/listing" className='flex justify-center mb-4'>
          <button className="bg-blue-500 text-white px-4 py-2 rounded text-center">
            Create New Listing
          </button>
        </Link>
        <Link href="/" className='flex justify-center mb-4'>
          <button className="bg-green-500 text-white px-4 py-2 rounded text-center">
            Home
          </button>
        </Link>
      {listings.length === 0 ? (
        <p className="text-center">No listings found.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {listings.map(listing => (
            <div key={listing.id} className="bg-gray-500 p-4 mb-4 shadow rounded">
              {editingId === listing.id ? (
                <div>
                  <input
                    type="text"
                    name="make"
                    value={editValues.make || ''}
                    onChange={handleEditChange}
                    placeholder="Make"
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="model"
                    value={editValues.model || ''}
                    onChange={handleEditChange}
                    placeholder="Model"
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="year"
                    value={editValues.year || ''}
                    onChange={handleEditChange}
                    placeholder="Year"
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="mileage"
                    value={editValues.mileage || ''}
                    onChange={handleEditChange}
                    placeholder="Mileage"
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="availability"
                    value={editValues.availability || ''}
                    onChange={handleEditChange}
                    placeholder="Availability"
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editValues.location || ''}
                    onChange={handleEditChange}
                    placeholder="Location"
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="price"
                    value={editValues.price || ''}
                    onChange={handleEditChange}
                    placeholder="Price"
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <div className="flex mt-2">
                    <button onClick={() => handleUpdate(listing.id)} className="bg-green-500 text-white p-2 mr-2 rounded">
                      Save
                    </button>
                    <button onClick={cancelEditing} className="bg-red-500 text-white p-2 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong>Make:</strong> {listing.make}</p>
                  <p><strong>Model:</strong> {listing.model}</p>
                  <p><strong>Year:</strong> {listing.year}</p>
                  <p><strong>Mileage:</strong> {listing.mileage}</p>
                  <p><strong>Availability:</strong> {listing.availability}</p>
                  <p><strong>Location:</strong> {listing.location}</p>
                  <p><strong>Price:</strong> {listing.price}</p>
                  <div className="flex mt-2">
                    <button onClick={() => startEditing(listing)} className="bg-blue-500 text-white p-2 mr-2 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(listing.id)} className="bg-red-500 text-white p-2 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}