import sqlite3
from werkzeug.security import generate_password_hash

# Nome do banco
bancoDados = "meu_banco.db"

# Conectar ao banco
conn = sqlite3.connect(bancoDados)
cur = conn.cursor()

# Habilitar FK
cur.execute("PRAGMA foreign_keys = ON;")

# ========================
# TABELA USUARIOS
# ========================
cur.execute("""
CREATE TABLE IF NOT EXISTS usuarios (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Senha TEXT NOT NULL,
    CriadoEm TEXT DEFAULT (datetime('now','localtime'))
);
""")

# ========================
# USUÁRIO PADRÃO (COM HASH)
# ========================


cur.execute("""
INSERT OR IGNORE INTO usuarios (Nome, Email, Senha)
VALUES (?, ?, ?)
""", ("Leia", "supervasos@gmail.com", "admin123"))

# ========================
# TABELA CATEGORIA
# ========================
cur.execute("""
CREATE TABLE IF NOT EXISTS categorias (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL
);
""")

# ========================
# TABELA FUNCIONÁRIOS
# ========================
cur.execute("""
CREATE TABLE IF NOT EXISTS funcionarios (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL,
    Cargo TEXT,
    Endereco TEXT,
    Telefone TEXT,
    Valor_salario REAL,
    Data_admissao TEXT,
        Data_demissao TEXT,
    
    Status TEXT DEFAULT 'ATIVO',
    CriadoEm TEXT DEFAULT (datetime('now','localtime'))
);
""")

# ========================
# TABELA RECEITAS
# ========================
cur.execute("""
CREATE TABLE IF NOT EXISTS receitas (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    
    Data TEXT NOT NULL,  
    DataRecebimento TEXT ,         
    Descricao TEXT,
    Cliente TEXT,
    CategoriaID TEXT,
    Valor REAL NOT NULL,
    Forma_pagamento TEXT,
    Desconto INTEGER,
    ValorTotal REAL NOT NULL,
    Status TEXT,
    CriadoEm TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (CategoriaID) REFERENCES categorias(ID) ON DELETE SET NULL
);
""")

# ========================
# TABELA DESPESAS
# ========================
cur.execute("""
CREATE TABLE IF NOT EXISTS despesas (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    DataPagamento TEXT,
    DataVencimento TEXT NOT NULL,
    Nome TEXT,
    Descricao TEXT,
    Valor REAL NOT NULL,
    Status TEXT, 
    CategoriaID TEXT,
    CriadoEm TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (CategoriaID) REFERENCES categorias(ID) ON DELETE SET NULL
);
""")

# ========================
# TABELA PAGAMENTOS
# ========================
cur.execute("""
CREATE TABLE IF NOT EXISTS pagamentos (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Valor REAL NOT NULL,
    Data TEXT NOT NULL,
    Descricao TEXT,
     Nome TEXT,
    Forma_pagamento TEXT,
    CategoriaID INTEGER,
    CriadoEm TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (CategoriaID) REFERENCES categorias(ID) ON DELETE SET NULL
);
""")

# ========================
# TABELA EMPRESA
# ========================
cur.execute("""
CREATE TABLE IF NOT EXISTS empresa (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT,
    CNPJ TEXT,
    Endereco TEXT,
    Telefone TEXT,
    Email TEXT,
    Logo BLOB,
    CriadoEm TEXT DEFAULT (datetime('now','localtime'))
);
""")

# Salvar e fecha
conn.commit()
conn.close()

print("Banco COMPLETO criado com sucesso!")
