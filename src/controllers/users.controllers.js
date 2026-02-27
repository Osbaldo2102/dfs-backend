const bcrypt = require('bcryptjs');
const { sign } = require('../auth');
const { UsersRepository } = require('../repositories/users.repository');

const repo = new UsersRepository();

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await repo.findByEmail(email);

    if (!user) {
      console.log('LOG: El email no existe en la tabla users');
      return res.status(401).json({ error: 'El email no existe en la tabla users' });
    }

    
    const passwordBD = user.password_hash || user.password;
    const ok = await bcrypt.compare(password, passwordBD);

    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generamos el token con la información del usuario
    const token = sign({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // RESPUESTA LISTA PARA REDIRECCIÓN:
    // Enviamos el token Y el objeto user con su rol
    return res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role // Esto es lo que leerá el frontend para redirigir
      }
    });

  } catch (error) {
    console.error("Error en loginUser:", error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function create(req, res) {
  try {
    const { email, password, role, nombre } = req.body;

    // Encriptamos la contraseña antes de guardar
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Creamos el usuario en el repositorio
    // Pasamos el role (si no viene, el repo debería poner 'user' por defecto)
    const user = await repo.create({
      nombre,
      email, 
      passwordHash, // Se guarda como password_hash en la DB
      role: role || 'user'
    });

    return res.status(201).json({ 
      ok: true, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      } 
    });

  } catch (error) {
    console.error("Error en create user:", error);
    return res.status(500).json({ error: 'Error al crear el usuario' });
  }
}

module.exports = { loginUser, create };