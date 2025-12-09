import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./paginas/Login";
import Layout from "./Layout/Layout";
import Dashboard from "./paginas/Dashboard";
import Despesas from "./paginas/Despesas";
import Receitas from "./paginas/Receitas";
import Funcionarios from "./paginas/Funcionarios";
import Configuracao from "./paginas/configuracao/Configuracao";
import Pagamentos from "./paginas/Pagamentos";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Despesas */}
        <Route
          path="/despesas"
          element={
            <Layout>
              <Despesas />
            </Layout>
          }
        />

        {/* Receitas */}
        <Route
          path="/receitas"
          element={
            <Layout>
              <Receitas />
            </Layout>
          }
        />

        {/* Funcionários */}
        <Route
          path="/funcionarios"
          element={
            <Layout>
              <Funcionarios />
            </Layout>
          }
        />

        {/* Pagamentos */}
        <Route
          path="/pagamentos"
          element={
            <Layout>
              <Pagamentos />
            </Layout>
          }
        />

        {/* Configuração */}
        <Route path="/configuracao" element={<Configuracao />} />

        {/* 404 */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
