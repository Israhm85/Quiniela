# 🚨 AYUDA: Aún Tengo el Error de Permisos

## ❌ Tu Situación Actual

Sigues viendo este error:
```
⛔ Error al generar PDF: Exception: No cuentas con el permiso para llamar a DocumentApp.create. 
Permisos necesarios: https://www.googleapis.com/auth/documents
```

**Esto significa que la autorización NO se ha completado correctamente.**

---

## ✅ Lista de Verificación (Marca lo que SÍ hiciste)

Antes de continuar, verifica qué pasos REALMENTE completaste:

- [ ] **Paso 1:** Abrí el Editor de Apps Script (Extensiones → Apps Script)
- [ ] **Paso 2:** Creé/actualicé el archivo `appsscript.json` con el contenido correcto
- [ ] **Paso 3:** Guardé el archivo `appsscript.json` (Ctrl+S)
- [ ] **Paso 4:** Ejecuté una función (como `onOpen`) presionando el botón ▶️
- [ ] **Paso 5:** Vi el diálogo de autorización de Google
- [ ] **Paso 6:** Hice click en "Revisar permisos"
- [ ] **Paso 7:** Hice click en "Configuración avanzada" cuando vi "Esta app no está verificada"
- [ ] **Paso 8:** Hice click en "Ir a [nombre del proyecto] (no seguro)"
- [ ] **Paso 9:** Hice click en "Permitir" para aceptar todos los permisos
- [ ] **Paso 10:** Cerré el editor y recargué el Spreadsheet

**Si NO marcaste TODOS los pasos de arriba, ese es el problema.** Continúa leyendo.

---

## 🎯 Solución Paso a Paso (CON VERIFICACIÓN)

### PASO 1: Verifica que `appsscript.json` Existe

1. **Abre el Editor:**
   - En tu Google Spreadsheet: **Extensiones** → **Apps Script**

2. **Busca el archivo en el panel izquierdo:**
   - Debe decir: `appsscript.json` (sin .gs al final)
   - Si no existe, créalo: **Ver** → **Mostrar archivo de manifiesto**

3. **Verifica el contenido:**
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

4. **Guarda:** Ctrl+S o ⌘+S

**✅ VERIFICACIÓN:** El archivo `appsscript.json` aparece en el panel izquierdo con ese contenido.

---

### PASO 2: Ejecuta una Función AHORA (Esto es CRÍTICO)

**La autorización NO sucede automáticamente. Debes ejecutar una función.**

1. **En el Editor de Apps Script:**
   - Busca el dropdown de funciones (arriba, al centro)
   - Selecciona: `onOpen` (o cualquier función del proyecto)

2. **Presiona el botón Ejecutar (▶️):**
   - Es el botón de "play" a la derecha del dropdown de funciones
   - **¡DEBES hacer click en este botón!**

3. **Espera a que aparezca el diálogo:**
   - Debería aparecer un popup que dice "Autorización necesaria"
   - Si NO aparece, es porque ya autorizaste o hay un problema

**✅ VERIFICACIÓN:** Apareció un diálogo pidiendo autorización.

---

### PASO 3: Autoriza (SIGUE CADA SUB-PASO)

**Si apareció el diálogo de autorización:**

1. **Click en "Revisar permisos"**
   - NO cierres el diálogo
   - NO hagas click en "Cancelar"

2. **Selecciona tu cuenta de Google**
   - La misma que usas para el Spreadsheet

3. **Verás: "Esta app no está verificada"**
   - **Esto es NORMAL**
   - NO te asustes
   - NO cierres la ventana

4. **Click en "Configuración avanzada"**
   - Está abajo del mensaje de advertencia
   - En texto pequeño y azul

5. **Click en "Ir a [Quiniela o nombre del proyecto] (no seguro)"**
   - Aparece después de hacer click en "Configuración avanzada"
   - Dice "(no seguro)" pero es seguro porque es TU proyecto

