import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase-client";
import { useSession } from "../context/SessionContext";
import loginimage from "../assets/loginImage.webp";
import { HiArrowLeft } from "react-icons/hi";

function SignIn() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOAuthSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { data: _data, error } = await supabase.auth.signInWithOAuth({
        provider: "google"
      });
      if (error) {
        console.error("cant handle oauth:", error);
        return;
      }
    } catch (error) {
      console.error("cant sign in with google: ", error);
    }

  };

  const handleSignIn = async () => {
    try {
      const { error: _error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });



      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
  console.log(session);
  return (
    // <div className="">
    //   <div className="flex min-h-screen items-center justify-center bg-gray-100">
    //     <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
    //       <h2 className="text-2xl text-purple-700 font-bold mb-6 text-center">
    //         Sign In
    //       </h2>
    //       <form className="space-y-5">
    //         <div>
    //           <label
    //             className="block text-sm text-purple-700 font-medium mb-1"
    //             htmlFor="email"
    //           >
    //             Email
    //           </label>
    //           <input
    //             type="email"
    //             id="email"
    //             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //             placeholder="Enter your email"
    //             onChange={(e) => setEmail(e.target.value)}
    //           />
    //         </div>
    //         <div>
    //           <label
    //             className="block text-sm text-purple-700 font-medium mb-1"
    //             htmlFor="password"
    //           >
    //             Password
    //           </label>
    //           <input
    //             type="password"
    //             id="password"
    //             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //             placeholder="Enter your password"
    //             onChange={(e) => setPassword(e.target.value)}
    //           />
    //         </div>
    //         <div className="flex justify-center">
    //           <button
    //             onClick={handleOAuthSignIn}
    //             className="flex justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100"
    //           >
    //             <img
    //               src="https://developers.google.com/identity/images/g-logo.png"
    //               alt="Google logo"
    //               className="w-5 h-5"
    //             />
    //           </button>
    //         </div>
    //         <div className="flex justify-center">
    //           <SecondButton
    //             title="Sign In"
    //             variant="invert"
    //             onClick={handleSignIn}
    //           />
    //         </div>
    //       </form>
    //       <div className="mt-6 flex justify-center">
    //         <SecondButton title="Back" onClick={() => navigate("/")} />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="main-container w-full h-screen flex flex-col lg:grid lg:grid-cols-3 items-center">
      <div className="form-column h-full w-full px-6 sm:px-10 lg:px-40 pb-10 lg:pb-40 pt-10 lg:pt-20 bg-white flex flex-col items-center justify-center gap-4 lg:col-span-2">
        <div className="lognav flex flex-col w-full items-center justify-center">
          <button
            onClick={() => navigate("/")}
            className="text-start w-full inline-flex items-center gap-2 hover:cursor-pointer hover:underline"
          >
            <HiArrowLeft />
            <span>Go Back</span>
          </button>
          <div className="my-company flex flex-col text-center">
            <span className="text-3xl/12 font-bold">MyTudus</span>
            <span className="text-lg font-medium">
              The all in one task management app
            </span>
          </div>
        </div>
        <div className="form-container w-full max-w-md bg-white p-5 rounded-lg">
          <div className="hero-text flex flex-col pb-5">
            <span className="text-3xl/10 font-bold">Sign In</span>
            <span className="text-md opacity-70">
              Welcome back! Enter your details below.
            </span>
          </div>
          <div className="main-form ">
            <form action="" className="flex flex-col justify-between">
              <div className="mb-8 flex flex-col gap-y-2">
                <label htmlFor="" className="font-bold">
                  Email
                </label>
                <input
                  type="email"
                  name=""
                  id="email"
                  placeholder="Your Email"
                  className="border border-gray-300  rounded-lg p-2 shadow-xs"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-8 flex flex-col gap-y-2">
                <div className="flex flex-row w-full justify-between pr-2">
                  <label htmlFor="" className="font-bold ">
                    Password
                  </label>
                  <span className="text-sm opacity-70 hover:cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="Your Password"
                  className="border border-gray-300  rounded-lg p-2 shadow-xs"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </form>
            <div className="userbuttons flex flex-col gap-5">
              <div className="flex justify-center items-center w-full">
                <button
                  onClick={handleSignIn}
                  className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:cursor-pointer hover:bg-blue-700"
                >
                  Continue with email
                </button>
              </div>
              <div className="flex justify-center items-center w-full">
                <span className="text-lg font-light text-center">
                  Or continue with
                </span>
              </div>
              <button
                onClick={handleOAuthSignIn}
                className="w-full inline-flex rounded-lg font-medium px-5 py-2 text-center items-center justify-center gap-2 border hover:bg-gray-100 hover:cursor-pointer"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5"
                />
                {/* change logo to svg dont do image im just lazy rn -B */}
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="image-column bg-gray-200 h-full hidden lg:flex justify-center items-center">
        <img src={loginimage} alt="" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}

export default SignIn;
