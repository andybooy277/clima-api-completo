import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.resolve('./data/users.json');
const TOKEN_SECRETO = process.env.TOKEN_SECRETO || 'TU_TOKEN_SECRETO';

export default async function handler(req, res) {
  const { persona, ciudad, token } = req.query;

  if (!persona || !ciudad) {
    return res.status(400).send('Faltan parámetros: persona y ciudad son requeridos');
  }

  if (token !== TOKEN_SECRETO) {
    return res.status(401).send('Token inválido');
  }

  try {
    let usersRaw = await fs.readFile(USERS_FILE, 'utf8');
    let users = JSON.parse(usersRaw);

    users[persona.toLowerCase()] = ciudad;

    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');

    res.status(200).send(`Ciudad "${ciudad}" guardada para ${persona}`);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al guardar los datos');
  }
}
