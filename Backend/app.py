from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# ===============================
# Conexão correta com o banco
# ===============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "meubanco.db")  # <-- ALTERADO AQUI!

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

    usuarios = [
        {"ID": row["ID"], "Nome": row["Nome"], "Email": row["Email"]}
        for row in dados
    ]

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
        conn.execute(
            "INSERT INTO usuarios (Nome, Email, Senha) VALUES (?, ?, ?)",
            (nome, email, senha),
        )
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

    return {
        "mensagem": "Login bem-sucedido!",
        "usuario": {
            "ID": usuario["ID"],
            "Nome": usuario["Nome"],
            "Email": usuario["Email"],
        },
    }


@app.route("/usuarios/<int:id>/senha", methods=["PUT"])
def atualizar_senha(id):
    data = request.json
    nova_senha = data.get("Senha")

    if not nova_senha:
        return {"erro": "A nova senha é obrigatória"}, 400

    conn = get_db()
    cur = conn.execute(
        "UPDATE usuarios SET Senha = ? WHERE ID = ?", (nova_senha, id)
    )
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

    valor = data.get("Valor")
    data_receita = data.get("Data")
    descricao = data.get("Descricao")
    forma_pagamento = data.get("Forma_pagamento")
    categoria_id = data.get("CategoriaID")

    if not valor or not data_receita:
        return {"erro": "Valor e Data são obrigatórios!"}, 400

    conn = get_db()
    conn.execute(
        "INSERT INTO receitas (Valor, Data, Descricao, Forma_pagamento, CategoriaID) VALUES (?, ?, ?, ?, ?)",
        (valor, data_receita, descricao, forma_pagamento, categoria_id),
    )
    conn.commit()

    return {"mensagem": "Receita cadastrada com sucesso!"}, 201


@app.route("/receitas", methods=["GET"])
def listar_receitas():
    conn = get_db()
    cur = conn.execute(
        """
        SELECT receitas.*, 
               COALESCE(categorias.Nome, 'Sem Categoria') AS Categoria
        FROM receitas
        LEFT JOIN categorias ON categorias.ID = receitas.CategoriaID
        ORDER BY Data DESC
        """
    )

    dados = cur.fetchall()

    receitas = [
        {
            "ID": row["ID"],
            "Valor": row["Valor"],
            "Data": row["Data"],
            "Descricao": row["Descricao"],
            "Forma_pagamento": row["Forma_pagamento"],
            "CategoriaID": row["CategoriaID"],
            "Categoria": row["Categoria"],
            "CriadoEm": row["CriadoEm"],
        }
        for row in dados
    ]

    return jsonify(receitas)


@app.route("/receitas/<int:id>", methods=["PUT"])
def editar_receitas(id):
    data = request.json

    valor = data.get("Valor")
    data_receita = data.get("Data")
    descricao = data.get("Descricao")
    forma_pagamento = data.get("Forma_pagamento")
    categoria_id = data.get("CategoriaID")

    conn = get_db()
    cur = conn.execute(
        """
        UPDATE receitas
        SET Valor = ?, Data = ?, Descricao = ?, Forma_pagamento = ?, CategoriaID = ?
        WHERE ID = ?
        """,
        (valor, data_receita, descricao, forma_pagamento, categoria_id, id),
    )
    conn.commit()

    if cur.rowcount == 0:
        return {"erro": "Receita não encontrada!"}, 404

    return {"mensagem": "Receita atualizada com sucesso!"}


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

    valor = data.get("Valor")
    data_despesa = data.get("Data")
    descricao = data.get("Descricao")
    forma_pagamento = data.get("Forma_pagamento")
    categoria_id = data.get("CategoriaID")

    if not valor or not data_despesa:
        return {"erro": "Valor e Data são obrigatórios!"}, 400

    conn = get_db()
    conn.execute(
        "INSERT INTO despesas (Valor, Data, Descricao, Forma_pagamento, CategoriaID) VALUES (?, ?, ?, ?, ?)",
        (valor, data_despesa, descricao, forma_pagamento, categoria_id),
    )
    conn.commit()

    return {"mensagem": "Despesa cadastrada com sucesso!"}, 201


