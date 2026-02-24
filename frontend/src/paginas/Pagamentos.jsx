import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash, Pencil } from "lucide-react";

export default function Pagamentos() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [categoria, setCategoria] = useState("");

  const [listaPagamentos, setListaPagamentos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const formatBRL = (v) => {
    const num = Number(v);
    if (Number.isNaN(num)) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  function salvarDespesa(e) {
    e.preventDefault();

    if (!descricao || !valor || !data) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      // atualizar
      setListaPagamentos((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? { ...d, descricao, valor, data, formaPagamento, categoria }
            : d,
        ),
      );
      setEditingId(null);
    } else {
      const novaDespesa = {
        id: Date.now(),
        descricao,
        valor,
        data,
        formaPagamento,
        categoria,
      };
      setListaPagamentos((prev) => [...prev, novaDespesa]);
    }

    // limpar campos
    setDescricao("");
    setValor("");
    setData("");
    setFormaPagamento("");
    setCategoria("");
  }

  function editarDespesa(id) {
    const d = listaPagamentos.find((it) => it.id === id);
    if (!d) return;
    setDescricao(d.descricao);
    setValor(d.valor);
    setData(d.data);
    setFormaPagamento(d.formaPagamento);
    setCategoria(d.categoria);
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function excluirDespesa(id) {
    if (!confirm("Deseja excluir esta despesa?")) return;
    setListaPagamentos((prev) => prev.filter((d) => d.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDescricao("");
      setValor("");
      setData("");
      setFormaPagamento("");
      setCategoria("");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <CardContent>
        <h1 className="text-2xl font-bold ">Pagamentos</h1>
        <h2 className="flex text-1xl  flex-col ">
          Lançamentos de pagamento futuros
        </h2>
      </CardContent>

      <Card className="w-full max-w-7xl mx-auto">
        <CardContent className="py-8">
          <form onSubmit={salvarDespesa} className="w-full space-y-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="descricao" className="text-sm font-medium">
                Descrição
              </label>
              <input
                id="descricao"
                name="descricao"
                className="w-full border rounded-md p-2"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label htmlFor="valor" className="text-sm font-medium">
                  Valor
                </label>
                <input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border rounded-md p-2"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="data" className="text-sm font-medium">
                  Data
                </label>
                <input
                  id="data"
                  name="data"
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="formaPagamento" className="text-sm font-medium">
                  Forma de Pagamento
                </label>
                <select
                  id="formaPagamento"
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

              <div>
                <label htmlFor="categoria" className="text-sm font-medium">
                  Categoria
                </label>
                <select
                  id="categoria"
                  className="w-full border rounded-md p-2"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option>Sálario</option>
                  <option>Boleto</option>
                  <option>Imposto</option>
                  <option>Fornecedor</option>

                  <option>Outros</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button
                type="submit"
                className="w-full md:w-40 bg-green-600 hover:bg-green-700"
              >
                {editingId ? "Salvar Alterações" : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Descrição</th>
                <th className="border p-2">Valor</th>
                <th className="border p-2">Categoria</th>
                <th className="border p-2">Data de Vencimento</th>
                <th className="border p-2">Forma de Pagamento</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {listaPagamentos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Nenhum pagamento cadastrado
                  </td>
                </tr>
              )}

              {listaPagamentos.map((d) => (
                <tr key={d.id}>
                  <td className="border p-2">{d.descricao}</td>
                  <td className="border p-2 text-red-600">
                    {formatBRL(d.valor)}
                  </td>
                  <td className="border p-2">{d.categoria}</td>
                  <td className="border p-2">{d.data}</td>
                  <td className="border p-2">{d.formaPagamento}</td>
                  <td className="border p-2">
                    <div className="flex gap-2 items-center">
                      <Button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 text-xs flex items-center gap-1"
                        onClick={() => editarDespesa(d.id)}
                      >
                        <Pencil size={14} /> Editar
                      </Button>
                      <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs flex items-center gap-1"
                        onClick={() => excluirDespesa(d.id)}
                      >
                        <Trash size={14} /> Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