6. **Revisa los permisos listados:**
   - Ver y administrar hojas de cálculo
   - Ver y administrar documentos
   - Ver y administrar archivos de Drive
   - Conectarse a servicios externos
   - Ver tu dirección de correo

7. **Click en "Permitir"**
   - Botón azul
   - En la parte inferior

8. **Espera a que se cierre el diálogo**
   - NO cierres tú mismo
   - Debe cerrarse automáticamente

**✅ VERIFICACIÓN:** El diálogo se cerró y volviste al editor de Apps Script sin errores.

---

### PASO 4: Recarga el Spreadsheet

**IMPORTANTE: Debes recargar para que tome efecto.**

1. **Cierra el Editor de Apps Script**
   - Cierra la pestaña/ventana del editor

2. **Ve a tu Google Spreadsheet**
   - La pestaña con la Quiniela

3. **Recarga la página:**
   - Presiona F5
   - O Ctrl+R (⌘+R en Mac)
   - O el botón de recargar del navegador

4. **Espera unos segundos:**
   - El menú "Quiniela" debe aparecer en la barra superior
   - Puede tardar 5-10 segundos

**✅ VERIFICACIÓN:** El menú "Quiniela" aparece en la barra superior del Spreadsheet.

---

### PASO 5: Prueba Generar el PDF

1. **En el Spreadsheet:**
   - Menú: **Quiniela** → **📄 Generar PDF de jornada**
   - O desde la web app: Resultados → Descargar PDF

2. **Ingresa el número de jornada**
   - Usa una jornada que esté cerrada o una pasada

3. **Resultado esperado:**
   - ✅ "PDF generado exitosamente"
   - ❌ Si aún da error, continúa abajo

**✅ VERIFICACIÓN:** El PDF se genera sin el error de permisos.

---

## 🚫 Si TODAVÍA Tienes el Error

### Problema 1: No Ejecutaste la Función

**Síntoma:** Nunca viste el diálogo de autorización.

**Solución:**
1. Vuelve al Editor de Apps Script
2. Selecciona función `onOpen` en el dropdown
3. **Presiona el botón ▶️ (Ejecutar)**
4. Espera el diálogo de autorización
5. Sigue los pasos de autorización arriba

---

### Problema 2: Cerraste el Diálogo sin Autorizar

**Síntoma:** Viste el diálogo pero lo cerraste o hiciste click en "Cancelar".

**Solución:**
1. Vuelve al Editor de Apps Script
2. Ejecuta la función de nuevo (▶️)
3. Esta vez completa TODO el proceso de autorización
4. NO cierres hasta hacer click en "Permitir"

---

### Problema 3: No Aceptaste Todos los Permisos

**Síntoma:** Autorizaste pero no viste/aceptaste los permisos de "documentos" y "drive".

**Solución:**
1. **Revoca los permisos actuales:**
   - Ve a: https://myaccount.google.com/permissions
   - Busca el proyecto de tu Quiniela
   - Click en el proyecto
   - Click en "Quitar acceso"

2. **Vuelve a autorizar:**
   - Regresa al Editor de Apps Script
   - Ejecuta la función (▶️)
   - Sigue TODO el proceso de autorización
   - Asegúrate de ver y aceptar TODOS los permisos

---

### Problema 4: El archivo `appsscript.json` No Está Correcto

**Síntoma:** El archivo existe pero tiene errores.

**Solución:**
1. **Elimina el archivo actual:**
   - En el Editor de Apps Script
   - Click derecho en `appsscript.json`
   - Eliminar

2. **Crea uno nuevo:**
   - Ver → Mostrar archivo de manifiesto
   - Copia TODO el contenido del PASO 1 arriba
   - Pégalo completo
   - Guarda (Ctrl+S)

3. **Vuelve a autorizar:**
   - Ejecuta función (▶️)
   - Completa autorización

---

### Problema 5: Estás Usando una Cuenta Diferente

