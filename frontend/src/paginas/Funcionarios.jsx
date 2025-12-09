import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Funcionarios() {
  const [descricao, setDescricao] = useState("");
  const [cargo, setCargo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [Contato, setContato] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("ATIVO");

  const [listaFuncionario, setListaFuncionario] = useState([]);

  function salvarFuncionario(e) {
    e.preventDefault();

    if (!descricao || !Contato || !data) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const novoFuncionario = {
      id: Date.now(),
      descricao,
      cargo,
      endereco,
      Contato,
      data,
      valor,
      status, // ✅ agora usa o status do formulário
    };

    setListaFuncionario([...listaFuncionario, novoFuncionario]);

    setDescricao("");
    setCargo("");
    setEndereco("");
    setContato("");
    setValor("");
    setData("");
    setStatus("ATIVO"); // ✅ volta para ATIVO ao limpar
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="w-full h-screen">
        <CardContent className="w-full h-full flex flex-col justify-start space-y-8">
          <form
            onSubmit={salvarFuncionario}
            className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg space-y-6"
          >
            <h2 className="text-[25px] font-bold text-gray-800 border-b pb-4">
              Cadastro de Funcionários
            </h2>

            {/* Nome Completo */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold text-gray-700">
                Nome Completo:
              </label>

              <input
                className="col-span-9 border border-gray-300 rounded-xl px-4 py-3 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 placeholder-gray-400"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite o nome do funcionário"
              />
            </div>

            {/* Cargo */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold text-gray-700">
                Cargo:
              </label>

              <input
                className="col-span-9 border border-gray-300 rounded-xl px-4 py-3 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 placeholder-gray-400"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Digite o cargo"
              />
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold text-gray-700">
                Endereço:
              </label>

              <input
                className="col-span-9 border border-gray-300 rounded-xl px-4 py-3 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 placeholder-gray-400"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Digite o endereço"
              />
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold text-gray-700">
                Contato:
              </label>

              <input
                className="col-span-9 border border-gray-300 rounded-xl px-4 py-3 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 placeholder-gray-400"
                value={Contato}
                onChange={(e) => setContato(e.target.value)}
                placeholder="Digite o contato"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Data Admissão</label>
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Valor do Salário</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="w-full border rounded-md p-2 text-base"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
            </div>

            {/* ✅ STATUS (ADICIONADO) */}
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold text-gray-700">
                Status:
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="col-span-9 border border-gray-300 rounded-xl px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setDescricao("");
                  setCargo("");
                  setEndereco("");
                  setContato("");
                  setValor("");
                  setData("");
                  setStatus("ATIVO");
                }}
                className="w-20 h-7 px-2 py-0 text-xs bg-blue-600 text-white font-semibold
                hover:bg-blue-700 transition shadow-md"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className=" w-20 h-7 px-2 py-0 text-xs bg-blue-600 text-white font-semibold
                 hover:bg-blue-700 transition shadow-md"
              >
                Salvar
              </button>
            </div>
          </form>

          <Card>
            <CardHeader>
              <CardTitle className="text-[25px] font-bold text-gray-800 border-b pb-4">
                Lista de Funcionários
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Nome</th>
                    <th className="border p-2">Cargo</th>
                    <th className="border p-2">Endereço</th>
                    <th className="border p-2">Contato</th>
                    <th className="border p-2">Data de Admissão</th>
                    <th className="border p-2">Valor Salário</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {listaFuncionario.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        Nenhum funcionário cadastrado
                      </td>
                    </tr>
                  )}

                  {listaFuncionario.map((f) => (
                    <tr key={f.id}>
                      <td className="border p-2">{f.descricao}</td>
                      <td className="border p-2">{f.cargo}</td>
                      <td className="border p-2">{f.endereco}</td>
                      <td className="border p-2">{f.Contato}</td>
                      <td className="border p-2">{f.data}</td>
                      <td className="border p-2">{f.valor}</td>
                      <td className="border p-2">{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 w-20 h-7 px-2 py-0 text-xs"
                  >
                    Excluir
                  </Button>

                  <Button
                    type="button"
                    className="bg-gray-400 hover:bg-gray-500 text-white w-20 h-7 px-2 py-0 text-xs"
                  >
                    Editar
                  </Button>

                  <Button
                    type="submit"
                    className="bg-gray-600 hover:bg-gray-700 text-white w-20 h-7 px-2 py-0 text-xs"
                  >
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default Funcionarios;
