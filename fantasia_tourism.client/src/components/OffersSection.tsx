
//import React, { useState } from 'react';
//import { Button } from "@/components/ui/button";
//import { Heart, Star, Map, Bed } from "lucide-react";
//import { Link,useNavigate } from "react-router-dom";


//interface PropertyCardProps {
//  title: string;
//  location: string;
//  price: number;
//  id: number;
//  rating?: number;
//  image?: string;
//  amenities?: string[];
//}

//const PropertyCard: React.FC<PropertyCardProps> = ({ 
//  title, 
//  location, 
//  price, 
//  id, 
//  rating = 4.5,
//  image,
//  amenities = ["WiFi", "Pool", "Parking"]
//}) => {
//  const [isFavorite, setIsFavorite] = useState(false);
//  const navigate = useNavigate();
  
//  const toggleFavorite = (e: React.MouseEvent) => {
//    e.stopPropagation();
//    setIsFavorite(!isFavorite);
//  };

//  const handleViewDetails = () => {
//    navigate(`/property/${id}`);
//  };

//  return (
//    <div className="tourism-card flex flex-col" onClick={handleViewDetails}>
//      <div className="relative h-48 bg-tourism-light-blue overflow-hidden">
//        {image ? (
//          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//        ) : (
//          <div className="flex items-center justify-center h-full">
//            <Bed size={40} className="text-tourism-teal" />
//            <div className="text-tourism-ocean/70">Property Image</div>
//          </div>
//        )}
//        <button 
//          onClick={toggleFavorite}
//          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-md z-10"
//        >
//          <Heart 
//            className={`h-5 w-5 ${isFavorite ? 'fill-tourism-coral text-tourism-coral' : 'text-gray-400'}`}
//          />
//        </button>
//        <div className="absolute bottom-2 left-2 bg-white/80 rounded-lg px-2 py-1 flex items-center">
//          <Star className="h-4 w-4 text-tourism-sunset fill-tourism-sunset mr-1" />
//          <span className="text-sm font-medium">{rating}</span>
//        </div>
//      </div>
//      <div className="p-4 bg-white flex-grow">
//        <div className="flex justify-between items-start">
//          <h3 className="font-medium text-lg text-tourism-ocean">{title}</h3>
//        </div>
//        <div className="flex items-center mt-1 mb-2">
//          <Map className="h-4 w-4 text-gray-500 mr-1" />
//          <p className="text-sm text-gray-500">{location}</p>
//        </div>
//        <div className="flex flex-wrap gap-1 mb-3">
//          {amenities.map((amenity, i) => (
//            <span key={i} className="text-xs bg-tourism-light-blue/50 text-tourism-ocean px-2 py-0.5 rounded-md">
//              {amenity}
//            </span>
//          ))}
//        </div>
//        <div className="mt-auto flex justify-between items-center">
//          <p className="text-sm">
//            <span className="font-medium text-gray-600">From</span><br />
//            <span className="font-bold text-tourism-ocean text-lg">${price}</span>
//            <span className="text-xs text-gray-500"> /night</span>
//          </p>
//          <Button 
//            variant="outline" 
//            size="sm" 
//            className="text-xs border-tourism-teal text-tourism-teal hover:bg-tourism-teal hover:text-white"
//          >
//            View Details
//          </Button>
//        </div>
//      </div>
//    </div>
//  );
//};

//const OffersSection: React.FC = () => {
//  const properties = [
//    { 
//      id: 1, 
//      title: "Luxury Villa", 
//      location: "Miami, USA", 
//      price: 299, 
//      image: "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?auto=format&w=500&h=250",
//      amenities: ["Pool", "WiFi", "Sea View"],
//      rating: 4.8
//    },
//    { 
//      id: 2, 
//      title: "Beach House", 
//      location: "Barcelona, Spain", 
//      price: 199, 
//      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&w=500&h=250",
//      amenities: ["Beach Access", "WiFi", "Kitchen"],
//      rating: 4.6
//    },
//    { 
//      id: 3, 
//      title: "Downtown Loft", 
//      location: "New York, USA", 
//      price: 249, 
//      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&w=500&h=250",
//      amenities: ["City View", "WiFi", "Gym"],
//      rating: 4.4
//    },
//    { 
//      id: 4, 
//      title: "Mountain Cabin", 
//      location: "Aspen, USA", 
//      price: 179, 
//      image: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&w=500&h=250",
//      amenities: ["Fireplace", "Hiking", "View"],
//      rating: 4.9
//    }
//  ];

//  return (
//    <div className="py-16 px-6 bg-white relative">
//      <div className="max-w-7xl mx-auto">
//        <div className="text-center mb-12">
//          <h2 className="section-heading text-tourism-ocean">Featured Properties</h2>
//          <p className="text-gray-600 max-w-xl mx-auto mt-4">
//            Discover our handpicked selection of exceptional accommodations in top destinations worldwide.
//          </p>
//        </div>
        
//        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//          {properties.map((property) => (
//            <PropertyCard
//              key={property.id}
//              id={property.id}
//              title={property.title}
//              location={property.location}
//              price={property.price}
//              image={property.image}
//              rating={property.rating}
//              amenities={property.amenities}
//            />
//          ))}
//        </div>
        
//        <div className="mt-12 text-center">
//             <Link to="/properties" className="cursor-pointer">My Properties</Link>

//        </div>
//      </div>
//    </div>
//  );
//};

//export default OffersSection;
