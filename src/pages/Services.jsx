import { ArrowLeft, ChevronRight } from "lucide-react";
import { categoriesData } from "../data/servicesData";
import { Link } from "react-router-dom";


export default function Booking() {

    const serviceCategories = categoriesData.map(cat => ({
        title: cat.title,
        count: cat.services.length,
        img: cat.img
    }));

    return (
        <div className="min-h-screen bg-[#FFF5F8] p-4 sm:p-6 lg:p-12 font-sans">
            {/* Header / Navigation */}
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors mb-6 md:mb-8">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                <span className="text-sm sm:text-base lg:text-xl">Back to Home</span>
            </Link>

            <div className="max-w-[1400px] mx-auto">
                {/* Categories Section */}
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-bold text-muted-foreground mb-2">
                        Select Service Category
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg md:text-xl">
                        Choose a category to see available services
                    </p>
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {serviceCategories.map((category, index) => (
                        <Link
                            key={index}
                            to={`/services/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col group border border-pink-50 overflow-hidden"
                        >
                            {/* Image Container */}
                            <div className="w-full h-56 sm:h-64 md:h-72 overflow-hidden relative bg-pink-50">
                                <img
                                    src={category.img}
                                    alt={category.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Content Container */}
                            <div className="p-5 sm:p-6 lg:p-6 flex justify-between items-center w-full">
                                <div className="text-left">
                                    <h3 className="text-base sm:text-lg md:text-xl lg:text-xl font-medium text-muted-foreground mb-1 md:mb-2 text-wrap">
                                        {category.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-lg font-light">
                                        {category.count} options available
                                    </p>
                                </div>
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 text-gray-300 group-hover:text-pink-300 transition-colors shrink-0" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
