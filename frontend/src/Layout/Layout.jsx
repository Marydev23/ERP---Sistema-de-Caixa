import React from "react";
import { Sidebar } from "../components/sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>{" "}
    </div>
  );
}
