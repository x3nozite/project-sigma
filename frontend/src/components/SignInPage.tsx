import { useNavigate } from "react-router-dom";
import { SecondButton } from "./ui/buttons";

function SignIn() {
    const navigate = useNavigate();
    return (
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
                        />
                    </div>
                    <div className="flex justify-center">
                        <SecondButton
                        title="Sign In"
                        variant="invert"
                        onClick={(e) => { e.preventDefault();}}
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
    );
}

export default SignIn;