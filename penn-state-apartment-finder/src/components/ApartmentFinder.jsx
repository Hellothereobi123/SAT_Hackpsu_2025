import React, { useState, useEffect } from 'react';
import { Search, X, Home, DollarSign, Bed, MapPin, ArrowUpDown, Calendar, Coffee, Wifi, Shield, Filter } from 'lucide-react';

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

  // Map component
  const ApartmentMap = () => {
    useEffect(() => {
      // This would be replaced with actual map integration code
      console.log("Map initialized with apartments:", apartments);
    }, []);

    return (
      <div className="relative">
        <div className="bg-gray-200 h-96 rounded-lg overflow-hidden relative">
          {/* This would be replaced with an actual map */}
          <div className="absolute inset-0 bg-blue-50">
            {/* Simplified map visual representation */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center">
                <div className="text-blue-900 font-bold">Penn State</div>
              </div>
            </div>
            
            {/* Apartment markers */}
            {filteredApartments.map(apt => (
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
        
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <h3 className="font-medium text-gray-800 mb-2">Nearby Points of Interest</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <Coffee size={16} className="text-green-600" />
              </div>
              <span>5 Coffee Shops</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Home size={16} className="text-blue-600" />
              </div>
              <span>Campus Buildings</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <Wifi size={16} className="text-purple-600" />
              </div>
              <span>Free WiFi Spots</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <Shield size={16} className="text-red-600" />
              </div>
              <span>Safety Centers</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {/* Header with hero section */}
      <header className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Penn State Apartment Finder</h1>
            <div className="flex space-x-4">
              <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors">
                List Your Property
              </button>
              <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors">
                Sign In
              </button>
            </div>
          </div>
          
          <div className="bg-blue-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Find Your Perfect Penn State Home</h2>
            <p className="text-blue-100 mb-4">
              Browse apartments near campus with our easy-to-use search tools
            </p>
            <div className="bg-white rounded-lg overflow-hidden flex">
              <input 
                type="text"
                placeholder="Search by location, property name, or features..."
                className="flex-grow p-4 text-gray-800 outline-none"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
              />
              <button className="bg-yellow-500 text-white px-6 font-medium hover:bg-yellow-600 transition-colors flex items-center">
                <Search size={18} className="mr-2" /> Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 pb-16">
        {/* View Toggle */}
        <div className="mb-4 mt-6 flex justify-center">
          <div className="bg-white p-1 rounded-lg shadow-md flex">
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'list' 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              <Home size={18} className="mr-2" /> List View
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'map' 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              <MapPin size={18} className="mr-2" /> Map View
            </button>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-blue-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Filter size={20} className="mr-2 text-blue-900" /> Advanced Filters
            </h2>
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <X size={16} className="mr-1" /> Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <DollarSign size={16} />
                </span>
                <input
                  type="number"
                  name="minRent"
                  value={filters.minRent}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="pl-9 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <DollarSign size={16} />
                </span>
                <input
                  type="number"
                  name="maxRent"
                  value={filters.maxRent}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="pl-9 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Bed size={16} />
                </span>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="pl-9 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <MapPin size={16} />
                </span>
                <select
                  name="maxDistance"
                  value={filters.maxDistance}
                  onChange={handleFilterChange}
                  className="pl-9 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Any</option>
                  <option value="0.5">0.5 miles</option>
                  <option value="1">1 mile</option>
                  <option value="2">2 miles</option>
                  <option value="5">5 miles</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Calendar size={16} />
                </span>
                <select
                  name="available"
                  className="pl-9 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Any Time</option>
                  <option value="now">Now</option>
                  <option value="may">May 2025</option>
                  <option value="june">June 2025</option>
                  <option value="august">August 2025</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <ArrowUpDown size={16} />
                </span>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="pl-9 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="distance">Distance</option>
                  <option value="rent-low">Rent: Low to High</option>
                  <option value="rent-high">Rent: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Popular Amenities */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Amenities:</h3>
            <div className="flex flex-wrap gap-2">
              {["Furnished", "Utilities Included", "Pet Friendly", "Gym", "In-unit Laundry", "Parking"].map(amenity => (
                <div key={amenity} className="flex items-center">
                  <label className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2" />
                    <span className="text-sm">{amenity}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-700 font-medium">
            Found {filteredApartments.length} apartments
          </div>
          <div className="text-sm text-gray-500">
            Showing all available properties
          </div>
        </div>
        
        {/* Main Content Area - Toggle between List and Map */}
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApartments.map(apt => (
              <div key={apt.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={apt.image} alt={apt.name} className="w-full h-48 object-cover" />
                  {apt.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-md px-2 py-1 text-sm font-medium text-gray-800">
                    ${apt.rent}/mo
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-blue-900">{apt.name}</h3>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded-lg">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm font-medium">{apt.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({apt.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 flex items-center">
                    <MapPin size={16} className="mr-1 flex-shrink-0 text-blue-900" /> 
                    <span className="text-sm">{apt.address}</span>
                  </p>
                  
                  <div className="flex justify-between mb-4 text-sm">
                    <div className="flex items-center">
                      <Bed size={16} className="mr-1 text-gray-600" />
                      <span>{apt.bedrooms} {apt.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                    <div className="flex items-center">
                      <span>{apt.bathrooms} {apt.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                    <div className="flex items-center text-blue-900 font-medium">
                      <span>{apt.distance} miles</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Available:</span> {apt.available}
                    </p>
                    
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {apt.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {apt.amenities.length > 3 && 
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            +{apt.amenities.length - 3} more
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-grow bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">
                      View Details
                    </button>
                    <button className="px-3 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors">
                      ♥
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredApartments.length === 0 && (
              <div className="col-span-full text-center py-10">
                <Home size={48} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-xl font-medium text-gray-600">No apartments match your filters</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <ApartmentMap />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-3">Penn State Apartment Finder</h2>
              <p className="text-blue-200 mb-4">Finding your perfect home since 2025</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-200">
                  <span className="sr-only">Facebook</span>
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">f</div>
                </a>
                <a href="#" className="text-white hover:text-blue-200">
                  <span className="sr-only">Twitter</span>
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">t</div>
                </a>
                <a href="#" className="text-white hover:text-blue-200">
                  <span className="sr-only">Instagram</span>
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">i</div>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">List Your Property</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-lg">Subscribe</h3>
              <p className="text-blue-200 mb-3">Get notified about new properties</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="p-2 text-gray-800 rounded-l-md flex-grow outline-none"
                />
                <button className="bg-yellow-500 text-white px-4 rounded-r-md font-medium hover:bg-yellow-600 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-700 mt-8 pt-6 text-center text-blue-300 text-sm">
            © 2025 Penn State Apartment Finder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PennStateApartmentFinder;