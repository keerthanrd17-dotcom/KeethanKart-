"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import PasswordField from "@/app/components/molecules/PasswordField";
import { z } from "zod";
import MainLayout from "@/app/components/templates/MainLayout";
import { useSignupMutation } from "@/app/store/apis/AuthApi";
import { loginDemoUser, setDemoState, demoId } from "@/app/lib/demo";
import { performGoogleSignIn, formatFirebaseAuthError } from "@/app/lib/firebase";
import { useAppDispatch } from "@/app/store/hooks";
import { setUser } from "@/app/store/slices/AuthSlice";
import useToast from "@/app/hooks/ui/useToast";

interface InputForm {
  name: string;
  email: string;
  password: string;
}

const nameSchema = (value: string) => {
  const result = z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .safeParse(value);
  return result.success || result.error.errors[0].message;
};

const emailSchema = (value: string) => {
  const result = z.string().email("Invalid email address").safeParse(value);
  return result.success || result.error.errors[0].message;
};

const Signup = () => {
  const [signUp, { isLoading, error }] = useSignupMutation();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: InputForm) => {
    try {
      await signUp(formData).unwrap();
      showToast("Account created successfully! Welcome to KeethanKart.", "success");
      router.push("/");
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const googleUser = await performGoogleSignIn();
      dispatch(setUser({ user: googleUser }));
      showToast(
        `Namaste, ${googleUser.name.split(" ")[0]}! Welcome to KeethanKart. 🇮🇳`,
        "success"
      );
      router.push("/");
    } catch (err) {
      console.error("Google sign up error:", err);
      showToast(formatFirebaseAuthError(err), "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    showToast("Exploring as Guest! 🛒", "success");
    router.push("/shop");
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 text-slate-100">
        <main className="w-full max-w-md glass-card p-6 sm:p-9 relative overflow-hidden shadow-2xl">
          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 blur-sm rounded-full" />

          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              🇮🇳 Join KeethanKart
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Join millions of Indian shoppers for exclusive festival deals
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-center text-xs p-3 rounded-xl mb-4">
              Registration failed. Please check your information and try again.
            </div>
          )}

          {/* Google Sign-up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
            className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.99] mb-3"
          >
            {isGoogleLoading ? (
              <Loader2 className="animate-spin text-amber-400" size={18} />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
            )}
            <span>Sign up with Google</span>
          </button>

          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full py-3 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] mb-4"
          >
            <ShoppingBag size={15} className="text-amber-400" />
            <span>Continue as Guest</span>
            <ArrowRight size={14} className="text-slate-400" />
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0a0a1a] text-slate-400 uppercase tracking-wider font-semibold">
                Or with Email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              name="name"
              type="text"
              placeholder="Your Full Name"
              control={control}
              validation={{
                required: "Name is required",
                validate: nameSchema,
              }}
              error={errors.name?.message}
              className="py-2.5 text-sm"
            />

            <Input
              name="email"
              type="text"
              placeholder="Email address"
              control={control}
              validation={{
                required: "Email is required",
                validate: emailSchema,
              }}
              error={errors.email?.message}
              className="py-2.5 text-sm"
            />

            <PasswordField register={register} watch={watch} errors={errors} />

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 mt-5">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-amber-400 font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default Signup;
