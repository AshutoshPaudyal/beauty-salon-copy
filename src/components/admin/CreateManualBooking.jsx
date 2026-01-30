import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, Clock, Check, Loader2, User, Mail, Phone, ChevronDown, ChevronUp, Search } from "lucide-react";
import { countryCodes } from "../../data/countryCodes";

// Mock Data Generators
const mockFetchCategories = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 1, name: "Threading" },
        { id: 2, name: "Waxing" },
        { id: 3, name: "Facials" },
        { id: 4, name: "Body Scrubbing" },
    ];
};

const mockFetchServices = async (categoryId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const services = {
        1: [
            { id: 1, name: "Eyebrow Threading", duration: "15 min" },
            { id: 2, name: "Upper Lip Threading", duration: "10 min" },
            { id: 3, name: "Full Face Threading", duration: "30 min" },
        ],
        2: [
            { id: 4, name: "Full Body Wax", duration: "60 min" },
            { id: 5, name: "Leg Waxing (Full)", duration: "45 min" },
        ],
        3: [
            { id: 6, name: "Basic Facial", duration: "45 min" },
            { id: 7, name: "Diamond Facial", duration: "60 min" },
        ],
        4: [
            { id: 8, name: "Full Body Scrub", duration: "45 min" },
        ]
    };
    return services[categoryId] || [];
};

const mockFetchTimeSlots = async (date) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Return grouped slots logic simulated
    const slots = {
        Morning: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
        Afternoon: ["12:30 PM", "01:00 PM", "02:00 PM", "02:30 PM", "03:30 PM", "04:00 PM"],
        Evening: ["05:00 PM", "05:30 PM", "06:00 PM"]
    };
    return slots;
};

// Calendar Component
const BookingCalendar = ({ selectedDate, onSelect, isOpen, onClose }) => {
    const [viewDate, setViewDate] = useState(selectedDate || new Date());
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (selectedDate) {
            setViewDate(selectedDate);
        }
    }, [isOpen, selectedDate]);


    if (!isOpen) return null;

    const getUSToday = () => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        const parts = formatter.formatToParts(now);
        const year = parseInt(parts.find(p => p.type === 'year').value);
        const month = parseInt(parts.find(p => p.type === 'month').value) - 1;
        const day = parseInt(parts.find(p => p.type === 'day').value);
        return new Date(year, month, day);
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderDays = () => {
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }

        const usToday = getUSToday();
        const todayStr = usToday.toDateString();

        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            // Compare logic matching DateTimeSelection.jsx
            const compareDate = new Date(date);
            compareDate.setHours(0, 0, 0, 0);
            const compareToday = new Date(usToday);
            compareToday.setHours(0, 0, 0, 0);
            const isPast = compareDate < compareToday;
            const isTodayDate = date.toDateString() === todayStr;

            days.push(
                <button
                    key={d}
                    disabled={isPast}
                    onClick={() => {
                        onSelect(date);
                        onClose();
                    }}
                    className={`h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full text-base font-medium transition-colors cursor-pointer
                        ${isSelected
                            ? 'bg-secondary text-white shadow-lg shadow-pink-200'
                            : isPast
                                ? 'text-gray-300 cursor-not-allowed'
                                : isTodayDate
                                    ? 'text-secondary bg-pink-50'
                                    : 'hover:bg-pink-50 text-muted-foreground'
                        }
                    `}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div
            ref={calendarRef}
            className="absolute lg:left-full lg:-top-32 lg:mt-0 lg:ml-6 top-full mt-4 left-0 z-[110] bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-pink-50 min-w-[320px] sm:min-w-[360px] animate-in fade-in zoom-in slide-in-from-top-4 lg:slide-in-from-left-4 duration-200"
        >
            <div className="flex items-center justify-between mb-8">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-muted-foreground transition-colors cursor-pointer">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-xl font-medium text-muted-foreground">{monthName} {year}</span>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-muted-foreground transition-colors cursor-pointer">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                {weekdays.map(d => <div key={d} className="py-2">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2 place-items-center">
                {renderDays()}
            </div>
        </div>
    );
};

