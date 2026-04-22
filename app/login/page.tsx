"use client";

import { login, signup } from "./actions";
import { CircleCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  /* Create a sign-in sign-up toggle */
  const [password, setPassword] = useState("");
  const [hasMeetPwCriteria, setHasMeetPwCriteria] = useState(false);
  const [pwMatch, setPwMatch] = useState(false);

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    /* Ensure password longer or equal 8 characters, at least one capital letter and at least one digit */
    if (
      e.target.value.length >= 8 &&
      /[A-Z]/.test(e.target.value) &&
      /[0-9]/.test(e.target.value)
    ) {
      setHasMeetPwCriteria(true);
    } else {
      setHasMeetPwCriteria(false);
    }
  };

  const handleConfirmPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasMeetPwCriteria && e.target.value === password) {
      setPwMatch(true);
    } else {
      setPwMatch(false);
    }
  };

  const usePasswordVisibility = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    // Return the type and the toggle function
    const inputType = isVisible ? "text" : "password";
    const Icon = isVisible ? EyeOff : Eye;

    return { inputType, Icon, toggleVisibility };
  };

  const pwfieldVisibility = usePasswordVisibility();
  const confirmPwfieldVisibility = usePasswordVisibility();

  const [isSetToLogin, setIsSetToLogin] = useState(true);

  const handleLoginToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsSetToLogin((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg font-montserrat">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--secondary-color)]">
            Advance LMS
          </h2>
          {isSetToLogin ? (
            <p className="mt-2 text-sm text-gray-600">
              Sign in to start your session / Or{" "}
              <a href="#" onClick={handleLoginToggle}>
                <span className="text-[var(--secondary-color)] font-semibold">
                  sign up
                </span>
              </a>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Sign up to begin your time with Advance / Or{" "}
              <a href="#" onClick={handleLoginToggle}>
                <span className="text-[var(--secondary-color)] font-semibold">
                  sign in
                </span>
              </a>
            </p>
          )}
        </div>
        {isSetToLogin ? (
          <form className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              <div className="relative">
                <input
                  name="password"
                  type={pwfieldVisibility.inputType}
                  required
                  placeholder="Password"
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
                <button
                  type="button"
                  onClick={pwfieldVisibility.toggleVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-1/5 text-gray-500 z-10"
                >
                  <pwfieldVisibility.Icon size={20} />
                </button>
              </div>
            </div>
            <button
              formAction={login}
              className="group relative flex w-full justify-center rounded-md bg-[var(--secondary-color)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              <input
                type="tel"
                name="phone"
                pattern="0[0-9]{9}"
                placeholder="Phone"
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              <div className="relative">
                <input
                  name="password"
                  type={pwfieldVisibility.inputType}
                  required
                  placeholder="Password"
                  onChange={handlePwChange}
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
                <button
                  type="button"
                  onClick={pwfieldVisibility.toggleVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-1/5 text-gray-500 z-10"
                >
                  <pwfieldVisibility.Icon size={20} />
                </button>
                {hasMeetPwCriteria && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-2/1 text-green-500 font-bold">
                    <CircleCheck size={20} />
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  name="confirm-password"
                  type={confirmPwfieldVisibility.inputType}
                  required
                  placeholder="Confirm password"
                  onChange={handleConfirmPwChange}
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
                <button
                  type="button"
                  onClick={confirmPwfieldVisibility.toggleVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-1/5 text-gray-500 z-10"
                >
                  <confirmPwfieldVisibility.Icon size={20} />
                </button>
                {pwMatch && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-2/1 text-green-500 font-bold">
                    <CircleCheck size={20} />
                  </div>
                )}
              </div>
            </div>

            <button
              formAction={signup}
              className="group relative flex w-full justify-center rounded-md bg-[var(--secondary-color)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
