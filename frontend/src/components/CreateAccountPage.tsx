import { useNavigate } from "react-router-dom";
import { SecondButton } from "./ui/buttons";
import { useState } from "react";
import { supabase } from "../supabase-client";
import loginimage from "../assets/loginImage.webp";
import { HiArrowLeft } from "react-icons/hi";

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
      const { error } = await supabase.auth.signUp({
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

  // return (
  //   <div className="">
  //     <div className="flex min-h-screen items-center justify-center bg-gray-100">
  //       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
  //         <h2 className="text-2xl text-purple-700 font-bold mb-6 text-center">
  //           Create Account
  //         </h2>
  //         <form className="space-y-5">
  //           <div>
  //             <label
  //               className="block text-sm text-purple-700 font-medium mb-1"
  //               htmlFor="username"
  //             >
  //               Username
  //             </label>
  //             <input
  //               type="text"
  //               id="username"
  //               value={username}
  //               onChange={(e) => setUsername(e.target.value)}
  //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               placeholder="Enter your username"
  //             />
  //           </div>
  //           <div>
  //             <label
  //               className="block text-sm text-purple-700 font-medium mb-1"
  //               htmlFor="email"
  //             >
  //               Email
  //             </label>
  //             <input
  //               type="email"
  //               id="email"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               placeholder="Enter your email"
  //             />
  //           </div>
  //           <div>
  //             <label
  //               className="block text-sm text-purple-700 font-medium mb-1"
  //               htmlFor="password"
  //             >
  //               Password
  //             </label>
  //             <input
  //               type="password"
  //               id="password"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               placeholder="Enter your password"
  //             />
  //           </div>
  //           <div>
  //             <label
  //               className="block text-sm text-purple-700 font-medium mb-1"
  //               htmlFor="confirm-password"
  //             >
  //               Confirm Password
  //             </label>
  //             <input
  //               type="password"
  //               id="confirm-password"
  //               value={confirmPassword}
  //               onChange={(e) => setConfirmPassword(e.target.value)}
  //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               placeholder="Enter your password"
  //             />
  //           </div>
  //           <div className="flex justify-center">
  //             <SecondButton
  //               title="Sign In"
  //               variant="invert"
  //               onClick={(e) => {
  //                 e.preventDefault();
  //                 handleCreateAccount();
  //               }}
  //             />
  //           </div>
  //         </form>
  //         <div className="mt-6 flex justify-center">
  //           <SecondButton title="Back" onClick={() => navigate("/")} />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  
  return (
  <div className="main-container w-full h-screen flex flex-col lg:grid lg:grid-cols-3 items-center">
    <div
      className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow hover:cursor-pointer"
      onClick={() => navigate("/")}
    >
      <HiArrowLeft className="text-lg" />
      <span className="font-medium text-sm">Go Back</span>
    </div>

    <div className="absolute top-24 sm:top-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center text-white text-center lg:hidden">
      <span className="text-3xl/12 font-bold drop-shadow-lg">RectUp</span>
      <span className="text-lg font-medium opacity-90 drop-shadow-md">
        The all in one task management app
      </span>
    </div>

    <div className="image-column w-full h-[50vh] sm:h-[40vh] bg-gray-200 flex lg:hidden relative">
      <img src={loginimage} alt="" className="object-cover w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
    </div>

    <div className="form-column h-full w-full px-6 sm:px-10 lg:px-40 pb-10 lg:pb-40 pt-10 lg:pt-20 bg-white flex flex-col items-center justify-center gap-4 lg:col-span-2">

      <div className="form-container w-full max-w-md bg-white p-5 rounded-lg">
        
        <div className="hero-text flex flex-col pb-5">
          <span className="text-3xl/10 font-bold">Create Account</span>
          <span className="text-md opacity-70">
            Join us! Enter your details below.
          </span>
        </div>

        <div className="main-form">
          <form className="flex flex-col justify-between">

            <div className="mb-6 flex flex-col gap-y-2">
              <label className="font-bold">Username</label>
              <input
                type="text"
                placeholder="Your Username"
                className="border border-gray-300 rounded-lg p-2 shadow-xs"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-6 flex flex-col gap-y-2">
              <label className="font-bold">Email</label>
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-300 rounded-lg p-2 shadow-xs"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6 flex flex-col gap-y-2">
              <label className="font-bold">Password</label>
              <input
                type="password"
                placeholder="Your Password"
                className="border border-gray-300 rounded-lg p-2 shadow-xs"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6 flex flex-col gap-y-2">
              <label className="font-bold">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter Password"
                className="border border-gray-300 rounded-lg p-2 shadow-xs"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

          </form>

          <div className="userbuttons flex flex-col gap-5">
            <button
              onClick={handleCreateAccount}
              className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700"
            >
              Create Account
            </button>

            <button
              onClick={() => navigate("/signin")}
              className="w-full px-5 py-2 rounded-lg border font-medium hover:bg-gray-100"
            >
              Already have an account?
            </button>
          </div>
        </div>

      </div>
    </div>

    <div className="image-column bg-gray-200 h-full hidden lg:flex justify-center items-center relative">
      <img src={loginimage} alt="" className="object-cover w-full h-full" />
    </div>

  </div>
);

}

export default CreateAccount;
