import { useState, useMemo, useRef, useEffect } from "react";
import ConfirmationModal from "../components/admin/ConfirmationModal";
import {
    Search,
    Calendar,
    List,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Mail,
    Phone,
    User,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Settings,
    Camera,
    PlusCircle,
    ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { mockBookings as initialBookings } from "../data/mockBookings";
import ManageServices from "../components/admin/ManageServices";
import ManageServicePhotos from "../components/admin/ManageServicePhotos";
import CreateManualBooking from "../components/admin/CreateManualBooking";
import SetupOfficeHours from "../components/admin/SetupOfficeHours";

const ITEMS_PER_PAGE = 5;


const CustomCalendarPicker = ({ selectedDate, onSelect, isOpen, onClose }) => {
    // Current date for viewing transition
    const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
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

    if (!isOpen) return null;

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const formatDateForSelect = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const renderDays = () => {
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10 sm:h-12 sm:w-12"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const dateStr = formatDateForSelect(date);
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <button
                    key={d}
                    onClick={() => {
                        onSelect(dateStr);
                        onClose();
                    }}
                    className={`h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full text-base font-medium transition-colors cursor-pointer
                        ${isSelected
                            ? 'bg-secondary text-white shadow-lg shadow-pink-200'
                            : isToday
                                ? 'text-secondary bg-pink-50'
                                : 'hover:bg-pink-50 text-gray-700'
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
            className="absolute top-full mt-4 left-0 z-[110] bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-pink-50 min-w-[320px] sm:min-w-[360px] animate-in fade-in zoom-in slide-in-from-top-4 duration-200"
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
                {weekdays.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 place-items-center">
                {renderDays()}
            </div>

        </div>
    );
};

const getTodayDateString = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState(initialBookings);
    const [activeTab, setActiveTab] = useState("Manage Bookings");
    const [viewType, setViewType] = useState("list"); // 'list' or 'date'
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        bookingId: null,
        newStatus: null,
        title: "",
        message: "",
        actionType: "default"
    });

    // Filter Logic
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
            const matchesSearch =
                booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.service.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDate = !selectedDate || booking.date === selectedDate;
            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [filterStatus, searchQuery, selectedDate, bookings]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Grouping by Date for Date View
    const groupedBookings = useMemo(() => {
        const groups = {};
        paginatedBookings.forEach(booking => {
            if (!groups[booking.date]) {
                groups[booking.date] = [];
            }
            groups[booking.date].push(booking);
        });
        return groups;
    }, [paginatedBookings]);

    // Stats
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === "confirmed").length,
        completed: bookings.filter(b => b.status === "completed").length,
        cancelled: bookings.filter(b => b.status === "cancelled").length
    };

    const handleStatusUpdate = (bookingId, status) => {
        const actionText = status === 'completed' ? 'Complete' : 'Cancel';
        setModalConfig({
            isOpen: true,
            bookingId,
            newStatus: status,
            title: `${actionText} Booking?`,
            message: `Are you sure you want to mark booking ${bookingId} as ${status}?`,
            actionType: status === 'cancelled' ? 'delete' : status === 'completed' ? 'complete' : 'confirm'
        });
    };

    const confirmAction = () => {
        if (modalConfig.actionType === 'signout') {
            navigate('/');
        } else {
            setBookings(prev => prev.map(b =>
                b.id === modalConfig.bookingId ? { ...b, status: modalConfig.newStatus } : b
            ));
        }
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleSignOutClick = () => {
        setModalConfig({
            isOpen: true,
            title: "Sign Out?",
            message: "Are you sure you want to exit the Admin Dashboard?",
            actionType: 'signout',
            bookingId: null,
            newStatus: null
        });
    };

    const tabs = [
        "Manage Bookings",
        "Manage Services",
        "Service Photos",
        "Create Manual Booking",
        "Setup Office Hours"
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed": return "text-blue-600 bg-blue-50";
            case "completed": return "text-green-600 bg-green-50";
            case "cancelled": return "text-red-600 bg-red-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    const getStatusBadge = (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(status)}`}>
            {status}
        </span>
    );

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-[#FFF5F8] p-4 sm:p-6 lg:p-12 font-sans">
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmAction}
                title={modalConfig.title}
                message={modalConfig.message}
                actionType={modalConfig.actionType}
            />

            {/* Sign Out Button - Responsive positioning */}
            <div className="max-w-7xl mx-auto mb-6 lg:mb-0">
                <button
                    onClick={handleSignOutClick}
                    className="lg:fixed lg:top-8 lg:left-8 z-[50] flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-pink-100 shadow-sm active:scale-95 group cursor-pointer text-sm sm:text-base"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Sign Out</span>
                </button>
            </div>

            <header className="max-w-7xl mx-auto mb-8 sm:mb-10 lg:mb-12 lg:pt-0">
                <div className="text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-muted-foreground mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground text-base sm:text-lg">Manage bookings, services, and appointments</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${activeTab === tab
                                ? "bg-secondary text-white shadow-md shadow-pink-100"
                                : "bg-white text-gray-600 hover:bg-pink-50 border border-gray-100"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "Manage Bookings" ? (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Total Bookings", value: stats.total, status: "all", color: "border-gray-100" },
                                { label: "Confirmed", value: stats.confirmed, status: "confirmed", color: "border-blue-100 text-blue-600" },
                                { label: "Completed", value: stats.completed, status: "completed", color: "border-green-100 text-green-600" },
                                { label: "Cancelled", value: stats.cancelled, status: "cancelled", color: "border-red-100 text-red-600" }
                            ].map((stat) => (
                                <button
                                    key={stat.label}
                                    onClick={() => { setFilterStatus(stat.status); setCurrentPage(1); }}
                                    className={`bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] border-2 text-left transition-all hover:scale-[1.02] cursor-pointer ${filterStatus === stat.status ? "border-secondary shadow-lg" : `${stat.color} shadow-sm`
                                        }`}
                                >
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 lg:mb-4 uppercase tracking-wider font-semibold">{stat.label}</p>
                                    <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color.includes('text') ? stat.color.split(' ')[1] : 'text-muted-foreground'}`}>
                                        {stat.value}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-5 lg:p-6 shadow-sm border border-pink-50">
                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between mb-6 sm:mb-8">
                                <div className="relative w-full md:max-w-xl">
                                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or service..."
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all text-sm sm:text-base lg:text-lg"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <div className="relative flex items-center">
                                        {selectedDate && (
                                            <button
                                                onClick={() => { setSelectedDate(""); setCurrentPage(1); }}
                                                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md border border-pink-100 rounded-full p-1 sm:p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer animate-in zoom-in slide-in-from-right-2 duration-200"
                                                title="Clear date"
                                            >
                                                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </button>
                                        )}
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                                className={`pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-100 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium focus:outline-none transition-all cursor-pointer min-w-[160px] sm:min-w-[200px] text-left flex items-center gap-1.5 sm:gap-2
                                                    ${selectedDate ? 'text-muted-foreground bg-white ring-2 ring-pink-50' : 'text-gray-400'}`}
                                            >
                                                <Calendar className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${selectedDate ? 'text-secondary' : 'text-gray-400'}`} />
                                                <span className="text-xs sm:text-sm">{selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select Date'}</span>
                                            </button>

                                            <CustomCalendarPicker
                                                selectedDate={selectedDate}
                                                onSelect={(date) => {
                                                    setSelectedDate(date);
                                                    setCurrentPage(1);
                                                }}
                                                isOpen={isCalendarOpen}
                                                onClose={() => setIsCalendarOpen(false)}
                                            />
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-100 mx-1 hidden lg:block"></div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <button
                                            onClick={() => setViewType("list")}
                                            className={`p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl transition-all cursor-pointer ${viewType === "list" ? "bg-secondary text-white shadow-lg shadow-pink-200" : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"}`}
                                            title="List View"
                                        >
                                            <List className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                        </button>
                                        <button
                                            onClick={() => setViewType("date")}
                                            className={`p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl transition-all cursor-pointer ${viewType === "date" ? "bg-secondary text-white shadow-lg shadow-pink-200" : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"}`}
                                            title="Group by Date"
                                        >
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Display */}
                            <div className="space-y-6">
                                {viewType === "list" ? (
                                    paginatedBookings.map((booking) => (
                                        <div key={booking.id} className="border border-gray-50 rounded-xl sm:rounded-2xl lg:rounded-[2rem] p-4 sm:p-5 lg:p-6 transition-all hover:border-pink-200 bg-white shadow-sm hover:shadow-md relative group">
                                            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                                                <div className="flex-1 space-y-3 sm:space-y-4">
                                                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                        <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-secondary/60" />
                                                            <div>
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-tight">Customer</p>
                                                                <p className="font-semibold text-sm sm:text-base text-muted-foreground">{booking.customerName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-secondary/60" />
                                                            <div>
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-tight">Email</p>
                                                                <p className="font-medium text-xs sm:text-sm text-muted-foreground break-all">{booking.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                                                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-secondary/60" />
                                                            <div>
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-tight">Phone</p>
                                                                <p className="font-medium text-sm sm:text-base text-muted-foreground">{booking.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Original Actions Location - Refined Spacing */}
                                                    {booking.status === "confirmed" && (
                                                        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-50">
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-green-50 text-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-green-100 transition-all cursor-pointer"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                Mark as Completed
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-red-50 text-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-red-100 transition-all cursor-pointer"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                Cancel Booking
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="w-full lg:w-1/3 bg-[#FAFBFF] rounded-xl sm:rounded-[1.5rem] p-4 sm:p-5 border border-pink-50 lg:self-start">
                                                    <h3 className="text-lg sm:text-xl font-bold text-muted-foreground mb-2 sm:mb-3">{booking.service}</h3>
                                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 text-xs sm:text-sm">
                                                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                            <span>{booking.duration}</span>
                                                        </div>
                                                        <span className="text-secondary font-bold text-base sm:text-lg">${booking.price}</span>
                                                    </div>
                                                    <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 font-medium">
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary/60" />
                                                            <span className="text-xs sm:text-sm">{new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary/60" />
                                                            <span className="text-xs sm:text-sm text-muted-foreground">{booking.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    Object.entries(groupedBookings).map(([date, dateBookings]) => (
                                        <div key={date} className="space-y-3 sm:space-y-4 pt-6 mt-6 border-t border-gray-300 first:border-0 first:mt-0 first:pt-0 sm:border-0 sm:mt-0 sm:pt-0">
                                            {/* Desktop/Tablet: Show date and count in one line */}
                                            <div className="hidden sm:flex items-center gap-3 py-2 px-1">
                                                <Calendar className="w-5 h-5 text-secondary shrink-0" />
                                                <h3 className="text-lg font-bold text-muted-foreground">{formatDate(date)}</h3>
                                                <span className="bg-pink-100 text-secondary text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                    {dateBookings.length} {dateBookings.length === 1 ? 'booking' : 'bookings'}
                                                </span>
                                            </div>

                                            {/* Mobile: Stack date and count vertically */}
                                            <div className="flex sm:hidden flex-col gap-2 py-2 px-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                                                    <h3 className="text-base font-bold text-muted-foreground">{formatDate(date)}</h3>
                                                </div>
                                                <span className="bg-pink-100 text-secondary text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap self-start ml-6">
                                                    {dateBookings.length} {dateBookings.length === 1 ? 'booking' : 'bookings'}
                                                </span>
                                            </div>
                                            <div className="space-y-2 sm:space-y-3">
                                                {dateBookings.map((booking) => (
                                                    <div key={booking.id} className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all hover:shadow-sm group">
                                                        {/* Mobile Layout: Stack everything vertically */}
                                                        <div className="flex flex-col gap-3 sm:hidden">
                                                            {/* Time and Status Row */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-secondary/60" />
                                                                    <div>
                                                                        <p className="text-sm font-bold text-muted-foreground">{booking.time}</p>
                                                                        <p className="text-[10px] text-gray-500 uppercase font-semibold">{booking.duration}</p>
                                                                    </div>
                                                                </div>
                                                                {getStatusBadge(booking.status)}
                                                            </div>

                                                            {/* Service Info */}
                                                            <div className="border-t border-gray-100 pt-3">
                                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                                    <p className="font-bold text-muted-foreground text-sm leading-tight">{booking.service}</p>
                                                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">{booking.id}</span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">{booking.customerName} • {booking.phone}</p>
                                                            </div>

                                                            {/* Actions */}
                                                            {booking.status === "confirmed" && (
                                                                <div className="flex gap-2 pt-2 border-t border-gray-100">
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 transition-all cursor-pointer"
                                                                    >
                                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                                        Mark as Completed
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer"
                                                                    >
                                                                        <XCircle className="w-3.5 h-3.5" />
                                                                        Cancel Booking
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Desktop/Tablet Layout: Original horizontal layout */}
                                                        <div className="hidden sm:flex items-center justify-between">
                                                            <div className="flex items-center gap-6">
                                                                <div className="text-center w-20">
                                                                    <p className="text-sm font-bold text-muted-foreground">{booking.time}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{booking.duration}</p>
                                                                </div>
                                                                <div className="border-l border-gray-100 pl-6">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-bold text-muted-foreground">{booking.service}</p>
                                                                        <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 rounded uppercase font-bold">{booking.id}</span>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">{booking.customerName} • {booking.phone}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {getStatusBadge(booking.status)}
                                                                {booking.status === "confirmed" && (
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                                            className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-green-100 transition-all cursor-pointer"
                                                                        >
                                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                                            Mark as Completed
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                            className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer"
                                                                        >
                                                                            <XCircle className="w-3.5 h-3.5" />
                                                                            Cancel Booking
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {filteredBookings.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-muted-foreground mb-1">No bookings found</h3>
                                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all cursor-pointer ${currentPage === i + 1
                                                ? "bg-secondary text-white shadow-md shadow-pink-100"
                                                : "text-gray-400 hover:bg-pink-50"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : activeTab === "Manage Services" ? (
                    <ManageServices />
                ) : activeTab === "Service Photos" ? (
                    <ManageServicePhotos />
                ) : activeTab === "Create Manual Booking" ? (
                    <CreateManualBooking />
                ) : activeTab === "Setup Office Hours" ? (
                    <SetupOfficeHours />
                ) : (
                    <div className="text-center py-32 bg-white rounded-[2.5rem] border border-pink-50 shadow-sm">
                        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Settings className="w-10 h-10 text-secondary" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-muted-foreground mb-2">{activeTab}</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">This section is currently under development. Stay tuned for updates!</p>
                        <button
                            onClick={() => setActiveTab("Manage Bookings")}
                            className="bg-secondary hover:bg-button-hover text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                            Return to Bookings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
