import sqlite3

# Nome do novo banco
bancoDados = "meubanco.db"

# Conectar ao banco
conn = sqlite3.connect(bancoDados)
cur = conn.cursor()

# Habilitar chaves estrangeiras
cur.execute("PRAGMA foreign_keys = ON;")

# ========================
# TABELAS
# ========================

# Tabela Usuarios
cur.execute("""
CREATE TABLE IF NOT EXISTS usuarios (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Senha TEXT NOT NULL,
    CriadoEm TEXT DEFAULT (datetime('now','localtime'))
);
""")

cur.execute("""
    INSERT INTO usuarios (Nome, Email, Senha)
    VALUES (?, ?, ?)
""", ("Leia", "supervasos@gmail.com", "admin123"))

# Tabela Funcionarios
cur.execute("""
CREATE TABLE IF NOT EXISTS funcionarios (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL,
    Cargo TEXT,
    Telefone TEXT,
    Endereco TEXT,
    CriadoEm TEXT DEFAULT (datetime('now','localtime'))
);
""")

# Tabela Categorias
cur.execute("""
CREATE TABLE IF NOT EXISTS categorias (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT
);
""")

# Tabela Receitas
cur.execute("""
CREATE TABLE IF NOT EXISTS receitas (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Valor REAL NOT NULL,
    Data TEXT NOT NULL,
    Descricao TEXT,
    Forma_pagamento TEXT,
    CategoriaID INTEGER,
    CriadoEm TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (CategoriaID) REFERENCES categorias(ID) ON DELETE SET NULL
);
""")

# Tabela Despesas
cur.execute("""
CREATE TABLE IF NOT EXISTS despesas (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Valor REAL NOT NULL,
    Data TEXT NOT NULL,
    Descricao TEXT,
    Forma_pagamento TEXT,
    CategoriaID INTEGER,
    CriadoEm TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (CategoriaID) REFERENCES categorias(ID) ON DELETE SET NULL
);
""")


# Salvar e fechar
conn.commit()
conn.close()

print("Banco 'meubanco.db' criado com sucesso!")
