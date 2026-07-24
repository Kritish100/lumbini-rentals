"use client";

import { verifySecretKey } from "@/app/admin/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const isValid = await verifySecretKey(inputKey);
      if (isValid) {
        router.push("/admin");
      } else setError("Invalid secret key. Please try again.");
    } catch (err) {
      setError("Connection Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center pb-[16vh] justify-center bg-gray-50 font-sans text-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[380px] flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <div className="text-3xl">🔒</div>
          <h2 className="m-0 text-2xl font-bold tracking-tight text-gray-900">
            Admin Verification
          </h2>
          <p className="m-0 text-sm leading-relaxed text-gray-500">
            Enter your secret API key to access the dashboard. Page reloads will
            instantly lock the panel again.
          </p>
        </div>

        {/* Input Wrapper */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Secret Key
          </label>
          <input
            type="password"
            placeholder="••••••••••••••••"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            disabled={isLoading}
            required
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition-all duration-150 
                    ${
                      error
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    } 
                    disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {error && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
              <span>⚠️</span> {error}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-xl py-3 text-base font-medium transition-all duration-150 
                    ${
                      isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] shadow-sm shadow-blue-500/10"
                    }`}
        >
          {isLoading ? "Verifying..." : "Access Dashboard"}
        </button>
      </form>
    </div>
  );
}
