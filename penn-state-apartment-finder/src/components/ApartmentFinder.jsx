import React, { useState, useEffect } from 'react';
import { Search, X, Home, DollarSign, Bed, MapPin, ArrowUpDown, Calendar, Coffee, Wifi, Shield, Filter } from 'lucide-react';
import ApartmentMap from './ApartmentMap'; // Assuming you have a separate component for the map
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { addDoc } from "firebase/firestore"; 
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: "AIzaSyCdT94QQEbqEyCnazUitETDiG1gmqByX3E" });

const firebaseConfig = {
  apiKey: "AIzaSyC_wn6HBNcIDnQJzz-S1j_Fm20tUtgc_OY",
  authDomain: "sat-hackpsu-2025.firebaseapp.com",
  projectId: "sat-hackpsu-2025",
  storageBucket: "sat-hackpsu-2025.firebasestorage.app",
  messagingSenderId: "41582977382",
  appId: "1:41582977382:web:1f811a79d99ce0595fa8a7",
  measurementId: "G-B3ZK0MSF09"
};

// Initialize Firebase
const PennStateApartmentFinder = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('list');

  // State for apartments and loading
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // State for property listing modal
  const [showListingForm, setShowListingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rent: '',
    bedrooms: '',
    bathrooms: '',
    distance: '',
    available: '',
    image: '/placeholder-apartment.jpg',
    amenities: [''],
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' });

  // Use useEffect to fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const apartmentsList = await getApartments(db);
        
        // Process the data to ensure all required fields have default values
        const processedApartments = apartmentsList.map(apt => ({
          id: apt.id, // Generate an ID if none exists
          name: apt.name || 'Unnamed Property',
          address: apt.address || 'Address not available',
          rent: apt.rent !== undefined ? apt.rent : null,
          bedrooms: apt.bedrooms !== undefined ? apt.bedrooms : null,
          bathrooms: apt.bathrooms !== undefined ? apt.bathrooms : null,
          distance: apt.distance !== undefined ? apt.distance : null,
          rating: apt.rating !== undefined ? apt.rating : 'N/A',
          reviews: apt.reviews !== undefined ? apt.reviews : 0,
          available: apt.available || 'Contact for availability',
          image: apt.image || '/placeholder-apartment.jpg',
          featured: apt.featured || false,
          amenities: Array.isArray(apt.amenities) ? apt.amenities : [],
          // Add a new property to determine if the apartment is actually available
          isAvailable: apt.available 
            ? !apt.available.toLowerCase().includes('not available') && 
              !apt.available.toLowerCase().includes('unavailable') &&
              !apt.available.toLowerCase().includes('false')
            : true // Default to true if no availability information
        }));
        
        setApartments(processedApartments);
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []); 

  // Your existing getApartments function
  async function getApartments(db) {
    const apartmentsCollection = collection(db, 'testApartments');
    const apartmentsSnapshot = await getDocs(apartmentsCollection);
    const apartmentList = apartmentsSnapshot.docs.map(doc => {
      // Get document ID and data
      const data = doc.data();
      return {
        id: doc.id, // Include the Firestore document ID
        ...data
      };
    });
    return apartmentList;
  }
  
  async function searchGemini(search) {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyCdT94QQEbqEyCnazUitETDiG1gmqByX3E" });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Assuming that id is included for each, give the name and id in json format that best satisfies the following prompt: ${search} this time, don't give your justification. Just the name and apartment id in json format is enough given the following csv values:   Apartment ID: 13I1mUSUi3nOFTwQBo9jApartment data: {'bathrooms': None, 'website': '', 'rent': 1155.0, 'rating': None, 'plan': '', 'distance': 0.5, 'name': 'Dale Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Dale-Ext-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '113 S. Fraser St', 'furnished': ''}-------------------Apartment ID: 20UM4AUzcVMbLHXmVlPBApartment data: {'bathrooms': None, 'website': '', 'rent': 2100.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': '500 W. College Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2014/01/500-WCollege-Ave_EXT_16x9-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '500 W. College Ave', 'furnished': ''}-------------------Apartment ID: 2m8y3gCJE1NvOTzyhOiKApartment data: {'bathrooms': None, 'website': '', 'rent': 2920.0, 'rating': 5.0, 'plan': '', 'distance': 0.4, 'name': 'O’Brien Place', 'image': 'https://www.arpm.com/wp-content/uploads/2021/04/OBrien-Place_EXT_WM-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '300 S. Pugh St', 'furnished': ''}-------------------Apartment ID: 4QvamfoRzUEAY1CgDu2zApartment data: {'bathrooms': None, 'website': '', 'rent': 2100.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': '500 W. College Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2014/01/500-WCollege-Ave_EXT_16x9-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '500 W. College Ave', 'furnished': ''}-------------------Apartment ID: 4qcb6U0tDvgJPnNv1gEzApartment data: {'bathrooms': None, 'website': '', 'rent': 695.0, 'rating': 3.1, 'plan': '', 'distance': 0.6, 'name': 'Ivy Place', 'image': 'https://www.arpm.com/wp-content/uploads/2022/09/Ivy-Place_Exterior-Front-1-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '236 S Fraser St', 'furnished': ''}-------------------Apartment ID: 55byPJH2OMhVyc7IwTidApartment data: {'bathrooms': None, 'website': '', 'rent': 695.0, 'rating': 3.1, 'plan': '', 'distance': 0.6, 'name': 'Ivy Place', 'image': 'https://www.arpm.com/wp-content/uploads/2022/09/Ivy-Place_Exterior-Front-1-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '236 S Fraser St', 'furnished': ''}-------------------Apartment ID: 5ykPvuB5805oPJLU1bbEApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/orlando/', 'rent': 2400.0, 'rating': None, 'plan': '4 BR', 'distance': 0.7, 'name': 'Orlando', 'image': 'https://www.arpm.com/wp-content/uploads/2023/10/Orlando-4-bedroom-banner-575x325.png', 'bedrooms': 4.0, 'phone': '', 'owner': 'ARPM', 'people': 5.0, 'available': 'TRUE', 'address': '221 S. Barnard St.', 'furnished': 'FALSE'}-------------------Apartment ID: 7khSkQYIXLAXfC2VjTqTApartment data: {'bathrooms': None, 'website': '', 'rent': 825.0, 'rating': 3.0, 'plan': '', 'distance': 0.9, 'name': 'Nittany View', 'image': 'https://www.arpm.com/wp-content/uploads/2021/12/Nittany-View_EXT-2_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '804-810 S. Allen St.', 'furnished': ''}-------------------Apartment ID: 85z7PhfpBwdn5TEZcgAPApartment data: {'bathrooms': None, 'website': '', 'rent': 1150.0, 'rating': None, 'plan': '', 'distance': 0.3, 'name': 'Campus View', 'image': 'https://www.arpm.com/wp-content/uploads/2022/01/campus-view-1-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '106 E. College Ave', 'furnished': ''}-------------------Apartment ID: 8T4Ne8lh3uZQcRHRPKDoApartment data: {'bathrooms': None, 'website': '', 'rent': 1030.0, 'rating': None, 'plan': '', 'distance': 0.3, 'name': 'Locust Lane Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2021/12/Locust-Lane-2-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '301 Locust Lane', 'furnished': ''}-------------------Apartment ID: 9cPJ2m6R4ku6lMQkQTgaApartment data: {'bathrooms': None, 'website': '', 'rent': 2920.0, 'rating': 5.0, 'plan': '', 'distance': 0.4, 'name': 'O’Brien Place', 'image': 'https://www.arpm.com/wp-content/uploads/2021/04/OBrien-Place_EXT_WM-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '300 S. Pugh St', 'furnished': ''}-------------------Apartment ID: 9q7xp1EHzwm9hBeRA3v9Apartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/ambassador/', 'rent': 1925.0, 'rating': None, 'plan': '1 BR Deluxe', 'distance': 0.1, 'name': 'Ambassador', 'image': 'https://www.arpm.com/wp-content/uploads/2022/02/Ambassador-studio-1-bedroom-banner-575x325.png', 'bedrooms': 1.0, 'phone': '', 'owner': 'ARPM', 'people': 2.0, 'available': 'TRUE', 'address': '421 E. Beaver Ave', 'furnished': 'TRUE'}-------------------Apartment ID: AqRosJjJnGRkreRkTReuApartment data: {'bathrooms': None, 'website': '', 'rent': 645.0, 'rating': None, 'plan': '', 'distance': 0.2, 'name': '512 E College Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2023/04/512-e-college-EXT-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '512 E. College Ave', 'furnished': ''}-------------------Apartment ID: AwEmu2PYzWcstAe7v8KXApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/ambassador/', 'rent': 1625.0, 'rating': None, 'plan': 'Eff Deluxe', 'distance': 0.1, 'name': 'Ambassador', 'image': 'https://www.arpm.com/wp-content/uploads/2022/02/Ambassador-studio-1-bedroom-banner-575x325.png', 'bedrooms': 0.0, 'phone': '', 'owner': 'ARPM', 'people': 1.0, 'available': 'TRUE', 'address': '421 E. Beaver Ave', 'furnished': 'TRUE'}-------------------Apartment ID: B5u4OmMx4vAu0TVNfQi7Apartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/ambassador/', 'rent': 1925.0, 'rating': None, 'plan': '1 BR Deluxe', 'distance': 0.1, 'name': 'Ambassador', 'image': 'https://www.arpm.com/wp-content/uploads/2022/02/Ambassador-studio-1-bedroom-banner-575x325.png', 'bedrooms': 1.0, 'phone': '', 'owner': 'ARPM', 'people': 2.0, 'available': 'TRUE', 'address': '421 E. Beaver Ave', 'furnished': 'TRUE'}-------------------Apartment ID: CBLIGEpO1QpaP54yVcR3Apartment data: {'bathrooms': None, 'website': '', 'rent': 900.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': 'REVIVE On Prospect', 'image': 'https://www.arpm.com/wp-content/uploads/2021/11/REVIVE-New-Remodeled-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '219 E. Prospect Ave', 'furnished': ''}-------------------Apartment ID: FEsNjEFlZcAL5p7bCsPQApartment data: {'bathrooms': None, 'website': '', 'rent': 1300.0, 'rating': 2.5, 'plan': '', 'distance': 0.8, 'name': 'Fairmount Hills', 'image': 'https://www.arpm.com/wp-content/uploads/2022/01/Fairmount-Hills-1-2-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '215 W Fairmount Avenue', 'furnished': ''}-------------------Apartment ID: GYXpCmtkUcOx0O93IBvQApartment data: {'bathrooms': None, 'website': '', 'rent': 3650.0, 'rating': None, 'plan': '', 'distance': 0.5, 'name': '200 West', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/200-West-Ext-website-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '200 W. College Ave', 'furnished': ''}-------------------Apartment ID: HGK0hrSOZAMnZvX5S7khApartment data: {'bathrooms': None, 'website': '', 'rent': 1150.0, 'rating': None, 'plan': '', 'distance': 0.3, 'name': 'Campus View', 'image': 'https://www.arpm.com/wp-content/uploads/2022/01/campus-view-1-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '106 E. College Ave', 'furnished': ''}-------------------Apartment ID: IMK1ai6tARy1F9OwCi9jApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/fromm-building/', 'rent': 1600.0, 'rating': 1.5, 'plan': 'Studio', 'distance': 0.3, 'name': 'Fromm Building', 'image': 'https://www.arpm.com/wp-content/uploads/2025/02/Fromm-Building-New-Remodeled-575x325.png', 'bedrooms': 0.0, 'phone': '', 'owner': 'ARPM', 'people': 1.0, 'available': 'TRUE', 'address': '112 - 118 E College Ave', 'furnished': 'TRUE'}-------------------Apartment ID: LV2m9QTpcqvEybohWrrPApartment data: {'bathrooms': None, 'website': '', 'rent': 1155.0, 'rating': 5.0, 'plan': '', 'distance': 0.2, 'name': 'Penn Tower', 'image': 'https://www.arpm.com/wp-content/uploads/2021/11/penn-tower-2-bedroom-banner-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '255 E. Beaver Ave', 'furnished': ''}-------------------Apartment ID: LpWlzz89L4tqtoPfp098Apartment data: {'bathrooms': None, 'website': '', 'rent': 1115.0, 'rating': None, 'plan': '', 'distance': 0.4, 'name': 'Rapid Transit Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Rapid-Transit-Ext-website-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '111 S. Allen St', 'furnished': ''}-------------------Apartment ID: M7jo5vsVJRLvfh6NqNSmApartment data: {'bathrooms': None, 'website': '', 'rent': 1300.0, 'rating': 2.5, 'plan': '', 'distance': 0.8, 'name': 'Fairmount Hills', 'image': 'https://www.arpm.com/wp-content/uploads/2022/01/Fairmount-Hills-1-2-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '215 W Fairmount Avenue', 'furnished': ''}-------------------Apartment ID: MIyCyI04ILTRT9BH6wzfApartment data: {'bathrooms': None, 'website': '', 'rent': None, 'rating': 3.7, 'plan': '', 'distance': 0.6, 'name': 'The Graduate', 'image': 'https://images.squarespace-cdn.com/content/v1/60da120f5332732a7029b2e6/1624912161174-15ZN9MX35UJZXLU8YV8W/Photo+Aug+19%2C+3+59+01+PM.jpg?format=500w', 'bedrooms': None, 'phone': '', 'owner': 'GN Associates', 'people': None, 'available': 'TRUE', 'address': '138 S. ATHERTON STREET, STATE COLLEGE, PA 16801', 'furnished': ''}-------------------Apartment ID: MhaPqlKIPMq2Mvavg63EApartment data: {'bathrooms': None, 'website': '', 'rent': None, 'rating': 2.0, 'plan': '', 'distance': 0.7, 'name': 'Park Place', 'image': 'https://images.squarespace-cdn.com/content/v1/60da120f5332732a7029b2e6/1624912056498-A60OP6FDGL112IV75FJB/Photo+Jul+14%2C+10+03+52+AM.jpg?format=500w', 'bedrooms': None, 'phone': '', 'owner': 'GN Associates', 'people': None, 'available': 'TRUE', 'address': '224 S. BURROWES STREET, STATE COLLEGE, PA 16801', 'furnished': ''}-------------------Apartment ID: Mvgx00LuiOVyQ3YFCLehApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/ambassador/', 'rent': 1625.0, 'rating': None, 'plan': 'Eff Deluxe', 'distance': 0.1, 'name': 'Ambassador', 'image': 'https://www.arpm.com/wp-content/uploads/2022/02/Ambassador-studio-1-bedroom-banner-575x325.png', 'bedrooms': 0.0, 'phone': '', 'owner': 'ARPM', 'people': 1.0, 'available': 'TRUE', 'address': '421 E. Beaver Ave', 'furnished': 'TRUE'}-------------------Apartment ID: MzzVwohxeZpndAjFe02JApartment data: {'bathrooms': None, 'website': '', 'rent': 825.0, 'rating': 3.0, 'plan': '', 'distance': 0.9, 'name': 'Nittany View', 'image': 'https://www.arpm.com/wp-content/uploads/2021/12/Nittany-View_EXT-2_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '804-810 S. Allen St.', 'furnished': ''}-------------------Apartment ID: OBqDxoj91XdA1XRgMdlfApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/fromm-building/', 'rent': 3200.0, 'rating': 1.5, 'plan': '2 BR', 'distance': 0.3, 'name': 'Fromm Building', 'image': 'https://www.arpm.com/wp-content/uploads/2025/02/Fromm-Building-New-Remodeled-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 3.0, 'available': 'TRUE', 'address': '112 - 118 E College Ave', 'furnished': 'TRUE'}-------------------Apartment ID: Oy0sqts9ErKVjNWyyIWWApartment data: {'bathrooms': None, 'website': '', 'rent': 900.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': 'REVIVE On Prospect', 'image': 'https://www.arpm.com/wp-content/uploads/2021/11/REVIVE-New-Remodeled-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '219 E. Prospect Ave', 'furnished': ''}-------------------Apartment ID: QxtFehIyc54VBwsFRYPvApartment data: {'bathrooms': None, 'website': '', 'rent': 1440.0, 'rating': 3.7, 'plan': '', 'distance': 0.2, 'name': 'Beaver Terrace', 'image': 'https://www.arpm.com/wp-content/uploads/2022/01/BT-2-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '456 E. Beaver Ave', 'furnished': ''}-------------------Apartment ID: RA9xq7BhiWik4hCk1v6BApartment data: {'bathrooms': None, 'website': '', 'rent': 1430.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': '110 S. Barnard St', 'image': 'https://www.arpm.com/wp-content/uploads/2014/01/110-SBarnard_EXT_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '110 S. Barnard St', 'furnished': ''}-------------------Apartment ID: RDjNkyB8mtT7U5HR7PWiApartment data: {'bathrooms': None, 'website': '', 'rent': 1440.0, 'rating': 3.7, 'plan': '', 'distance': 0.2, 'name': 'Beaver Terrace', 'image': 'https://www.arpm.com/wp-content/uploads/2022/01/BT-2-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '456 E. Beaver Ave', 'furnished': ''}-------------------Apartment ID: RZNC3vx523nBwJTQ1U7oApartment data: {'bathrooms': None, 'website': '', 'rent': 3650.0, 'rating': None, 'plan': '', 'distance': 0.5, 'name': '200 West', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/200-West-Ext-website-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '200 W. College Ave', 'furnished': ''}-------------------Apartment ID: SBS0HCctQiXP3FVy5kVcApartment data: {'bathrooms': None, 'website': '', 'rent': 1410.0, 'rating': None, 'plan': '', 'distance': 0.4, 'name': 'Citizens Building', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Citizens-Ext-website-1-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '124 W. College Ave.', 'furnished': ''}-------------------Apartment ID: VSZZG2j7oeDQEb48ccTYApartment data: {'bathrooms': None, 'website': '', 'rent': 1200.0, 'rating': 1.0, 'plan': '', 'distance': 0.1, 'name': 'University Towers', 'image': 'https://www.arpm.com/wp-content/uploads/2021/04/University-Towers_EXT_WM-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '458 E. College Ave', 'furnished': ''}-------------------Apartment ID: VWz1cT3mc8kQif4rZ1MhApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/orlando/', 'rent': 2400.0, 'rating': None, 'plan': '4 BR', 'distance': 0.7, 'name': 'Orlando', 'image': 'https://www.arpm.com/wp-content/uploads/2023/10/Orlando-4-bedroom-banner-575x325.png', 'bedrooms': 4.0, 'phone': '', 'owner': 'ARPM', 'people': 5.0, 'available': 'TRUE', 'address': '221 S. Barnard St.', 'furnished': 'FALSE'}-------------------Apartment ID: XA9aaSJZ381zTSNVkSoiApartment data: {'bathrooms': None, 'website': '', 'rent': 1340.0, 'rating': 4.2, 'plan': '', 'distance': 0.3, 'name': 'University Gateway', 'image': 'https://www.arpm.com/wp-content/uploads/2021/11/University-Gateway-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '616 E. College Ave', 'furnished': ''}-------------------Apartment ID: Y82MJHXzfiVbnnWzxfHRApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/120-122-logan-ave/', 'rent': 1700.0, 'rating': None, 'plan': '122-A', 'distance': 1.0, 'name': '120-122 Logan Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2025/01/120-122-Logan-ext-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 2.0, 'available': 'TRUE', 'address': '122-A Logan Ave', 'furnished': 'FALSE'}-------------------Apartment ID: bPqCktzqFEVfc2CpdT40Apartment data: {'bathrooms': 1.5, 'website': 'https://www.arpm.com/property/beaver-plaza/', 'rent': 2975.0, 'rating': 5.0, 'plan': '2 BR', 'distance': 0.6, 'name': 'Beaver Plaza', 'image': 'https://www.arpm.com/wp-content/uploads/2022/02/Beaver-Plaza-2-bedroom-banner-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 5.0, 'available': 'TRUE', 'address': '222 W. Beaver Ave', 'furnished': 'TRUE'}-------------------Apartment ID: bqsiBcSVaHsOVVTqtECrApartment data: {'bathrooms': None, 'website': '', 'rent': 1430.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': '110 S. Barnard St', 'image': 'https://www.arpm.com/wp-content/uploads/2014/01/110-SBarnard_EXT_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '110 S. Barnard St', 'furnished': ''}-------------------Apartment ID: brQMloMGn2KUfxRKq0NGApartment data: {'bathrooms': None, 'website': '', 'rent': None, 'rating': 3.7, 'plan': '', 'distance': 0.6, 'name': 'The Graduate', 'image': 'https://images.squarespace-cdn.com/content/v1/60da120f5332732a7029b2e6/1624912161174-15ZN9MX35UJZXLU8YV8W/Photo+Aug+19%2C+3+59+01+PM.jpg?format=500w', 'bedrooms': None, 'phone': '', 'owner': 'GN Associates', 'people': None, 'available': 'TRUE', 'address': '138 S. ATHERTON STREET, STATE COLLEGE, PA 16801', 'furnished': ''}-------------------Apartment ID: bsrTdRn3fuNMpRl8vW50Apartment data: {'bathrooms': None, 'website': '', 'rent': 895.0, 'rating': None, 'plan': '', 'distance': 1.0, 'name': 'Crestmont Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2021/08/Crestmont-Apts_EXT-2_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '901 S. Allen St', 'furnished': ''}-------------------Apartment ID: cPmx6AJ6C2bh8W6wwfGbApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/barcroft/', 'rent': 2990.0, 'rating': None, 'plan': '2 BR Large', 'distance': 0.2, 'name': 'Barcroft', 'image': 'https://www.arpm.com/wp-content/uploads/2023/04/Barcroft-2-bedroom-banner-2-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 5.0, 'available': 'TRUE', 'address': '522 E. College Ave', 'furnished': 'TRUE'}-------------------Apartment ID: cukiwcKYe6R1JCJSPcVcApartment data: {'bathrooms': None, 'website': '', 'rent': 645.0, 'rating': None, 'plan': '', 'distance': 0.2, 'name': '512 E College Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2023/04/512-e-college-EXT-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '512 E. College Ave', 'furnished': ''}-------------------Apartment ID: cwCwyiAtg0j9EXH5sy34Apartment data: {'bathrooms': None, 'website': '', 'rent': 1230.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': '506 W. College Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2014/01/506-WCollege-Ave_EXT_16x9-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '506 W. College Ave', 'furnished': ''}-------------------Apartment ID: fcfge5TqmaaRFEsrfyKAApartment data: {'bathrooms': None, 'website': '', 'rent': 895.0, 'rating': None, 'plan': '', 'distance': 1.0, 'name': 'Crestmont Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2021/08/Crestmont-Apts_EXT-2_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '901 S. Allen St', 'furnished': ''}-------------------Apartment ID: hJp5bDhrRRWEhugOGRd1Apartment data: {'bathrooms': 1.5, 'website': 'https://www.arpm.com/property/beaver-plaza/', 'rent': 2975.0, 'rating': 5.0, 'plan': '2 BR', 'distance': 0.6, 'name': 'Beaver Plaza', 'image': 'https://www.arpm.com/wp-content/uploads/2022/02/Beaver-Plaza-2-bedroom-banner-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 5.0, 'available': 'TRUE', 'address': '222 W. Beaver Ave', 'furnished': 'TRUE'}-------------------Apartment ID: iRRD80dBDs8BTAJAP8myApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/fromm-building/', 'rent': 1600.0, 'rating': 1.5, 'plan': 'Studio', 'distance': 0.3, 'name': 'Fromm Building', 'image': 'https://www.arpm.com/wp-content/uploads/2025/02/Fromm-Building-New-Remodeled-575x325.png', 'bedrooms': 0.0, 'phone': '', 'owner': 'ARPM', 'people': 1.0, 'available': 'TRUE', 'address': '112 - 118 E College Ave', 'furnished': 'TRUE'}-------------------Apartment ID: iZ5nhB0TsRckIJJVF36VApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/fromm-building/', 'rent': 1795.0, 'rating': 1.5, 'plan': '1 BR', 'distance': 0.3, 'name': 'Fromm Building', 'image': 'https://www.arpm.com/wp-content/uploads/2025/02/Fromm-Building-New-Remodeled-575x325.png', 'bedrooms': 1.0, 'phone': '', 'owner': 'ARPM', 'people': 2.0, 'available': 'TRUE', 'address': '112 - 118 E College Ave', 'furnished': 'TRUE'}-------------------Apartment ID: jDOCVQPoJMR7OUgB13SeApartment data: {'bathrooms': None, 'website': '', 'rent': 1115.0, 'rating': None, 'plan': '', 'distance': 0.4, 'name': 'Rapid Transit Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Rapid-Transit-Ext-website-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '111 S. Allen St', 'furnished': ''}-------------------Apartment ID: jQRIuvCtOnHqM78Ehbx2Apartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/120-122-logan-ave/', 'rent': 1700.0, 'rating': None, 'plan': '122-A', 'distance': 1.0, 'name': '120-122 Logan Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2025/01/120-122-Logan-ext-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 2.0, 'available': 'TRUE', 'address': '122-A Logan Ave', 'furnished': 'FALSE'}-------------------Apartment ID: lQX849vkMR8gVjboNQreApartment data: {'bathrooms': None, 'website': '', 'rent': 1340.0, 'rating': 4.2, 'plan': '', 'distance': 0.3, 'name': 'University Gateway', 'image': 'https://www.arpm.com/wp-content/uploads/2021/11/University-Gateway-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '616 E. College Ave', 'furnished': ''}-------------------Apartment ID: m7lRtnk53T2SzWyU9PXiApartment data: {'bathrooms': None, 'website': '', 'rent': 1200.0, 'rating': 1.0, 'plan': '', 'distance': 0.1, 'name': 'University Towers', 'image': 'https://www.arpm.com/wp-content/uploads/2021/04/University-Towers_EXT_WM-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '458 E. College Ave', 'furnished': ''}-------------------Apartment ID: n8inC6HOoZ0KZnErenIUApartment data: {'bathrooms': None, 'website': '', 'rent': 1410.0, 'rating': None, 'plan': '', 'distance': 0.4, 'name': 'Citizens Building', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Citizens-Ext-website-1-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '124 W. College Ave.', 'furnished': ''}-------------------Apartment ID: nhnHvd9NfE2XvatxOACZApartment data: {'bathrooms': None, 'website': '', 'rent': 1155.0, 'rating': 5.0, 'plan': '', 'distance': 0.2, 'name': 'Penn Tower', 'image': 'https://www.arpm.com/wp-content/uploads/2021/11/penn-tower-2-bedroom-banner-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '255 E. Beaver Ave', 'furnished': ''}-------------------Apartment ID: ou7uGORAnRLywR7XgvHzApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/fromm-building/', 'rent': 1795.0, 'rating': 1.5, 'plan': '1 BR', 'distance': 0.3, 'name': 'Fromm Building', 'image': 'https://www.arpm.com/wp-content/uploads/2025/02/Fromm-Building-New-Remodeled-575x325.png', 'bedrooms': 1.0, 'phone': '', 'owner': 'ARPM', 'people': 2.0, 'available': 'TRUE', 'address': '112 - 118 E College Ave', 'furnished': 'TRUE'}-------------------Apartment ID: si2hSXyOJI4MohkbnwWjApartment data: {'bathrooms': None, 'website': '', 'rent': 1030.0, 'rating': None, 'plan': '', 'distance': 0.3, 'name': 'Locust Lane Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2021/12/Locust-Lane-2-bedroom-banner-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '301 Locust Lane', 'furnished': ''}-------------------Apartment ID: t49jnS0oZ1EET8zpsQVMApartment data: {'bathrooms': None, 'website': '', 'rent': 960.0, 'rating': None, 'plan': '', 'distance': 0.4, 'name': 'Garden Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Garden-Apts-Ext-website-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '112 S. Allen St', 'furnished': ''}-------------------Apartment ID: u8fdev6x2PPbKdeyR4nBApartment data: {'bathrooms': None, 'website': '', 'rent': 960.0, 'rating': None, 'plan': '', 'distance': 0.4, 'name': 'Garden Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Garden-Apts-Ext-website-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '112 S. Allen St', 'furnished': ''}-------------------Apartment ID: uR8ikmqH538I2IPyuiANApartment data: {'bathrooms': None, 'website': '', 'rent': 3000.0, 'rating': None, 'plan': '', 'distance': 0.7, 'name': 'The Collegian', 'image': 'https://www.arpm.com/wp-content/uploads/2019/10/The-Collegian_EXT-072022_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '217 S. Atherton St', 'furnished': ''}-------------------Apartment ID: usxGB0mS6hx5ovyZ2LF4Apartment data: {'bathrooms': None, 'website': '', 'rent': 1230.0, 'rating': None, 'plan': '', 'distance': 0.6, 'name': '506 W. College Ave', 'image': 'https://www.arpm.com/wp-content/uploads/2014/01/506-WCollege-Ave_EXT_16x9-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '506 W. College Ave', 'furnished': ''}-------------------Apartment ID: vDnHn3uhw3QTe2uNv2KUApartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/fromm-building/', 'rent': 3200.0, 'rating': 1.5, 'plan': '2 BR', 'distance': 0.3, 'name': 'Fromm Building', 'image': 'https://www.arpm.com/wp-content/uploads/2025/02/Fromm-Building-New-Remodeled-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 3.0, 'available': 'TRUE', 'address': '112 - 118 E College Ave', 'furnished': 'TRUE'}-------------------Apartment ID: xDt5R3hhnTlcHW2WMgTLApartment data: {'bathrooms': None, 'website': '', 'rent': 3000.0, 'rating': None, 'plan': '', 'distance': 0.7, 'name': 'The Collegian', 'image': 'https://www.arpm.com/wp-content/uploads/2019/10/The-Collegian_EXT-072022_16x9-575x325.jpg', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '217 S. Atherton St', 'furnished': ''}-------------------Apartment ID: xf4yLMDlj0jTobQexV3iApartment data: {'bathrooms': None, 'website': '', 'rent': None, 'rating': 2.0, 'plan': '', 'distance': 0.7, 'name': 'Park Place', 'image': 'https://images.squarespace-cdn.com/content/v1/60da120f5332732a7029b2e6/1624912056498-A60OP6FDGL112IV75FJB/Photo+Jul+14%2C+10+03+52+AM.jpg?format=500w', 'bedrooms': None, 'phone': '', 'owner': 'GN Associates', 'people': None, 'available': 'TRUE', 'address': '224 S. BURROWES STREET, STATE COLLEGE, PA 16801', 'furnished': ''}-------------------Apartment ID: yBk6PLzbirgAajA6PJjMApartment data: {'bathrooms': None, 'website': '', 'rent': 1155.0, 'rating': None, 'plan': '', 'distance': 0.5, 'name': 'Dale Apartments', 'image': 'https://www.arpm.com/wp-content/uploads/2013/10/Dale-Ext-575x325.png', 'bedrooms': None, 'phone': '', 'owner': 'ARPM', 'people': None, 'available': 'TRUE', 'address': '113 S. Fraser St', 'furnished': ''}-------------------Apartment ID: zOtdrFt8KsLPjnoiDMr0Apartment data: {'bathrooms': 1.0, 'website': 'https://www.arpm.com/property/barcroft/', 'rent': 2990.0, 'rating': None, 'plan': '2 BR Large', 'distance': 0.2, 'name': 'Barcroft', 'image': 'https://www.arpm.com/wp-content/uploads/2023/04/Barcroft-2-bedroom-banner-2-575x325.png', 'bedrooms': 2.0, 'phone': '', 'owner': 'ARPM', 'people': 5.0, 'available': 'TRUE', 'address': '522 E. College Ave', 'furnished': 'TRUE'}-------------------`,
    });
    return result;
  }
  
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    minRent: "",
    maxRent: "",
    bedrooms: "",
    maxDistance: "",
    sortBy: "distance",
    showUnavailable: false // New filter to control display of unavailable apartments
  });

  // Filter apartments based on current filters - with safe handling of missing properties
  const filteredApartments = apartments.filter(apt => {
    // Filter by availability if showUnavailable is false
    if (!filters.showUnavailable && !apt.isAvailable) {
      return false;
    }
    
    // Search filter
    if (filters.search && 
        !apt.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !apt.address.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Min rent filter
    if (filters.minRent && (apt.rent === null || parseInt(filters.minRent) > apt.rent)) {
      return false;
    }
    
    // Max rent filter
    if (filters.maxRent && apt.rent !== null && parseInt(filters.maxRent) < apt.rent) {
      return false;
    }
    
    // Bedrooms filter
    if (filters.bedrooms && apt.bedrooms !== parseInt(filters.bedrooms)) {
      return false;
    }
    
    // Distance filter
    if (filters.maxDistance && (apt.distance === null || parseFloat(filters.maxDistance) < apt.distance)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "distance") {
      // Handle null values
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1; // Push nulls to the end
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    } else if (filters.sortBy === "rent-low") {
      // Handle null values
      if (a.rent === null && b.rent === null) return 0;
      if (a.rent === null) return 1; // Push nulls to the end
      if (b.rent === null) return -1;
      return a.rent - b.rent;
    } else if (filters.sortBy === "rent-high") {
      // Handle null values
      if (a.rent === null && b.rent === null) return 0;
      if (a.rent === null) return 1; // Push nulls to the end
      if (b.rent === null) return -1;
      return b.rent - a.rent;
    }
    return 0;
  });
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      sortBy: "distance",
      showUnavailable: false
    });
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle amenities changes
  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities[index] = value;
    setFormData(prev => ({
      ...prev,
      amenities: updatedAmenities
    }));
  };

  // Add new amenity field
  const addAmenityField = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, '']
    }));
  };

  // Remove amenity field
  const removeAmenityField = (index) => {
    const updatedAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      amenities: updatedAmenities
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', message: '' });

    try {
      // Convert string values to appropriate types
      const propertyData = {
        ...formData,
        rent: formData.rent ? parseFloat(formData.rent) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        distance: formData.distance ? parseFloat(formData.distance) : null,
        amenities: formData.amenities.filter(amenity => amenity.trim() !== ''),
        featured: false,
        rating: 'N/A',
        reviews: 0
      };

      // Check if the property is available based on the text
      propertyData.isAvailable = !propertyData.available.toLowerCase().includes('not available') && 
                                !propertyData.available.toLowerCase().includes('unavailable') &&
                                !propertyData.available.toLowerCase().includes('false');

      // Initialize Firebase if not already initialized
      let app;
      try {
        app = initializeApp(firebaseConfig);
      } catch (error) {
        // If already initialized, get the existing app
        app = window.firebase?.apps[0];
      }
      
      const db = getFirestore(app);
      const apartmentsCollection = collection(db, 'testApartments');
      
      // Add document to Firestore
      const docRef = await addDoc(apartmentsCollection, propertyData);
      
      // Add the new apartment to the local state
      const newApartment = {
        id: docRef.id,
        ...propertyData
      };
      
      setApartments(prev => [...prev, newApartment]);
      setSubmitMessage({ 
        type: 'success', 
        message: 'Your property has been successfully listed!' 
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          address: '',
          rent: '',
          bedrooms: '',
          bathrooms: '',
          distance: '',
          available: '',
          image: '/placeholder-apartment.jpg',
          amenities: [''],
          description: ''
        });
        setShowListingForm(false);
        setSubmitMessage({ type: '', message: '' });
      }, 3000);
      
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmitMessage({ 
        type: 'error', 
        message: 'There was an error listing your property. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {/* Header with hero section */}
      <header className="bg-blue-900 text-white py-6">
        {/* Header content - unchanged */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Penn State Apartment Finder</h1>
            <div className="flex space-x-4">
              <button 
                className="bg-white text-blue-900 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors"
                onClick={() => setShowListingForm(true)}
              >
                List Your Property
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
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <button 
    className="bg-yellow-500 text-white px-6 font-medium hover:bg-yellow-600 transition-colors flex items-center"
    onClick={async () => {
      console.log("Search button clicked with value:", search);
      if (search.trim() !== '') {
        try {
          // Initialize Gemini
          searchGemini(search)
          .then(result => console.log(result.text))
          .catch(error => console.error("Error:", error));
          
          // Process search with Gemini
          
          //const enhancedSearch = result.response.text();
          //console.log("Gemini processed search:", enhancedSearch);
          
          // Here you can update filters if needed when the button is clicked
          
          
        } catch (error) {
          console.error("Error with Gemini:", error);
        }
      }
    }}
  >
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
        
        {/* Filters Section - with new availability filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Rent</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                name="minRent"
                placeholder="Min"
                value={filters.minRent}
                onChange={handleFilterChange}
                className="pl-8 pr-4 py-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max. Rent</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                name="maxRent"
                placeholder="Max"
                value={filters.maxRent}
                onChange={handleFilterChange}
                className="pl-8 pr-4 py-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="pl-3 pr-4 py-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>
          
          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (miles)</label>
            <input
              type="number"
              name="maxDistance"
              placeholder="Any distance"
              value={filters.maxDistance}
              onChange={handleFilterChange}
              className="pl-3 pr-4 py-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Availability Toggle */}
          <div className="md:col-span-2 flex items-center mt-2">
            <input
              type="checkbox"
              id="showUnavailable"
              name="showUnavailable"
              checked={filters.showUnavailable}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showUnavailable" className="ml-2 block text-sm text-gray-700">
              Show unavailable apartments
            </label>
          </div>
          
          {/* Sort Options */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, sortBy: "distance" }))}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  filters.sortBy === "distance"
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <MapPin size={16} className="mr-1" /> Distance
              </button>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, sortBy: "rent-low" }))}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  filters.sortBy === "rent-low"
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <DollarSign size={16} className="mr-1" /> Price: Low to High
              </button>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, sortBy: "rent-high" }))}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  filters.sortBy === "rent-high"
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <DollarSign size={16} className="mr-1" /> Price: High to Low
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-700 font-medium">
            {loading ? 'Loading apartments...' : `Found ${filteredApartments.length} apartments`}
          </div>
          <div className="text-sm text-gray-500">
            {filters.showUnavailable 
              ? 'Showing all properties' 
              : 'Showing only available properties'}
          </div>
        </div>
        
        {/* Main Content Area - Toggle between List and Map */}
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading apartments...</p>
              </div>
            ) : (
              filteredApartments.map((apt, index) => (
                <div key={apt.id} className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${!apt.isAvailable ? 'border-2 border-red-200' : ''}`}>
                  <div className="relative">
                    <img src={apt.image} alt={apt.name} className="w-full h-48 object-cover" />
                    {apt.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        Featured
                      </div>
                    )}
                    {!apt.isAvailable && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-2 rounded-md font-bold">
                          Not Available
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-md px-2 py-1 text-sm font-medium text-gray-800">
                      {apt.rent !== null ? `$${apt.rent}/mo` : 'Price on request'}
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
                        <span>{apt.bedrooms !== null ? `${apt.bedrooms} ${apt.bedrooms === 1 ? 'Bed' : 'Beds'}` : 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <span>{apt.bathrooms !== null ? `${apt.bathrooms} ${apt.bathrooms === 1 ? 'Bath' : 'Baths'}` : 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-blue-900 font-medium">
                        <span>{apt.distance !== null ? `${apt.distance} miles` : 'Distance N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-3">
                      <p className={`text-sm ${!apt.isAvailable ? 'text-red-500 font-medium' : 'text-gray-600'} mb-2`}>
                        <span className="font-medium">Available:</span> {apt.available}
                      </p>
                      
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {apt.amenities.length > 0 ? (
                            <>
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
                            </>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                              No amenities listed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button 
                        className={`flex-grow py-2 rounded-lg font-medium ${
                          apt.isAvailable 
                            ? 'bg-blue-900 text-white hover:bg-blue-800' 
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        } transition-colors`}
                      >
                        {apt.isAvailable ? 'View Details' : 'Not Available'}
                      </button>
                      <button className={`px-3 py-2 rounded-lg ${
                        apt.isAvailable 
                          ? 'border border-blue-900 text-blue-900 hover:bg-blue-50' 
                          : 'border border-gray-300 text-gray-400'
                      } transition-colors`}>
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {!loading && filteredApartments.length === 0 && (
              <div className="col-span-full text-center py-10">
                <Home size={48} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-xl font-medium text-gray-600">No apartments match your filters</h3>
                <p className="text-gray-500 mt-2">
                  {!filters.showUnavailable 
                    ? 'Try adjusting your search criteria or enable "Show unavailable apartments"' 
                    : 'Try adjusting your search criteria'}
                </p>
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
          <ApartmentMap 
            apartments={apartments} 
            filteredApartments={filteredApartments} 
            loading={loading}
          />
        )}
      </div>

      {/* Property Listing Modal */}
      {showListingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">List Your Property</h2>
              <button onClick={() => setShowListingForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            {submitMessage.message && (
              <div className={`p-4 mb-4 rounded-lg ${
                submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {submitMessage.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Property Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Nittany Apartments"
                  />
                </div>
                
                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 123 College Ave, State College, PA"
                  />
                </div>
                
                {/* Monthly Rent */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent ($)
                  </label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 1200"
                  />
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="0">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>
                
                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="1">1 Bathroom</option>
                    <option value="1.5">1.5 Bathrooms</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="2.5">2.5 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="3.5">3.5 Bathrooms</option>
                    <option value="4">4+ Bathrooms</option>
                  </select>
                </div>
                
                {/* Distance from Campus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance from Campus (miles)
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 0.5"
                    step="0.1"
                  />
                </div>
                
                {/* Availability */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <input
                    type="text"
                    name="available"
                    value={formData.available}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Available August 2025 or Immediate"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter "Not Available" if the property is currently unavailable
                  </p>
                </div>
                
                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Leave blank for default image"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to use default image or enter a full URL to an image
                  </p>
                </div>
                
                {/* Amenities */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities
                  </label>
                  
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => handleAmenityChange(index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md"
                        placeholder={`e.g. ${['WiFi', 'Parking', 'Gym', 'Laundry', 'Pet Friendly'][index % 5]}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeAmenityField(index)}
                        className="ml-2 p-2 text-red-500 hover:text-red-700"
                        disabled={formData.amenities.length === 1}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addAmenityField}
                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                  >
                    + Add Another Amenity
                  </button>
                </div>
                
                {/* Property Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describe your property..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowListingForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`px-6 py-2 bg-blue-900 text-white rounded-lg ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    'List My Property'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PennStateApartmentFinder;