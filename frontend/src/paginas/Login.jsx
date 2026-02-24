import { FaUser, FaLock } from "react-icons/fa";
import "../style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Senha: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro);
        return;
      }

      // --- LOGIN OK ---
      alert("Login realizado! Bem-vindo " + data.usuario.Nome);

      // SALVA O USUÁRIO (opcional, mas recomendado)
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // 🔥 REDIRECIONA PARA O DASHBOARD
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar ao servidor.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">
            Acesse sua Conta
          </h1>
          <p className="text-sm text-slate-500">
            Entre para acessar seu painel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full h-11 pl-10 pr-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="accent-blue-600" />
              Lembrar de mim
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Entrar
          </button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Não tem uma conta?{" "}
          <a
            href="/usuario"
            className="text-blue-600 font-medium hover:underline"
          >
            Registrar
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;
