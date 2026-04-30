-- Seed inicial — Omar-404, apenas para populat o banco

INSERT INTO usuarios (nome, email, senha, perfil) VALUES
  ('Admin', 'admin@omar404.com', '123456', 'admin');

INSERT INTO clientes (nome, cpf, telefone, email) VALUES
  ('Maria Silva', '111.222.333-44', '(81) 99999-0001', 'maria@email.com'),
  ('João Santos', '555.666.777-88', '(81) 99999-0002', 'joao@email.com');

INSERT INTO falecidos (nome, data_nascimento, data_falecimento, causa_morte, cliente_id) VALUES
  ('José Silva', '1940-03-10', '2024-01-15', 'Causas naturais', 1),
  ('Ana Santos', '1955-07-22', '2024-02-03', 'Causas naturais', 2);

INSERT INTO servicos (tipo, descricao, valor, falecido_id, status) VALUES
  ('Velório', 'Sala standard 12h', 1500.00, 1, 'concluido'),
  ('Cremação', 'Cremação com urna simples', 3200.00, 2, 'pendente');