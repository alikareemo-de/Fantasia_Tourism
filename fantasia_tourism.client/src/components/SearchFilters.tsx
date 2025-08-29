import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccommodationType {
  type: 'Shared' | 'Private';
  label: string;
}

const SearchFilters: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rooms, setRooms] = useState('');
  const [propertyArea, setPropertyArea] = useState('');
  const [hasTransport, setHasTransport] = useState<'Yes' | 'No'>('No');
  const [accommodationType, setAccommodationType] = useState<AccommodationType['type']>('Shared');
  
  const accommodationOptions: AccommodationType[] = [
    { type: 'Shared', label: 'Host Stay' },
    { type: 'Private', label: 'Solo Stay' }
  ];

  return (
    <div className="w-full bg-[#f8f8f5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top filters row */}
        <div className="flex flex-wrap gap-3 justify-between mb-8">
          <div className="bg-[#e5e6e1] px-6 py-2 rounded-full">
            <span className="text-[#4b5d45]">Country</span>
          </div>
          <div className="bg-[#e5e6e1] px-6 py-2 rounded-full">
            <span className="text-[#4b5d45]">City</span>
          </div>
          <div className="bg-[#e5e6e1] px-6 py-2 rounded-full">
            <span className="text-[#4b5d45]">Location</span>
          </div>
          <div className="bg-[#e5e6e1] px-6 py-2 rounded-full">
            <span className="text-[#4b5d45]">Property Type</span>
          </div>
          <div className="hidden md:flex items-end">
            <span className="text-4xl font-bold text-[#4b5d45]">XXXXXs</span>
            <span className="text-sm ml-1 mb-1 text-[#6b7d65]">Per Night</span>
          </div>
        </div>

        {/* Date range section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#4b5d45] mb-3">Available Travel Date</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Input 
                type="date" 
                placeholder="MM/DD/YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-[#a8b7a2] text-[#4b5d45]"
              />
            </div>
            <span className="font-bold text-xl text-[#4b5d45]">To</span>
            <div className="flex items-center">
              <Input 
                type="date" 
                placeholder="MM/DD/YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-[#a8b7a2] text-[#4b5d45]"
              />
            </div>
          </div>
        </div>

        {/* Other details section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#4b5d45] mb-3">Other Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-r border-[#c4cebc]">
              <p className="font-medium text-[#4b5d45]">Rooms available</p>
              <Input 
                type="number" 
                placeholder="0" 
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="border-[#a8b7a2] text-[#4b5d45] max-w-[100px]"
              />
            </div>
            <div className="border-r border-[#c4cebc]">
              <p className="font-medium text-[#4b5d45]">Property area</p>
              <div className="flex items-center gap-2">
                <Input 
                  type="text" 
                  placeholder="300" 
                  value={propertyArea}
                  onChange={(e) => setPropertyArea(e.target.value)}
                  className="border-[#a8b7a2] text-[#4b5d45] max-w-[100px]"
                />
                <span className="text-[#4b5d45]">M²</span>
              </div>
            </div>
            <div className="border-r border-[#c4cebc]">
              <p className="font-medium text-[#4b5d45]">Car for transportation</p>
              <div className="flex gap-4 mt-2">
                <button 
                  className={`px-3 py-1 ${hasTransport === 'Yes' ? 'bg-[#6b7d65] text-white' : 'bg-[#e5e6e1] text-[#4b5d45]'} rounded`}
                  onClick={() => setHasTransport('Yes')}
                >
                  Yes
                </button>
                <button 
                  className={`px-3 py-1 ${hasTransport === 'No' ? 'bg-[#6b7d65] text-white' : 'bg-[#e5e6e1] text-[#4b5d45]'} rounded`}
                  onClick={() => setHasTransport('No')}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <p className="font-medium text-[#4b5d45]">Accommodation type</p>
              <div className="flex gap-4 mt-2">
                {accommodationOptions.map((option) => (
                  <div key={option.type} className="flex items-center">
                    <button
                      className={`px-3 py-1 ${accommodationType === option.type ? 'bg-[#6b7d65] text-white' : 'bg-[#e5e6e1] text-[#4b5d45]'} rounded`}
                      onClick={() => setAccommodationType(option.type)}
                    >
                      {option.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Facilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-[#c4cebc] rounded-lg p-6 bg-[#f2f4ef]">
            <h4 className="text-xl font-bold text-[#4b5d45] mb-3">Public Facilities</h4>
            <p className="text-[#6b7d65]">Outdoor Garden, Terrace/Balcony, BBQ Grill</p>
          </div>
          <div className="border border-[#c4cebc] rounded-lg p-6 bg-[#f2f4ef]">
            <h4 className="text-xl font-bold text-[#4b5d45] mb-3">Entertainment Facilities</h4>
            <p className="text-[#6b7d65]">Smart TV, Board Games, Picnic Tools</p>
          </div>
          <div className="border border-[#c4cebc] rounded-lg p-6 bg-[#f2f4ef]">
            <h4 className="text-xl font-bold text-[#4b5d45] mb-3">Service Facilities</h4>
            <p className="text-[#6b7d65]">Free WiFi, AC/Heating, Hair Dryer, Iron</p>
          </div>
          <div className="border border-[#c4cebc] rounded-lg p-6 bg-[#f2f4ef]">
            <h4 className="text-xl font-bold text-[#4b5d45] mb-3">Premium Add-ons</h4>
            <p className="text-[#6b7d65]">Hot Tub, Coffee/Tea Maker, Bike Rental, Fishing/Picnic Gear</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
