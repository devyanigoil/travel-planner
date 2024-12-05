import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backend from "../Utils/backend";

const Trips = ({userData}) => {
  const navigate = useNavigate();
  
  // State for trips (fetched from backend)
  const [trips, setTrips] = useState({});

  const [packingList, setPackingList] = useState({
    essentials: [
      { id: "passport", name: "Passport", quantity: 1, packed: false },
      { id: "wallet", name: "Wallet", quantity: 1, packed: false },
      {
        id: "phone-charger",
        name: "Phone Charger",
        quantity: 1,
        packed: false,
      },
    ],
    clothing: [
      { id: "t-shirts", name: "T-Shirts", quantity: 3, packed: false },
      { id: "underwear", name: "Underwear", quantity: 4, packed: false },
      { id: "socks", name: "Socks", quantity: 3, packed: false },
      { id: "pants", name: "Pants", quantity: 2, packed: false },
    ],
  });

  // State to track which trip is generating a packing list
  const [generatingPackingListForTripId, setGeneratingPackingListForTripId] = useState(null);

  // Fetching trips from backend (dummy API call simulation)
  useEffect(() => {
    // Simulate a backend API call
    const fetchTrips = async () => {
      const response = await backend.getTrips(userData.email); 
      // const data = await response.json();
      console.log(response.data)
      setTrips(response.data.data);
    };

    fetchTrips().catch((error) => console.error('Error fetching trips:', error));
  }, []);

  const handleGeneratePackingList = async (trip) => {
    try {
      // Set the current trip as generating packing list
      setGeneratingPackingListForTripId(trip.id);

      // Call API to generate packing list
      // const response = await backend.generatePackingList({ 
      //   tripId: trip.id 
      // });

      // Parse the API response
      // const packingList = await response.json();

      // Navigate to packing list page with trip details and generated list
      navigate(`/packing-list/${trip.id}`, { 
        state: { 
          tripDetails: trip, 
          packingList: packingList 
        } 
      });
    } catch (error) {
      console.error('Error generating packing list:', error);
      // Optional: show error notification to user
    } finally {
      // Reset the generating state
      setGeneratingPackingListForTripId(null);
    }
  };

  const renderTripSection = (tripsArray, title) => (
    <div className="trips-section">
      <h2>{title}</h2>
      {tripsArray && tripsArray.length > 0 ? (
        tripsArray.map((trip) => (
          <div key={trip.id} className="trip-card">
            <div>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Date:</strong> {trip.startDate}</p>
            </div>
            <button 
              onClick={() => handleGeneratePackingList(trip)}
              disabled={generatingPackingListForTripId === trip.id}
              className='generate-button'
            >
              {generatingPackingListForTripId === trip.id ? (
                <div className="loader">Generating...</div>
              ) : ( trip.isPackingListCreated?
                'View Packing List':'Generate Packing List'
              )}
            </button>
          </div>
        ))
      ) : (
        <p>No {title.toLowerCase()}.</p>
      )}
    </div>
  );

  return (
    <>
      {renderTripSection(trips.upcomingTrips, 'Upcoming Trips')}
      {renderTripSection(trips.pastTrips, 'Past Trips')}
    </>
  );
};

export default Trips;