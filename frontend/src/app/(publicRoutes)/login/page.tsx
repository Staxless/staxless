"use client";
// /pages/login.js
import { FormEvent, useState } from "react";
import { redirect } from "next/navigation";

interface ApiError extends Error {
  response?: Response;
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!response.ok) {
        const error = new Error("Login failed") as ApiError;
        error.response = response;
        throw error;
      }

      const data = await response.json();
      console.log("Login successful:", data);
      // Redirect to a different page or handle success state
      redirect("/dashboard");
    } catch (err) {
      const error = err as ApiError;
      if (error.response) {
        // Handle specific error responses from the server
        setError(
          `Error: ${error.response.status} ${error.response.statusText}`,
        );
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="container mx-auto py-20">
      <h2 className="text-3xl text-center font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
