import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/services/propertyApi';

interface PropertyImageGalleryProps {
    images: string[];
    propertyTitle: string;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
    images,
    propertyTitle
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">No images available</div>
            </div>
        );
    }

    return (
        <>
            {/* Main Image */}
            <div
                className="bg-gray-200 h-96 rounded-lg flex items-center justify-center mb-4 cursor-pointer overflow-hidden"
                onClick={() => openModal(0)}
            >
                {images[0] ? (
                    <img
                        src={getImageUrl(images[0])}
                        alt={`${propertyTitle} - Main view`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                        }}
                    />
                ) : (
                    <div className="text-gray-500">Main Property Image</div>
                )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {images.slice(1, 4).map((image, index) => (
                    <div
                        key={index}
                        className="bg-gray-200 h-24 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
                        onClick={() => openModal(index + 1)}
                    >
                        {image ? (
                            <img
                                src={getImageUrl(image)}
                                alt={`${propertyTitle} - View ${index + 2}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                }}
                            />
                        ) : (
                            <div className="text-gray-500 text-xs">Image {index + 2}</div>
                        )}
                    </div>
                ))}

                {/* Show "More" button if there are more than 4 images */}
                {images.length > 4 && (
                    <div
                        className="bg-gray-200 h-24 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                        onClick={() => openModal(4)}
                    >
                        <div className="text-gray-700 text-sm font-medium">
                            +{images.length - 4} more
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center p-4">
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                            onClick={closeModal}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        {/* Previous Button */}
                        {images.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute left-4 text-white hover:bg-white/20"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                        )}

                        {/* Main Image */}
                        <img
                            src={getImageUrl(images[selectedImageIndex])}
                            alt={`${propertyTitle} - View ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                            }}
                        />

                        {/* Next Button */}
                        {images.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-4 text-white hover:bg-white/20"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} of {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyImageGallery;