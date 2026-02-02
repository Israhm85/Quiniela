# 🔧 Solución: Error de Sintaxis en appsscript.json

## ❌ Error que Estás Viendo

```
SyntaxError: Unexpected token ':', línea 2, archivo appscripts.json.gs
```

## 🎯 Causa del Problema

El error indica que hay un problema con el **nombre del archivo**:

- ❌ **Nombre incorrecto:** `appscripts.json.gs` (tiene una 's' extra y extensión .gs)
- ✅ **Nombre correcto:** `appsscript.json` (sin 's' al final, sin .gs)

### ¿Por qué es importante?

En Google Apps Script:
- **`appsscript.json`** = Archivo de configuración/manifest (formato JSON)
- **`.gs`** = Extensión para archivos de código JavaScript/Google Apps Script

Al crear un archivo llamado `appscripts.json.gs`, el sistema lo trata como código JavaScript, no como JSON, causando el error de sintaxis.

---

## ✅ Solución en 3 Pasos

### Paso 1: Abre el Editor de Apps Script

1. Ve a tu Google Spreadsheet de la Quiniela
2. Menú: **Extensiones** → **Apps Script**

### Paso 2: Verifica los Archivos en el Panel Izquierdo

Busca si tienes alguno de estos archivos incorrectos:
- ❌ `appscripts.json.gs` (con 's' y .gs)
- ❌ `appscript.json.gs` (con .gs)
- ❌ `appsscripts.json` (con 's' extra)

### Paso 3: Corrige el Archivo

**Opción A: Si tienes un archivo con nombre incorrecto**

1. **Elimina el archivo incorrecto:**
   - Click derecho en el archivo incorrecto (ej: `appscripts.json.gs`)
   - Selecciona **"Eliminar"** o **"Remove"**

2. **Crea el archivo correcto:**
   - Click en el ícono **+** junto a "Archivos"
   - NO selecciones "Script" (eso crea .gs)
   - Busca la opción para crear archivo de tipo **"JSON"** o simplemente nómbralo `appsscript.json`
   - Si no ves opción JSON, créalo como texto plano asegurándote que el nombre sea exactamente: `appsscript.json`

3. **Copia el contenido correcto:**
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

**Opción B: Si ya tienes `appsscript.json` correcto**

Si ya tienes el archivo con el nombre correcto y sigue dando error:

1. Verifica que el contenido sea JSON válido (usa el código de arriba)
2. Asegúrate de que NO haya caracteres extraños antes de la primera llave `{`
3. Guarda el archivo (Ctrl+S o ⌘+S)

---

## 🔍 Cómo Crear el Archivo Correctamente en Apps Script

### Método Recomendado (Apps Script Editor)

Cuando estés en el Editor de Apps Script:

1. **Para crear el manifest:**
   - El archivo `appsscript.json` debería aparecer automáticamente
   - Si no existe, ve a **Ver** → **Mostrar archivo de manifiesto**
   - O en la vista moderna: Click en el ícono de configuración ⚙️

2. **Verificar el nombre:**
   - El archivo DEBE llamarse exactamente: `appsscript.json`
   - Sin extensión `.gs`
   - Sin 's' extra al final de "appsscript"

---

## ⚠️ Errores Comunes a Evitar

| Error | Incorrecto | Correcto |
|-------|------------|----------|
| Nombre con 's' extra | `appscripts.json` | `appsscript.json` |
| Extensión .gs | `appsscript.json.gs` | `appsscript.json` |
| Ambos errores | `appscripts.json.gs` | `appsscript.json` |
| Mayúsculas | `AppScript.json` | `appsscript.json` |

---

## ✅ Verificación Final

Después de corregir el archivo, verifica:

1. **Nombre del archivo:**
   - Debe aparecer como: `appsscript.json` (sin ícono de script .gs)
   - En el panel izquierdo del editor

2. **Contenido:**
   - Debe ser JSON válido (ver ejemplo arriba)
   - Comienza con `{` y termina con `}`
   - No tiene código JavaScript

3. **Sin errores:**
   - Guarda el archivo (Ctrl+S)
   - No debe mostrar errores de sintaxis
   - El editor puede mostrar el JSON con colores

---

## 🎨 Captura de Pantalla de Referencia

El archivo `appsscript.json` debe verse así en el editor:

```
📁 Archivos
  📄 Code.gs
  📄 Index.html
  📋 appsscript.json  ← Debe tener este nombre exacto
```

**NO debe verse así:**
```
📁 Archivos
  📄 Code.gs
  📄 Index.html
  📄 appscripts.json.gs  ← INCORRECTO (tiene .gs y 's' extra)
```

---

## 🆘 Si Aún Tienes Problemas

### Error persiste después de renombrar

1. **Cierra y vuelve a abrir el editor:**
   - Cierra la pestaña del Apps Script
   - Vuelve a abrir: Extensiones → Apps Script

2. **Refresca el proyecto:**
   - Presiona F5 para recargar
   - O cierra sesión y vuelve a entrar

3. **Verifica permisos:**
   - Asegúrate de tener permisos de edición en el proyecto

### No puedes crear el archivo con el nombre correcto

Si el editor te obliga a usar `.gs`:

1. Crea el archivo con cualquier nombre temporal
2. Luego intenta cambiar el tipo de archivo a "Manifest" en las propiedades
3. O contacta al administrador del proyecto

### El archivo no aparece en el panel

1. Ve al menú **Ver**
2. Selecciona **Mostrar archivo de manifiesto** (Show manifest file)
3. Esto debería crear o mostrar `appsscript.json`

---

## 📚 Recursos Adicionales

- [Documentación oficial de Google sobre appsscript.json](https://developers.google.com/apps-script/concepts/manifests)
- [Guía de permisos del proyecto](SOLUCION_PERMISOS_DOCUMENTAPP.md)
- [Guía rápida de configuración](GUIA_RAPIDA_PERMISOS.md)

---

## 🎯 Resumen Rápido

**El problema:** Archivo con nombre incorrecto `appscripts.json.gs`  
**La solución:** Renombrar/recrear como `appsscript.json`  
**Tiempo:** 2 minutos  
**Resultado:** Sin errores de sintaxis

---

## 📝 Checklist de Verificación

- [ ] El archivo se llama exactamente `appsscript.json` (sin 's' extra)
- [ ] El archivo NO tiene extensión `.gs`
- [ ] El contenido es JSON válido (puedes copiar el código de arriba)
- [ ] Has guardado el archivo (Ctrl+S)
- [ ] No hay errores de sintaxis mostrados en el editor
- [ ] Puedes ejecutar funciones sin errores

Si todos los puntos están marcados, ¡el problema está resuelto! 🎉

---

**Fecha de actualización:** 2026-02-01  
**Proyecto:** Quiniela Liga MX