**Síntoma:** Autorizaste con una cuenta pero el Spreadsheet está en otra.

**Solución:**
1. **Verifica tu cuenta:**
   - ¿Con qué cuenta abriste el Spreadsheet?
   - ¿Con qué cuenta autorizaste en Apps Script?
   - Deben ser la MISMA

2. **Si son diferentes:**
   - Cierra sesión de todas las cuentas de Google
   - Vuelve a iniciar sesión solo con la cuenta del Spreadsheet
   - Repite el proceso de autorización

---

### Problema 6: El Navegador Está Bloqueando

**Síntoma:** No aparece el diálogo de autorización cuando ejecutas.

**Solución:**
1. **Verifica bloqueadores de popups:**
   - Desactiva bloqueadores de popup para Google
   - Permite popups en tu navegador

2. **Prueba en modo incógnito:**
   - Abre Chrome/Firefox en modo incógnito
   - Inicia sesión con tu cuenta
   - Repite el proceso

3. **Prueba otro navegador:**
   - Chrome, Firefox, Edge
   - A veces uno funciona mejor que otro

---

## 🆘 Último Recurso: Método Alternativo

Si NADA de lo anterior funciona, prueba este método:

### Método: Autorización Forzada

1. **En el Editor de Apps Script:**
   - Ve al menú: **Proyecto** → **Configuración del proyecto**

2. **Desactiva "Mostrar appsscript.json":**
   - Si está activado, desactívalo
   - Guarda

3. **Reactiva "Mostrar appsscript.json":**
   - Vuélvelo a activar
   - Esto fuerza a que se recargue el manifest

4. **Ejecuta la función:**
   - Vuelve al editor
   - Ejecuta `onOpen` (▶️)
   - Autoriza completamente

---

## 📞 Información para Soporte

Si TODAVÍA no funciona después de todo esto, necesitarás ayuda adicional. Recopila esta información:

1. **¿Qué pasos completaste?**
   - Lista los pasos 1-10 de arriba que SÍ hiciste

2. **¿Viste el diálogo de autorización?**
   - Sí/No

3. **¿Qué mensaje ves EXACTAMENTE al autorizar?**
   - Copia todo el texto del error

4. **¿En qué paso te quedaste?**
   - Identifica exactamente dónde no puedes continuar

5. **¿Qué navegador usas?**
   - Chrome, Firefox, Safari, Edge, otro

6. **Capturas de pantalla:**
   - Del panel de archivos en Apps Script (mostrando appsscript.json)
   - Del error al intentar generar PDF
   - Del diálogo de autorización (si aparece)

---

## 🎯 Resumen de Acciones

**Si sigues con el error, haz ESTO ahora:**

1. ✅ Ve a: https://myaccount.google.com/permissions
2. ✅ Revoca permisos del proyecto Quiniela (si existe)
3. ✅ Abre Editor de Apps Script
4. ✅ Verifica que `appsscript.json` existe con el contenido correcto
5. ✅ Ejecuta función `onOpen` presionando ▶️
6. ✅ Completa TODO el proceso de autorización (7 sub-pasos)
7. ✅ Recarga el Spreadsheet (F5)
8. ✅ Prueba generar PDF

**Tiempo total:** 5-10 minutos si sigues todos los pasos.

---

## ✅ Cuando Funcione

Sabrás que funcionó cuando:
- ✅ No aparece el error de permisos
- ✅ El PDF se genera correctamente
- ✅ Aparece el enlace para descargar el PDF
- ✅ Todos los usuarios pueden generar PDFs

**Si después de seguir TODOS estos pasos aún tienes el error, el problema puede ser con los permisos de tu cuenta de Google o configuración del proyecto. En ese caso, contacta a soporte con la información de arriba.**

---

**Fecha:** 2026-02-02  
**Proyecto:** Quiniela Liga MX  
**Error:** Permission denied for DocumentApp.create
