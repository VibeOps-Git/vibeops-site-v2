import { useState } from "react";
import { Mail, CheckCircle, Loader2, ArrowRight, User } from "lucide-react";

interface EmailSignupProps {
  onSubmit?: (data: { name: string; email: string }) => Promise<void>;
}

export function EmailSignup({ onSubmit }: EmailSignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Please enter your name");
      setStatus("error");
      return;
    }

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Submit to Google Forms
      // Form URL format: https://docs.google.com/forms/d/e/FORM_ID/formResponse
      const GOOGLE_FORM_URL = import.meta.env.VITE_REPORTLY_WAITLIST_URL;

      // Entry IDs from Google Form (found via pre-filled link or page source)
      const NAME_ENTRY_ID = import.meta.env.VITE_REPORTLY_NAME_ENTRY_ID;
      const EMAIL_ENTRY_ID = import.meta.env.VITE_REPORTLY_EMAIL_ENTRY_ID;

      if (GOOGLE_FORM_URL) {
        // Use URLSearchParams for better Google Forms compatibility
        const params = new URLSearchParams();
        params.append(NAME_ENTRY_ID, name);
        params.append(EMAIL_ENTRY_ID, email);

        await fetch(GOOGLE_FORM_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });
      }

      // Also call custom handler if provided
      if (onSubmit) {
        await onSubmit({ name, email });
      }

      setStatus("success");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Email signup error:", error);
      // Even with no-cors, we show success since we can't read the response
      setStatus("success");
      setName("");
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
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Your name"
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border ${
                  status === "error" && !name.trim() ? "border-red-500/50" : "border-white/10"
                } text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffcc]/50 focus:bg-white/10 transition-all`}
                disabled={status === "loading"}
              />
            </div>
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Your email"
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border ${
                  status === "error" && name.trim() ? "border-red-500/50" : "border-white/10"
                } text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffcc]/50 focus:bg-white/10 transition-all`}
                disabled={status === "loading"}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-6 py-3.5 rounded-xl bg-[#00ffcc] text-black font-semibold hover:bg-[#00ffcc]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
