import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CircleDollarSign, ArrowUp, ArrowDown, User } from "lucide-react";

export default function ChartOverview() {
  const [movimentacoes, setMovimentacoes] = useState([]);

  const formatBRL = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  function formatarData(data) {
    if (!data) return "-";

    const hoje = new Date().toDateString();
    const d = new Date(data).toDateString();

    if (d === hoje) return "Hoje";

    return new Date(data).toLocaleDateString("pt-BR");
  }

  const getIcon = (tipo) => {
    switch (tipo) {
      case "entrada":
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      case "saida":
        return <ArrowUp className="h-4 w-4 text-red-600" />;
      case "retirada":
        return <User className="h-4 w-4 text-purple-600" />;
      default:
        return <CircleDollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  useEffect(() => {
    async function carregarMovimentos() {
      try {
        const resReceitas = await fetch("http://localhost:5000/receitas");
        const receitas = await resReceitas.json();

        const resDespesas = await fetch("http://localhost:5000/despesas");
        const despesas = await resDespesas.json();

        const hoje = new Date();
        const semana = new Date();
        semana.setDate(hoje.getDate() - 7);

        // RECEITAS
        const entradas = receitas.map((r) => ({
          tipo: "entrada",
          titulo: `Venda | ${r.Forma_pagamento}`,
          descricao: r.Cliente || r.Descricao,
          valor: r.ValorTotal || r.Valor,
          data: r.Data,
        }));

        // DESPESAS
        const saidas = despesas.map((d) => ({
          tipo: d.CategoriaID === "Retirada de Sócio" ? "retirada" : "saida",
          titulo:
            d.CategoriaID === "Retirada de Sócio"
              ? `Retirada | ${d.Nome}`
              : `Despesa | ${d.CategoriaID}`,
          descricao: d.Descricao,
          valor: d.Valor,
          data: d.DataPagamento || d.DataVencimento,
        }));

        const todos = [...entradas, ...saidas]
          .filter((m) => new Date(m.data) >= semana)
          .sort((a, b) => new Date(b.data) - new Date(a.data))
          .slice(0, 10);

        setMovimentacoes(todos);
      } catch (err) {
        console.error("Erro ao carregar atividades:", err);
      }
    }

    carregarMovimentos();
  }, []);

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">
            Atividade Financeira
          </CardTitle>
          <CircleDollarSign className="h-4 w-4 text-gray-500" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
        {movimentacoes.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b pb-2 last:border-none"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-md">
                {getIcon(item.tipo)}
              </div>

              <div>
                <p className="text-sm font-medium">{item.titulo}</p>
                <p className="text-xs text-gray-500">{item.descricao}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">{formatBRL(item.valor)}</p>
              <p className="text-xs text-gray-500">{formatarData(item.data)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
