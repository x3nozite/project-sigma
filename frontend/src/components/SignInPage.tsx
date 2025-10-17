import { useNavigate } from "react-router-dom";
import { SecondButton } from "./ui/buttons";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Login successful!");
        navigate("/");
        } catch (error) {
        console.error(error);
        alert("Something went wrong!");
        }
    };
    return (

        <div className="">
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl text-purple-700 font-bold mb-6 text-center">Sign In</h2>
                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm text-purple-700 font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-purple-700 font-medium mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <SecondButton
                            title="Sign In"
                            variant="invert"
                            onClick={handleSignIn}
                            />
                        </div>
                        
                    </form>
                    <div className="mt-6 flex justify-center">
                        <SecondButton 
                        title="Back" 
                        onClick={() => navigate("/")} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
        
            
}

export default SignIn;