export default function CreateBooking() {
    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        phone: "",
        categoryId: "",
        serviceId: "",
        date: null,
        time: ""
    });

    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [timeSlots, setTimeSlots] = useState({ Morning: [], Afternoon: [], Evening: [] });

    // UI States
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingServices, setLoadingServices] = useState(false);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Phone Country Code State
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countryCodes.find(c => c.code === "US") || countryCodes[0]);
    const [searchTerm, setSearchTerm] = useState("");


    // Fetch Categories on Mount
    useEffect(() => {
        mockFetchCategories().then(data => {
            setCategories(data);
            setLoadingCategories(false);
        });
    }, []);

    // Fetch Services when Category changes
    useEffect(() => {
        if (formData.categoryId) {
            setLoadingServices(true);
            setFormData(prev => ({ ...prev, serviceId: "", time: "" })); // Reset dependent fields
            mockFetchServices(formData.categoryId).then(data => {
                setServices(data);
                setLoadingServices(false);
            });
        } else {
            setServices([]);
        }
    }, [formData.categoryId]);

    // Fetch Times when Date or Service changes
    useEffect(() => {
        if (formData.date && formData.serviceId) {
            setLoadingTimes(true);
            mockFetchTimeSlots(formData.date).then(data => {
                setTimeSlots(data);
                setLoadingTimes(false);
            });
        } else {
            setTimeSlots({ Morning: [], Afternoon: [], Evening: [] });
        }
    }, [formData.date, formData.serviceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API submission
        setSuccessMessage("Booking Created Successfully!");
        setTimeout(() => {
            setSuccessMessage("");
            setFormData({
                customerName: "",
                email: "",
                phone: "",
                categoryId: "",
                serviceId: "",
                date: null,
                time: ""
            });
        }, 3000);
    };

    const formatDateDisplay = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-muted-foreground mb-8">Create Manual Booking</h2>

            {successMessage && (
                <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1">Customer Name *</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-muted-foreground"
                                placeholder="Jane Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1">Customer Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-muted-foreground"
                                placeholder="jane@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1">Customer Phone *</label>
                        <div className="relative">
                            <div className={`flex items-center w-full px-5 py-2 bg-gray-50 border border-gray-100 rounded-2xl transition-all overflow-hidden ${showCountryDropdown ? 'ring-2 ring-secondary/20' : ''}`}>
                                {/* Country Selector Trigger */}
                                <button
                                    type="button"
                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                    className="flex items-center gap-2 py-2 pr-4 border-r border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                                >
                                    <span className="font-semibold text-muted-foreground text-base whitespace-nowrap ml-1">
                                        {selectedCountry.code} {selectedCountry.dial_code}
                                    </span>
                                    <div className="flex flex-col -space-y-1 ml-1 opacity-40">
                                        <ChevronUp className="w-3.5 h-3.5" />
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </button>

                                {/* Phone Input */}
                                <input
                                    type="tel"
                                    required
                                    name="phone"
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-2 bg-transparent focus:outline-none placeholder:text-gray-400 font-medium text-muted-foreground"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Searchable Dropdown */}
                            {showCountryDropdown && (
                                <div className="absolute top-full left-0 mt-3 w-80 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="p-4 border-b border-gray-50 sticky top-0 bg-white/95 backdrop-blur-sm">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search country..."
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 text-sm"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto px-2 py-2 custom-scrollbar">
                                        {countryCodes
                                            .filter(c =>
                                                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                c.dial_code.includes(searchTerm) ||
                                                c.code.toLowerCase().includes(searchTerm.toLowerCase())
                                            ).map((country) => (
                                                <button
                                                    key={`${country.code}-${country.dial_code}`}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setShowCountryDropdown(false);
                                                        setSearchTerm("");
                                                    }}
                                                    className={`w-full px-4 py-3 flex items-center justify-between rounded-2xl transition-all cursor-pointer mb-0.5
                                                        ${selectedCountry.code === country.code
                                                            ? 'bg-pink-50 text-secondary'
                                                            : 'hover:bg-slate-50 text-slate-700'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-100">
                                                            <span className="text-xl transform scale-125">{country.flag}</span>
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-semibold">{country.name}</span>
                                                            <span className="text-xs text-slate-400">{country.code}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium opacity-60">{country.dial_code}</span>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                            {showCountryDropdown && (
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowCountryDropdown(false)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1">Service Category *</label>
                        <div className="relative">
                            <select
                                required
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-muted-foreground appearance-none cursor-pointer"
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                {loadingCategories ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <ChevronLeft className="w-4 h-4 rotate-270 text-gray-400" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1">Service *</label>
                        <div className="relative">
                            <select
                                required
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleInputChange}
                                disabled={!formData.categoryId}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-muted-foreground appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select service</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>{service.name} ({service.duration})</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                {loadingServices ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <ChevronLeft className="w-4 h-4 rotate-270 text-gray-400" />}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-sm font-bold text-gray-500 ml-1">Date *</label>
                        <div
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className={`w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer flex items-center justify-between transition-all group
                                ${isCalendarOpen ? 'ring-2 ring-secondary/20 bg-white' : ''}
                            `}
                        >
                            <span className={`font-medium ${formData.date ? 'text-muted-foreground' : 'text-gray-400'}`}>
                                {formData.date ? formatDateDisplay(formData.date) : 'mm/dd/yyyy'}
                            </span>
                            <Calendar className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors" />
                        </div>

                        {/* Custom Calendar Popover */}
                        <BookingCalendar
                            isOpen={isCalendarOpen}
                            onClose={() => setIsCalendarOpen(false)}
                            selectedDate={formData.date}
                            onSelect={(date) => setFormData(prev => ({ ...prev, date, time: "" }))}
                        />
                    </div>
                </div>

                {/* Time Selection */}
                {formData.date && formData.serviceId && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-bold text-gray-500 ml-1">Available Time Slots *</label>
                        {loadingTimes ? (
                            <div className="flex items-center gap-2 text-gray-400 py-4">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm font-medium">Loading available slots...</span>
                            </div>
                        ) : (
                            <div className="space-y-6 mt-5">
                                {Object.entries(timeSlots).map(([period, slots]) => (
                                    slots.length > 0 && (
                                        <div key={period}>
                                            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">{period}</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 font-sans">
                                                {slots.map(time => (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, time }))}
                                                        className={`py-2.5 px-1 rounded-xl text-xs sm:text-sm font-semibold transition-all border whitespace-nowrap flex items-center justify-center
                                                            ${formData.time === time
                                                                ? 'bg-secondary text-white border-secondary shadow-md'
                                                                : 'bg-white text-muted-foreground border-gray-100 hover:border-pink-200 hover:bg-pink-50'
                                                            }
                                                        `}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                        {!loadingTimes && Object.values(timeSlots).flat().length === 0 && (
                            <p className="text-sm text-gray-400 italic">No slots available for this date.</p>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!formData.time || !formData.date || !formData.serviceId || !formData.customerName}
                    className="w-full bg-secondary hover:bg-button-hover text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-pink-100 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer mt-8"
                >
                    Create Booking
                </button>
            </form>
        </div>
    );
}
