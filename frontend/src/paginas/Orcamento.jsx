import React, { useState } from "react";
import { CardContent, CardTitle } from "@/components/ui/card";
import { CirclePlus, Receipt } from "lucide-react";

export default function Orcamento() {
  const [cliente, setCliente] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [contato, setContato] = useState("");
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <CardContent>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-semibold text-gray-800 tracking-tight">
              Gestão de Orçamentos
            </CardTitle>

            <button className="w-40 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-md transition">
              + Novo Orçamento
            </button>
          </div>
        </CardContent>

        {/* FORM CLIENTE */}
        <CardContent className="flex">
          <form className="w-full bg-zinc-100">
            <div className="flex items-center gap-2">
              <Receipt className="w-8 h-8 text-green-600" />
              <CardTitle className="text-xl font-semibold text-gray-800">
                Dados do Cliente
              </CardTitle>
            </div>

            <div className="w-full p-2 space-y-1">
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  Cliente:
                </label>
                <input
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  CNPJ:
                </label>
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Digite o CNPJ"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  Endereço:
                </label>
                <input
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Digite o endereço"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  Contato:
                </label>
                <input
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Digite o contato"
                />
              </div>
            </div>

            <div className="flex justify-start pt-6">
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
              >
                <CirclePlus className="w-5 h-5" />
                Cadastrar Produto
              </button>
            </div>
          </form>
        </CardContent>

        {/* CADASTRAR PRODUTO */}
        {openModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            {/* FORM PRODUTO */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Produto adicionado");
              }}
              className="relative bg-white w-[450px] rounded-lg p-6 shadow-xl"
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-6">
                <CirclePlus className="w-6 h-6 text-green-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Adicionar Produto
                </CardTitle>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Produto
                </label>

                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Selecione</option>
                  {/** puxar produtos do banco */}
                </select>
              </div>

              <div className="grid grid-cols-10 gap-5 py-3">
                <div className="col-span-5 md:col-span-5 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Quantidade
                  </label>

                  <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>

                <div className="col-span-5 md:col-span-5 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Preço Unitário
                  </label>

                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  <CirclePlus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
