import React, { useMemo, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./PackingList.css";
import NewItemModal from "./NewItemModal";
import PrintShare from "./PrintShare";
import TripDetailsBox from "../ItineraryPlanner/TripDetailsBox";
import backend from "../Utils/backend";

const PackingList = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State for trip details and packing list
  const [tripDetails, setTripDetails] = useState(
    location.state?.tripDetails || {
      destination: "Loading...",
      startDate: "",
      endDate: "",
      travelers: 0,
      tripType: "",
    }
  );

  const [packingList, setPackingList] = useState(
    location.state?.packingList || {
      essentials: [],
      clothing: [],
    }
  );

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Fetch trip details and packing list if not passed via navigation state
  useEffect(() => {
    const fetchTripDetails = async () => {
      // If no trip details were passed via navigation state, fetch them
      if (!location.state?.tripDetails) {
        try {
          const tripResponse = await backend.getTripDetails(tripId);
          const tripData = await tripResponse.json();
          setTripDetails(tripData);
        } catch (error) {
          console.error("Error fetching trip details:", error);
          // Optionally show an error message or redirect
          navigate('/trips');
        }
      }

      // If no packing list was passed via navigation state, fetch it
      if (!location.state?.packingList) {
        try {
          const packingListResponse = await backend.getPackingList(tripId);
          const packingListData = await packingListResponse.json();
          setPackingList(packingListData);
        } catch (error) {
          console.error("Error fetching packing list:", error);
          // Optionally show an error message
        }
      }
    };

    fetchTripDetails();
  }, [tripId, location.state, navigate]);

  const toggleItemPacked = (category, itemId) => {
    setPackingList((current) => ({
      ...current,
      [category]: current[category].map((item) =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      ),
    }));
  };

  // Pagination logic
  const paginatedItems = useMemo(() => {
    const allItems = Object.entries(packingList).flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category }))
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      items: allItems.slice(startIndex, endIndex),
      totalPages: Math.ceil(allItems.length / itemsPerPage),
    };
  }, [packingList, currentPage]);

  const calculatePackedItemsCount = () => {
    let packedCount = 0;
    let totalCount = 0;
    Object.values(packingList).forEach((category) => {
      category.forEach((item) => {
        totalCount++;
        if (item.packed) packedCount++;
      });
    });
    return { packedCount, totalCount };
  };

  const handleSaveChanges = async () => {
    try {
      await backend.updatePackingList(tripId, packingList);
      // Optionally show a success message
    } catch (error) {
      console.error("Error saving packing list:", error);
      // Optionally show an error message
    }
  };

  const { packedCount, totalCount } = calculatePackedItemsCount();

  return (
    <div className="packing-list-container">
      <div className="trip-details">
        <div className="trip-info">
          <TripDetailsBox tripDetails={tripDetails} />
        </div>
      </div>

      <div className="packing-list-content">
        <div className="packing-list-header">
          <h2>🧳 Packing List for {tripDetails.destination}</h2>
          <PrintShare
            tripDetails={tripDetails}
            packingList={packingList}
          />
        </div>

        {Object.entries(packingList).map(([category, items]) => (
          <div key={category} className="packing-category">
            <h4 className="category-title">{category}</h4>
            <div className="category-items">
              {items
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((item) => (
                  <label
                    key={item.id}
                    className={`item-checkbox ${item.packed ? "packed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => toggleItemPacked(category, item.id)}
                    />
                    {item.name} (Qty: {item.quantity})
                  </label>
                ))}
            </div>
          </div>
        ))}

        <div className="list-actions">
          <button
            className="add-item-btn"
            onClick={() => setShowAddItemModal(true)}
          >
            + Add New Item
          </button>

          <div className="pagination">
            {[...Array(paginatedItems.totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`page-btn ${
                  index + 1 === currentPage ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="list-summary">
          <span>
            {packedCount} of {totalCount} items packed
          </span>
          <button 
            className="save-btn"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
        <NewItemModal
          showAddItemModal={showAddItemModal}
          setShowAddItemModal={setShowAddItemModal}
          packingList={packingList}
          setPackingList={setPackingList}
        />
      </div>
    </div>
  );
};

export default PackingList;