# Generación de PDF de Jornada

## ⚠️ IMPORTANTE: Autorización Requerida

**Si obtienes un error de permisos** al generar PDFs, consulta la guía:  
📖 **[Solución: Error de Permisos DocumentApp](SOLUCION_PERMISOS_DOCUMENTAPP.md)**

Este error ocurre porque Google Apps Script necesita permisos explícitos para crear documentos y archivos. La guía te explica cómo re-autorizar el script (es un proceso de 5 minutos).

## Descripción

Función que genera automáticamente un archivo PDF con todos los participantes y sus selecciones ("picks") para una jornada específica. Esta funcionalidad facilita la creación de reportes claros y organizados para las jornadas completadas.

## Características

✅ **Verificación de estado**: Verifica si la jornada está cerrada (solo para jornada actual)  
✅ **Incluye todos los partidos**: Partidos de Liga MX + décimo partido opcional  
✅ **Información completa**: Muestra picks, marcadores pronosticados y puntos obtenidos  
✅ **Ordenamiento inteligente**: Participantes ordenados por puntos totales  
✅ **Indicador de pago**: Muestra ✓ para jugadores que pagaron, ⚠ para los que no  
✅ **Múltiples entries**: Soporta sistema 2x1 (Entry 1 y Entry 2)  
✅ **Formato profesional**: Tablas bien organizadas y fáciles de leer  
✅ **Almacenamiento automático**: PDF guardado en Google Drive  

## Cómo Usar

### Desde el Menú de Google Sheets

1. Abre el archivo de Google Sheets de la Quiniela
2. Ve al menú **Quiniela** en la barra superior
3. Selecciona **📄 Generar PDF de jornada**
4. Ingresa el número de jornada que deseas generar
5. Confirma la generación (si la jornada no está cerrada, se pedirá confirmación)
6. El sistema generará el PDF y mostrará un enlace de acceso

### Desde la Aplicación Web (NUEVO)

1. Accede a la aplicación web de la Quiniela
2. Entra con tu nombre (si aún no lo has hecho)
3. Click en **"📊 Ver tabla / transparencia"**
4. Click en **"📄 Descargar PDF de jornada"**
5. Espera unos segundos mientras se genera
6. Click en el enlace **"📥 Abrir PDF en nueva pestaña"**
7. El PDF se abrirá en Google Drive donde puedes descargarlo o imprimirlo

**Nota:** La opción de PDF desde la web app está disponible para todos los participantes, no solo para administradores. Solo se permite generar PDFs de jornadas cerradas (o jornadas pasadas).

**Ver más:** [Documentación completa de acceso desde web app](ACCESO_PDF_WEBAPP.md)

### Desde Código (API)

```javascript
// Generar PDF para una jornada específica
const pdfUrl = generarPDFJornadaInterno_(1);  // Jornada 1
Logger.log("PDF generado: " + pdfUrl);
```

## Contenido del PDF

### 1. Encabezado
- Título: "QUINIELA LIGA MX - JORNADA X"
- Fecha y hora de generación

### 2. Tabla de Partidos
Muestra todos los partidos de la jornada con:
- Número de partido
- Equipo local
- Equipo visitante
- Marcador (si está disponible)
- Resultado (L/E/V)

### 3. Pronósticos por Participante
Para cada participante, muestra:
- Nombre del participante
- Indicador de pago (✓ o ⚠)
- Entry (si tiene más de uno)
- Puntos totales obtenidos
- Tabla detallada con:
  - Equipos del partido
  - Pick seleccionado (L/E/V)
  - Marcador pronosticado
  - Puntos obtenidos (resaltado en verde si ganó puntos)

## Validaciones y Manejo de Errores

### Validaciones Implementadas

1. **Jornada válida**: Verifica que el número de jornada sea válido (> 0)
2. **Datos existentes**: Verifica que existan partidos para la jornada
3. **Jornada cerrada**: Para la jornada actual, advierte si no está cerrada
4. **Datos incompletos**: Maneja correctamente datos faltantes o incompletos

### Casos de Error Manejados

- **Sin partidos**: Si no hay partidos para la jornada, muestra error descriptivo
- **Sin pronósticos**: Si no hay pronósticos, muestra mensaje apropiado en el PDF
- **Jornada inválida**: Rechaza números de jornada inválidos
- **Errores de generación**: Captura y muestra errores con mensajes claros

## Estructura de Datos

### PARTIDOS (Sheet)
```
JORNADA | FECHA | LOCAL | VISITANTE | MARCADOR | RES
   1    | ...   | Cruz  | América   |   2-1    | L
```

### PRONOSTICOS (Sheet)
```
JORNADA | ID | NOMBRE | ENTRY | LOCAL | VISITANTE | PICK | PICK_MARCADOR | PUNTOS | TIMESTAMP
   1    | 5  | Juan   |   1   | Cruz  | América   |  L   |     2-1       |   1    | ...
```

### JUGADORES (Sheet)
```
ID | NOMBRE | TOKEN | ACTIVO | PAGADO | FECHA_REG
5  | Juan   | abc123|   SI   |   SI   | ...
```

## Ejemplo de Uso

### Escenario: Jornada Completada

```
Jornada 1 - 9 partidos de Liga MX + 1 de La Liga
- 12 participantes (8 con Entry 1, 4 con Entry 1 y 2)
- Todos los partidos con marcador capturado
- Jornada marcada como cerrada
```

