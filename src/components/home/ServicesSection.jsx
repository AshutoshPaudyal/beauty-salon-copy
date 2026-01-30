import ServiceCard from "./ServiceCard.jsx";
import { Sparkles, Star } from "lucide-react"



export default function ServicesSection() {
    return (
        <section className="mt-6 sm:mt-12 md:mt-20 lg:mt-20 px-3 pt-10 sm:pt-16 md:pt-24 lg:pt-24 bg-primary-foreground pb-10 sm:pb-16 md:pb-24 lg:pb-24">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-6xl
                     flex justify-center font-bold text-secondary text-center">
                Our Services
            </h2>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-secondary fill-secondary" />
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-secondary fill-secondary" />
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-secondary fill-secondary" />
            </div>
            <ServiceCard />
        </section>
    );
}
