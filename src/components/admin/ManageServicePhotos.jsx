import React, { useState, useRef } from "react";
import { Upload, ImageIcon, X, AlertTriangle } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

export default function ManageServicePhotos() {
    const [categories] = useState([
        { id: 1, name: "Threading" },
        { id: 2, name: "Waxing" },
        { id: 3, name: "Facials" },
        { id: 4, name: "Body Scrubbing" },
    ]);

    const [services, setServices] = useState({
        1: [
            { id: 1, name: "Eyebrow Threading", imageUrl: null },
            { id: 2, name: "Upper Lip Threading", imageUrl: null },
            { id: 3, name: "Chin Threading", imageUrl: null },
            { id: 4, name: "Full Face Threading", imageUrl: null },
            { id: 5, name: "Forehead Threading", imageUrl: null },
            { id: 6, name: "Sides Threading", imageUrl: null },
        ],
        2: [
            { id: 1, name: "Full Body Wax", imageUrl: null },
            { id: 2, name: "Leg Waxing (Full)", imageUrl: null },
        ],
        3: [
            { id: 1, name: "Basic Facial", imageUrl: null },
            { id: 2, name: "Diamond Facial", imageUrl: null },
        ],
        4: [
            { id: 1, name: "Full Body Scrub", imageUrl: null },
        ]
    });

    const [selectedCategoryId, setSelectedCategoryId] = useState(1);
    // Removed separate servicePhotos state as imageUrl is now part of service object
    const fileInputRef = useRef(null);
    const [uploadingForId, setUploadingForId] = useState(null);
    const [photoToDelete, setPhotoToDelete] = useState(null);

    const handleUploadClick = (serviceId) => {
        setUploadingForId(serviceId);
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simulate upload
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImageUrl = reader.result;

                // Update service object directly
                const updatedServicesList = services[selectedCategoryId].map(service =>
                    service.id === uploadingForId
                        ? { ...service, imageUrl: newImageUrl }
                        : service
                );

                setServices(prev => ({
                    ...prev,
                    [selectedCategoryId]: updatedServicesList
                }));

                setUploadingForId(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const confirmDelete = (serviceId, e) => {
        e.stopPropagation();
        setPhotoToDelete(serviceId);
    };

    const handleConfirmDelete = () => {
        if (photoToDelete) {
            // Update service object directly to remove image
            const updatedServicesList = services[selectedCategoryId].map(service =>
                service.id === photoToDelete
                    ? { ...service, imageUrl: null }
                    : service
            );

            setServices(prev => ({
                ...prev,
                [selectedCategoryId]: updatedServicesList
            }));

            setPhotoToDelete(null);
        }
    };

    const cancelDelete = () => {
        setPhotoToDelete(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!photoToDelete}
                onClose={cancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Photo?"
                message="Are you sure you want to remove this photo? This action cannot be undone."
                actionType="delete"
            />

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-muted-foreground mb-1">Manage Service Photos</h2>
                        <p className="text-muted-foreground">Upload and manage visual previews for your salon services</p>
                    </div>
                </div>

                {/* Category Selection Pills */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer border-2
                                ${selectedCategoryId === cat.id
                                    ? "bg-secondary text-white border-secondary shadow-lg shadow-pink-100 scale-105"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-pink-200 hover:text-secondary"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services[selectedCategoryId].map((service) => (
                        <div key={service.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col border border-pink-50 overflow-hidden">
                            {/* Image Container */}
                            <div className="w-full h-56 sm:h-64 md:h-72 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => handleUploadClick(service.id)}>
                                {service.imageUrl ? (
                                    <>
                                        <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
                                        <button
                                            onClick={(e) => confirmDelete(service.id, e)}
                                            className="absolute top-2 right-2 z-10 p-2 cursor-pointer bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full shadow-sm transition-colors"
                                            title="Remove Photo"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </>
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-muted-foreground opacity-40" />
                                )}
                                {/* Upload overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl scale-90 group-hover:scale-100 transition-all">
                                        <Upload className="w-6 h-6 text-secondary" />
                                    </div>
                                </div>
                            </div>
                            {/* Service Content */}
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-muted-foreground">{service.name}</h3>
                                <button onClick={() => handleUploadClick(service.id)} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl cursor-pointer font-semibold text-sm ${service.imageUrl ? 'bg-gray-100 text-gray-600' : 'bg-secondary text-white'} transition-all`}>
                                    <Upload className="w-4 h-4" />
                                    Upload Photo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
