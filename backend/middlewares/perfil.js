function apenasAdmin(req, res, next) {
    if (req.usuario.perfil !== 'admin') {
        return res.status(403).json({
            erro: 'Trágico! Apenas administradores podem realizar esta ação.'
        });
    }
    next();
}

module.exports = { apenasAdmin };