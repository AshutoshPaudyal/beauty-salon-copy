import { Link } from "react-router-dom";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { categoriesData } from "../../data/servicesData";


export default function ServiceCard({ service }) {
    const services = categoriesData.map(cat => ({
        id: cat.id,
        title: cat.title,
        img: cat.img,
        description: cat.description,
        price: `From $${cat.basePrice}`
    }));

    return (
        <section className="grid max-w-[1650px] mx-auto
                      gap-6 sm:gap-8 md:gap-10 lg:gap-15 px-3 grid-cols-1 lg:grid-cols-2 mt-12 sm:mt-16 md:mt-24 lg:mt-30 pb-12 lg:pb-0">
            {services.map((service) => (
                <Card className={"rounded-b-3xl sm:rounded-b-4xl pt-0 shadow-lg md:shadow-xl border-0 hover:shadow-xl md:hover:shadow-2xl transition-shadow"} key={service.id}>
                    <div className="overflow-hidden rounded-t-3xl sm:rounded-t-4xl h-64 sm:h-72 md:h-80 lg:h-90">
                        <img
                            src={service.img}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                        <h3 className={"text-3xl sm:text-4xl md:text-5xl text-secondary font-bold font-serif"}>{service.title}</h3>
                        <p className={"text-base sm:text-lg lg:text-xl text-foreground"}>{service.description}</p>
                        <div className={"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-2"}>
                            <p className={"text-2xl sm:text-3xl text-secondary font-bold"}>{service.price}</p>
                            <Link to={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`} className={"border rounded-full font-semibold px-6 py-2 sm:px-6 sm:py-3 text-base sm:text-lg bg-secondary text-primary-foreground hover:bg-button-hover transition-colors whitespace-nowrap w-full sm:w-auto text-center"}>Book Now</Link>
                        </div>
                    </div>
                </Card>
            ))}
        </section>
    )
}