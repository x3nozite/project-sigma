import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import loginimage from "../assets/loginImage.webp";
import { HiArrowLeft } from "react-icons/hi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkEmailExists, checkUsernameExists } from "./utilities/checkUser";

// schema for validation
const schema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Email is required"),
    password: z
      .string("Password is required")
      .min(8, "Password at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .superRefine(async ({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password must match",
        path: ["confirmPassword"],
      });
    }
  });

export type userFields = z.infer<typeof schema>;

function CreateAccount() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<userFields>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const navigate = useNavigate();
  const handleCreateAccount: SubmitHandler<userFields> = async (data) => {
    try {
      const { username, email, password } = data;
      const emailExists = await checkEmailExists(email);
      const usernameExists = await checkUsernameExists(username);
      if (emailExists) {
        setError("email", { message: "Email already exists" });
        return;
      }
      if (usernameExists) {
        setError("username", { message: "Username already exists!" });
        return;
      }

      const { error: _error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (_error) {
        setError("root", {
          message: _error.message,
        });
        alert("Error creating account: " + _error.message);
        return;
      }

      alert("Account created successfully, please verify email");
      navigate("/signin");
    } catch (error) {
      setError("root", {
        message: "Error!" + error,
      });
      alert("Error creating account: " + error);
    }
  };
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
            <form
              onSubmit={handleSubmit(handleCreateAccount)}
              className="flex flex-col justify-between"
              autoComplete="off"
            >
              <div className="mb-6 flex flex-col gap-y-2">
                <label className="font-bold">Username</label>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Your Username"
                  className="border border-gray-300 rounded-lg p-2 shadow-xs"
                  autoComplete="new-username"
                />
                {errors.username && (
                  <div className="text-red-500">{errors.username?.message}</div>
                )}
              </div>

              <div className="mb-6 flex flex-col gap-y-2">
                <label className="font-bold">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Your Email"
                  className="border border-gray-300 rounded-lg p-2 shadow-xs"
                  autoComplete="new-email"
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email?.message}</div>
                )}
              </div>

              <div className="mb-6 flex flex-col gap-y-2">
                <label className="font-bold">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Your Password"
                  className="border border-gray-300 rounded-lg p-2 shadow-xs"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <div className="text-red-500">{errors.password?.message}</div>
                )}
              </div>

              <div className="mb-6 flex flex-col gap-y-2">
                <label className="font-bold">Confirm Password</label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Re-enter Password"
                  className="border border-gray-300 rounded-lg p-2 shadow-xs"
                  autoComplete="new-confirmPassword"
                />
                {errors.confirmPassword && (
                  <div className="text-red-500">
                    {errors.confirmPassword?.message}
                  </div>
                )}
              </div>
              <div className="userbuttons flex flex-col gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700"
                >
                  {isSubmitting ? "Loading..." : "Create Account"}
                </button>
                <button
                  onClick={() => navigate("/signin")}
                  className="w-full px-5 py-2 rounded-lg border font-medium hover:bg-gray-100"
                >
                  Already have an account?
                </button>
              </div>
              {errors.root && (
                <div className="text-red-500">{errors.root.message}</div>
              )}
            </form>
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
