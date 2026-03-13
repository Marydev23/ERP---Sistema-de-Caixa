import React, { useState, useEffect } from "react";
import { CardContent, CardTitle } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import {
  CirclePlus,
  Receipt,
  Pencil,
  Trash,
  Download,
  Search,
} from "lucide-react";

export default function Orcamento() {
  const [cliente, setCliente] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [contato, setContato] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [nomeProduto, setNomeProduto] = useState("");

  const [categoria, setCategoria] = useState("");
  const [itens, setItens] = useState([]);
  const [frete, setFrete] = useState(0);
  const [openModalProduto, setOpenModalProduto] = useState(false);
  const [openModalItem, setOpenModalItem] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await fetch("http://localhost:5000/produtos");
      const data = await res.json();

      console.log("Produtos do banco:", data);

      setProdutos(data);
    } catch (erro) {
      console.log("Erro ao buscar produtos:", erro);
    }
  };
  const selecionarProduto = (id) => {
    const idNum = Number(id);
    setProdutoSelecionado(idNum);
    const produto = produtos.find((p) => p.id === idNum);
    if (produto) setPrecoUnitario(produto.Valor_unitario);
  };

  const salvarProduto = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nome_produto: nomeProduto,
        Valor_unitario: precoUnitario,
        CategoriaID: categoria,
      }),
    });

    if (response.ok) {
      alert("Produto cadastrado com sucesso!");

      setNomeProduto("");
      setPrecoUnitario("");
      setCategoria("");
      setOpenModalProduto(false);
      carregarProdutos();
    } else {
      alert("Erro ao cadastrar produto");
    }
  };

  const salvarOrcamento = async () => {
    const dados = {
      cliente,
      cnpj,
      endereco,
      contato,
      frete,
      total: totalGeral,
      itens,
    };

    try {
      const res = await fetch("http://localhost:5000/orcamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        alert("Orçamento salvo com sucesso!");
        return result;
      } else {
        alert("Erro ao salvar orçamento");
      }
    } catch (erro) {
      console.log(erro);
    }
  };

  function limparOrcamento() {
    setCliente("");
    setCnpj("");
    setEndereco("");
    setContato("");
    setItens([]);
    setFrete(0);
  }

  const adicionarProduto = () => {
    const produto = produtos.find((p) => p.id == produtoSelecionado);

    if (!produto) return;

    const novoItem = {
      id: produto.id,
      nome: produto.Nome_produto,
      quantidade: Number(quantidade),
      preco: Number(produto.Valor_unitario),
      total: Number(quantidade) * Number(produto.Valor_unitario),
    };

    setItens([...itens, novoItem]);
    setProdutoSelecionado("");
    setQuantidade(1);
    setPrecoUnitario("");
  };
  const removerItem = (index) => {
    const novaLista = itens.filter((_, i) => i !== index);
    setItens(novaLista);
  };
  const subtotal = itens.reduce((acc, item) => acc + item.total, 0);

  const totalGeral = subtotal + Number(frete);

  // ===============================
  // BUSCAR EMPRESA PARA O PDF
  // ===============================

  const buscarEmpresa = async () => {
    try {
      const res = await fetch("http://localhost:5000/empresa");

      if (!res.ok) {
        throw new Error("Empresa não encontrada");
      }

      const data = await res.json();

      // se vier array pega a primeira empresa
      return Array.isArray(data) ? data[0] : data;
    } catch (erro) {
      console.log("Erro ao buscar empresa:", erro);
      return null;
    }
  };

  // ===============================
  // GERAR PDF
  // ===============================

  const gerarPDF = async () => {
    try {
      const empresa = await buscarEmpresa();
      console.log("LOGO:", empresa.logo);

      if (!empresa) {
        alert("Dados da empresa não encontrados");
        return;
      }

      const doc = new jsPDF("p", "mm", "a4");

      // =============================
      // CORES
      // =============================

      const verde = [34, 94, 60];
      const cinza = [240, 240, 240];

      // =============================
      // CABEÇALHO
      // =============================

      doc.setFillColor(...verde);
      doc.rect(0, 0, 210, 18, "F");

      try {
        if (empresa?.logo && empresa.logo.startsWith("data:image")) {
          doc.addImage(empresa.logo, "PNG", 10, 22, 25, 25);
        }
      } catch (e) {
        console.log("Erro ao carregar logo:", e);
      }

      // nome empresa
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...verde);
      doc.text(empresa?.nome || "Empresa", 40, 28);

      // slogan
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(empresa?.slogan || "", 40, 34);

      // dados empresa
      doc.setFontSize(9);
      doc.text(`CNPJ: ${empresa?.cnpj || ""}`, 40, 40);
      doc.text(`Endereço: ${empresa?.endereco || ""}`, 40, 45);
      doc.text(`Telefone: ${empresa?.telefone || ""}`, 40, 50);
      doc.text(`Email: ${empresa?.email || ""}`, 40, 55);

      // titulo orçamento
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ORÇAMENTO", 200, 28, { align: "right" });

      // numero orçamento
      doc.setFillColor(...verde);
      doc.roundedRect(150, 32, 50, 10, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text("Nº 0001", 175, 39, { align: "center" });

      // data
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Data: ${new Date().toLocaleDateString()}`, 200, 48, {
        align: "right",
      });

      // linha
      doc.setDrawColor(200);
      doc.line(10, 65, 200, 65);

      // =============================
      // DADOS DO CLIENTE
      // =============================

      doc.setFillColor(...cinza);
      doc.roundedRect(10, 70, 190, 30, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("DADOS DO CLIENTE", 15, 76);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(`Cliente: ${cliente}`, 15, 84);
      doc.text(`CNPJ/CPF: ${cnpj}`, 110, 84);
      doc.text(`Endereço: ${endereco}`, 15, 91);
      doc.text(`Contato: ${contato}`, 15, 97);

      // =============================
      // TABELA
      // =============================

      let startY = 110;

      const col = {
        item: 15,
        desc: 35,
        qtd: 120,
        preco: 150,
        total: 180,
      };

      doc.setFillColor(...verde);
      doc.rect(10, startY - 6, 190, 8, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      doc.text("ITEM", col.item, startY);
      doc.text("PRODUTO", col.desc, startY);
      doc.text("QTD", col.qtd, startY);
      doc.text("PREÇO ", col.preco, startY);
      doc.text("TOTAL", col.total, startY);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      startY += 8;

      itens.forEach((item, index) => {
        doc.text(`${index + 1}`, col.item, startY);
        doc.text(item.nome, col.desc, startY);
        doc.text(`${item.quantidade}`, col.qtd, startY);
        doc.text(`R$ ${item.preco.toFixed(2)}`, col.preco, startY);
        doc.text(`R$ ${item.total.toFixed(2)}`, col.total, startY);

        startY += 7;

        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
      });

      // =============================
      // TOTAIS
      // =============================

      startY += 10;

      doc.setFillColor(240, 240, 240);
      doc.roundedRect(120, startY, 80, 25, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);

      doc.text(`Subtotal: R$ ${subtotal.toFixed(2)}`, 125, startY + 8);
      doc.text(`Frete: R$ ${frete.toFixed(2)}`, 125, startY + 15);

      // total geral destaque
      doc.setFillColor(...verde);
      doc.roundedRect(120, startY + 20, 80, 10, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);

      doc.text(`TOTAL: R$ ${totalGeral.toFixed(2)}`, 160, startY + 27, {
        align: "center",
      });

      // =============================
      // RODAPÉ
      // =============================

      doc.setTextColor(80);
      doc.setFontSize(10);

      doc.text("Obrigado pela preferência!", 10, 285);

      doc.text("Prazo de entrega: 5 a 7 dias úteis", 10, 290);

      doc.text(empresa?.site || "", 200, 290, { align: "right" });

      // =============================
      // SALVAR
      // =============================

      doc.save(`Orcamento_${cliente}.pdf`);
    } catch (erro) {
      console.log("Erro ao gerar PDF:", erro);
      alert("Erro ao gerar PDF");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <CardContent>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-semibold text-gray-800 tracking-tight">
              Gestão de Orçamentos
            </CardTitle>

            <button
              onClick={() => setOpenModalProduto(true)}
              className="w-40 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-md transition"
            >
              + Cadastrar Produto
            </button>
          </div>
        </CardContent>

        {/* CADASTRAR OS  PRODUTO */}
        {openModalProduto && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              onSubmit={salvarProduto}
              className="relative bg-white w-[450px] rounded-lg p-6 shadow-xl"
            >
              <button
                type="button"
                onClick={() => setOpenModalProduto(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-6">
                <CirclePlus className="w-6 h-6 text-green-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Cadastrar Produto
                </CardTitle>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Nome do Produto
                </label>

                <input
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Nome do produto"
                />
              </div>

              <div className="grid grid-cols-10 gap-5 py-3">
                <div className="col-span-5 flex flex-col">
                  <label className="text-sm font-medium text-slate-700">
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full h-10 border border-slate-300 rounded-lg
                    px-2  focus:ring-2 focus:ring-green-400
                    focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="bacia">Vasos Bacia</option>
                    <option value="redondo">Vasos boca Redondos</option>
                    <option value="quadrado">Vasos boca Quadrados</option>
                    <option value="bonsai">Vasos Bonsai</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div className="col-span-5 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Preço Unitário
                  </label>

                  <input
                    type="text"
                    value={precoUnitario}
                    onChange={(e) => setPrecoUnitario(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  <CirclePlus className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FORM CLIENTE */}
        <CardContent className="flex">
          <form className="w-full bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2">
              <Receipt className="w-8 h-8 text-green-600" />
              <CardTitle className="text-xl font-semibold text-gray-800">
                Dados do Cliente
              </CardTitle>
            </div>

            <div className="w-full p-2 space-y-2">
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  Cliente:
                </label>
                <input
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  CNPJ/CPF:
                </label>
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Digite o CNPJ ou CPF"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  Endereço:
                </label>
                <input
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Digite o endereço"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">
                  Contato:
                </label>
                <input
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className="flex-1 border-b border-gray-300 bg-transparent py-2 focus:outline-none"
                  placeholder="Digite o contato"
                />
              </div>
            </div>

            <div className="flex justify-start pt-6">
              <button
                type="button"
                onClick={() => setOpenModalItem(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
              >
                <CirclePlus className="w-5 h-5" />
                Adicionar Produtos
              </button>
            </div>
          </form>
        </CardContent>

        {/* MODAL PRODUTO */}
        {openModalItem && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                adicionarProduto();
              }}
              className="relative bg-white w-[450px] rounded-lg p-6 shadow-xl"
            >
              <button
                type="button"
                onClick={() => setOpenModalItem(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-6">
                <CirclePlus className="w-6 h-6 text-green-600" />
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Adicionar Produto
                </CardTitle>
              </div>

              <div className="flex flex-col mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Produto
                </label>

                <select
                  value={produtoSelecionado}
                  onChange={(e) => selecionarProduto(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Selecione</option>

                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.Nome_produto}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-10 gap-5 py-3">
                {/* QUANTIDADE */}
                <div className="col-span-5 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Quantidade
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* PREÇO */}
                <div className="col-span-5 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Preço Unitário
                  </label>

                  <input
                    type="text"
                    value={precoUnitario}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  <CirclePlus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABELA + RESUMO */}
        <div className="flex gap-6">
          {/* ITENS DO ORÇAMENTO */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl font-semibold text-slate-800">
                Itens do Orçamento
              </CardTitle>

              <div className="relative w-64">
                <Search
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Buscar..."
                  value={""}
                  className="h-8 w-full pl-8 pr-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Quant.</th>
                    <th className="p-3 text-left">Descrição</th>
                    <th className="p-3 text-left">Preço Unit.</th>
                    <th className="p-3 text-left">Valor</th>
                    <th className="p-3 text-left">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {itens.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        Nenhum produto adicionado
                      </td>
                    </tr>
                  ) : (
                    itens.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{index + 1}</td>

                        <td className="p-3">{item.quantidade}</td>

                        <td className="p-3">{item.nome}</td>

                        <td className="p-3">
                          R$ {Number(item.preco).toFixed(2)}
                        </td>

                        <td className="p-3">
                          R$ {Number(item.total).toFixed(2)}
                        </td>

                        <td className="p-3">
                          <div className="flex gap-3">
                            <Pencil
                              size={16}
                              className="cursor-pointer text-blue-700"
                            />

                            <Trash
                              size={16}
                              className="cursor-pointer text-red-700"
                              onClick={() => removerItem(index)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/*                                                     RESUMO DO ORÇAMENTO                               */}
          <div className="w-[260px] bg-white rounded-2xl shadow-md p-6 space-y-4">
            <CardTitle className="text-lg font-semibold text-slate-700">
              Resumo
            </CardTitle>

            <div className="bg-green-100 text-green-800 p-3 rounded-lg flex justify-between">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg flex justify-between items-center">
              <span>Frete</span>

              <input
                type="number"
                value={frete}
                onChange={(e) => setFrete(Number(e.target.value))}
                className="w-24 text-right bg-white border border-yellow-300 rounded px-2 py-1 outline-none"
                placeholder="0.00"
              />
            </div>

            <div className="bg-blue-100 text-blue-800 p-3 rounded-lg flex justify-between font-semibold">
              <span>Total Geral</span>
              <span>R$ {totalGeral.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {/*                                                     Botoes finais                             */}

        <div className="flex justify-end gap-3 mt-6">
          <button className="flex items-center gap-1 bg-slate-400 hover:bg-zinc-400 text-white text-sm font-medium px-4 py-1 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={salvarOrcamento}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1 rounded-lg"
          >
            <CirclePlus className="w-5 h-5" />
            Salvar Orçamento
          </button>

          <button
            onClick={() => {
              gerarPDF();
              limparOrcamento();
            }}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1 rounded-lg"
          >
            <Download className="w-5 h-5" />
            Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/// falta fazer aqui : a logo não ta subindo
/// resolver sobre a questão de salvar orçamento outtra logica essa não ta boa
