"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const screens = [
  {
    title: (
      <>
        Verified Properties <span className="text-[#D4A017]">Only</span>
      </>
    ),
    text: "Get genuine and verified listings. No ghost houses.",
    image: "/images/onboarding/screen1.jpg",
    extra: null,
  },
  {
    title: (
      <>
        Your Money <span className="text-[#D4A017]">Stays Protected</span>
      </>
    ),
    text: "Funds are locked in escrow until you inspect and confirm.",
    image: "/images/onboarding/screen2.jpg",
    extra: null,
  },
  {
    title: (
      <>
        Secure Account <span className="text-[#D4A017]">Creation</span>
      </>
    ),
    text: "BVN and NIN used only to create your personal transaction account.",
    image: "/images/onboarding/screen3.jpg",
    extra: null,
  },
  {
    title: (
      <>
        Create a Strong <span className="text-[#D4A017]">Password</span>
      </>
    ),
    text: "Use at least 8 characters, a mix of letters, numbers and symbols.",
    image: "/images/onboarding/screen4.jpg",
    extra: "password",
  },
  {
    title: (
      <>
        You’re <span className="text-[#D4A017]">In Control</span>
      </>
    ),
    text: "Find, inspect, and secure properties on your terms.",
    image: "/images/onboarding/screen5.jpg",
    extra: null,
  },
];

const passwordCriteria = [
  "At least 8 characters",
  "One uppercase letter",
  "One number",
  "One special character",
];

export default function OnboardingIntro() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const goTo = (nextIndex: number) => {
    if (isAnimating || nextIndex === current) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(nextIndex);
      setIsAnimating(false);
    }, 200);
  };

  const next = () => {
    if (current < screens.length - 1) {
      goTo(current + 1);
    } else {
      router.push("/onboarding/privacy");
    }
  };

  const prev = () => {
    if (current > 0) {
      goTo(current - 1);
    }
  };

  const skip = () => {
    router.push("/onboarding/privacy");
  };

  const screen = screens[current];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row relative overflow-hidden">
      {/* Logo - Top Left */}
      <div className="absolute top-0 left-0 z-20 p-5 pt-safe">
        <Image
          src="/images/logo.png"
          alt="Dwellify Realty"
          width={160}
          height={56}
          className="h-14 w-auto"
          priority
        />
      </div>

      {/* Skip all - Top Right */}
      <div className="absolute top-0 right-0 z-20 p-5 pt-safe">
        <button
          onClick={skip}
          className="text-sm font-medium text-[#0F172A] bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 flex items-center gap-1 shadow-sm"
        >
          Skip all
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Image Section */}
      <div className="w-full h-[74vh] lg:h-screen lg:w-[55%] relative">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={screen.image}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-[#F8FAFC] via-[#F8FAFC]/30 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-[#F8FAFC]" />
      </div>

      {/* Content Section - Mobile */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8 pt-10 lg:hidden">
        <div
          className={`transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-full text-left">
            <h1 className="text-[2.6rem] leading-[1.05] font-bold text-[#0F172A] tracking-tight">
              {screen.title}
            </h1>
            <p className="mt-1.5 text-[17px] text-gray-600 leading-snug">
              {screen.text}
            </p>

            {screen.extra === "password" && (
              <div className="mt-4 space-y-2">
                {passwordCriteria.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[15px] text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-start gap-2 mt-5 mb-6">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? "w-6 bg-[#0F172A]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">
          {current > 0 && (
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center shrink-0 active:scale-95 transition-all"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 bg-[#D4A017] text-[#0F172A] py-4 rounded-full font-semibold text-[17px] shadow-sm active:scale-[0.98] transition-all"
          >
            {current === screens.length - 1 ? "Continue" : "Next"}
          </button>
        </div>
      </div>

      {/* Content Section - Desktop / Tablet */}
      <div className="hidden lg:flex lg:w-[45%] items-center justify-center px-12 relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-[#F8FAFC] to-transparent" />

        <div
          className={`w-full max-w-lg relative z-10 transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="text-[2.6rem] leading-[1.05] font-bold text-[#0F172A] tracking-tight">
            {screen.title}
          </h1>
          <p className="mt-1.5 text-[17px] text-gray-600 leading-snug">
            {screen.text}
          </p>

          {screen.extra === "password" && (
            <div className="mt-4 space-y-2">
              {passwordCriteria.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[15px] text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-start gap-2 mt-5 mb-6">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? "w-6 bg-[#0F172A]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 w-full">
            {current > 0 && (
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 bg-[#D4A017] text-[#0F172A] py-4 rounded-full font-semibold text-[17px] shadow-sm active:scale-[0.98] transition-all"
            >
              {current === screens.length - 1 ? "Continue" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}