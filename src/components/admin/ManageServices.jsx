import React, { useState } from "react";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import { categoriesData } from "../../data/servicesData";

export default function ManageServices() {
    const [categories, setCategories] = useState(categoriesData.map(cat => ({
        id: cat.id,
        name: cat.title,
        slug: cat.slug,
        description: cat.description
    })));
    const [selectedCategoryId, setSelectedCategoryId] = useState(1);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [services, setServices] = useState(categoriesData.reduce((acc, cat) => {
        acc[cat.id] = cat.services.map(s => ({
            id: s.id,
            name: s.name,
            duration: s.duration,
            price: s.price
        }));
        return acc;
    }, {}));

    const [newService, setNewService] = useState({ name: "", duration: "", price: "" });

    // Inline Editing State - Categories
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editCategoryData, setEditCategoryData] = useState({ name: "", description: "" });

    // Inline Editing State - Services
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [editServiceData, setEditServiceData] = useState({ name: "", duration: "", price: "" });

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null, // 'category' or 'service'
        id: null,
        title: "",
        message: ""
    });

    const handleAddCategory = () => {
        if (!newCategory.name.trim()) return;
        const newId = Date.now();
        setCategories([...categories, {
            id: newId,
            name: newCategory.name,
            description: newCategory.description,
            slug: newCategory.name.toLowerCase().replace(/\s+/g, '-')
        }]);
        setServices({ ...services, [newId]: [] });
        setNewCategory({ name: "", description: "" });
    };

    const handleAddService = () => {
        if (!newService.name || !newService.duration || !newService.price) return;
        const categoryServices = services[selectedCategoryId] || [];
        const updatedServices = [
            ...categoryServices,
            { id: Date.now(), ...newService }
        ];
        setServices({ ...services, [selectedCategoryId]: updatedServices });
        setNewService({ name: "", duration: "", price: "" });
    };

    // Category Edit Handlers
    const startEditCategory = (cat, e) => {
        e.stopPropagation();
        setEditingCategoryId(cat.id);
        setEditCategoryData({ name: cat.name, description: cat.description || "" });
    };

    const cancelEditCategory = (e) => {
        e.stopPropagation();
        setEditingCategoryId(null);
        setEditCategoryData({ name: "", description: "" });
    };

    const saveEditCategory = (e) => {
        e.stopPropagation();
        if (!editCategoryData.name.trim()) return;
        setCategories(categories.map(cat =>
            cat.id === editingCategoryId ? { ...cat, name: editCategoryData.name, description: editCategoryData.description } : cat
        ));
        setEditingCategoryId(null);
        setEditCategoryData({ name: "", description: "" });
    };

    // Service Edit Handlers
    const startEditService = (service) => {
        setEditingServiceId(service.id);
        // Strip ' min' for editing
        const numericDuration = service.duration.replace(' min', '');
        setEditServiceData({ ...service, duration: numericDuration });
    };

    const cancelEditService = () => {
        setEditingServiceId(null);
        setEditServiceData({ name: "", duration: "", price: "" });
    };

    const saveEditService = () => {
        if (!editServiceData.name || !editServiceData.duration || !editServiceData.price) return;

        // Add ' min' back for storage
        const formattedDuration = editServiceData.duration.includes('min')
            ? editServiceData.duration
            : `${editServiceData.duration} min`;

        const updatedServices = services[selectedCategoryId].map(s =>
            s.id === editingServiceId ? { ...editServiceData, duration: formattedDuration } : s
        );
        setServices({ ...services, [selectedCategoryId]: updatedServices });
        setEditingServiceId(null);
    };

    const openDeleteServiceConfirm = (id) => {
        const service = services[selectedCategoryId].find(s => s.id === id);
        setConfirmModal({
            isOpen: true,
            type: 'service',
            id: id,
            title: "Delete Service?",
            message: `Are you sure you want to remove "${service.name}"? This action cannot be undone.`
        });
    };

    const openDeleteCategoryConfirm = (id, e) => {
        e.stopPropagation();
        const category = categories.find(c => c.id === id);
        setConfirmModal({
            isOpen: true,
            type: 'category',
            id: id,
            title: "Delete Category?",
            message: `Are you sure you want to remove the "${category.name}" category and all its services?`
        });
    };

    const confirmDelete = () => {
        if (confirmModal.type === 'service') {
            const updatedServices = services[selectedCategoryId].filter(s => s.id !== confirmModal.id);
            setServices({ ...services, [selectedCategoryId]: updatedServices });
        } else if (confirmModal.type === 'category') {
            const updatedCategories = categories.filter(cat => cat.id !== confirmModal.id);
            setCategories(updatedCategories);
            const newServices = { ...services };
            delete newServices[confirmModal.id];
            setServices(newServices);
            if (selectedCategoryId === confirmModal.id) {
                setSelectedCategoryId(updatedCategories[0]?.id || null);
            }
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    return (
        <>
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                actionType="delete"
            />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Add New Category */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50">
                    <h2 className="text-xl font-bold text-muted-foreground mb-6">Add New Service Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 ml-1">Category Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Hair Styling, Makeup, Nails"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-500 ml-1">Category Description</label>
                            <div className="flex flex-col gap-4">
                                <textarea
                                    placeholder="Provide a detailed description of the category."
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium min-h-[120px] resize-none"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="w-full sm:w-64 self-end bg-secondary hover:bg-button-hover text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer h-[58px]"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Categories Grid */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50">
                    <h2 className="text-xl font-bold text-muted-foreground mb-8">Service Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <div key={cat.id} className="relative group/category">
                                <button
                                    onClick={() => !editingCategoryId && setSelectedCategoryId(cat.id)}
                                    className={`w-full p-8 pt-24 rounded-[2rem] border-2 text-left transition-all group cursor-pointer h-full min-h-[180px] flex flex-col justify-start
                                                ${selectedCategoryId === cat.id
                                            ? 'border-secondary bg-pink-50/30'
                                            : 'border-pink-100 bg-gray-50/30 hover:border-pink-200'}
                                                ${editingCategoryId === cat.id ? 'ring-2 ring-secondary/50' : ''}`}
                                >
                                    <div className="flex flex-col h-full">
                                        {editingCategoryId === cat.id ? (
                                            <div className="w-full space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider ml-1">Name</label>
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        className="w-full px-4 py-2 bg-white border border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-bold text-muted-foreground text-lg shadow-sm"
                                                        value={editCategoryData.name}
                                                        onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider ml-1">Description</label>
                                                    <textarea
                                                        className="w-full px-4 py-2 bg-white border border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-muted-foreground text-sm shadow-sm min-h-[80px] resize-none"
                                                        value={editCategoryData.description}
                                                        onChange={(e) => setEditCategoryData({ ...editCategoryData, description: e.target.value })}
                                                        onClick={(e) => e.stopPropagation()}
                                                        placeholder="Category description..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-bold text-muted-foreground mb-1 group-hover:text-secondary transition-colors leading-tight">{cat.name}</h3>
                                                <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-auto">{(services[cat.id] || []).length} services</p>
                                            </>
                                        )}
                                    </div>
                                </button>
                                <div className="absolute top-8 left-8 flex gap-3">
                                    {editingCategoryId === cat.id ? (
                                        <>
                                            <button
                                                onClick={saveEditCategory}
                                                className="p-2.5 bg-secondary text-white rounded-xl shadow-md cursor-pointer z-10 hover:bg-button-hover transition-all active:scale-90"
                                                title="Save"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={cancelEditCategory}
                                                className="p-2.5 bg-white text-gray-400 hover:text-red-500 rounded-xl transition-all border border-pink-50 shadow-md cursor-pointer z-10 active:scale-90"
                                                title="Cancel"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => startEditCategory(cat, e)}
                                                className="p-2.5 bg-white text-gray-400 hover:text-blue-500 rounded-xl transition-all border border-pink-50 shadow-sm cursor-pointer z-10 active:scale-90"
                                                title="Edit Category"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {categories.length > 1 && (
                                                <button
                                                    onClick={(e) => openDeleteCategoryConfirm(cat.id, e)}
                                                    className="p-2.5 bg-white text-gray-400 hover:text-red-500 rounded-xl transition-all border border-pink-50 shadow-sm cursor-pointer z-10 active:scale-90"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Category Services */}
                {selectedCategoryId && (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50 animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold text-muted-foreground mb-8">
                            {categories.find(c => c.id === selectedCategoryId)?.name} Services ({(services[selectedCategoryId] || []).length})
                        </h2>

                        {/* Add New Service Form */}
                        <div className="mb-12 border-b border-gray-100 pb-12">
                            <h3 className="text-lg font-bold text-muted-foreground mb-6">Add New Service to {categories.find(c => c.id === selectedCategoryId)?.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-sm font-semibold text-gray-500 ml-1">Service Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Full Arms Waxing"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-500 ml-1">Duration (minutes)</label>
                                    <input
                                        type="text"
                                        placeholder="eg., 30"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                                        value={newService.duration}
                                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-500 ml-1">Price ($)</label>
                                    <input
                                        type="text"
                                        placeholder="eg., 50"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={handleAddService}
                                    className="w-full bg-secondary hover:bg-button-hover text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer h-[58px]"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Service
                                </button>
                            </div>
                        </div>

                        {/* Services List Table */}
                        <div>
                            <h3 className="text-lg font-bold text-muted-foreground mb-6">Existing {categories.find(c => c.id === selectedCategoryId)?.name} Services</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            <th className="text-left py-4 px-4 text-sm font-black text-gray-400 uppercase tracking-widest w-[40%]">Service Name</th>
                                            <th className="text-left py-4 px-4 text-sm font-black text-gray-400 uppercase tracking-widest w-[20%]">Duration</th>
                                            <th className="text-left py-4 px-4 text-sm font-black text-gray-400 uppercase tracking-widest w-[20%]">Price</th>
                                            <th className="text-right py-4 px-4 text-sm font-black text-gray-400 uppercase tracking-widest w-[20%]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(services[selectedCategoryId] || []).map((service) => (
                                            <tr key={service.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group h-[80px]">
                                                {editingServiceId === service.id ? (
                                                    <>
                                                        <td className="py-4 px-4 align-middle">
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-2 bg-white border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold text-muted-foreground"
                                                                value={editServiceData.name}
                                                                onChange={(e) => setEditServiceData({ ...editServiceData, name: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 align-middle">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    className="w-20 px-4 py-2 bg-white border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-gray-600 text-center"
                                                                    value={editServiceData.duration}
                                                                    onChange={(e) => setEditServiceData({ ...editServiceData, duration: e.target.value })}
                                                                />
                                                                <span className="text-sm text-gray-400 font-medium">min</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 align-middle">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-secondary font-bold">$</span>
                                                                <input
                                                                    type="text"
                                                                    className="w-24 px-4 py-2 bg-white border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold text-secondary text-center"
                                                                    value={editServiceData.price}
                                                                    onChange={(e) => setEditServiceData({ ...editServiceData, price: e.target.value })}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-right align-middle">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={saveEditService}
                                                                    className="p-2 bg-secondary text-white rounded-lg hover:bg-button-hover transition-colors cursor-pointer"
                                                                    title="Save"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={cancelEditService}
                                                                    className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                                                    title="Cancel"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="py-5 px-4 font-bold text-muted-foreground">{service.name}</td>
                                                        <td className="py-5 px-4 text-gray-600 font-medium">{service.duration}</td>
                                                        <td className="py-5 px-4 text-secondary font-bold">${service.price}</td>
                                                        <td className="py-5 px-4">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <button
                                                                    onClick={() => startEditService(service)}
                                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteServiceConfirm(service.id)}
                                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        {(services[selectedCategoryId] || []).length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">No services in this category yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
