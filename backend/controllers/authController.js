const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const authController = {
    async register(req, res) {
        try {
            const { nome, email, senha, perfil } = req.body;

            if(!nome || !email || !senha) {
                return res.status(400).json({
                    erro: 'Nome, email e senha são obrigatórios.'
                });
            }

            const existe = await Usuario.buscarPorEmail(email);
            if (existe) {
                return res.status(409).json({
                    erro: 'Email já cadastrado.'
                });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const usuario = await Usuario.criar({ nome, email, senha: senhaCriptografada, perfil});
            
            return res.status(201).json({
                mensagem: 'Usuário criado com sucesso',
                usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil}
            });
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    erro: 'Email e senha são obrigatórios.'
                });
            }

            const usuario = await Usuario.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).json({ erro: 'Credenciais inválidas.' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({
                    erro: 'Credenciais inválidas'
                });
            }

            const token = jwt.sign(
                { id: usuario.id, email: usuario.email, perfil: usuario.perfil},
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({
                mensagem: 'Login realizado com sucesso',
                token,
                usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
            })
        } catch (err) {
            return res.status(500).json({ 
                erro: err.message
            });
        }
    },

    async registrarOperador(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const admin_id = req.usuario.id; 

            if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
            }

            if (req.usuario.perfil !== 'admin') {
            return res.status(403).json({ erro: 'Apenas admins podem cadastrar operadores.' });
            }

            const existe = await Usuario.buscarPorEmail(email);
            if (existe) {
            return res.status(409).json({ erro: 'Email já cadastrado.' });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const operador = await Usuario.criar({
            nome,
            email,
            senha: senhaCriptografada,
            perfil: 'operador',
            admin_id,
            });

            return res.status(201).json({
            mensagem: 'Operador cadastrado com sucesso.',
            usuario: { id: operador.id, nome: operador.nome, email: operador.email, perfil: operador.perfil, admin_id: operador.admin_id }
            });
        } catch (err) {
            return res.status(500).json({ erro: err.message });
        }
    }
};

module.exports = authController;