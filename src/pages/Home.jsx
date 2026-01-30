import Header from "../components/home/Header.jsx";
import HeroSection from "../components/home/HeroSection.jsx";
import ServicesSection from "../components/home/ServicesSection.jsx";
import Footer from "../components/home/Footer.jsx";
import AboutUs from "../components/home/AboutUs.jsx";
import ContactUs from "../components/home/ContactUs.jsx";

export default function Home() {



    return (
        <>
            <Header />
            <hr className="opacity-25" />
            <main id="main" className="pt-0 sm:pt-48 md:pt-48 lg:pt-55 bg-primary">
                <HeroSection />
                <ServicesSection />
                <AboutUs />
            </main>
            <ContactUs />
            <hr className="opacity-15" />
            <Footer />
        </>
    )
}