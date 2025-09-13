"use client";

import { Calculator } from "@/components/Calculator";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Scientific Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Powered by Golang backend with advanced mathematical functions
          </p>
        </div>
        <Calculator />
      </div>
    </main>
  );
}