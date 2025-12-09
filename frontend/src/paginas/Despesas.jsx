import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Trash, Pencil } from "lucide-react";

export default function Despesas() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [categoria, setCategoria] = useState("");

  const [listaDespesas, setListaDespesas] = useState([]);

  function salvarDespesa(e) {
    e.preventDefault();

    if (!descricao || !valor || !data) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const novaDespesa = {
      id: Date.now(),
      descricao,
      valor,
      data,
      formaPagamento,
      categoria,
    };

    setListaDespesas([...listaDespesas, novaDespesa]);

    setDescricao("");
    setValor("");
    setData("");
    setFormaPagamento("");
    setCategoria("");
  }

  return (
    <div className="p-6 space-y-6 ">
      <CardContent>
        <CardTitle className="w-full max-w-7x1 max-auto text-2x1 font-bold items-center">
          Sáida de Caixa
        </CardTitle>
      </CardContent>

      <Card className="w-full max-w-7xl mx-auto">
        <CardContent className="py-8">
          <form
            onSubmit={salvarDespesa}
            className="w-full grid-cols-1 md:grid-cols-4 gap-9"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Descrição</label>
              <input
                className="w-full border rounded-md p-2"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="md:col-span-1 flex flex-col gap-2">
              <label className="text-sm font-medium">Valor</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                className="w-full border rounded-md p-2 text-base"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>

            <div className="md:col-span-1 flex flex-col gap-2">
              <label className="text-sm font-medium">Data</label>
              <input
                type="date"
                className="w-full border rounded-md p-2"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium">Forma de Pagamento</label>
              <select
                className="w-full border rounded-md p-2"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="">Selecione</option>
                <option>Dinheiro</option>
                <option>PIX</option>
                <option>Cartão</option>
                <option>Boleto</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-medium">Categoria</label>
              <select
                className="w-full border rounded-md p-2"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecione</option>
                <option>Funcionário</option>
                <option>Retirada de Sócios</option>
                <option>Contabilidade</option>
                <option>Material</option>
                <option>Gasolina/Passagem</option>
                <option>Àgua/Luz/Aluguel</option>
                <option>Outros</option>
              </select>
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Despesas</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Descrição</th>
                <th className="border p-2">Valor</th>
                <th className="border p-2">Categoria</th>
                <th className="border p-2">Data de Pagamento</th>
                <th className="border p-2">Forma de Pagamento</th>
              </tr>
            </thead>

            <tbody>
              {listaDespesas.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Nenhuma Despesa cadastrada
                  </td>
                </tr>
              )}

              {listaDespesas.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.descricao}</td>
                  <td className="border p-2 text-green-700">R$ {r.valor}</td>
                  <td className="border p-2">{r.data}</td>
                  <td className="border p-2">{r.formaPagamento}</td>
                  <td className="border p-2">{r.categoria}</td>
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
    </div>
  );
}
