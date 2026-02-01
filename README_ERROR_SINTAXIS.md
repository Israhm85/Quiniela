# ⚡ SOLUCIÓN INMEDIATA: Error de Sintaxis appsscript.json

## ❌ Tu Error

```
SyntaxError: Unexpected token ':', línea 2, archivo appscripts.json.gs
```

## ✅ La Solución (2 minutos)

### El Problema
Has creado un archivo con el **nombre incorrecto**:
- ❌ `appscripts.json.gs` → INCORRECTO
- ✅ `appsscript.json` → CORRECTO

### Cómo Arreglarlo

**En el Editor de Google Apps Script:**

1. **Elimina el archivo incorrecto**
   - Busca: `appscripts.json.gs` en el panel izquierdo
   - Click derecho → Eliminar

2. **Crea el archivo correcto**
   - Menú: **Ver** → **Mostrar archivo de manifiesto**
   - Esto crea automáticamente: `appsscript.json`

3. **Pega el contenido**
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

4. **Guarda** (Ctrl+S)

## ✅ Verificación

El archivo debe verse así en el panel izquierdo:
```
📁 Archivos
  📄 Code.gs
  📄 Index.html
  📋 appsscript.json  ← Debe tener este ícono y nombre
```

**NO debe verse así:**
```
📁 Archivos
  📄 Code.gs
  📄 Index.html
  📄 appscripts.json.gs  ← INCORRECTO
```

## 📚 Más Ayuda

- 📖 **Guía detallada:** [SOLUCION_ERROR_SINTAXIS_APPSSCRIPT.md](SOLUCION_ERROR_SINTAXIS_APPSSCRIPT.md)
- 🎨 **Guía visual:** [VISUAL_ERROR_APPSSCRIPT.html](VISUAL_ERROR_APPSSCRIPT.html) (abre en navegador)
- ⚡ **Permisos:** [GUIA_RAPIDA_PERMISOS.md](GUIA_RAPIDA_PERMISOS.md)

## 🎯 Resumen

| Aspecto | Detalle |
|---------|---------|
| **Problema** | Nombre de archivo incorrecto |
| **Causa** | `appscripts.json.gs` en vez de `appsscript.json` |
| **Solución** | Eliminar y recrear con nombre correcto |
| **Tiempo** | 2 minutos |
| **Dificultad** | Muy fácil |

---

**¡Eso es todo!** Una vez corregido el nombre, el error desaparecerá. 🎉
