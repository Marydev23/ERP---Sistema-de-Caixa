import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DollarSign, Percent, TrendingDown } from "lucide-react";
import ChartGrafico from "../components/ChartGrafico";
import ChartOverview from "../components/ChartOverview";
import { useEffect, useState } from "react";

function Dashboard() {
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);

  const saldo = receitas - despesas;

  const formatBRL = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        const resReceitas = await fetch("http://localhost:5000/receitas");
        const dadosReceitas = await resReceitas.json();

        const resDespesas = await fetch("http://localhost:5000/despesas");
        const dadosDespesas = await resDespesas.json();

        // 🔹 pegar somente receitas PAGAS
        const receitasPagas = dadosReceitas.filter(
          (item) => item.Status === "Pago",
        );

        // 🔹 pegar somente despesas PAGAS
        const despesasPagas = dadosDespesas.filter(
          (item) => item.Status === "Pago",
        );

        // 🔹 somar receitas
        const totalReceitas = receitasPagas.reduce(
          (acc, item) => acc + Number(item.ValorTotal || item.Valor),
          0,
        );

        // 🔹 somar despesas
        const totalDespesas = despesasPagas.reduce(
          (acc, item) => acc + Number(item.Valor),
          0,
        );

        setReceitas(totalReceitas);
        setDespesas(totalDespesas);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDados();
  }, []);

  return (
    <main className="sm:ml-14 p-4">
      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Visão geral do fluxo de caixa
          </h1>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg border-none rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white/90">Entradas</CardTitle>
              <DollarSign className="w-5 h-5 text-white/90" />
            </div>

            <CardDescription className="text-white">
              Total de vendas 30 dias
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-bold text-white">
              R$ {formatBRL(receitas)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-500 shadow-lg border-none rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white/90">Saída</CardTitle>

              <TrendingDown className="w-5 h-5 text-white/90" />
            </div>

            <CardDescription className="text-white">
              Gastos de 30 dias
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-bold text-white">
              R$ {formatBRL(despesas)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg border-none rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white/90">
                Saldo em Caixa
              </CardTitle>

              <Percent className="w-5 h-5 text-white/90" />
            </div>

            <CardDescription className="text-white">
              Saldo Atual
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-bold text-white">
              R$ {formatBRL(saldo)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <ChartGrafico />
        <ChartOverview />
      </section>
    </main>
  );
}

export default Dashboard;
