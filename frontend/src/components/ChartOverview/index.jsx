import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CircleDollarSign, ArrowUp, ArrowDown, User } from "lucide-react"; // ícones novos

const pagamentos = [
  {
    tipo: "Entrada",
    forma: "PIX",
    descricao: "Cliente João",
    valor: "R$ 450,00",
    data: "Hoje",
    cor: "text-green-600",
  },
  {
    tipo: "Saída",
    forma: "Material",
    descricao: "Matéria-prima",
    valor: "R$ 1.200,00",
    data: "Hoje",
    cor: "text-red-600",
  },
  {
    tipo: "Retirada",
    forma: "Sócio",
    descricao: "Pró-labore",
    valor: "R$ 2.000,00",
    data: "Ontem",
    cor: "text-purple-600",
  },
];

const ChartOverview = () => {
  const getIcon = (tipo) => {
    switch (tipo) {
      case "Entrada":
        return <ArrowDown className="h-5 w-5 text-green-600" />;
      case "Saída":
        return <ArrowUp className="h-5 w-5 text-red-600" />;
      case "Retirada":
        return <User className="h-5 w-5 text-purple-600" />;
      default:
        return <CircleDollarSign className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="w-full md:w-1/2 md:max-w-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-gray-800">
            Últimos Pagamentos
          </CardTitle>
          <CircleDollarSign className="h-4 w-4 text-gray-600" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {pagamentos.map((item, index) => (
          <article
            key={index}
            className="flex items-center justify-between border-b pb-2"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 flex items-center justify-center bg-gray-100">
                {getIcon(item.tipo)}
              </Avatar>

              <div>
                <p className={`text-sm font-medium ${item.cor}`}>
                  {item.tipo} | {item.forma}
                </p>
                <p className="text-xs text-gray-500">{item.descricao}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">{item.valor}</p>
              <p className="text-xs text-gray-500">{item.data}</p>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChartOverview;
