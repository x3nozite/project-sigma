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

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

function SignIn() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<signInFields>({
    resolver: zodResolver(schema),
    // mode: "onSubmit",
  });

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot, isSubmitting: isSubmittingForgot },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
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

  const handleForgotPassword: SubmitHandler<ForgotPasswordFields> = async (
    data
  ) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `http://localhost:5173/#/reset-password`,
      });

      if (error) {
        alert("Error: " + error.message);
        return;
      }

      setEmailSent(true);
    } catch (error) {
      alert("Error sending reset email: " + error);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setEmailSent(false);
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
                  <span className="text-sm opacity-70 hover:cursor-pointer"
                    onClick={() => setShowForgotPasswordModal(true)}>
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

      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeForgotPasswordModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {!emailSent ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <form onSubmit={handleSubmitForgot(handleForgotPassword)}>
                  <div className="mb-6 flex flex-col gap-y-2">
                    <label htmlFor="forgot-email" className="font-bold">
                      Email
                    </label>
                    <input
                      {...registerForgot("email")}
                      type="email"
                      id="forgot-email"
                      placeholder="Your Email"
                      className="border border-gray-300 rounded-lg p-2 shadow-sm"
                    />
                    {errorsForgot.email && (
                      <div className="text-red-500 text-sm">
                        {errorsForgot.email?.message}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingForgot}
                    className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:cursor-pointer hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isSubmittingForgot ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="success-icon mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to your email address. Please
                  check your inbox and click the link to reset your password.
                </p>
                <button
                  onClick={closeForgotPasswordModal}
                  className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:cursor-pointer hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
