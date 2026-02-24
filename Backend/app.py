from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import os
from datetime import datetime, timedelta  


app = Flask(__name__)
CORS(app)

# ===============================
# Conexão correta com o banco
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "meubanco.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ===============================
# USUÁRIOS
# ===============================

@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    conn = get_db()
    cur = conn.execute("SELECT * FROM usuarios")
    dados = cur.fetchall()
    usuarios = [{"ID": row["ID"], "Nome": row["Nome"], "Email": row["Email"]} for row in dados]
    return jsonify(usuarios)

@app.route("/usuarios", methods=["POST"])
def cadastrar_usuarios():
    data = request.json
    nome = data.get("Nome")
    email = data.get("Email")
    senha = data.get("Senha")

    if not nome or not email or not senha:
        return {"erro": "Todos os campos são obrigatórios"}, 400

    try:
        conn = get_db()
        conn.execute("INSERT INTO usuarios (Nome, Email, Senha) VALUES (?, ?, ?)", (nome, email, senha))
        conn.commit()
    except sqlite3.IntegrityError:
        return {"erro": "Email já cadastrado!"}, 400

    return {"mensagem": "Usuário cadastrado com sucesso!"}, 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("Email")
    senha = data.get("Senha")

    if not email or not senha:
        return {"erro": "Email e senha são obrigatórios"}, 400

    conn = get_db()
    cur = conn.execute("SELECT * FROM usuarios WHERE Email=?", (email,))
    usuario = cur.fetchone()

    if not usuario:
        return {"erro": "Usuário não encontrado"}, 404
    if usuario["Senha"] != senha:
        return {"erro": "Senha incorreta"}, 401

    return {"mensagem": "Login bem-sucedido!", "usuario": {"ID": usuario["ID"], "Nome": usuario["Nome"], "Email": usuario["Email"]}}

@app.route("/usuarios/<int:id>/senha", methods=["PUT"])
def atualizar_senha(id):
    data = request.json
    nova_senha = data.get("Senha")
    if not nova_senha:
        return {"erro": "A nova senha é obrigatória"}, 400

    conn = get_db()
    cur = conn.execute("UPDATE usuarios SET Senha = ? WHERE ID = ?", (nova_senha, id))
    conn.commit()

    if cur.rowcount == 0:
        return {"erro": "Usuário não encontrado"}, 404
    return {"mensagem": "Senha atualizada com sucesso!"}

@app.route("/usuarios/<int:id>", methods=["DELETE"])
def deletar_usuario(id):
    conn = get_db()
    cur = conn.execute("DELETE FROM usuarios WHERE ID = ?", (id,))
    conn.commit()
    if cur.rowcount == 0:
        return {"erro": "Usuário não encontrado"}, 404
    return {"mensagem": "Usuário deletado com sucesso!"}

# ===============================
# RECEITAS
# ===============================



