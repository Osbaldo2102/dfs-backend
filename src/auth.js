const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'default_secret_key';

function sign(payload) {
    // Aqui se actualizo el tiempo de expiración a 2 hora
    return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'Falta autorización' });
    }

    // Bearer token

    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato de token inválido' });
    }

    try {
        req.user = jwt.verify(token, SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

module.exports = {
    sign,
    authMiddleware
}