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
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Acesse a sua Conta</h1>

        <div className="input-box">
          <FaUser className="icon" />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="recall-forget">
          <label>
            <input type="checkbox" />
            Lembre de mim
          </label>
          <a href="#s">Esqueceu a senha?</a>
        </div>

        <button type="submit">Entrar</button>

        <div className="signup-link">
          <p>
            Não tem uma conta? <a href="/usuario">Registrar</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
