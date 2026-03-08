import {
  Barcode,
  Package,
  Home,
  PanelBottom,
  Settings,
  TrendingDown,
  TrendingUp,
  UserCog,
  Wallet,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

export function Sidebar() {
  return (
    <div className="flex w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-4 bg-background sm:flex flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5 ">
          <TooltipProvider>
            <Link
              to="#"
              className="flex h-9 w-9  shrink-0 items-center justify-center bg-primary
            text-primary-foreground rounded-full"
            >
              <Package className="h-4 w-4" />
              <span className="sr-only">Painel de Controle</span>
            </Link>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard"
                  className="flex h-9 w-9  shrink-0 items-center justify-center 
                  rounded-lg text-nuted-foreground transition-colors hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Início</span>
                </Link>
              </TooltipTrigger>

              <TooltipContent side="right">Início</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/receitas"
                  className="flex h-9 w-9  shrink-0 items-center justify-center 
                  rounded-lg text-nuted-foreground transition-colors hover:text-foreground"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="sr-only">Receitas </span>
                </Link>
              </TooltipTrigger>

              <TooltipContent side="right">Receitas </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/despesas"
                  className="flex h-9 w-9  shrink-0 items-center justify-center 
                  rounded-lg text-nuted-foreground transition-colors hover:text-foreground"
                >
                  <TrendingDown className="h-5 w-5" />
                  <span className="sr-only">Despesas </span>
                </Link>
              </TooltipTrigger>

              <TooltipContent side="right">Despesas </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/funcionarios"
                  className="flex h-9 w-9  shrink-0 items-center justify-center 
                  rounded-lg text-nuted-foreground transition-colors hover:text-foreground"
                >
                  <UserCog className="h-5 w-5" />
                  <span className="sr-only">Funcionários </span>
                </Link>
              </TooltipTrigger>

              <TooltipContent side="right">Funcionários </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/orcamento"
                  className="flex h-9 w-9  shrink-0 items-center justify-center 
                  rounded-lg text-nuted-foreground transition-colors hover:text-foreground"
                >
                  <Barcode className="h-5 w-5" />
                  <span className="sr-only">Orcamento</span>
                </Link>
              </TooltipTrigger>

              <TooltipContent side="right">Orcamento </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/configuracao"
                  className="flex h-9 w-9  shrink-0 items-center justify-center 
                  rounded-lg text-nuted-foreground transition-colors hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Configurações</span>
                </Link>
              </TooltipTrigger>

              <TooltipContent side="right">Configurações </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="#"
                  className="flex h-9 w-9  shrink-0 items-center justify-center 
                  rounded-lg text-nuted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-5 w-5 text-red-700" />
                  <span className="sr-only">Sair</span>
                </Link>
              </TooltipTrigger>

              <TooltipContent side="right">Sair </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-start px-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelBottom className="w-5 h-5 stroke-black fill-white" />
                <span className="sr-only">Abrir / fechar</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="sm:max-w-xs bg-white border-none [&>button]:hidden"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="#"
                  className="flex h-10 w-10 bg-primary rounded-full text-lg
                  items-center justify-center text-primary-foreground gap-2 md:text-base "
                >
                  <Wallet className="h-5 w-5 transition-all" />
                  <span className="sr-only">Logo do projeto</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5 transition-all" />
                  Início
                </Link>

                <Link
                  to="/receitas"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <TrendingUp className="h-5 w-5 transition-all" />
                  Receitas
                </Link>

                <Link
                  to="/despesas"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <TrendingDown className="h-5 w-5 transition-all" />
                  Despesas
                </Link>

                <Link
                  to="/funcionarios"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <UserCog className="h-5 w-5 transition-all" />
                  Funcionários
                </Link>

                <Link
                  to="/pagamentos"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Barcode className="h-5 w-5 transition-all" />A pagar
                </Link>

                <Link
                  to="/configuracao"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5 transition-all" />
                  Configurações
                </Link>

                <div className="mt-6 border-t pt-4">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/login";
                    }}
                    className="flex w-full items-center gap-4 px-2.5 text-gray-700 hover:text-red-600 bg-white hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="h-5 w-5 transition-all" />
                    Sair
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <h2>Menu</h2>
        </header>
      </div>
    </div>
  );
}
