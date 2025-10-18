import { useNavigate } from "react-router-dom";
import { SecondButton } from "./ui/buttons";
import { useState } from "react";
import { supabase } from "../App";

function CreateAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        alert("Error creating account: " + error.message);
      } else {
        alert("Account created successfully, please verify your email");
        navigate("/signin");
      }
    } catch (error) {
      alert("Error creating account: " + error);
    }
  };

  return (
    <div className="">
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl text-purple-700 font-bold mb-6 text-center">
            Sign In
          </h2>
          <form className="space-y-5">
            <div>
              <label
                className="block text-sm text-purple-700 font-medium mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                className="block text-sm text-purple-700 font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                className="block text-sm text-purple-700 font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label
                className="block text-sm text-purple-700 font-medium mb-1"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-center">
              <SecondButton
                title="Sign In"
                variant="invert"
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateAccount();
                }}
              />
            </div>
          </form>
          <div className="mt-6 flex justify-center">
            <SecondButton title="Back" onClick={() => navigate("/")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