@app.route("/receitas", methods=["POST"])
def cadastrar_receitas():
    data = request.json

    # ===== tratar valor =====
    try:
        valor = float(str(data.get("Valor") or 0).replace(",", "."))
    except:
        return {"erro": "Valor inválido"}, 400

    data_receita = data.get("Data")
    cliente = data.get("Cliente")
    descricao = data.get("Descricao")
    forma_pagamento = data.get("Forma_pagamento")
    categoria_id = data.get("CategoriaID")

    if not data_receita:
        return {"erro": "Data é obrigatória!"}, 400

    parcelas = int(data.get("Parcelas") or 1)

    # ===== boleto =====
    data_recebimento = data.get("DataRecebimento")

    if forma_pagamento == "Boleto":
        if not data_recebimento:
            data_recebimento = (
                datetime.strptime(data_receita, "%Y-%m-%d") + timedelta(days=7)
            ).strftime("%Y-%m-%d")
    else:
        data_recebimento = data_receita

    # ===== cálculo financeiro =====
 
    # ===== cálculo financeiro =====
    desconto = 0
    status = "Pago"
    valor_total = valor  # 🔥 garante que sempre exista

    if forma_pagamento == "Cartão de crédito":
        taxa = 0.0498
        taxa_parcela = taxa + (0.01 * (parcelas - 1))
        desconto = round(valor * taxa_parcela, 2)
        valor_total = round(valor - desconto, 2)

    elif forma_pagamento == "Cartão de débito":
        taxa = 0.0169
        desconto = round(valor * taxa, 2)
        valor_total = round(valor - desconto, 2)

    elif forma_pagamento == "Boleto":
        status = "Em aberto"
    

            

    # ===== inserir no banco =====
    conn = get_db()
    conn.execute("""
        INSERT INTO receitas
        (Valor, Data, Cliente, Descricao, Forma_pagamento,
        CategoriaID, DataRecebimento, ValorTotal, Desconto, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        valor,
        data_receita,
        cliente,
        descricao,
        forma_pagamento,
        categoria_id,
        data_recebimento,
        valor_total,
        desconto,
        status
    ))

    conn.commit()

    return {"mensagem": "Receita cadastrada com sucesso!"}, 201



@app.route("/receitas/<int:id>", methods=["PUT"])
def editar_receitas(id):
    data = request.json

    try:
        valor = float(str(data.get("Valor") or 0).replace(",", "."))
    except:
        return {"erro": "Valor inválido"}, 400

    data_receita = data.get("Data")
    cliente = data.get("Cliente")
    descricao = data.get("Descricao")
    forma_pagamento = data.get("Forma_pagamento")
    categoria_id = data.get("CategoriaID")
    parcelas = int(data.get("Parcelas") or 1)
    desconto = float(data.get("Desconto") or 0)
    status = data.get("Status") or "Pago"

    if not data_receita:
        return {"erro": "Data é obrigatória!"}, 400

    # ===== boleto =====
    data_recebimento = data.get("DataRecebimento")
    if forma_pagamento == "Boleto" and not data_recebimento:
        data_recebimento = (
            datetime.strptime(data_receita, "%Y-%m-%d") + timedelta(days=7)
        ).strftime("%Y-%m-%d")
    elif not data_recebimento:
        data_recebimento = data_receita

    # ===== valor total =====
    if forma_pagamento == "Cartão de crédito":
        taxa = 0.0498
        taxa_parcela = taxa + (0.01 * (parcelas - 1))
        valor_total = round(valor - (valor * taxa_parcela), 2)
    elif forma_pagamento == "Cartão de débito":
        taxa = 0.0169
        valor_total = round(valor - (valor * taxa), 2)
    else:
        valor_total = valor

    conn = get_db()
    cur = conn.execute("""
        UPDATE receitas
        SET Valor=?, Data=?, Cliente=?, Descricao=?,
            Forma_pagamento=?, CategoriaID=?,
            DataRecebimento=?, ValorTotal=?,
            Desconto=?, Status=?
        WHERE ID=?
    """, (
        valor,
        data_receita,
        cliente,
        descricao,
        forma_pagamento,
        categoria_id,
        data_recebimento,
        valor_total,
        desconto,
        status,
        id
    ))

    conn.commit()
    conn.close()

    if cur.rowcount == 0:
        return {"erro": "Receita não encontrada!"}, 404

    return {"mensagem": "Receita atualizada com sucesso!"}




@app.route("/receitas", methods=["GET"])
def listar_receitas():
    busca = request.args.get("busca", "").lower()  # pega o parâmetro de busca
    conn = get_db()

    sql = """
        SELECT receitas.*, COALESCE(categorias.Nome,'Sem Categoria') AS Categoria
        FROM receitas
        LEFT JOIN categorias ON categorias.ID = receitas.CategoriaID
    """

    
    if busca:
        sql += """
        WHERE LOWER(receitas.Descricao) LIKE ? OR LOWER(receitas.Cliente) LIKE ?
        """
        params = (f"%{busca}%", f"%{busca}%")
    else:
        params = ()

    
    sql += """
        ORDER BY 
            CASE 
                WHEN Status = 'Em aberto' THEN 0
                ELSE 1
            END,
            Data DESC,
            ID DESC
    """

    cur = conn.execute(sql, params)
    dados = cur.fetchall()
    receitas = [
        {
            "ID": row["ID"],
            "Valor": row["Valor"],
            "Data": row["Data"],
            "Cliente": row["Cliente"],
            "Descricao": row["Descricao"],
            "Forma_pagamento": row["Forma_pagamento"],
            "CategoriaID": row["CategoriaID"],
            "Categoria": row["Categoria"],
            "DataRecebimento": row["DataRecebimento"],
            "ValorTotal": row["ValorTotal"],
            "Desconto": row["Desconto"],
            "Status": row["Status"],
            "CriadoEm": row["CriadoEm"]
        }
        for row in dados
    ]
    return jsonify(receitas)



@app.route("/receitas/<int:id>", methods=["DELETE"])
def excluir_receitas(id):
    conn = get_db()
    cur = conn.execute("DELETE FROM receitas WHERE ID = ?", (id,))
    conn.commit()
    if cur.rowcount == 0:
        return {"erro": "Receita não encontrada!"}, 404
    return {"mensagem": "Receita excluída com sucesso!"}

# ===============================
# DESPESAS
# ===============================



@app.route("/despesas", methods=["POST"])
def cadastrar_despesa():
    data = request.json

    data_despesa = data.get("Data")
    data_vencimento = data.get("DataVencimento")
    nome = data.get("Nome")
    descricao = data.get("Descricao")
    status = data.get("Status")
    categoria_id = data.get("CategoriaID")

    try:
        valor = float(str(data.get("Valor")).replace(",", "."))
    except:
        return {"erro": "Valor inválido!"}, 400

    if valor is None or not data_despesa or not data_vencimento:
        return {"erro": "Valor, Data e Data de Vencimento são obrigatórios!"}, 400

    conn = get_db()
    try:
        conn.execute("""
            INSERT INTO despesas 
            (Data, DataVencimento, Nome, Descricao, Valor, Status, CategoriaID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (data_despesa, data_vencimento, nome, descricao, valor, status, categoria_id))

        conn.commit()
        return {"mensagem": "Despesa cadastrada com sucesso!"}, 201
    finally:
        conn.close()

@app.route("/despesas", methods=["GET"])
def listar_despesas():
    conn = get_db()
    cur = conn.execute("""
        SELECT despesas.*, 
        COALESCE(categorias.Nome,'Sem Categoria') AS Categoria
        FROM despesas
        LEFT JOIN categorias ON categorias.ID = despesas.CategoriaID
        ORDER BY Data DESC
    """)

    dados = cur.fetchall()

    despesas = [
        {
            "ID": row["ID"],
            "Data": row["Data"],
            "DataVencimento": row["DataVencimento"],
            "Nome": row["Nome"],
            "Descricao": row["Descricao"],
            "Valor": row["Valor"],
            "Status": row["Status"],
            "CategoriaID": row["CategoriaID"],
            "Categoria": row["Categoria"],
            "CriadoEm": row["CriadoEm"],
        }
        for row in dados
    ]

    conn.close()
    return jsonify(despesas)


@app.route("/despesas/<int:id>", methods=["PUT"])
def editar_despesa(id):
    data = request.json

    data_despesa = data.get("Data")
    data_vencimento = data.get("DataVencimento")
    nome = data.get("Nome")
    descricao = data.get("Descricao")
    valor = data.get("Valor")
    status = data.get("Status")
    categoria_id = data.get("CategoriaID")

    conn = get_db()
    cur = conn.execute("""
        UPDATE despesas
        SET Data = ?, 
            DataVencimento = ?, 
            Nome = ?, 
            Descricao = ?, 
            Valor = ?, 
            Status = ?, 
            CategoriaID = ?
        WHERE ID = ?
    """, (data_despesa, data_vencimento, nome, descricao, valor, status, categoria_id, id))

    conn.commit()

    if cur.rowcount == 0:
        conn.close()
        return {"erro": "Despesa não encontrada!"}, 404

    conn.close()
    return {"mensagem": "Despesa atualizada com sucesso!"}



@app.route("/despesas/<int:id>", methods=["DELETE"])
def excluir_despesa(id):
    conn = get_db()
    cur = conn.execute("DELETE FROM despesas WHERE ID = ?", (id,))
    conn.commit()
    if cur.rowcount == 0:
        return {"erro": "Despesa não encontrada!"}, 404
    return {"mensagem": "Despesa excluída com sucesso!"}



# ===============================
# LISTAR FUNCIONÁRIOS
# ===============================
@app.route("/funcionarios", methods=["GET"])
def listar_funcionarios():
    conn = get_db()
    cur = conn.execute("SELECT * FROM funcionarios")
    dados = cur.fetchall()

    funcionarios = []
    for row in dados:
        funcionarios.append({
            "ID": row["ID"],
            "Nome": row["Nome"],
            "Cargo": row["Cargo"],
            "Telefone": row["Telefone"],
            "Endereco": row["Endereco"],
            "Valor_salario": row["Valor_salario"],
            "Data_admissao": row["Data_admissao"],
            "Status": row["Status"],
            "Data_demissao": row["Data_demissao"],
            "CriadoEm": row["CriadoEm"]
        })

    return jsonify(funcionarios)


# ===============================
# CADASTRAR FUNCIONÁRIO
# ===============================
@app.route("/funcionarios", methods=["POST"])
def cadastrar_funcionario():
    data = request.json

    nome = data.get("Nome")
    cargo = data.get("Cargo")
    telefone = data.get("Telefone")
    endereco = data.get("Endereco")
    valor_salario = data.get("Valor_salario")
    data_admissao = data.get("Data_admissao")
    status = data.get("Status", "ATIVO")

    data_demissao = None
    if status == "INATIVO":
        data_demissao = datetime.now().strftime("%Y-%m-%d")

    if not nome or not cargo:
        return {"erro": "Nome e Cargo são obrigatórios!"}, 400

    conn = get_db()
    conn.execute("""
        INSERT INTO funcionarios
        (Nome, Cargo, Telefone, Endereco, Valor_salario, Data_admissao, Status, Data_demissao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        nome,
        cargo,
        telefone,
        endereco,
        valor_salario,
        data_admissao,
        status,
        data_demissao
    ))
    conn.commit()

    return {"mensagem": "Funcionário cadastrado com sucesso!"}, 201


# ===============================
# EDITAR FUNCIONÁRIO
# ===============================
@app.route("/funcionarios/<int:id>", methods=["PUT"])
def editar_funcionario(id):
    data = request.json

    nome = data.get("Nome")
    cargo = data.get("Cargo")
    telefone = data.get("Telefone")
    endereco = data.get("Endereco")
    valor_salario = data.get("Valor_salario")
    data_admissao = data.get("Data_admissao")
    status = data.get("Status")

    data_demissao = None
    if status == "INATIVO":
        data_demissao = datetime.now().strftime("%Y-%m-%d")

    conn = get_db()
    cur = conn.execute("""
        UPDATE funcionarios SET
            Nome = ?,
            Cargo = ?,
            Telefone = ?,
            Endereco = ?,
            Valor_salario = ?,
            Data_admissao = ?,
            Status = ?,
            Data_demissao = ?
        WHERE ID = ?
    """, (
        nome,
        cargo,
        telefone,
        endereco,
        valor_salario,
        data_admissao,
        status,
        data_demissao,
        id
    ))
    conn.commit()

    if cur.rowcount == 0:
        return {"erro": "Funcionário não encontrado"}, 404

    return {"mensagem": "Funcionário atualizado com sucesso!"}


# ===============================
# EXCLUIR FUNCIONÁRIO
# ===============================
@app.route("/funcionarios/<int:id>", methods=["DELETE"])
def excluir_funcionario(id):
    conn = get_db()
    cur = conn.execute("DELETE FROM funcionarios WHERE ID = ?", (id,))
    conn.commit()

    if cur.rowcount == 0:
        return {"erro": "Funcionário não encontrado"}, 404

    return {"mensagem": "Funcionário excluído com sucesso!"}

# ===============================
# CATEGORIAS
# ===============================

@app.route("/categorias", methods=["GET"])
def listar_categorias():
    conn = get_db()
    cur = conn.execute("SELECT * FROM categorias ORDER BY Nome ASC")
    dados = cur.fetchall()
    categorias = [{"ID": row["ID"], "Nome": row["Nome"]} for row in dados]
    return jsonify(categorias)

# ===============================
# EMPRESA
# ===============================

@app.route("/empresa", methods=["POST"])
def criar_empresa():
    data = request.json
    nome = data.get("Nome")
    cnpj = data.get("CNPJ")
    telefone = data.get("Telefone")
    endereco = data.get("Endereco")
    email = data.get("Email")
    logo = data.get("Logo")

    if not nome or not cnpj:
        return {"erro": "Nome e CNPJ são obrigatórios"}, 400

    conn = get_db()
    conn.execute("INSERT INTO empresa (Nome, CNPJ, Telefone, Endereco, Email, Logo) VALUES (?, ?, ?, ?, ?, ?)", (nome, cnpj, telefone, endereco, email, logo))
    conn.commit()
    return {"mensagem": "Empresa cadastrada com sucesso!"}, 201

@app.route("/empresa/<int:id>", methods=["GET"])
def buscar_empresa(id):
    conn = get_db()
    cur = conn.execute("SELECT * FROM empresa WHERE ID = ?", (id,))
    row = cur.fetchone()
    if not row:
        return {"erro": "Empresa não encontrada"}, 404
    empresa = {"ID": row["ID"], "Nome": row["Nome"], "CNPJ": row["CNPJ"], "Telefone": row["Telefone"], "Endereco": row["Endereco"], "Email": row["Email"], "Logo": row["Logo"], "CriadoEm": row["CriadoEm"]}
    return jsonify(empresa)

@app.route("/empresa/<int:id>", methods=["PUT"])
def editar_empresa(id):
    data = request.json
    nome = data.get("Nome")
    cnpj = data.get("CNPJ")
    telefone = data.get("Telefone")
    endereco = data.get("Endereco")
    email = data.get("Email")
    logo = data.get("Logo")

    conn = get_db()
    cur = conn.execute("UPDATE empresa SET Nome = ?, CNPJ = ?, Telefone = ?, Endereco = ?, Email = ?, Logo = ? WHERE ID = ?", (nome, cnpj, telefone, endereco, email, logo, id))
    conn.commit()
    if cur.rowcount == 0:
        return {"erro": "Empresa não encontrada"}, 404
    return {"mensagem": "Empresa atualizada com sucesso!"}

# ===============================
# Rodar servidor
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
