import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const API_KEY = '81c1fe302b45f17598d4eb082bbdd4a2';
const USERS_FILE = path.resolve('./data/users.json');

export default async function handler(req, res) {
  try {
    const canal = req.query.channel || 'desconocido';
    const rawQuery = req.query.query || '';
    const partes = rawQuery.trim().split(' ').filter(p => p !== '');

    let persona = canal;
    let ciudad = 'Montevideo';

    // Carga usuarios
    let usersRaw = await fs.readFile(USERS_FILE, 'utf8');
    let users = JSON.parse(usersRaw);

    if (partes.length === 1) {
      persona = partes[0];
      if (users[persona.toLowerCase()]) {
        ciudad = users[persona.toLowerCase()];
      }
    } else if (partes.length >= 2) {
      ciudad = partes[0];
      persona = partes.slice(1).join(' ');
    } else {
      if (users[persona.toLowerCase()]) {
        ciudad = users[persona.toLowerCase()];
      }
    }

    const geoResp = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(ciudad)}&limit=1&appid=${API_KEY}`);
    const geoData = await geoResp.json();
    if (!geoData.length) {
      return res.status(404).send(`No se encontró la ciudad "${ciudad}"`);
    }
    const { lat, lon } = geoData[0];

    const weatherResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`);
    const weatherData = await weatherResp.json();

    const estado = weatherData.weather[0].description;
    const temp = weatherData.main.temp.toFixed(1);
    const tempMin = weatherData.main.temp_min.toFixed(0);
    const tempMax = weatherData.main.temp_max.toFixed(0);
    const humedad = weatherData.main.humidity;
    const nubes = weatherData.clouds.all;
    const amanecer = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
    const atardecer = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

    const respuesta = `Clima para ${persona} en ${ciudad} 🇦🇷/🌍:\n` +
                      `${estado.charAt(0).toUpperCase() + estado.slice(1)}\n` +
                      `🌡 Temp: ${temp}°C | Mín: ${tempMin}° / Máx: ${tempMax}°\n` +
                      `💧 Humedad: ${humedad}% | ☁️ Nubosidad: ${nubes}%\n` +
                      `🌅 Amanecer: ${amanecer} | 🌇 Atardecer: ${atardecer}`;

    res.status(200).send(respuesta);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al obtener los datos del clima');
  }
}
