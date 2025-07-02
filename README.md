# API Clima con usuarios y ciudades

## Setup

1. Cloná este repo o subilo a GitHub
2. Creá un archivo `.env` con:

TOKEN_SECRETO=tu_token_secreto_aqui

3. Desplegalo en Vercel (detecta automáticamente las funciones en `/api`)

## Comandos Nightbot

- Consultar clima:

!clima
$(urlfetch https://clima-api-completo.vercel.app/api/clima?channel=$(channel)&query=$(querystring))


- Agregar ciudad (solo mods):

!addclima
$(urlfetch https://clima-api-completo.vercel.app/api/addclima?persona=$(1)&ciudad=$(2)&token=andy2005)

## Notas

- El archivo `/data/users.json` se usa como base local de usuarios.
- Si querés algo más persistente, usá una base externa como Supabase o Firestore.
