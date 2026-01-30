import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
            className="flex flex-col items-center text-muted-foreground text-pretty gap-3 sm:gap-5 py-6 sm:py-8 lg:py-6 px-4 ">
            <p className="flex items-center gap-2 sm:gap-3">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary fill-secondary" />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-secondary font-serif transition-colors">Beauty Salon</span>
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary fill-secondary" />
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-center">&copy; 2025 Beauty Salon. All rights
                reserved.</p>
        </footer>
    )
}