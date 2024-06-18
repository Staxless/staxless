"use client";
// /pages/login.js
import { FormEvent, useState } from "react";

interface ApiError extends Error {
  response?: Response;
}

export default function Dashboard() {
  return <h1> Hello Auth User </h1>;
}
