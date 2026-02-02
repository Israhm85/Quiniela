# 🚨 ACTÚA AHORA: Solución al Error de Permisos

## ❌ Tienes Este Error

```
⛔ Error al generar PDF: Exception: No cuentas con el permiso para llamar a DocumentApp.create
```

## ✅ HAZ ESTO AHORA (En 5 Minutos)

### 🎯 Acción Inmediata

**El error significa que NO completaste la autorización. Sigue EXACTAMENTE estos pasos AHORA:**

---

### 📍 PASO 1: Revoca Permisos Anteriores (1 minuto)

**Por qué:** Para empezar limpio y evitar conflictos.

1. **Abre:** https://myaccount.google.com/permissions
2. **Busca:** Tu proyecto "Quiniela" o el nombre de tu spreadsheet
3. **Click en el proyecto** (si aparece)
4. **Click en "Quitar acceso"** o "Remove access"
5. **Confirma**

Si NO aparece ningún proyecto, está bien. Continúa al siguiente paso.

---

### 📍 PASO 2: Ve al Editor de Apps Script (30 segundos)

1. **Abre tu Google Spreadsheet** de la Quiniela
2. **Menú:** Extensiones → Apps Script
3. **Espera** a que cargue el editor

---

### 📍 PASO 3: Verifica appsscript.json (1 minuto)

1. **En el panel izquierdo,** busca el archivo `appsscript.json`
   - Si NO existe: Menú **Ver** → **Mostrar archivo de manifiesto**
   
2. **Haz click en el archivo** para abrirlo

3. **Verifica que tenga EXACTAMENTE esto:**
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

4. **Si NO tiene ese contenido:**
   - Selecciona TODO el contenido actual (Ctrl+A)
   - Bórralo
   - Copia y pega el contenido de arriba
   - **Guarda:** Ctrl+S (⌘+S en Mac)

---

### 📍 PASO 4: Ejecuta la Función (30 segundos)

**ESTE ES EL PASO MÁS IMPORTANTE:**

1. **En el editor,** busca el dropdown de funciones
   - Está arriba, al centro
   - Dice algo como "Seleccionar función"

2. **Click en el dropdown**

3. **Selecciona:** `onOpen`
   - Si no aparece, selecciona cualquier función del proyecto

4. **Presiona el botón ▶️ (Ejecutar)**
   - Es el botón de "play"
   - Está a la derecha del dropdown
   - **¡DEBES hacer click en este botón!**

5. **Espera** a que aparezca un diálogo

---

### 📍 PASO 5: Autoriza (2 minutos)

**Aparecerá un diálogo. Sigue TODOS estos sub-pasos:**

1. ✅ **Click en "Revisar permisos"**

2. ✅ **Selecciona tu cuenta de Google**
   - La misma cuenta del Spreadsheet

3. ✅ **Verás: "Esta app no está verificada"**
   - NO cierres el diálogo
   - Es normal, no te preocupes

4. ✅ **Click en "Configuración avanzada"**
   - Link en texto pequeño azul

5. ✅ **Click en "Ir a [nombre proyecto] (no seguro)"**
   - Aparece después del paso anterior

6. ✅ **Verás lista de permisos:**
   - ☑️ Ver y administrar hojas de cálculo
   - ☑️ Ver y administrar documentos ← IMPORTANTE
   - ☑️ Ver y administrar archivos de Drive ← IMPORTANTE
   - ☑️ Conectarse a servicios externos
   - ☑️ Ver tu dirección de correo

7. ✅ **Click en "Permitir"**
   - Botón azul al final

8. ✅ **Espera a que el diálogo se cierre solo**

---

### 📍 PASO 6: Recarga el Spreadsheet (30 segundos)

1. **Cierra** la pestaña/ventana del Editor de Apps Script

2. **Ve** a la pestaña de tu Google Spreadsheet

3. **Recarga la página:**
   - Presiona **F5**
   - O Ctrl+R (⌘+R en Mac)
   - O el botón de recargar del navegador

