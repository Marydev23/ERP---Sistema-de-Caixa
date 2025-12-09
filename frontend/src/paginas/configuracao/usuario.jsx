import React from "react";

export default function Usuario() {
  return (
    <main className="flex-1 bg-white border rounded-lg p-8">
      <h1 className="text-2xl font-semibold mb-6">Sua Conta</h1>

      <div className="space-y-5">
        <Input label="Digite seu nome" placeholder="Nome" />
        <Input label="Digite seu E-mail" placeholder="seuemail@gmail.com" />
        <Input label="Digite sua senha" placeholder="Sua senha" />
      </div>
    </main>
  );
}
function Input({ label, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="block font-medium">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border rounded-lg p-2"
      />
    </div>
  );
}
