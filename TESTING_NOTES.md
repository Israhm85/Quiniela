# Testing Notes - Fix de Guardado de Pronósticos

## Problema Original
El formulario de 'Guardar pronósticos' muestra el error 'entry1: no hay picks para guardar' aunque ya se eligieron todos los picks.

## Causa Raíz Identificada
1. **Mismatch en API**: Frontend enviaba picks en 2 llamadas separadas con parámetros `{entry, picks}`, pero backend esperaba una sola llamada con `{picks1, picks2}`
2. **Sin validación frontend**: No se verificaba que hubiera picks válidos antes de llamar la API
3. **SESSION.partidos vacío**: Si la carga de partidos falla en bootstrap, los inputs no se generan correctamente

## Cambios Implementados

### Frontend (Index.html)
1. **Validación de SESSION.partidos en bootstrap** (líneas ~430-437):
   - Verifica que SESSION.partidos no esté vacío después del bootstrap
   - Muestra error claro si no se cargaron partidos
   - Agrega logs de consola para debugging

2. **Validación pre-submit en submitAll()** (líneas ~581-588):
   - Verifica que SESSION.partidos no esté vacío antes de procesar
   - Valida que hay al menos un pick con selección válida (L/E/V)
   - No llama la API si no hay picks válidos
   - Muestra mensajes de error claros y específicos

3. **Corrección de llamada API** (líneas ~612-631):
   - Cambió de 2 llamadas separadas a 1 sola llamada
   - Envía `{picks1, picks2}` en lugar de `{entry, picks}`
   - Maneja errores de conexión con failureHandler

### Backend (Code.gs)
1. **Soporte para ambos formatos** (líneas ~707-719):
   - Acepta nuevo formato: `{picks1, picks2}`
   - Mantiene compatibilidad con formato legacy: `{entry, picks}`
   - Convierte automáticamente entre formatos

2. **Validación mejorada** (líneas ~721-728):
   - Verifica que hay picks con selecciones válidas (no solo arrays vacíos)
   - Mensaje de error más descriptivo
   - Revisa contenido real de los picks, no solo longitud del array

## Escenarios de Prueba

### Escenario 1: Usuario nuevo sin picks
- **Setup**: Cargar página, seleccionar jornada activa
- **Acción**: Click en "Guardar pronósticos" sin seleccionar nada
- **Resultado Esperado**: Error "No hay picks para guardar. Selecciona al menos un resultado..."
- **Validación**: No debe llamar API, mensaje debe ser claro

### Escenario 2: Solo Entry 1 con picks
- **Setup**: Seleccionar picks solo en Entry 1
- **Acción**: Click en "Guardar pronósticos"
- **Resultado Esperado**: Guardado exitoso, "Entry 1 (X picks) · Entry 2 (0 picks)"
- **Validación**: Solo Entry 1 debe guardarse

### Escenario 3: Solo Entry 2 con picks
- **Setup**: Seleccionar picks solo en Entry 2
- **Acción**: Click en "Guardar pronósticos"
- **Resultado Esperado**: Guardado exitoso, "Entry 1 (0 picks) · Entry 2 (X picks)"
- **Validación**: Solo Entry 2 debe guardarse

### Escenario 4: Ambos entries con picks
- **Setup**: Seleccionar picks en Entry 1 y Entry 2
- **Acción**: Click en "Guardar pronósticos"
- **Resultado Esperado**: Guardado exitoso, "Entry 1 (X picks) · Entry 2 (Y picks)"
- **Validación**: Ambos entries deben guardarse correctamente

### Escenario 5: SESSION.partidos vacío
- **Setup**: Simular falla en bootstrap (partidos no cargados)
- **Acción**: Intentar guardar
- **Resultado Esperado**: Error "No hay partidos cargados. Intenta recargar la página."
- **Validación**: No debe llamar API, debe mostrar error en consola

### Escenario 6: Partidos bloqueados por tiempo/marcador
- **Setup**: Partido con marcador o pasado el tiempo de lock
- **Acción**: Intentar guardar picks de ese partido
- **Resultado Esperado**: Pick no se guarda, mensaje "Bloqueados por lock: X"
- **Validación**: Otros picks sí deben guardarse

## Pasos para Testing Manual

1. **Abrir Google Apps Script**:
   - Ir al proyecto en Google Sheets
   - Abrir "Extensiones > Apps Script"
   - Verificar que Code.gs tiene los cambios

2. **Desplegar Web App**:
   - En Apps Script: "Implementar > Probar implementaciones"
   - Copiar URL de prueba

3. **Probar cada escenario**:
   - Abrir la URL en navegador
   - Abrir DevTools (F12) para ver logs de consola
   - Ejecutar cada escenario listado arriba
   - Verificar mensajes y comportamiento

4. **Verificar en Sheets**:
   - Revisar hoja "PRONOSTICOS" después de guardar
   - Confirmar que los picks se guardaron correctamente
   - Verificar que ENTRY column tiene valores 1 o 2

## Logs de Consola Esperados

### Bootstrap Exitoso
```
Bootstrap data: {ok: true, jornada: 1, partidos: [...]}
Partidos loaded: 9
✅ SESSION.partidos cargado correctamente con 9 partidos
```

### Bootstrap con Error
```
Bootstrap data: {ok: true, jornada: 1, partidos: []}
Partidos loaded: 0
⛔ ERROR: SESSION.partidos está vacío después del bootstrap
```

### Guardado Sin Picks
```
SESSION.partidos está vacío: []
// O
No se encontraron picks válidos. Entry 1: 0 Entry 2: 0
```

### Guardado Exitoso
```
(No logs de error, mensaje de éxito en UI)
```

## Regresiones a Monitorear

1. **Formato legacy**: Verificar que código antiguo que aún use formato `{entry, picks}` siga funcionando
2. **Décimo partido**: Confirmar que el décimo partido opcional se guarda correctamente
3. **Edición de picks**: Verificar que actualizar picks existentes funciona
4. **Locks**: Confirmar que partidos bloqueados no se sobrescriben

## Notas Adicionales

- El cambio es **backward compatible** gracias al soporte de formato legacy en backend
- Todos los comentarios están en español para consistencia con el código existente
- Mensajes de error son específicos y ayudan al usuario a entender qué hacer
- Validaciones previenen llamadas innecesarias a la API
