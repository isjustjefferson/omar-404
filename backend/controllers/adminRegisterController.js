const bcrypt = require('bcryptjs');
const db = require('../config/db');
const Usuario = require('../models/Usuario');
const { enviarCodigoVerificacao } = require('../config/mailer');

function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const adminRegisterController = {
  async solicitar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
      }

      const existe = await Usuario.buscarPorEmail(email);
      if (existe) {
        return res.status(409).json({ erro: 'Email já cadastrado.' });
      }

      await db.query(
        `UPDATE verificacoes_email SET usado = TRUE WHERE email = $1`,
        [email]
      );

      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const codigo = gerarCodigo();
      const expira = new Date(Date.now() + 15 * 60 * 1000); 

      await db.query(
        `INSERT INTO verificacoes_email (email, nome, senha, codigo, expira_em)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, nome, senhaCriptografada, codigo, expira]
      );

      await enviarCodigoVerificacao(email, nome, codigo);

      return res.status(200).json({
        mensagem: 'Código enviado para o e-mail. Válido por 15 minutos.'
      });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async confirmar(req, res) {
    try {
      const { email, codigo } = req.body;

      if (!email || !codigo) {
        return res.status(400).json({ erro: 'Email e código são obrigatórios.' });
      }

      const result = await db.query(
        `SELECT * FROM verificacoes_email
         WHERE email = $1 AND codigo = $2 AND usado = FALSE
         ORDER BY criado_em DESC LIMIT 1`,
        [email, codigo]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ erro: 'Código inválido.' });
      }

      const verificacao = result.rows[0];

      if (new Date() > new Date(verificacao.expira_em)) {
        return res.status(400).json({ erro: 'Código expirado. Solicite um novo.' });
      }

      await db.query(
        `UPDATE verificacoes_email SET usado = TRUE WHERE id = $1`,
        [verificacao.id]
      );

      const usuario = await Usuario.criar({
        nome: verificacao.nome,
        email: verificacao.email,
        senha: verificacao.senha,
        perfil: 'admin',
      });

      return res.status(201).json({
        mensagem: 'Admin cadastrado com sucesso.',
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
      });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};

module.exports = adminRegisterController;