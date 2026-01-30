import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Clock } from 'lucide-react';


export default function ContactUs() {
    const contacts = [
        { icon: Phone, title: "Phone Number", value: "+977 9812345678" },
        { icon: Mail, title: "Email", value: "ramthapa78@gmail.com" },
        { icon: MapPin, title: "Location", value: "Baluwakhani, Kapan" },
        { icon: Clock, title: "Working Hours", value: "Mon–Sat (9:00 AM – 6:00 PM)" },
    ];
    return (
        <section
            id="contact"
            className="relative flex flex-col items-center gap-7 bg-primary-foreground pt-6 sm:pt-10 md:pt-16 lg:pt-20 pb-16 sm:pb-24 md:pb-32 overflow-hidden">
            <h2 className="text-3xl font-serif text-secondary sm:text-4xl md:text-5xl lg:text-7xl font-bold px-4 text-center">
                Get In Touch With Us
            </h2>
            <div className="grid max-w-[1650px] mx-auto z-10 w-full
                      gap-6 sm:gap-8 md:gap-10
                      px-4 sm:px-6 md:px-8
                      grid-cols-1 md:grid-cols-2 lg:grid-cols-4
                      mt-4 sm:mt-8 md:mt-12 mb-8 sm:mb-16 md:mb-28">
                {contacts.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="flex flex-col justify-center bg-primary gap-4 sm:gap-5 md:gap-6 border rounded-3xl sm:rounded-4xl py-10 px-6 sm:py-16 sm:px-8 shadow-lg border-gray-300 hover:shadow-2xl transition-shadow duration-300 items-center text-center h-full"
                        >
                            <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
                            <p className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-secondary">{item.title}</p>
                            <p className="text-base sm:text-lg font-medium text-muted-foreground break-words w-full">{item.value}</p>
                        </div>
                    )
                })}
            </div>
            <svg
                className="absolute bottom-0 left-0 w-full bg-primary z-0 pointer-events-none"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
            >
                <path
                    fill="white"
                    d="M0,64 C80,96 160,96 240,80
                       320,64 400,32 480,48
                       560,64 640,128 720,112
                       800,96 880,32 960,48
                       1040,64 1120,96 1200,80
                       1280,64 1360,32 1440,48
                       L1440,0 L0,0 Z"
                />
            </svg>
        </section>
    );
}