import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { categoriesData, getCategoryBySlug } from "../data/servicesData";

export const serviceData = categoriesData.reduce((acc, cat) => {
    acc[cat.slug] = {
        title: cat.title,
        services: cat.services.map(s => ({
            ...s,
            title: s.name,
            price: `$${s.price}`,
            duration: `${s.duration.includes('minutes') ? s.duration : s.duration.replace('min', 'minutes')}`
        }))
    };
    return acc;
}, {});

export default function ServiceDetails() {
    const { category } = useParams();
    // Default to empty/generic if not found
    const currentCategory = serviceData[category] || { title: "Service", services: [] };

    return (
        <div className="min-h-screen bg-[#FFF5F8] p-4 sm:p-6 lg:p-12 font-sans">
            {/* Header / Navigation - Layout matching Booking.jsx */}
            <Link to="/services" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 md:mb-8">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                <span className="text-sm sm:text-base lg:text-xl">Back to Categories</span>
            </Link>

            <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-muted-foreground mb-2 md:mb-4">
                    {currentCategory.title}
                </h1>
            </div>

            {/* Grid of Services */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentCategory.services.map((service) => (
                    <div key={service.id} className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col border border-pink-50 overflow-hidden">
                        {/* Image Container - Fixed Responsive Height */}
                        <div className="w-full h-56 sm:h-64 md:h-72 flex items-center justify-center relative bg-pink-50 overflow-hidden">
                            {service.img ? (
                                <img
                                    src={service.img}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                />
                            ) : (
                                <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-muted-foreground opacity-40" />
                            )}
                        </div>

                        {/* Content Container */}
                        <div className="p-5 sm:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 lg:gap-5 flex-1">
                            {/* Title and Price Row */}
                            <div className="flex justify-between items-center gap-2 sm:gap-3 lg:gap-4">
                                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-foreground leading-tight basis-2/3">
                                    {service.title}
                                </h3>
                                <span className="text-secondary text-base sm:text-lg lg:text-xl xl:text-2xl font-medium px-1.5 sm:px-2 lg:px-3 py-1 rounded-lg shrink-0">
                                    {service.price}
                                </span>
                            </div>

                            {/* Duration */}
                            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base xl:text-xl -mt-1 sm:-mt-2 font-medium">
                                {service.duration}
                            </p>

                            {/* Book Now Button */}
                            {/* Book Now Button */}
                            <Link to={`/book/${category}/${service.id}`} className="w-full mt-auto bg-secondary hover:bg-button-hover text-primary-foreground text-center text-sm sm:text-base lg:text-lg xl:text-xl font-medium py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all shadow-md active:scale-[0.98]">
                                Book Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
