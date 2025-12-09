import React from "react";

export default function Empresa() {
  return (
    <main className="flex-1 bg-white border rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Configurações do Sistema
      </h1>

      <h2 className="text-2xl font-semibold mb-6">Dados da Empresa</h2>

      <div className="space-y-5">
        <Input label="Nome da Empresa" placeholder="Nome da Empresa" />
        <Input label="CNPJ" placeholder="00.000.000/0000-00" />
        <Input label="Endereço" placeholder="Digite o endereço" />
        <Input label="Telefone" placeholder="(00) 00000-0000" />
        <Input label="E-mail" placeholder="email@seuemail.com" />

        <div className="space-y-2">
          <label className="font-medium">Logo</label>
          <input type="file" className="block" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-20 h-7 px-2 py-1 text-xs hover:bg-blue-700 transition"
        >
          Salvar
        </button>

        <button
          type="button"
          className="bg-gray-600 text-white w-20 h-7 px-2 py-1 text-xs hover:bg-gray-700 transition"
        >
          Editar
        </button>
      </div>
    </main>
  );
}

function Input({ label, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
