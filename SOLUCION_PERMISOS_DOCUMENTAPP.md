# Solución: Error de Permisos de DocumentApp

## Problema

Al intentar generar un PDF, aparece este error:

```
Error al generar PDF: Exception: No cuentas con el permiso para llamar a DocumentApp.create. 
Permisos necesarios: https://www.googleapis.com/auth/documents. 
Para obtener más información, consulta https://developers.google.com/apps-script/guides/support/troubleshooting#authorization-is
```

## Causa

Google Apps Script requiere que declares explícitamente los permisos (OAuth scopes) que tu script necesita para acceder a ciertos servicios como DocumentApp y DriveApp.

Este proyecto ahora incluye un archivo `appsscript.json` que declara todos los permisos necesarios.

## Solución: Re-autorizar el Script

Después de agregar el archivo `appsscript.json`, necesitas **re-autorizar el script** para que Google Apps Script conceda los nuevos permisos.

### Pasos para Re-autorizar

#### Opción 1: Desde el Editor de Google Apps Script

1. **Abre el Editor de Apps Script:**
   - Ve a tu Google Spreadsheet de la Quiniela
   - Menú: **Extensiones** → **Apps Script**

2. **Actualiza el Manifest:**
   - En el editor, verás tus archivos (Code.gs, Index.html, etc.)
   - Busca o crea el archivo `appsscript.json` en el panel izquierdo
   - Si no existe, créalo:
     - Click en el ícono **+** junto a "Archivos"
     - Selecciona **Script** o **JSON**
     - Nómbralo `appsscript.json`
   - Copia y pega el contenido del archivo `appsscript.json` de este repositorio

3. **Guarda los Cambios:**
   - Click en el ícono de **guardar** (💾) o Ctrl+S

4. **Ejecuta una Función para Forzar la Autorización:**
   - En el editor, selecciona cualquier función del dropdown (ej: `onOpen`)
   - Click en **Ejecutar** (▶️)
   - Aparecerá un diálogo pidiendo autorización

5. **Autoriza el Script:**
   - Click en **Revisar permisos**
   - Selecciona tu cuenta de Google
   - Verás una advertencia: **"Esta app no está verificada"**
     - Esto es normal para scripts personales
     - Click en **Configuración avanzada**
     - Click en **Ir a [Nombre del Proyecto] (no seguro)**
   - Revisa los permisos solicitados:
     - Ver y administrar hojas de cálculo
     - Ver y administrar documentos
     - Ver y administrar archivos de Drive
     - Conectarse a servicios externos
     - Ver tu dirección de correo
   - Click en **Permitir**

6. **Recarga el Spreadsheet:**
   - Cierra el editor de Apps Script
   - Recarga tu Google Spreadsheet
   - El menú "Quiniela" debería aparecer (puede tardar unos segundos)

#### Opción 2: Desde el Menú de la Quiniela

1. **Abre tu Google Spreadsheet** de la Quiniela

2. **Actualiza el archivo appsscript.json** (siguiendo los pasos anteriores)

3. **Usa el Menú Quiniela:**
   - Espera a que cargue el menú "Quiniela"
   - Selecciona cualquier opción del menú (ej: "📄 Generar PDF de jornada")
   - Si no tienes permisos, aparecerá el diálogo de autorización

4. **Sigue los pasos de autorización** (pasos 5 del método anterior)

### Verificación

Una vez autorizado, prueba generar un PDF:

1. **Desde el Menú de Sheets:**
   - Menú **Quiniela** → **📄 Generar PDF de jornada**
   - Ingresa el número de jornada
   - El PDF debería generarse sin errores

2. **Desde la Web App:**
   - Accede a la aplicación web
   - Ve a **Resultados**
   - Click en **"📄 Descargar PDF de jornada"**
   - El PDF debería generarse y aparecer el enlace

## Permisos Requeridos

El archivo `appsscript.json` declara los siguientes permisos:

### 1. Spreadsheets
```
https://www.googleapis.com/auth/spreadsheets
```
**Uso:** Leer y escribir datos en Google Sheets  
**Funciones:** Todas las operaciones básicas de la quiniela

### 2. Documents
```
https://www.googleapis.com/auth/documents
```
**Uso:** Crear y editar Google Docs (para generar PDFs)  
**Funciones:** `DocumentApp.create()`, `generarPDFJornadaInterno_()`

