import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFields = z.infer<typeof schema>;

function ResetPassword() {
  const navigate = useNavigate();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        const fullHash = window.location.hash;
        // console.log('Full hash:', fullHash);
        
        const hashParts = fullHash.split('#');
        const tokenFragment = hashParts.length > 2 ? hashParts[2] : hashParts[1];
        
        // console.log('Token fragment:', tokenFragment);
        

        const params = new URLSearchParams(tokenFragment);
        
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        if (error) {
          console.error('Supabase error:', error, errorDescription);
          
          if (error === 'access_denied' && errorDescription?.includes('expired')) {
            setErrorMessage("The reset link has expired. Password reset links are valid for 1 hour only.");
          } else {
            setErrorMessage("Invalid reset link. Please request a new one.");
          }
          
          setIsLoading(false);
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
          return;
        }
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');

        // console.log('URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (accessToken && type === 'recovery') {

          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setErrorMessage("Failed to validate reset link. Please request a new one.");
            setIsLoading(false);
            setTimeout(() => {
              navigate("/signin");
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('Session established successfully');
            setIsValidSession(true);
            setIsLoading(false);
          }
        } else {
          setErrorMessage("No valid reset token found. Please request a new reset link.");
          setIsLoading(false);
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
        }
      } catch (error) {
        console.error("Error in handlePasswordReset:", error);
        setErrorMessage("An error occurred. Please try again.");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      }
    };

    handlePasswordReset();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, !!session);
        if (event === 'PASSWORD_RECOVERY' && session) {
          setIsValidSession(true);
          setIsLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleResetPassword: SubmitHandler<ResetPasswordFields> = async (
    data
  ) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        alert("Error: " + error.message);
        return;
      }

      setResetSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      alert("Error resetting password: " + error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="error-icon mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Link Invalid</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate("/signin")}
            className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:cursor-pointer hover:bg-blue-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
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
          <h2 className="text-2xl font-bold mb-2">
            Password Reset Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been reset successfully. You will be redirected to
            the sign in page in a few seconds.
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:cursor-pointer hover:bg-blue-700"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleResetPassword)}
        >
          <div className="flex flex-col gap-y-2">
            <label htmlFor="password" className="font-bold">
              New Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter new password"
              className="border border-gray-300 rounded-lg p-2 shadow-sm"
            />
            {errors.password && (
              <div className="text-red-500 text-sm">
                {errors.password?.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="confirmPassword" className="font-bold">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm new password"
              className="border border-gray-300 rounded-lg p-2 shadow-sm"
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-5 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:cursor-pointer hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;