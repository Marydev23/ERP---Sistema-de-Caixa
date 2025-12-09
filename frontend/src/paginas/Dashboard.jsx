import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBigDown, DollarSign, Percent, TrendingDown } from "lucide-react";
import ChartOverview from "../components/chart";
import ChartPizza from "../components/chartPizza";

function Dashboard() {
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
        <Card className="bg-gradient-to-br  from-teal-400 to-teal-500 shadow-lg border-none rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm: text-x1  text-white/90 select-none">
                Entradas
              </CardTitle>

              <DollarSign className="w-5 h-5 text-white/90" />
            </div>
            <CardDescription className="text-white">
              Total de vendas 30 dias
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight">
              R$ 2.000,00
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br  from-red-500 to-red-500 shadow-lg border-none rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm: text-x1  text-white/90 select-none">
                Saída
              </CardTitle>

              <TrendingDown className="w-5 h-5 text-white/90" />
            </div>
            <CardDescription className="text-teal-50">
              Gastos de 30 dias
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight">
              R$ 1.000,00
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br  from-blue-600 to-blue-500 shadow-lg border-none rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm: text-x1  text-white/90 select-none">
                Saldo em Caixa
              </CardTitle>

              <Percent className="w-5 h-5 text-white/90" />
            </div>
            <CardDescription className="text-teal-50">
              Saldo Atual
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight">
              R$ 1.000,00
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <ChartOverview />
        <ChartPizza />
      </section>
    </main>
  );
}

export default Dashboard;
