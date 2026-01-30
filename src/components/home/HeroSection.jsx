import { Link } from "react-router-dom";

export default function HeroSection() {
    return (
        <>
            <section id="heroSection"
                className="flex flex-col items-center justify-center gap-4 sm:gap-8 md:gap-10 lg:gap-10 px-4 sm:px-6 md:px-8">
                <h2 className="text-secondary text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-serif font-bold text-center leading-tight">
                    it's time to <br />sparkle & shine</h2>
                <p className="font-sans text-foreground text-lg sm:text-xl md:text-2xl lg:text-2xl text-center max-w-xl sm:max-w-2xl lg:max-w-none px-4">
                    Indulge in our luxurious beauty treatments
                </p>
                <Link
                    className="font-bold shadow-lg text-lg sm:text-xl md:text-2xl  mt-6 sm:mt-8 md:mt-10 lg:mt-10 rounded-full py-3 px-8 sm:py-3.5 sm:px-10 lg:py-5 lg:px-15 bg-secondary text-primary-foreground hover:bg-button-hover transition-colors"
                    to="/services">Book Now</Link>
                <div className={"flex flex-col lg:flex-row gap-8 lg:gap-10 justify-center items-center mt-12 sm:mt-16 lg:mt-15 w-full"}>
                    <div className={"p-3 sm:p-4 md:p-5 bg-white shadow-xl transform md:-rotate-3 hover:rotate-0 transition-transform w-[90%] sm:w-[80%] md:w-auto max-w-[400px]"}>
                        <img className={"w-full h-auto aspect-[3/4] object-cover"} src="/assets/beautiful-women-eyebrow-threading-closeup.png" alt="Threading" />
                    </div>
                    <div className={"p-3 sm:p-4 md:p-5 bg-white shadow      -xl transform md:rotate-2 hover:rotate-0 transition-transform w-[90%] sm:w-[80%] md:w-auto max-w-[400px]"}>
                        <img className={"w-full h-auto aspect-[3/4] object-cover"} src="/assets/spa-facial-treatment-relaxing-women.png" alt="Facial" />
                    </div>

                </div>
            </section>
        </>
    )
}