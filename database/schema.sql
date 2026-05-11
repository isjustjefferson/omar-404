-- Omar-404: Sistema de Administração de Funerária

SET client_encoding TO 'UTF8';

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(50) DEFAULT 'operador'
    CHECK (perfil IN ('admin', 'operador')),
  admin_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verificacoes_email (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  nome VARCHAR(150) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  codigo VARCHAR(6) NOT NULL,
  expira_em TIMESTAMP NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  admin_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE falecidos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  data_nascimento DATE,
  data_falecimento DATE NOT NULL,
  causa_morte VARCHAR(255),
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  admin_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE servicos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT,
  valor NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
  data_velorio TIMESTAMP,
  data_sepultamento TIMESTAMP,
  falecido_id INT NOT NULL REFERENCES falecidos(id) ON DELETE RESTRICT,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  admin_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'cancelado')),
  criado_em TIMESTAMP DEFAULT NOW()
);