**Resultado**: PDF con tabla de 10 partidos y 12 secciones de pronósticos, ordenados por puntos totales de mayor a menor.

## Consideraciones Técnicas

### Rendimiento
- Tiempo de generación: 5-15 segundos dependiendo del número de participantes
- Límite de participantes: Sin límite práctico (probado con 50+ participantes)
- Tamaño del PDF: ~50-200 KB dependiendo de la cantidad de datos

### Compatibilidad
- ✅ Google Apps Script
- ✅ Google Drive (almacenamiento)
- ✅ Google Docs (generación intermedia)
- ✅ Formato PDF (exportación final)

### Permisos Requeridos

**Importante:** Esta funcionalidad requiere permisos específicos de Google Apps Script.

Si obtienes un error como:
```
Error al generar PDF: Exception: No cuentas con el permiso para llamar a DocumentApp.create
```

**Solución:** Consulta la [Guía de Autorización](SOLUCION_PERMISOS_DOCUMENTAPP.md) para re-autorizar el script.

**Permisos necesarios:**
- ✅ Acceso a Google Sheets (lectura) - `spreadsheets` scope
- ✅ Acceso a Google Drive (escritura) - `drive` scope  
- ✅ Acceso a Google Docs (creación/eliminación) - `documents` scope

El proyecto incluye un archivo `appsscript.json` que declara todos estos permisos automáticamente.

## Funciones Relacionadas

### Función Principal
- `generarPDFJornada()`: Función del menú UI que solicita jornada y genera PDF

### Funciones Internas
- `generarPDFJornadaInterno_(jornada)`: Genera el PDF para una jornada específica
- `getDecimoPartidoPorJornada_(jornada)`: Obtiene información del décimo partido

### Funciones Auxiliares Usadas
- `getConfig_(key)`: Lee configuración
- `isJornadaCerrada_()`: Verifica si jornada está cerrada
- `normalizeTeam_(name)`: Normaliza nombres de equipos

## Mejoras Futuras Sugeridas

1. **Filtrado avanzado**: Opción de generar PDF solo para jugadores que pagaron
2. **Estadísticas**: Agregar sección con estadísticas de la jornada (promedio de puntos, mejor pick, etc.)
3. **Diseño personalizable**: Permitir personalizar colores y formato
4. **Envío automático**: Integración con email para envío automático del PDF
5. **Historial**: Mantener registro de PDFs generados
6. **Comparación**: Generar PDF comparativo entre múltiples jornadas

## Solución de Problemas

### ❌ "No cuentas con el permiso para llamar a DocumentApp.create"

**Error completo:**
```
Error al generar PDF: Exception: No cuentas con el permiso para llamar a DocumentApp.create. 
Permisos necesarios: https://www.googleapis.com/auth/documents
```

**Causa**: El script no tiene los permisos OAuth necesarios para crear documentos  
**Solución**: 📖 **[Sigue esta guía completa](SOLUCION_PERMISOS_DOCUMENTAPP.md)** para re-autorizar el script

**Resumen rápido:**
1. Asegúrate de que existe el archivo `appsscript.json` en tu proyecto
2. Abre el Editor de Apps Script (Extensiones → Apps Script)
3. Ejecuta cualquier función para forzar la autorización
4. Acepta los permisos cuando se soliciten
5. Recarga el Spreadsheet

### "No hay partidos para la jornada X"
**Causa**: La jornada no tiene partidos registrados en la hoja PARTIDOS  
**Solución**: Verificar que los partidos estén correctamente importados/registrados

### "Error al generar PDF" (genérico)
**Causa**: Permisos insuficientes o error en Google Drive  
**Solución**: Verificar permisos de la aplicación y espacio en Drive

### PDF vacío o incompleto
**Causa**: Datos faltantes en hojas PRONOSTICOS o JUGADORES  
**Solución**: Ejecutar "Generar pronósticos" para la jornada antes de crear el PDF

## Código de Ejemplo

### Generar PDF al Cerrar Jornada (Automático)

```javascript
function cerrarJornadaActual() {
  setConfig_("JornadaCerrada", "SI");
  setConfig_("Cierre_Jornada", new Date());
  
  // Generar PDF automáticamente
  const jornada = Number(getConfig_("JornadaActual")) || 1;
  try {
    const pdfUrl = generarPDFJornadaInterno_(jornada);
    Logger.log("PDF generado automáticamente: " + pdfUrl);
  } catch (e) {
    Logger.log("Error generando PDF: " + e.toString());
  }
  
  SpreadsheetApp.getActiveSpreadsheet().toast("🔒 Jornada cerrada. PDF generado.", "Quiniela", 6);
}
```

## Notas de Implementación

1. El PDF se genera como un documento temporal de Google Docs que luego se convierte a PDF
2. El documento temporal se elimina automáticamente después de la conversión
3. Los picks ganadores se resaltan en verde para fácil identificación
4. El header de las tablas usa colores para mejor legibilidad
5. Los participantes sin picks aparecen en la lista pero sin tabla de picks

## Seguridad y Privacidad

- ✅ No expone tokens de sesión
- ✅ Solo muestra datos de la jornada solicitada
- ✅ El PDF se guarda en el Drive del usuario que ejecuta la función
- ✅ No se comparte automáticamente con nadie

## Licencia y Créditos

Parte del sistema **Quiniela Liga MX - Sistema Pro**  
Implementado usando Google Apps Script API  
Compatible con todas las funcionalidades existentes del sistema
