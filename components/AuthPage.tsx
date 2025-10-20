import { useState } from "react";
import {
  Brain,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";

interface AuthPageProps {
  onLogin: (user: { email: string; name: string }) => void;
  onSkip?: () => void;
  hasPAOData?: boolean;
}

export function AuthPage({
  onLogin,
  onSkip,
  hasPAOData = false,
}: AuthPageProps) {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    // Validation
    if (isSignup && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // If no errors, proceed with authentication
    if (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.password
    ) {
      const user = {
        email: formData.email,
        name: isSignup
          ? formData.name
          : formData.email.split("@")[0],
      };

      // Store user in localStorage
      localStorage.setItem("pao-user", JSON.stringify(user));

      onLogin(user);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Success banner if PAO data imported */}
      {hasPAOData && (
        <div className="px-6 pt-6 pb-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-1">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <h3 className="text-sm text-emerald-700 dark:text-emerald-300">
                Your PAO is ready!
              </h3>
            </div>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 pl-8">
              Create an account to save your progress
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center mx-auto mb-4 shadow-large">
            <Brain
              className="w-10 h-10 text-white"
              strokeWidth={2}
            />
          </div>
          <h1 className="text-3xl mb-2">
            {isSignup ? "Get Started" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSignup
              ? "Create your account to continue"
              : "Sign in to your account"}
          </p>
        </div>

        {/* Auth Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 flex flex-col"
        >
          {/* Name field (signup only) */}
          {isSignup && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  handleInputChange("name", e.target.value)
                }
                placeholder="Enter your name"
                className={`w-full ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
              placeholder="Enter your email"
              className={`w-full ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-muted-foreground" />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                handleInputChange("password", e.target.value)
              }
              placeholder="Enter your password"
              className={`w-full ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex-1" />

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 shadow-lg"
          >
            {isSignup ? "Create Account" : "Sign In"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Toggle between login/signup */}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setErrors({ name: "", email: "", password: "" });
            }}
            className="text-sm text-center text-muted-foreground"
          >
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span className="text-primary">Sign in</span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span className="text-primary">Sign up</span>
              </>
            )}
          </button>

          {/* Skip for now option */}
          {hasPAOData && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-center text-muted-foreground"
            >
              Skip for now
            </button>
          )}

          {/* Demo note */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Demo Mode: Data stored locally on this device
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}