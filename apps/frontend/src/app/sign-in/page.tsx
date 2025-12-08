"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/components/theme-provider";
import { Eye, EyeOff, ChevronLeft, Moon, Sun } from "lucide-react";

export default function SignInPage() {
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in:", { email, password, keepLoggedIn });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="p-4">
        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Sign In</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        <div className="flex w-full bg-white dark:bg-slate-800 rounded-t-[30px] shadow-xl overflow-hidden transition-colors duration-300">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col">
            {/* Back Link */}
            <Link
              href="/dashboard"
              className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm mb-16 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to dashboard
            </Link>

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Sign In</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Enter your email and password to sign in!
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                      or
                    </span>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">
                    Email<span className="text-[hsl(var(--primary))]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@simmmple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white focus:border-[hsl(var(--primary))]"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-200 font-medium">
                    Password<span className="text-[hsl(var(--primary))]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white focus:border-[hsl(var(--primary))] pr-12"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Keep Logged In & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keep-logged-in"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    />
                    <Label
                      htmlFor="keep-logged-in"
                      className="text-sm text-slate-600 dark:text-slate-300 font-normal cursor-pointer"
                    >
                      Keep me logged in
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[hsl(var(--primary))] hover:underline font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white"
                >
                  Sign In
                </Button>

                {/* Register Link */}
                <p className="text-center text-slate-600 dark:text-slate-300 text-sm">
                  Not registered yet?{" "}
                  <Link
                    href="/sign-up"
                    className="text-[hsl(var(--primary))] font-semibold hover:underline transition-colors"
                  >
                    Create an Account
                  </Link>
                </p>
              </form>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
              © 2024 Horizon UI. All Rights Reserved. Made with love by{" "}
              <span className="text-[hsl(var(--primary))] font-medium">Simmmple!</span>
            </footer>
          </div>

          {/* Right Side - Branding */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 dark:from-blue-600 dark:via-cyan-600 dark:to-teal-600">
              {/* Abstract Shapes */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full">
                  <svg
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 600 800"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <ellipse
                      cx="300"
                      cy="100"
                      rx="400"
                      ry="200"
                      fill="url(#gradient1)"
                      opacity="0.6"
                    />
                    <ellipse
                      cx="500"
                      cy="600"
                      rx="300"
                      ry="400"
                      fill="url(#gradient2)"
                      opacity="0.4"
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
              {/* Logo */}
              <div className="mb-4">
                <div className="relative w-32 h-32">
                  <Image
                    src="/logo 2.png"
                    alt="DocIntel Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Brand Name */}
              <h2 className="text-white text-5xl font-bold mb-12 drop-shadow-lg">DocIntel</h2>

              {/* Info Box */}
              <div className="border border-white/30 rounded-2xl px-8 py-6 text-center backdrop-blur-sm bg-white/10">
                <p className="text-white/90 text-sm mb-1">Learn More About Doc Intel:</p>
                <p className="text-white font-semibold text-lg">www.docintel.com</p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-8 text-white/70 text-sm">
              <Link href="#" className="hover:text-white transition-colors">
                Marketplace
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                License
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Blog
              </Link>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
