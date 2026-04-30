-- Omar-404: Sistema de Administração de Funerária

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(50) DEFAULT 'operador', -- 'admin' ou 'operador'
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE falecidos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  data_nascimento DATE,
  data_falecimento DATE NOT NULL,
  causa_morte VARCHAR(255),
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE servicos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT,
  valor NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
  falecido_id INT NOT NULL REFERENCES falecidos(id) ON DELETE RESTRICT,
  status VARCHAR(50) DEFAULT 'pendente',
    CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'cancelado')),
  criado_em TIMESTAMP DEFAULT NOW()
);