@app.route("/despesas", methods=["GET"])
def listar_despesas():
    conn = get_db()
    cur = conn.execute(
        """
        SELECT despesas.*, 
               COALESCE(categorias.Nome, 'Sem Categoria') AS Categoria
        FROM despesas
        LEFT JOIN categorias ON categorias.ID = despesas.CategoriaID
        ORDER BY Data DESC
        """
    )

    dados = cur.fetchall()

    despesas = [
        {
            "ID": row["ID"],
            "Valor": row["Valor"],
            "Data": row["Data"],
            "Descricao": row["Descricao"],
            "Forma_pagamento": row["Forma_pagamento"],
            "CategoriaID": row["CategoriaID"],
            "Categoria": row["Categoria"],
            "CriadoEm": row["CriadoEm"],
        }
        for row in dados
    ]

    return jsonify(despesas)


@app.route("/despesas/<int:id>", methods=["PUT"])
def editar_despesa(id):
    data = request.json

    valor = data.get("Valor")
    data_despesa = data.get("Data")
    descricao = data.get("Descricao")
    forma_pagamento = data.get("Forma_pagamento")
    categoria_id = data.get("CategoriaID")

    conn = get_db()
    cur = conn.execute(
        """
        UPDATE despesas
        SET Valor = ?, Data = ?, Descricao = ?, Forma_pagamento = ?, CategoriaID = ?
        WHERE ID = ?
        """,
        (valor, data_despesa, descricao, forma_pagamento, categoria_id, id),
    )
    conn.commit()

    if cur.rowcount == 0:
        return {"erro": "Despesa não encontrada!"}, 404

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
# FUNCIONÁRIOS
# ===============================

@app.route("/funcionarios", methods=["POST"])
def cadastrar_funcionario():
    data = request.json

    nome = data.get("Nome")
    cargo = data.get("Cargo")
    telefone = data.get("Telefone")
    endereco = data.get("Endereco")

    if not nome or not cargo:
        return {"erro": "Nome e Cargo são obrigatórios!"}, 400

    conn = get_db()
    conn.execute(
        "INSERT INTO funcionarios (Nome, Cargo, Telefone, Endereco) VALUES (?, ?, ?, ?)",
        (nome, cargo, telefone, endereco),
    )
    conn.commit()

    return {"mensagem": "Funcionário cadastrado com sucesso!"}, 201


@app.route("/funcionarios", methods=["GET"])
def listar_funcionarios():
    conn = get_db()
    cur = conn.execute("SELECT * FROM funcionarios")
    dados = cur.fetchall()

    funcionarios = [
        {
            "ID": row["ID"],
            "Nome": row["Nome"],
            "Cargo": row["Cargo"],
            "Telefone": row["Telefone"],
            "Endereco": row["Endereco"],
            "CriadoEm": row["CriadoEm"],
        }
        for row in dados
    ]

    return jsonify(funcionarios)


@app.route("/funcionarios/<int:id>", methods=["PUT"])
def editar_funcionarios(id):
    data = request.json

    nome = data.get("Nome")
    cargo = data.get("Cargo")
    telefone = data.get("Telefone")
    endereco = data.get("Endereco")

    conn = get_db()
    cur = conn.execute(
        """
        UPDATE funcionarios
        SET Nome = ?, Cargo = ?, Telefone = ?, Endereco = ?
        WHERE ID = ?
        """,
        (nome, cargo, telefone, endereco, id),
    )
    conn.commit()

    if cur.rowcount == 0:
        return {"erro": "Funcionário não encontrado"}, 404

    return {"mensagem": "Funcionário atualizado com sucesso!"}


@app.route("/funcionarios/<int:id>", methods=["DELETE"])
def excluir_funcionarios(id):
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

    categorias = [
        {"ID": row["ID"], "Nome": row["Nome"]}
        for row in dados
    ]

    return jsonify(categorias)


# ===============================
# Rodar servidor
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
