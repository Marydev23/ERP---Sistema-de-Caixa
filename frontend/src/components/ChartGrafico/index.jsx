import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

export default function ChartGrafico() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resReceitas = await fetch("http://localhost:5000/receitas");
        const receitas = await resReceitas.json();

        const resDespesas = await fetch("http://localhost:5000/despesas");
        const despesas = await resDespesas.json();

        const meses = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];

        const resumo = {};
        meses.forEach((mes) => {
          resumo[mes] = { mes, entradas: 0, saidas: 0 };
        });

        receitas
          .filter((r) => r.Status?.toLowerCase() === "pago")
          .forEach((r) => {
            if (!r.Data) return;

            const dataReceita = new Date(r.Data);
            const mes = meses[dataReceita.getMonth()];

            resumo[mes].entradas += Number(r.ValorTotal || r.Valor || 0);
          });

        despesas
          .filter((d) => d.Status?.toLowerCase() === "pago")
          .forEach((d) => {
            if (!d.DataPagamento) return;

            const dataDespesa = new Date(d.DataPagamento);
            const mes = meses[dataDespesa.getMonth()];

            resumo[mes].saidas += Number(d.Valor || 0);
          });

        setData(Object.values(resumo));
      } catch (error) {
        console.error("Erro ao carregar gráfico:", error);
      }
    }

    carregarDados();
  }, []);

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">
            Receitas x Despesas
          </CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500" />
        </div>
      </CardHeader>

      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="entradas"
              stroke="#10b981"
              strokeWidth={3}
              name="Receitas"
            />

            <Line
              type="monotone"
              dataKey="saidas"
              stroke="#ef4444"
              strokeWidth={3}
              name="Despesas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
