# 🔧 Guía Rápida: Solucionar Error de Permisos

## Error que Recibes

```
Error al generar PDF: Exception: No cuentas con el permiso para llamar a DocumentApp.create
```

## ⚠️ Nota Importante sobre el Nombre del Archivo

**Si recibes error de sintaxis:** `SyntaxError: Unexpected token ':'`

El archivo DEBE llamarse exactamente: **`appsscript.json`**

❌ NO usar: `appscripts.json.gs` (nombre incorrecto)  
❌ NO usar: `appsscript.json.gs` (extensión incorrecta)  
✅ USAR: `appsscript.json` (correcto)

📖 Si tienes este error, consulta: [SOLUCION_ERROR_SINTAXIS_APPSSCRIPT.md](SOLUCION_ERROR_SINTAXIS_APPSSCRIPT.md)

---

## Solución en 5 Pasos (5 minutos)

### 1️⃣ Abre el Editor de Apps Script
- Ve a tu Google Spreadsheet de la Quiniela
- Menú: **Extensiones** → **Apps Script**

### 2️⃣ Crea/Actualiza el archivo `appsscript.json`

**⚠️ IMPORTANTE: El nombre DEBE ser exactamente `appsscript.json`**
- NO usar: `appscripts.json.gs` ❌
- NO usar: `appsscript.json.gs` ❌
- USAR: `appsscript.json` ✅

**Pasos:**
- En el panel izquierdo, busca el archivo `appsscript.json`
- Si no existe:
  - Ve al menú **Ver** → **Mostrar archivo de manifiesto** (esto lo crea automáticamente)
  - O click en **+** junto a "Archivos" y asegúrate de nombrarlo exactamente `appsscript.json`
- Si tienes un archivo con nombre incorrecto (como `appscripts.json.gs`), elimínalo primero
- Copia y pega este contenido:

```json
{
  "timeZone": "America/Mexico_City",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE"
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}
```

### 3️⃣ Guarda el Archivo
- Click en el icono de **guardar** 💾 o presiona Ctrl+S

### 4️⃣ Ejecuta una Función para Autorizar
- En el dropdown de funciones, selecciona `onOpen`
- Click en **Ejecutar** ▶️
- Aparecerá un diálogo pidiendo autorización

### 5️⃣ Acepta los Permisos
- Click en **Revisar permisos**
- Selecciona tu cuenta de Google
- Verás: **"Esta app no está verificada"** (esto es normal)
  - Click en **Configuración avanzada**
  - Click en **Ir a [Nombre del Proyecto] (no seguro)**
- Revisa los permisos y click en **Permitir**

## ✅ Verificación

Después de autorizar:
1. Cierra el editor de Apps Script
2. Recarga tu Spreadsheet
3. Prueba generar un PDF:
   - Desde el menú: **Quiniela** → **📄 Generar PDF de jornada**
   - O desde la web app: **Resultados** → **Descargar PDF**

## ⚠️ Importante

- Solo necesitas hacer esto **UNA VEZ**
- Después de autorizar, **todos los usuarios** podrán generar PDFs
- Si cambias de cuenta de Google, tendrás que volver a autorizar

## 🆘 ¿Necesitas Ayuda?

Si aún tienes problemas después de seguir estos pasos:

📖 **[Ver guía completa aquí](SOLUCION_PERMISOS_DOCUMENTAPP.md)**

La guía completa incluye:
- Capturas de pantalla de cada paso
- Explicación detallada de cada permiso
- Solución a problemas comunes
- Preguntas frecuentes

---

**Tiempo estimado:** 5 minutos  
**Frecuencia:** Una sola vez (o cuando cambies de cuenta)  
**Afecta a:** Todos los usuarios podrán generar PDFs después
