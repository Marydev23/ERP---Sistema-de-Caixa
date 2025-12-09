import React from "react";
import { Sidebar } from "../components/sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com o botão */}
      <Sidebar />

      {/* Conteúdo da página logo abaixo */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
