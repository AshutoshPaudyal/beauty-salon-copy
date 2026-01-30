import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SignIn() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock sign in logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        if (formData.email === "admin@gmail.com" && formData.password === "admin123") {
            navigate("/admin");
        } else {
            navigate("/services");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F8] p-4 sm:p-6 lg:p-12 font-sans flex flex-col items-center justify-start sm:justify-center relative">
            {/* Absolute Back Button - Matching UserInformation.jsx */}
            <Link
                to="/"
                className="absolute left-4 top-4 sm:left-12 sm:top-12 flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                <span className="text-sm sm:text-base lg:text-xl">Back</span>
            </Link>

            <div className="w-full flex items-center justify-center mt-12 sm:mt-0">
                <div className="max-w-lg w-full bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-sm border border-pink-50">
                    <div className="text-center mb-8 sm:mb-10">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-secondary mb-2 sm:mb-3">Welcome Back</h1>
                        <p className="text-muted-foreground text-base sm:text-lg">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        <div>
                            <label className="block text-base sm:text-lg font-medium text-muted-foreground mb-1.5 sm:mb-2">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-300 text-base sm:text-lg text-muted-foreground transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-base sm:text-lg font-medium text-muted-foreground mb-1.5 sm:mb-2">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Enter your password"
                                className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-300 text-base sm:text-lg text-muted-foreground transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary hover:bg-button-hover text-white font-medium text-lg sm:text-xl py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-3 sm:mt-4 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                    Signing in...
                                </>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-muted-foreground text-lg">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-secondary font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
