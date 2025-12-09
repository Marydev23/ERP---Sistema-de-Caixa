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

const data = [
  { mes: "Jan", entradas: 1000, saidas: 300 },
  { mes: "Fev", entradas: 2500, saidas: 1300 },
  { mes: "Mar", entradas: 2000, saidas: 1000 },
  { mes: "Abr", entradas: 3800, saidas: 2000 },
  { mes: "Jun", entradas: 2600, saidas: 3800 },
];

export default function ChartOverview() {
  return (
    <Card className="w-full md:w-1/2 md:max-w-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-gray-800">
            Gráfico de Entradas x Saídas
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
              stroke="#3b82f6"
              strokeWidth={3}
              dot
            />

            <Line
              type="monotone"
              dataKey="saidas"
              stroke="#fb923c"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
