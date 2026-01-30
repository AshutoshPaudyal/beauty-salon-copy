import { useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { serviceData } from "./ServiceDetails";
import { countryCodes } from "../data/countryCodes";

const mockSubmitBooking = async (bookingData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Mock Submit:", bookingData);
    return {
        success: true,
        bookingId: "BK-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        message: "Booking confirmed successfully"
    };
};

export default function UserInformation() {
    const { category, serviceId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { date, time } = location.state || {};

    // Find service details
    const categoryData = serviceData[category];
    const service = categoryData?.services.find(s => s.id === parseInt(serviceId));

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: ""
    });

    // Country Code State
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countryCodes.find(c => c.code === "US") || countryCodes[0]);
    const [searchTerm, setSearchTerm] = useState("");

    // Steps: 'details' | 'review' | 'confirmed'
    const [step, setStep] = useState('details');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingId, setBookingId] = useState(null);

    if (!service) {
        return <div className="p-10 text-center">Service not found</div>;
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setStep('review');
    };

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            const data = {
                ...formData,
                phone: `${selectedCountry.dial_code} ${formData.phone}`,
                service: service.title,
                price: service.price,
                date: new Date(date).toISOString().split('T')[0],
                time
            };
            const response = await mockSubmitBooking(data);
            if (response.success) {
                setBookingId(response.bookingId);
                setStep('confirmed');
            }
        } catch (error) {
            console.error("Booking failed", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 'confirmed') {
        return (
            <div className="min-h-screen bg-primary p-4 sm:p-6 lg:p-12 font-sans flex flex-col items-center justify-start sm:justify-center relative">
                <div className="max-w-xl w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-pink-50 mt-24 sm:mt-0">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-5xl font-bold font-serif text-muted-foreground mb-8">Booking Confirmed!</h2>
                    <p className="text-muted-foreground text-xl mb-10">
                        Thank you {formData.fullName}. Your appointment for <span className="font-semibold font-serif text-3xl text-secondary">{service.title}</span> on {new Date(date).toLocaleDateString()} at {time} has been booked.
                    </p>
                    <Link to="/" className="inline-block bg-secondary hover:bg-button-hover text-white px-8 py-3 rounded-xl font-medium transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FFF5F8] p-4 sm:p-6 lg:p-12 font-sans flex flex-col items-center justify-start sm:justify-center relative">
            {/* Header */}
            <button
                onClick={() => step === 'review' ? setStep('details') : navigate(-1)}
                className="absolute left-4 top-4 sm:left-12 sm:top-12 flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                <span className="text-sm sm:text-base lg:text-xl">Back</span>
            </button>

            <div className="w-full flex items-center justify-center mt-12 sm:mt-0">
                <div className="max-w-lg w-full bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-sm border border-pink-50">

                    {step === 'details' ? (
                        <>
                            <div className="text-center mb-8 sm:mb-10">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-secondary mb-2 sm:mb-3">Your Information</h2>
                                <p className="text-muted-foreground text-base sm:text-lg">Please provide your contact details</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-5 sm:space-y-6">
                                <div>
                                    <label className="block text-base sm:text-lg font-medium text-muted-foreground mb-1.5 sm:mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your full name"
                                        className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-sm sm:text-base text-muted-foreground"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-base sm:text-lg font-medium text-muted-foreground mb-1.5 sm:mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="your.email@example.com"
                                        className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-sm sm:text-base text-muted-foreground"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-base sm:text-lg font-medium text-muted-foreground mb-1.5 sm:mb-2">Phone Number *</label>
                                    <div className="relative">
                                        <div className={`flex items-center w-full px-5 py-2 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm transition-all overflow-hidden ${showCountryDropdown ? 'ring-2 ring-primary ring-opacity-20' : ''}`}>
                                            {/* Country Selector Trigger */}
                                            <button
                                                type="button"
                                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                className="flex items-center gap-2 py-2 pr-4 border-r border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                                            >
                                                <span className="font-semibold text-muted-foreground text-lg whitespace-nowrap ml-1">
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
                                                placeholder="Phone Number"
                                                className="w-full px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-muted-foreground"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm"
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
                                    </div>

                                    {showCountryDropdown && (
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowCountryDropdown(false)}
                                        />
                                    )}
                                </div>

                                <div className="pt-3 sm:pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-secondary hover:bg-button-hover cursor-pointer text-white font-medium text-base sm:text-lg py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-md transition-all active:scale-[0.98]"
                                    >
                                        Review Booking
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Review Step */
                        <div>
                            <div className="text-center mb-8 sm:mb-10">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-secondary mb-2 sm:mb-3">Review Booking</h2>
                                <p className="text-muted-foreground text-base sm:text-lg">Please review your details before confirming</p>
                            </div>

                            <div className="space-y-6 rounded-2xl p-4 sm:p-2 mb-8">
                                <div className="border-b border-pink-100 pb-4">
                                    <h3 className="text-sm uppercase tracking-wide text-muted-foreground/60 font-semibold mb-3">Service Details</h3>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-muted-foreground text-lg">{service.title}</p>
                                            <p className="text-muted-foreground">{service.duration}</p>
                                        </div>
                                        <p className="font-bold text-secondary text-lg">{service.price}</p>
                                    </div>
                                </div>

                                <div className="border-b border-pink-100 pb-4">
                                    <h3 className="text-sm uppercase tracking-wide text-muted-foreground/60 font-semibold mb-3">Date & Time</h3>
                                    <p className="font-medium text-muted-foreground">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-muted-foreground">{time}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm uppercase tracking-wide text-muted-foreground/60 font-semibold mb-3">Your Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Name</p>
                                            <p className="font-medium text-muted-foreground">{formData.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone</p>
                                            <p className="font-medium text-muted-foreground">{selectedCountry.dial_code} {formData.phone}</p>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="font-medium text-muted-foreground">{formData.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setStep('details')}
                                    className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-muted-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Edit Details
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-6 rounded-xl bg-[#38AFA9] hover:bg-[#7bcbc3] text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Confirming...
                                        </>
                                    ) : "Confirm Booking"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
