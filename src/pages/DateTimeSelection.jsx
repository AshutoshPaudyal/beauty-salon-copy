import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Scissors, Loader2 } from "lucide-react";
import { serviceData } from "./ServiceDetails";

// Mock configuration and data
const OFFICE_HOURS = {
    start: "09:00 AM",
    end: "07:00 PM",
    breaks: [
        { start: "02:00 PM", end: "05:00 PM" }
    ]
};

const BOOKED_SLOTS_BY_DATE = {
    "2026-01-10": ["10:30 AM", "11:00 AM", "05:15 PM"],
    "2026-01-11": ["09:15 AM", "09:30 AM"]
};

// Helper functions (formerly in api.js)
const generateTimeSlots = (config) => {
    const slots = { Morning: [], Afternoon: [], Evening: [] };
    const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };
    const formatTime = (minutes) => {
        let h = Math.floor(minutes / 60);
        let m = minutes % 60;
        const modifier = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${modifier}`;
    };
    const start = parseTime(config.start);
    const end = parseTime(config.end);
    for (let current = start; current < end; current += 15) {
        const isBreak = config.breaks.some(b => {
            const bStart = parseTime(b.start);
            const bEnd = parseTime(b.end);
            return current >= bStart && current < bEnd;
        });
        if (!isBreak) {
            const timeStr = formatTime(current);
            const hour = Math.floor(current / 60);
            if (hour < 12) slots.Morning.push(timeStr);
            else if (hour < 17) slots.Afternoon.push(timeStr);
            else slots.Evening.push(timeStr);
        }
    }
    return slots;
};

const mockFetchBookedSlots = async (dateString) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return BOOKED_SLOTS_BY_DATE[dateString] || [];
};

const mockFetchOfficeHours = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return OFFICE_HOURS;
};

export default function DateTimeSelection() {
    const { category, serviceId } = useParams();

    // Find service details
    const categoryData = serviceData[category];
    const service = categoryData?.services.find(s => s.id === parseInt(serviceId));

    // Helper to get current date in US Eastern Time (America/New_York)
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

    const [currentDate, setCurrentDate] = useState(getUSToday());
    const [selectedDate, setSelectedDate] = useState(getUSToday());
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeSlots, setTimeSlots] = useState({ Morning: [], Afternoon: [], Evening: [] });
    const [bookedSlots, setBookedSlots] = useState([]);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);

    // Fetch office hours on mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await mockFetchOfficeHours();
                const slots = generateTimeSlots(config);
                setTimeSlots(slots);
            } catch (error) {
                console.error("Failed to fetch office hours", error);
            }
        };
        fetchConfig();
    }, []);

    // Fetch booked slots when date changes
    useEffect(() => {
        if (!selectedDate) return;

        const fetchBooked = async () => {
            setIsSlotsLoading(true);
            try {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;

                const booked = await mockFetchBookedSlots(formattedDate);
                setBookedSlots(booked);
            } catch (error) {
                console.error("Failed to fetch booked slots", error);
            } finally {
                setIsSlotsLoading(false);
            }
        };
        fetchBooked();
        setSelectedTime(null);
    }, [selectedDate]);

    // simple calendar logic
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const renderCalendar = () => {
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const days = [];

        // Empty slots for days before start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10 md:h-12 md:w-12"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            // Fix: Compare with US Today to disable past dates
            const usToday = getUSToday();
            // Reset time for comparison
            const compareDate = new Date(date);
            compareDate.setHours(0, 0, 0, 0);
            const compareToday = new Date(usToday);
            compareToday.setHours(0, 0, 0, 0);

            const isPast = compareDate < compareToday;

            days.push(
                <button
                    key={d}
                    disabled={isPast}
                    onClick={() => setSelectedDate(date)}
                    className={`h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full text-base md:text-lg font-medium transition-colors cursor-pointer
                        ${isSelected
                            ? 'bg-secondary text-white shadow-lg shadow-pink-200'
                            : isPast
                                ? 'text-gray-300 cursor-not-allowed'
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

    // Localized weekdays
    const weekdays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(2024, 0, i + 7); // Start from a Sunday (Jan 7, 2024)
        return date.toLocaleDateString('default', { weekday: 'short' });
    });

    if (!service) {
        return <div className="p-10 text-center">Service not found</div>;
    }

    return (
        <div className="min-h-screen bg-primary p-4 sm:p-6 lg:p-12 font-sans">
            {/* Header / Back Button - Full Width */}
            <div className="w-full mb-6 md:mb-8">
                <Link to={`/services/${category}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    <span className="text-sm sm:text-base lg:text-xl">Back</span>
                </Link>
            </div>

            <div className="max-w-6xl mx-auto mb-10 text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-sans text-muted-foreground mb-2">Select Date & Time</h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground">Booking: {service.title} ({service.duration})</p>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Selected Service Card */}
                <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-sm border border-pink-50">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 items-start sm:items-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-pink-50 rounded-xl sm:rounded-[2rem] flex items-center justify-center text-pink-300 shrink-0">
                            {/* Use img if available, else icon */}
                            {service.img ? <img src={service.img} alt={service.title} className="w-full h-full object-cover rounded-xl sm:rounded-[2rem]" /> : <Scissors className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />}
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-muted-foreground mb-1 sm:mb-2">{service.title}</h3>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-1 sm:mb-2">Duration: {service.duration}</p>
                            <p className="text-secondary text-base sm:text-lg md:text-xl lg:text-2xl font-medium">{service.price}</p>
                        </div>
                    </div>
                </div>

                {/* Date & Time Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Calendar Section */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm border border-pink-50 h-fit">
                        <h2 className="text-lg sm:text-xl font-medium text-muted-foreground mb-4 sm:mb-6">Choose Date</h2>
                        <div className="max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-muted-foreground transition-colors">
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <span className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground">{monthName} {year}</span>
                                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-muted-foreground transition-colors">
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-widest">
                                {weekdays.map(day => <div key={day}>{day}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-2 place-items-center">
                                {renderCalendar()}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm border border-pink-50 relative min-h-[400px]">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-muted-foreground flex items-center justify-center">
                                    <div className="w-2.5 h-0.5 sm:w-3 bg-muted-foreground"></div>
                                </div>
                                <h2 className="text-lg sm:text-xl font-medium text-muted-foreground">Choose Time</h2>
                            </div>
                            {isSlotsLoading && <Loader2 className="w-5 h-5 animate-spin text-pink-400" />}
                        </div>

                        {!selectedDate ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground px-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                                    <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 opacity-20" />
                                </div>
                                <p className="text-base sm:text-lg">Please select a date first to see available timings</p>
                            </div>
                        ) : (
                            <div className="space-y-6 sm:space-y-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar ">
                                {Object.entries(timeSlots).map(([period, slots]) => (
                                    slots.length > 0 && (
                                        <div key={period}>
                                            <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 sm:mb-4">{period}</h3>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                                                {slots.map((time) => {
                                                    const isBooked = bookedSlots.includes(time);
                                                    return (
                                                        <button
                                                            key={time}
                                                            disabled={isBooked}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`py-2 px-1 text-sm sm:text-base md:text-lg font-medium rounded-lg border transition-all truncate
                                                                ${selectedTime === time
                                                                    ? 'bg-secondary text-white border-secondary shadow-md'
                                                                    : isBooked
                                                                        ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                                                                        : 'border-pink-200 text-muted-foreground hover:bg-pink-50 cursor-pointer'
                                                                }
                                                            `}
                                                        >
                                                            {time}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Book Appointment Button */}
                        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100">
                            <Link
                                to={`/book/${category}/${serviceId}/details`}
                                state={{ date: selectedDate?.toString(), time: selectedTime }}
                                className={`w-full block text-center py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl font-medium transition-all shadow-md
                                    ${selectedDate && selectedTime
                                        ? 'bg-secondary hover:bg-button-hover text-white cursor-pointer active:scale-[0.98]'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                                    }
                                `}
                            >
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
