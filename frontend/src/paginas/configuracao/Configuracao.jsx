import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Settings, Building2, User, FileText } from "lucide-react";
import Empresa from "./Empresa";
import Usuario from "./Usuario";
import Relatorio from "./Relatorio";

function Configuracao() {
  const [menu, setMenu] = useState("empresa");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50 p-6 gap-6">
      <aside className="w-64 bg-white border rounded-lg p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4">Configurações</h2>

        <div
          className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
            menu === "geral" ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={() => setMenu("geral")}
        >
          <Settings />
          <span>Geral</span>
        </div>

        <div
          className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
            menu === "empresa" ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={() => setMenu("empresa")}
        >
          <Building2 />
          <span>Empresa</span>
        </div>

        <div
          className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
            menu === "usuario" ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={() => setMenu("usuario")}
        >
          <User />
          <span>Usuário</span>
        </div>

        <div
          className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
            menu === "relatorio" ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={() => setMenu("relatorio")}
        >
          <FileText />
          <span>Relatório</span>
        </div>
        <button
          onClick={() => navigate("/Dashboard")}
          className="mt-auto w-full bg-red-500 text-white p-1 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      {menu === "empresa" && <Empresa />}

      {menu === "geral" && (
        <div className="flex-1 bg-white border rounded-lg p-8">
          <h1 className="text-2xl font-bold">Tela Geral</h1>
          <p className="text-gray-500">Aqui vai mostrar os dados depois</p>
        </div>
      )}

      {menu === "usuario" && <Usuario />}
      {menu === "relatorio" && <Relatorio />}
    </div>
  );
}

export default Configuracao;
