import { Card } from "@/components/ui/card.jsx";
import { Sparkles, Heart, Star } from "lucide-react"

const cardContents = [
    { id: 1, title: "Expert Team", description: "Highly trained beauty professionals", icon: Star },
    { id: 2, title: "Premium Quality", description: "Only the finest products and care", icon: Sparkles },
    { id: 3, title: "Personalized Care", description: "Tailored treatments just for you", icon: Heart },
];

export default function AboutUs() {
    return (
        <section
            className="flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-7 lg:gap-15 pb-10 sm:pb-16 lg:pb-20 px-3 sm:px-4 md:px-6 mt-6 sm:mt-10 lg:mt-20">
            <h2 className="font-serif text-secondary text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mt-6 sm:mt-8 md:mt-12 lg:mt-20 text-center">About
                Us</h2>
            <div className={"flex flex-col lg:flex-row justify-center gap-10 lg:gap-15"}>
                <article className={"flex flex-col gap-6 sm:gap-7"}>
                    <p className="text-sm sm:text-base md:text-lg text-left lg:text-2xl leading-relaxed lg:leading-relaxed text-center px-2 sm:px-0 max-w-4xl">
                        At <span
                            className={"font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-secondary"}>Beauty Salon </span>, we
                        believe every woman deserves to feel beautiful and confident. Our
                        passion is bringing out your natural radiance through expert beauty treatments
                    </p>
                    <p className="text-sm sm:text-base text-left md:text-lg lg:text-xl leading-relaxed lg:leading-relaxed text-muted-foreground text-pretty text-center px-2 sm:px-0 max-w-3xl">
                        With years of experience and a commitment to excellence, our skilled professionals use premium products and the latest techniques to deliver outstanding results every single visit.
                    </p>
                </article>
                <article>
                    {cardContents.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card key={card.id}
                                className={"bg-primary-foreground border-0 pl-6 sm:pl-8 lg:pl-7 mb-5 pr-6 sm:pr-8 lg:pr-[18.75rem] py-6 sm:py-8 lg:py-7 rounded-3xl shadow-lg"}>
                                <div className={"flex gap-4 items-center"}>
                                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-secondary fill-secondary shrink-0" />
                                    <div className={"flex flex-col gap-1 sm:gap-3"}>
                                        <h4 className={"text-lg sm:text-xl md:text-2xl text-foreground font-bold"}>{card.title}</h4>
                                        <p className={"text-sm sm:text-base md:text-lg text-muted-foreground"}>{card.description}</p>
                                    </div>
                                </div>
                            </Card>
                        )
                    }
                    )}
                </article>
            </div>
        </section>
    )
}