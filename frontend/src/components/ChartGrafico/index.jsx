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

        // RECEITAS
        receitas
          .filter((r) => r.Status === "Pago")
          .forEach((r) => {
            const data = new Date(r.Data);
            const mes = meses[data.getMonth()];
            resumo[mes].entradas += Number(r.ValorTotal || r.Valor);
          });

        // DESPESAS
        despesas
          .filter((d) => d.Status === "Pago")
          .forEach((d) => {
            const data = new Date(d.Data);
            const mes = meses[data.getMonth()];
            resumo[mes].saidas += Number(d.Valor);
          });

        setData(Object.values(resumo));
      } catch (error) {
        console.error("Erro ao carregar gráfico:", error);
      }
    }

    carregarDados();
  }, []);

  return (
    <Card className="w-full md:w-1/2 md:max-w-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-gray-800">
            Receitas x Despesas por mês
          </CardTitle>
          <DollarSign className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="entradas"
              stroke="#10b981"
              strokeWidth={3}
              dot
              name="Receitas"
            />

            <Line
              type="monotone"
              dataKey="saidas"
              stroke="#ef4444"
              strokeWidth={3}
              dot
              name="Despesas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
