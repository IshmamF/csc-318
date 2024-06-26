'use client';

import { Calculator } from "./components/Calculator";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <Header />
          <Calculator />
        </div>
      </div>
    </div>
  );
}