### 3. Drive
```
https://www.googleapis.com/auth/drive
```
**Uso:** Acceder y crear archivos en Google Drive  
**Funciones:** `DriveApp.createFile()`, almacenar PDFs

### 4. External Requests
```
https://www.googleapis.com/auth/script.external_request
```
**Uso:** Hacer peticiones HTTP a servicios externos  
**Funciones:** `UrlFetchApp.fetch()`, sincronizar marcadores desde ESPN

### 5. User Email
```
https://www.googleapis.com/auth/userinfo.email
```
**Uso:** Identificar al usuario para validar administradores  
**Funciones:** `Session.getActiveUser().getEmail()`

## Contenido del archivo appsscript.json

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

## Configuración Adicional

### Zona Horaria
- **Establecida:** `America/Mexico_City`
- Esto asegura que las fechas y timestamps se manejen correctamente

### Runtime
- **Versión:** V8
- Motor JavaScript moderno con mejor rendimiento

### WebApp
- **executeAs:** `USER_DEPLOYING` - El script se ejecuta con los permisos del administrador
- **access:** `ANYONE` - Cualquiera con el enlace puede acceder

## Preguntas Frecuentes

### ¿Por qué necesito re-autorizar?

Cuando agregas nuevos permisos (como DocumentApp), Google requiere que vuelvas a autorizar el script para confirmar que estás de acuerdo con los nuevos permisos.

### ¿Es seguro dar estos permisos?

Sí, estos permisos son necesarios para el funcionamiento del script. Estás autorizando TU PROPIO script, no una aplicación de terceros.

### ¿Debo hacer esto cada vez?

No. Solo necesitas re-autorizar cuando:
- Se agregan nuevos permisos al script
- Cambias de cuenta de Google
- Revoques manualmente los permisos

### ¿Qué pasa si no autorizo?

Sin los permisos necesarios:
- ❌ No podrás generar PDFs
- ❌ No podrás acceder a Google Drive
- ❌ No funcionará la sincronización de marcadores
- ✅ Las funciones básicas de Sheets seguirán funcionando

### ¿Puedo revocar los permisos?

Sí, en cualquier momento puedes revocar los permisos:
1. Ve a https://myaccount.google.com/permissions
2. Busca el proyecto de tu Quiniela
3. Click en **Quitar acceso**

### ¿Aparece "Esta app no está verificada"?

Esto es normal para scripts personales de Apps Script. Google muestra esta advertencia para apps que no han pasado por el proceso de verificación de Google (que solo es necesario para apps públicas).

**Es seguro continuar** si es tu propio script.

## Problemas Comunes

### Error: "Authorization is required to perform that action"

**Solución:** Sigue los pasos de re-autorización arriba.

### Error: "Access not granted or expired"

**Solución:** 
1. Ve a https://myaccount.google.com/permissions
2. Revoca los permisos del script
3. Vuelve a autorizar siguiendo los pasos arriba

### El menú "Quiniela" no aparece

**Solución:**
1. Recarga la página del Spreadsheet
2. Espera 5-10 segundos
3. Si no aparece, abre el editor de Apps Script y ejecuta `onOpen()` manualmente

### Error: "Invalid OAuth scope in appsscript.json"

**Solución:**
1. Verifica que el contenido de `appsscript.json` sea exactamente como se muestra arriba
2. Asegúrate de que no haya errores de sintaxis JSON
3. Guarda y vuelve a autorizar

## Soporte

Si después de seguir estos pasos aún tienes problemas:

1. **Verifica los logs de Apps Script:**
   - Editor de Apps Script → Ver → **Registros**
   - Busca mensajes de error específicos

2. **Revisa la consola de JavaScript:**
   - En el Spreadsheet: F12 → Consola
   - Busca errores en rojo

3. **Contacta al administrador** del spreadsheet con:
   - El mensaje de error completo
   - Los pasos que seguiste
   - Capturas de pantalla si es posible

## Referencias

- [Google Apps Script Scopes](https://developers.google.com/apps-script/guides/services/authorization)
- [OAuth Scopes Documentation](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Apps Script Manifest](https://developers.google.com/apps-script/concepts/manifests)
- [Troubleshooting Authorization](https://developers.google.com/apps-script/guides/support/troubleshooting#authorization-is)
