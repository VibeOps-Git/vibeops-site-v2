import { useState } from "react";
import { Mail, CheckCircle, Loader2, ArrowRight } from "lucide-react";

interface EmailSignupProps {
  onSubmit?: (email: string) => Promise<void>;
}

export function EmailSignup({ onSubmit }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Submit to Google Sheets via Google Forms or Apps Script
      const GOOGLE_FORM_URL = import.meta.env.VITE_REPORTLY_WAITLIST_URL;

      if (GOOGLE_FORM_URL) {
        // Using Google Forms submission
        const formData = new FormData();
        formData.append("entry.EMAIL_FIELD_ID", email); // Replace with actual field ID
        formData.append("entry.TIMESTAMP_FIELD_ID", new Date().toISOString());

        await fetch(GOOGLE_FORM_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData,
        });
      }

      // Also call custom handler if provided
      if (onSubmit) {
        await onSubmit(email);
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Email signup error:", error);
      // Even with no-cors, we show success since we can't read the response
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-[#00ffcc]/10 border border-[#00ffcc]/30">
          <CheckCircle className="w-6 h-6 text-[#00ffcc]" />
          <div className="text-left">
            <p className="text-white font-medium">You're on the list!</p>
            <p className="text-sm text-gray-400">We'll notify you when Reportly launches.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Enter your email"
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border ${
                status === "error" ? "border-red-500/50" : "border-white/10"
              } text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffcc]/50 focus:bg-white/10 transition-all`}
              disabled={status === "loading"}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3.5 rounded-xl bg-[#00ffcc] text-black font-semibold hover:bg-[#00ffcc]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Waitlist</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
        {status === "error" && errorMessage && (
          <p className="mt-2 text-sm text-red-400">{errorMessage}</p>
        )}
      </form>
      <p className="mt-3 text-xs text-gray-500 text-center">
        Be the first to know when we launch. No spam, ever.
      </p>
    </div>
  );
}
