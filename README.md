# Magallanes by IBS — Guía de instalación completa

Esta guía te llevará desde cero hasta tener la app funcionando en una URL real.
**No necesitas conocimientos técnicos.** Sigue los pasos en orden.

---

## ⏱ Tiempo estimado: 30-45 minutos

---

## PASO 1 — Crear proyecto en Supabase (base de datos)

1. Ve a **[supabase.com](https://supabase.com)** y crea una cuenta gratuita
2. Haz clic en **"New project"**
3. Rellena:
   - **Name:** `magallanes-ibs`
   - **Database Password:** elige una contraseña segura (guárdala)
   - **Region:** Europe West (Frankfurt) — más cercano a España
4. Espera ~2 minutos a que se cree el proyecto
5. Una vez creado, ve a **Settings > API** y copia:
   - `Project URL` → guárdalo (lo necesitarás)
   - `anon public` key → guárdalo (lo necesitarás)

### Configurar la base de datos

6. En Supabase, ve a **SQL Editor** (icono de base de datos en el menú izquierdo)
7. Haz clic en **"New query"**
8. Abre el archivo `supabase-migration.sql` de este proyecto y copia **todo** su contenido
9. Pégalo en el editor y haz clic en **"Run"** (botón verde)
10. Deberías ver: `Success. No rows returned`

### Configurar autenticación (opcional pero recomendado)

11. Ve a **Authentication > Settings**
12. En **"Email confirmations"**, puedes DESACTIVARLO para que los usuarios entren directo sin confirmar email
    *(útil para pruebas; actívalo en producción)*
13. En **"Site URL"**, pon `https://tu-app.vercel.app` (lo actualizarás después)

---

## PASO 2 — Subir el código a GitHub

1. Ve a **[github.com](https://github.com)** y crea una cuenta si no tienes
2. Haz clic en **"New repository"**
3. Nombre: `magallanes-ibs`
4. Deja el resto por defecto y haz clic en **"Create repository"**
5. En tu ordenador, instala **[GitHub Desktop](https://desktop.github.com/)** (más fácil que la terminal)
6. Abre GitHub Desktop, ve a **File > Add Local Repository**
7. Selecciona la carpeta `magallanes` de este proyecto
8. Haz clic en **"Publish repository"** y selecciona tu repositorio de GitHub

---

## PASO 3 — Desplegar en Vercel

1. Ve a **[vercel.com](https://vercel.com)** y crea una cuenta (puedes usar tu cuenta de GitHub)
2. Haz clic en **"New Project"**
3. Importa el repositorio `magallanes-ibs` desde GitHub
4. En la pantalla de configuración, **ANTES de hacer clic en Deploy**, añade las variables de entorno:

   Haz clic en **"Environment Variables"** y añade estas 3 variables:

   | Variable | Valor |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | La Project URL de Supabase (Paso 1) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La anon key de Supabase (Paso 1) |
   | `ANTHROPIC_API_KEY` | Tu clave de la API de Claude (claude.ai/settings) |

5. Haz clic en **"Deploy"**
6. Espera ~3 minutos. Vercel te dará una URL como `magallanes-ibs.vercel.app`

---

## PASO 4 — Actualizar URLs en Supabase

1. Vuelve a Supabase > **Authentication > Settings**
2. Actualiza **"Site URL"** con tu URL de Vercel: `https://magallanes-ibs.vercel.app`
3. En **"Redirect URLs"**, añade: `https://magallanes-ibs.vercel.app/auth/callback`
4. Guarda los cambios

---

## PASO 5 — Probar la app

1. Ve a tu URL de Vercel
2. Deberías ver la pantalla de login de Magallanes
3. Haz clic en **"Crear cuenta"** y regístrate con tu email
4. Completa el onboarding eligiendo tu área
5. 🎉 Estás dentro del dashboard de Magallanes

---

## 🔧 Si algo falla

**Error "Invalid API key":** Revisa que las variables de entorno en Vercel estén bien escritas (sin espacios)

**Error "User already registered":** Ya existe una cuenta con ese email. Ve a "Iniciar sesión"

**La app no carga:** Ve a Vercel > tu proyecto > "Deployments" y mira el log de errores

**Preguntas:** Comparte el mensaje de error y te ayudo a resolverlo.

---

## 📁 Estructura del proyecto

```
magallanes/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx      # Página de login
│   │   ├── register/page.tsx   # Página de registro
│   │   └── callback/route.ts   # Confirmación de email
│   ├── onboarding/page.tsx     # Flujo de bienvenida + área
│   ├── dashboard/page.tsx      # Dashboard principal
│   └── layout.tsx              # Layout global
├── lib/supabase/
│   ├── client.ts               # Cliente para el navegador
│   └── server.ts               # Cliente para el servidor
├── middleware.ts               # Protección de rutas
├── supabase-migration.sql      # SQL para la base de datos
└── .env.local.example          # Plantilla de variables de entorno
```
