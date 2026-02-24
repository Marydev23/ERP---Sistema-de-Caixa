import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import {
  Pencil,
  Trash,
  Wallet,
  CalendarClock,
  CircleCheck,
  Search,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function Despesas() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cliente, setCliente] = useState("");

  const [listaDespesas, setListaDespesas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [openModal, setOpenModal] = useState(false);

  async function carregarDespesas() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/despesas`);
      const data = await res.json();
      setListaDespesas(data);
    } catch (err) {
      alert("Erro ao carregar despesas: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDespesas();
  }, []);

  const formatBRL = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(v || 0));

  function limparFormulario() {
    setDescricao("");
    setValor("");
    setData("");
    setCliente("");
    setCategoria("");
    setEditingId(null);
  }

  async function salvarDespesa(e) {
    e.preventDefault();

    if (!descricao || !valor || !data || !categoria) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const payload = {
      Valor: Number(valor),
      Data: data,
      DataVencimento: data,
      Nome: cliente,
      Descricao: descricao,
      Status: "Pendente",
      CategoriaID: categoria || null,
    };

    try {
      const res = await fetch(
        editingId ? `${API_URL}/despesas/${editingId}` : `${API_URL}/despesas`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao salvar despesa");

      limparFormulario();
      carregarDespesas();
      setOpenModal(false);
    } catch (err) {
      alert(err.message);
    }
  }

  function editarDespesa(d) {
    setDescricao(d.Descricao || "");
    setValor(d.Valor || "");
    setData(d.Data || "");
    setCliente(d.Nome || "");
    setCategoria(d.CategoriaID || "");
    setEditingId(d.ID);
    setOpenModal(true);
  }

  async function excluirDespesa(id) {
    if (!confirm("Deseja excluir esta despesa?")) return;

    try {
      await fetch(`${API_URL}/despesas/${id}`, { method: "DELETE" });
      carregarDespesas();
    } catch (err) {
      alert(err.message);
    }
  }

  // 🔥 FILTRO DE BUSCA
  const despesasFiltradas = useMemo(() => {
    return listaDespesas.filter((d) =>
      d.Descricao?.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [listaDespesas, busca]);

  // 🔥 CÁLCULOS DOS CARDS
  const total = listaDespesas.reduce((acc, d) => acc + Number(d.Valor), 0);

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto p-3 space-y-6 ">
        <CardContent>
          <div className="flex items-center justify-between ">
            <div className="space-y-1 ">
              <div className="flex items-center gap-3 ">
                <Wallet className="w-8 h-8 text-green-600" />
                <CardTitle className="text-3xl font-semibold text-gray-800 tracking-tight">
                  Gestão de Pagamentos
                </CardTitle>
              </div>

              <p className="text-gray-600 text-sm font-light">
                Controle e acompanhe todos os seus pagamentos
              </p>
            </div>

            <div className="flex">
              <select
                className="w-40 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium py-2 rounded-l-lg hover:bg-gray-200 transition flex items-center justify-center "
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              >
                <option value=""> Período: Últimos 30 dias</option>
                <option value="Atacado"> Período: Últimos 60 dias</option>
                <option value="Varejo"> Período: Últimos 90 dias</option>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </select>

              {/* NOVA VENDA */}
              <button
                onClick={() => {
                  limparFormulario();
                  setOpenModal(true);
                }}
                className="w-40 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 rounded-r-lg border-l-0 transition"
              >
                + Nova Despesa
              </button>
            </div>
          </div>
        </CardContent>

        {/* CARDS */}
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-red-50 p-4 rounded-xl shadow flex items-center gap-3">
              <Wallet className="w-6 h-6 text-red-700" />
              <div>
                <p className="text-sm">Total Despesas</p>
                <p className="text-xl font-bold text-red-600">
                  {formatBRL(total)}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl shadow flex items-center gap-3">
              <CalendarClock className="w-6 h-6 text-yellow-700" />
              <div>
                <p className="text-sm">A Vencer</p>
                <p className="text-xl font-bold text-yellow-600">
                  {formatBRL(0)}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl shadow flex items-center gap-3">
              <CircleCheck className="w-6 h-6 text-green-700" />
              <div>
                <p className="text-sm">Pagas</p>
                <p className="text-xl font-bold text-green-600">
                  {formatBRL(0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        {/* FORM */}
        {openModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[650px] rounded-2xl p-6 shadow-xl relative">
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>

              <CardTitle className="text-xl font-bold mb-4">
                {editingId ? "Editar Pagamento" : "Registrar Novo Pagamento"}
              </CardTitle>

              <form onSubmit={salvarDespesa} className="w-full space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-sm font-medium text-slate-700">
                      Descrição
                    </label>
                    <input
                      className="w-full h-8 border border-slate-300 rounded-lg px-3 mt-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                    />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <label className="text-sm font-medium text-slate-700">
                      Valor à pagar
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full h-8 border border-slate-300 rounded-lg px-3 mt-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                    />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <label className="text-sm font-medium text-slate-700">
                      Categoria
                    </label>
                    <select
                      className="w-full h-8 border border-slate-300 rounded-lg px-3 mt-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="Contabilidade">Contabilidade</option>
                      <option value="Matéria-Prima">Matéria-Prima</option>
                      <option value="Funcionário">Funcionário</option>
                      <option value="Imposto">Imposto</option>
                      <option value="Retirada de Sócio">
                        Retirada de Sócio
                      </option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Energia/Água/Aluguel">
                        Energia/Água/Aluguel
                      </option>
                      <option value="Frete">Frete</option>
                      <option value="Equipamento">Equipamento</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-sm font-medium text-slate-700">
                      Nome
                    </label>
                    <input
                      className="w-full h-8 border border-slate-300 rounded-lg px-3 mt-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                    />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <label className="text-sm font-medium text-slate-700">
                      Data de Vencimento
                    </label>
                    <input
                      type="date"
                      className="w-full h-8 border border-slate-300 rounded-lg px-3 mt-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90 text-white font-semibold h-8 px-5 rounded-lg transition"
                  >
                    {editingId ? "Salvar Alterações" : "Salvar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="bg-gray-500 hover:opacity-90 text-white font-semibold h-8 px-5 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-slate-800">
              Lista de Pagamentos
            </h2>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Pesquisar"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-8 w-full pl-8 pr-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
            </div>
          </div>

          <div className="h-[400px] overflow-y-auto border border-gray-200 rounded">
            <table className="w-full text-sm border-collapse border">
              <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Data de Vencimento</th>
                  <th className="p-2 text-left">Nome</th>
                  <th className="p-2 text-left">Descrição</th>
                  <th className="p-2 text-left">Valor</th>
                  <th className="p-2 text-left">Categoria</th>

                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Ações</th>
                </tr>
              </thead>

              <tbody>
                {despesasFiltradas.map((d) => (
                  <tr key={d.ID} className="hover:bg-slate-50">
                    <td className="p-2">{d.Data}</td>
                    <td className="p-2">{d.DataVencimento}</td>
                    <td className="p-2">{d.Nome}</td>
                    <td className="p-2">{d.Descricao}</td>
                    <td className="p-2">{formatBRL(d.Valor)}</td>
                    <td className="p-2">{d.CategoriaID || "Sem Categoria"}</td>
                    <td className="p-2">
                      <div
                        className={`flex items-center gap-1 font-semibold ${
                          d.Status === "Pago"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {d.Status === "Em aberto" && <LinkIcon size={14} />}
                        {d.Status}
                      </div>
                    </td>
                    <td className="p-2 flex gap-2">
                      <Pencil
                        size={16}
                        className="cursor-pointer"
                        onClick={() => editarDespesa(d)}
                      />
                      <Trash
                        size={16}
                        className="cursor-pointer"
                        onClick={() => excluirDespesa(d.ID)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
