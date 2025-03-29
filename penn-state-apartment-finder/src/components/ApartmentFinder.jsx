import React, { useState, useEffect } from 'react';

// Separate Map component
const ApartmentMap = ({ apartments }) => {
  useEffect(() => {
    console.log("Map initialized with apartments:", apartments);
  }, [apartments]);

  return (
    <div className="relative">
      <div className="bg-gray-200 h-96 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-50">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center">
              <div className="text-blue-900 font-bold">Penn State</div>
            </div>
          </div>
          
          {apartments.map(apt => (
            <div 
              key={apt.id} 
              className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 rounded-full 
                ${apt.featured ? 'bg-yellow-500' : 'bg-blue-700'} 
                flex items-center justify-center text-white font-bold cursor-pointer
                hover:w-8 hover:h-8 transition-all`}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              title={apt.name}
            >
              {apt.id}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
          <div className="text-sm font-medium mb-2">Map Legend</div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs">Featured Properties</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-700 mr-2"></div>
            <span className="text-xs">Available Properties</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PennStateApartmentFinder = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('list');

  // Sample apartment data
  const [apartments, setApartments] = useState([
    {
      id: 1,
      name: "Lion's Den Apartments",
      address: "100 College Ave, State College, PA",
      distance: 0.5,
      rent: 1200,
      bedrooms: 2,
      bathrooms: 1,
      available: "August 2025",
      amenities: ["Furnished", "Utilities Included", "Parking", "Laundry"],
      image: "/api/placeholder/400/250",
      featured: true,
      rating: 4.5,
      reviews: 78,
      coords: { lat: 40.7982, lng: -77.8599 },
    },
    {
      id: 2,
      name: "Blue & White Terrace",
      address: "220 Beaver Ave, State College, PA",
      distance: 0.8,
      rent: 1500,
      bedrooms: 3,
      bathrooms: 2,
      available: "June 2025",
      amenities: ["Balcony", "Gym", "Pet Friendly", "Pool"],
      image: "/api/placeholder/400/250",
      featured: false,
      rating: 4.2,
      reviews: 45,
      coords: { lat: 40.7948, lng: -77.8577 },
    },
    {
      id: 3,
      name: "Nittany Highlands",
      address: "350 College Ave, State College, PA",
      distance: 0.3,
      rent: 900,
      bedrooms: 1,
      bathrooms: 1,
      available: "May 2025",
      amenities: ["Utilities Included", "Furnished", "Security System"],
      image: "/api/placeholder/400/250",
      featured: true,
      rating: 4.8,
      reviews: 124,
      coords: { lat: 40.8012, lng: -77.8614 },
    },
    {
      id: 4,
      name: "Downtown Heights",
      address: "180 Allen Street, State College, PA",
      distance: 0.7,
      rent: 1350,
      bedrooms: 2,
      bathrooms: 2,
      available: "August 2025",
      amenities: ["In-unit Laundry", "Parking", "Dishwasher", "Hardwood Floors"],
      image: "/api/placeholder/400/250",
      featured: false,
      rating: 4.0,
      reviews: 56,
      coords: { lat: 40.7935, lng: -77.8620 },
    },
    {
      id: 5,
      name: "Campus View Apartments",
      address: "450 Pugh Street, State College, PA",
      distance: 0.4,
      rent: 1100,
      bedrooms: 2,
      bathrooms: 1,
      available: "June 2025",
      amenities: ["Furnished", "Cable Included", "Study Lounge", "Bike Storage"],
      image: "/api/placeholder/400/250",
      featured: false,
      rating: 4.3,
      reviews: 92,
      coords: { lat: 40.8001, lng: -77.8560 },
    }
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    minRent: "",
    maxRent: "",
    bedrooms: "",
    maxDistance: "",
    sortBy: "distance"
  });

  // Filter apartments based on current filters
  const filteredApartments = apartments.filter(apt => {
    // Search filter
    if (filters.search && !apt.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !apt.address.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Min rent filter
    if (filters.minRent && apt.rent < parseInt(filters.minRent)) {
      return false;
    }
    
    // Max rent filter
    if (filters.maxRent && apt.rent > parseInt(filters.maxRent)) {
      return false;
    }
    
    // Bedrooms filter
    if (filters.bedrooms && apt.bedrooms !== parseInt(filters.bedrooms)) {
      return false;
    }
    
    // Distance filter
    if (filters.maxDistance && apt.distance > parseFloat(filters.maxDistance)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "distance") {
      return a.distance - b.distance;
    } else if (filters.sortBy === "rent-low") {
      return a.rent - b.rent;
    } else if (filters.sortBy === "rent-high") {
      return b.rent - a.rent;
    }
    return 0;
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      minRent: "",
      maxRent: "",
      bedrooms: "",
      maxDistance: "",
      sortBy: "distance"
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search apartments..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => setActiveTab(activeTab === 'list' ? 'map' : 'list')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{activeTab === 'list' ? 'View Map' : 'View List'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredApartments.map(apt => (
              <div key={apt.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img src={apt.image} alt={apt.name} className="object-cover w-full h-full" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{apt.name}</h3>
                  <p className="text-gray-600">{apt.address}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="flex items-center text-gray-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      {apt.rent}/mo
                    </span>
                    <span className="flex items-center text-gray-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M2 4v16h20V4H2z" />
                        <path d="M2 4h20v16H2V4z" />
                        <path d="M6 4v16" />
                        <path d="M10 4v16" />
                        <path d="M14 4v16" />
                        <path d="M18 4v16" />
                      </svg>
                      {apt.bedrooms} beds
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ApartmentMap apartments={filteredApartments} />
        )}
      </div>
    </div>
  );
};

export default PennStateApartmentFinder;