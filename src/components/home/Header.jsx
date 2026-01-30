import { Link } from "react-router-dom";
import { Sparkles, Heart, Star } from "lucide-react"

export default function Header() {
    return (
        <header className="relative sm:fixed top-0 left-0 w-full bg-white shadow-md z-50 px-2 sm:px-4 py-5 lg:py-7">
            <nav
                className="text-base lg:text-lg font-semibold flex flex-col lg:flex-row items-center justify-between mx-1 sm:mx-2 md:mx-4 lg:mx-4 gap-4 lg:gap-0">
                <Link to="/" className="flex items-center gap-2 sm:gap-3">
                    <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-secondary fill-secondary" />
                    <span className="text-2xl sm:text-3xl lg:text-5xl font-bold font-serif text-secondary transition-colors">Beauty Salon</span>
                </Link>
                <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-7 font-sans text-foreground">
                    <a href="/#main"
                        className="text-xs sm:text-sm lg:text-lg transition-colors hover:text-secondary font-medium">HOME</a>
                    <Link to="/services"
                        className="text-xs sm:text-sm lg:text-lg transition-colors hover:text-secondary font-medium">SERVICES</Link>
                    <a href="/#contact"
                        className="text-xs sm:text-sm lg:text-lg transition-colors hover:text-secondary font-medium">CONTACT US</a>
                    <Link to="/signin" className="text-xs sm:text-sm lg:text-lg transition-colors hover:text-secondary font-medium">SIGN IN</Link>
                    <Link
                        className="rounded-full py-1.5 px-4 sm:py-2 sm:px-5 lg:py-3 lg:px-9 text-xs sm:text-sm lg:text-lg bg-secondary text-primary-foreground hover:bg-button-hover transition-colors whitespace-nowrap font-medium"
                        to="/signup">Sign Up</Link>
                </div>
            </nav>
        </header>
    )
}