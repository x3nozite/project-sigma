import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase-client";
// import { SubmitHandler } from "react-hook-form";
import { useSession } from "../context/SessionContext";
import loginimage from "../assets/loginImage.webp";
import { HiArrowLeft } from "react-icons/hi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkEmailExists } from "./utilities/checkUser";
import { useForm, type SubmitHandler } from "react-hook-form";

const schema = z.object({
  email: z.email("invalid email"),
  password: z.string("Password Required"),
});

export type signInFields = z.infer<typeof schema>;

// console.log(
//   schema.safeParse({
//     email: "briantsandriano",
//     password: "hellothisisme",
//   })
// );

function SignIn() {
  const { session } = useSession();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<signInFields>({
    resolver: zodResolver(schema),
    // mode: "onSubmit",
  });

  const handleOAuthSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { data: _data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: import.meta.env.VITE_REDIRECT_URL
        }
      });
      if (error) {
        console.error("cant handle oauth:", error);
        return;
      }
    } catch (error) {
      console.error("cant sign in with google: ", error);
    }
  };

  // use zod here maybe
  // const handleSignIn: SubmitHandler<signInFields> = async (data) => {
  //   const { data: _data, error: _error } =
  //     await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });
  //   if (_error) {
  //     alert(_error.message);
  //     console.error(_error);
  //     return;
  //   }
  //   alert("Login successful!");
  //   navigate("/");
  // };

  const handleRegularSignin: SubmitHandler<signInFields> = async (data) => {
    try {
      const { email, password } = data;

      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        setError("email", { message: "Email is not yet registered!" });
        return;
      }

      const { error: _error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (_error) {
        alert(_error.message);
        return;
      }
      alert("login successful!");
      navigate("/");
    } catch (error) {
      setError("root", {
        message: "Error! " + error,
      });
      alert("Error sign in!: " + error);
    }
  };
  // console.log(session);
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
          {" "}
          The all in one task management app
        </span>
      </div>

      <div className="image-column w-full h-[50vh] sm:h-[40vh] bg-gray-200 flex lg:hidden relative">
        <img src={loginimage} alt="" className="object-cover w-full h-full" />
      </div>

      <div className="form-column h-full w-full px-6 sm:px-10 lg:px-40 pb-10 lg:pb-40 pt-10 lg:pt-20 bg-white flex flex-col items-center justify-center gap-4 lg:col-span-2">
        <div className="lognav flex flex-col w-full items-center justify-center">
          <div className="my-company flex flex-col text-center  lg:flex">
            <span className="text-3xl/12 font-bold">RectUp</span>
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
            <form
              className="flex flex-col justify-between"
              onSubmit={handleSubmit(handleRegularSignin)}
            >
              <div className="mb-8 flex flex-col gap-y-2">
                <label htmlFor="" className="font-bold">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Your Email"
                  className="border border-gray-300  rounded-lg p-2 shadow-xs"
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email?.message}</div>
                )}
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
                  {...register("password")}
                  type="password"
                  placeholder="Your Password"
                  className="border border-gray-300  rounded-lg p-2 shadow-xs"
                />
                {errors.password && (
                  <div className="text-red-500">{errors.password?.message}</div>
                )}
              </div>
              <div className="userbuttons flex flex-col gap-5">
                <div className="flex justify-center items-center w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:cursor-pointer hover:bg-blue-700"
                  >
                    {isSubmitting ? "Loading..." : "Continue with email"}
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
                  Sign in with Google
                </button>
              </div>
            </form>
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
