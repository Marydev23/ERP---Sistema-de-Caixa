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

export function Sidebar() {
  return (
    <div className="flex w-full">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-slate-900 text-white sm:flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
          <Package className="w-5 h-5" />

          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm">ERP</span>
            <span className="text-semibold h-5 text-slate-400">
              Fábrica de Vasos
            </span>
          </div>
        </div>
        <nav className="flex flex-col gap-2 p-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/receitas"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800"
          >
            <TrendingUp className="w-5 h-5" />
            Receitas
          </Link>

          <Link
            to="/despesas"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800"
          >
            <TrendingDown className="w-5 h-5" />
            Despesas
          </Link>

          <Link
            to="/orcamento"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800"
          >
            <Barcode className="w-5 h-5" />
            Orçamentos
          </Link>

          <Link
            to="/funcionarios"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800"
          >
            <UserCog className="w-5 h-5" />
            Funcionários
          </Link>

          <Link
            to="/configuracao"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800"
          >
            <Settings className="w-5 h-5" />
            Configurações
          </Link>
        </nav>
        {/* SAIR */}
        <div className="mt-auto p-3 border-t">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-800 text-red-400"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* MOBILE */}
      <div className="sm:hidden flex flex-col w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-white">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelBottom className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="sm:max-w-xs bg-white border-none"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="#"
                  className="flex h-10 w-10 bg-primary rounded-full items-center justify-center text-primary-foreground"
                >
                  <Wallet className="h-5 w-5" />
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-4 px-2.5 hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  to="/receitas"
                  className="flex items-center gap-4 px-2.5 hover:text-foreground"
                >
                  <TrendingUp className="h-5 w-5" />
                  Receitas
                </Link>

                <Link
                  to="/despesas"
                  className="flex items-center gap-4 px-2.5 hover:text-foreground"
                >
                  <TrendingDown className="h-5 w-5" />
                  Despesas
                </Link>
                <Link
                  to="/orcamento"
                  className="flex items-center gap-4 px-2.5 hover:text-foreground"
                >
                  <Barcode className="h-5 w-5" />
                  Orçamentos
                </Link>

                <Link
                  to="/funcionarios"
                  className="flex items-center gap-4 px-2.5 hover:text-foreground"
                >
                  <UserCog className="h-5 w-5" />
                  Funcionários
                </Link>

                <Link
                  to="/configuracao"
                  className="flex items-center gap-4 px-2.5 hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Configurações
                </Link>

                <div className="border-t pt-4">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/login";
                    }}
                    className="flex items-center gap-4 px-2.5 text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
