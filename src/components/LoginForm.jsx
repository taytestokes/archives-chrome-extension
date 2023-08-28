import React, { useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "./Layout";
import { LoadingSpinner } from "./LoadingSpinner";

export const LoginForm = () => {
  const { setTokenToStorage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async (evt) => {
    evt.preventDefault();

    setLoading(true);

    try {
      const { installType } = await chrome.management.getSelf();

      const url =
        installType === "development"
          ? "http://localhost:8080"
          : "https://archives.taytestokes.io";

      const response = await fetch(`${url}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error, please try again.");
      }

      setTokenToStorage(data.accessToken);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      {error && (
        <div className="flex items-center mt-4">
          <ExclamationCircleIcon className="h-4 w-4 text-red-400" />
          <p className="text-red-400 ml-2">{error}</p>
        </div>
      )}

      <form onSubmit={submitForm}>
        <label htmlFor="email" className="flex font-medium mt-4">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="w-full bg-zinc-800 mt-1 p-2 rounded-md border border-zinc-700 focus:outline-none"
          onChange={(evt) => setEmail(evt.target.value)}
          value={email}
        />

        <label htmlFor="password" className="flex font-medium mt-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          className="w-full bg-zinc-800 mt-1 p-2 rounded-md border border-zinc-700 focus:outline-none"
          onChange={(evt) => setPassword(evt.target.value)}
          value={password}
        />

        <button className="w-full mt-4 rounded-md bg-transparent px-8 py-2 font-medium transition hover:bg-zinc-800 border border-zinc-700">
          {loading ? (
            <LoadingSpinner className="w-[18px] h-[18px] mx-auto" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </Layout>
  );
};