4. **Espera 5-10 segundos**
   - El menú "Quiniela" debe aparecer arriba

---

### 📍 PASO 7: Prueba (30 segundos)

1. **En el Spreadsheet:**
   - Menú: **Quiniela** → **📄 Generar PDF de jornada**

2. **Ingresa número de jornada**

3. **Resultado:**
   - ✅ **Si funciona:** Verás "PDF generado exitosamente"
   - ❌ **Si aún da error:** Lee la sección de abajo

---

## 🚫 Si TODAVÍA Da Error

Si seguiste TODOS los pasos de arriba y AÚN tienes el error:

### Opción 1: Checklist Interactivo
👉 Abre: **[CHECKLIST_AUTORIZACION.html](CHECKLIST_AUTORIZACION.html)** en tu navegador

- Marca cada paso que completaste
- Te dirá qué paso falta

### Opción 2: Guía Detallada
👉 Abre: **[AYUDA_ERROR_PERSISTE.md](AYUDA_ERROR_PERSISTE.md)**

- Troubleshooting completo
- 6 problemas comunes con soluciones

### Opción 3: Método Alternativo

**Intenta en modo incógnito:**

1. Abre Chrome/Firefox en **modo incógnito**
2. Inicia sesión con tu cuenta de Google
3. Abre el Spreadsheet
4. Repite TODOS los pasos de arriba
5. A veces funciona mejor en modo incógnito

---

## ❓ Preguntas Frecuentes

### "No vi ningún diálogo de autorización"

**Problema:** No ejecutaste la función correctamente.

**Solución:**
- En el Editor de Apps Script
- Selecciona función `onOpen` en el dropdown
- **Presiona el botón ▶️**
- Si no aparece diálogo, verifica bloqueadores de popup

### "Cerré el diálogo sin querer"

**Solución:**
- Vuelve a ejecutar la función (▶️)
- Completa TODO el proceso esta vez

### "No veo la opción 'Configuración avanzada'"

**Problema:** Puede que el navegador o la configuración no la muestre.

**Solución:**
- Intenta en otro navegador (Chrome, Firefox)
- Intenta en modo incógnito
- Desactiva extensiones del navegador

### "Hice todo pero sigue dando error"

**Posibles causas:**
1. No completaste algún paso (usa el checklist interactivo)
2. No recargaste el Spreadsheet después de autorizar
3. Estás usando una cuenta diferente
4. El navegador está bloqueando algo

**Solución:**
- Revoca permisos en https://myaccount.google.com/permissions
- Repite TODOS los pasos de nuevo
- Prueba en modo incógnito
- Prueba otro navegador

---

## 📊 Tiempo Estimado

| Paso | Tiempo |
|------|--------|
| 1. Revocar permisos | 1 min |
| 2. Abrir editor | 30 seg |
| 3. Verificar archivo | 1 min |
| 4. Ejecutar función | 30 seg |
| 5. Autorizar | 2 min |
| 6. Recargar | 30 seg |
| 7. Probar | 30 seg |
| **TOTAL** | **~5-6 minutos** |

---

## ✅ Cuando Funcione

Sabrás que funcionó cuando:
- ✅ El PDF se genera sin error
- ✅ Aparece el enlace de descarga
- ✅ Todos los usuarios pueden generar PDFs

---

## 🆘 Última Opción

Si NADA funciona, recopila:
1. Capturas de pantalla de cada paso
2. El mensaje de error exacto
3. Qué navegador usas
4. Qué pasos completaste

Y busca ayuda adicional con esa información.

---

**📌 RECORDATORIO:** El 99% de los casos se resuelven siguiendo TODOS los pasos de arriba. El problema más común es no ejecutar la función (Paso 4) o no completar la autorización (Paso 5).

**¡Empieza AHORA con el Paso 1!** 🚀

---

**Fecha:** 2026-02-02  
**Proyecto:** Quiniela Liga MX  
**Tiempo:** 5-6 minutos
