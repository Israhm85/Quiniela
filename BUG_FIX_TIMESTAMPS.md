# Bug Fix: Timestamps en Campos de Marcador

## 🐛 Reporte del Usuario (@Israhm85)

"me paso algo curioso en algunos inputs del marcador, creo que actualice la pagina y se me puso un horario con formato largo terminando con horario pacifico"

### Síntomas
- Campos de marcador mostrando timestamps largos
- Formato: "Sun Jan 19 2026 12:00:00 GMT-0800 (Pacific Standard Time)"
- Apareció después de actualizar la página

## 🔍 Investigación

### Análisis del Problema

**Archivo: Code.gs - Líneas 687-694 (api_getMyPicks)**
```javascript
// ANTES (VULNERABLE):
let gl="", gv="";
const pm = String(r[7]||"").trim();  // Column PICK_MARCADOR
if (pm && pm.includes("-")) {
  const parts = pm.split("-");
  gl = parts[0]; gv = parts[1];
}
```

**Problema Identificado:**
1. La columna PICK_MARCADOR (índice 7) contenía timestamps en lugar de marcadores
2. Los timestamps en formato string incluyen "-" (ej: "GMT-0800")
3. El código hacía split("-") sin validar el formato
4. Resultado: `gl = "Sun Jan 19 2026 12:00:00 GMT"`, `gv = "0800 (Pacific..."`

### Causa Raíz

**Posibles causas de datos corruptos:**
1. **Confusión de columnas**: Código previo pudo haber escrito timestamp en columna incorrecta
2. **Error manual**: Usuario editó sheet y puso fecha en lugar de marcador
3. **Bug temporal**: Código anterior tuvo bug que fue corregido pero dejó datos sucios

**Estructura de columnas:**
```
0: JORNADA
1: ID
2: NOMBRE
3: ENTRY
4: LOCAL
5: VISITANTE
6: PICK
7: PICK_MARCADOR    ← Aquí se encontró el timestamp
8: PUNTOS
9: TIMESTAMP        ← Aquí DEBERÍA estar el timestamp
```

## ✅ Solución Implementada

### 1. Validación en Backend (Code.gs)

**Ubicación**: `api_getMyPicks()` - Líneas 687-697

```javascript
// DESPUÉS (PROTEGIDO):
let gl="", gv="";
const pm = String(r[7]||"").trim();
// Validar que el marcador tenga formato correcto (no timestamps u otros textos)
if (pm && pm.includes("-") && pm.length < 10) {  // Máximo "99-99" son 5 caracteres
  const parts = pm.split("-");
  // Solo aceptar si ambas partes son numéricas y cortas
  if(parts.length === 2 && parts[0].length <= 2 && parts[1].length <= 2 &&
     !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))){
    gl = parts[0]; gv = parts[1];
  }
}
```

**Validaciones agregadas:**
- ✅ Longitud total del string < 10 caracteres
- ✅ Exactamente 2 partes después de split("-")
- ✅ Cada parte tiene máximo 2 caracteres
- ✅ Ambas partes son valores numéricos

### 2. Validación en Frontend (Index.html)

**Ubicación**: `fillPicksInForm()` - Líneas 512-529

```javascript
// ANTES (SIN VALIDACIÓN):
if(marcEl && saved.gl != null && saved.gv != null && 
   String(saved.gl).trim() !== "" && String(saved.gv).trim() !== ""){
  marcEl.value = `${saved.gl}-${saved.gv}`;
}

// DESPUÉS (CON VALIDACIÓN):
if(marcEl && saved.gl != null && saved.gv != null){
  const glStr = String(saved.gl).trim();
  const gvStr = String(saved.gv).trim();
  
  // Verificar que son valores cortos (máximo 2 dígitos) y numéricos
  // Esto previene que timestamps u otros textos largos se muestren como marcador
  if(glStr !== "" && gvStr !== "" && 
     glStr.length <= 2 && gvStr.length <= 2 &&
     !isNaN(Number(glStr)) && !isNaN(Number(gvStr))){
    marcEl.value = `${glStr}-${gvStr}`;
  }
}
```

**Validaciones agregadas:**
- ✅ Máximo 2 caracteres por valor (gl y gv)
- ✅ Ambos valores son numéricos
- ✅ No se permite texto largo o timestamps

## 🧪 Testing

### Casos de Prueba

| Input en PICK_MARCADOR | Antes | Después |
|------------------------|-------|---------|
| "2-1" | ✅ Se muestra | ✅ Se muestra |
| "10-5" | ✅ Se muestra | ✅ Se muestra |
| "99-99" | ✅ Se muestra | ✅ Se muestra |
| "Sun Jan 19 2026 12:00:00 GMT-0800..." | ❌ Se muestra corrupto | ✅ Se ignora |
| "2026-01-19" | ❌ Se muestra "2026-01" | ✅ Se ignora |
| "abc-def" | ❌ Se muestra | ✅ Se ignora |
| "100-200" | ❌ Se muestra | ✅ Se ignora (>2 dígitos) |

### Validación de Comportamiento

**Escenario 1: Marcador válido normal**
```
Input: "2-1"
Backend: gl="2", gv="1" ✅
Frontend: Muestra "2-1" en input ✅
```

**Escenario 2: Timestamp en columna (bug original)**
```
Input: "Sun Jan 19 2026 12:00:00 GMT-0800 (Pacific Standard Time)"
Backend: 
  - pm.length = 58 (> 10) → Se ignora ✅
  - gl="", gv="" → No se parsea
Frontend: 
  - glStr = "", gvStr = "" → No se muestra ✅
  - Campo queda vacío en lugar de mostrar basura
```

**Escenario 3: Fecha en formato ISO**
```
Input: "2026-01-19"
Backend: 
  - pm.length = 10 (no < 10) → Se ignora ✅
  - gl="", gv=""
Frontend: Campo vacío ✅
```

**Escenario 4: Texto no numérico**
```
Input: "abc-def"
Backend: 
  - parts = ["abc", "def"]
  - isNaN(Number("abc")) = true → Se ignora ✅
  - gl="", gv=""
Frontend: Campo vacío ✅
```

## 📊 Impacto

### Beneficios

1. **Protección contra datos corruptos**: Sistema ahora inmune a timestamps en columna incorrecta
2. **Experiencia de usuario**: Usuarios no ven más textos extraños en campos de marcador
3. **Validación robusta**: Doble capa de protección (backend + frontend)
4. **Backward compatible**: Marcadores válidos existentes siguen funcionando
5. **Prevención futura**: Nuevos bugs de corrupción de datos serán filtrados

### Limitaciones Conocidas

1. **Datos históricos**: Timestamps antiguos en el sheet permanecen, pero son ignorados
2. **Marcadores de 3 dígitos**: "100-200" no permitido (límite: 99-99)
3. **Formato especial**: Solo acepta formato "N-N" donde N es 1-2 dígitos

### Recomendaciones

**Para el administrador:**
1. Revisar hoja PRONÓSTICOS columna PICK_MARCADOR
2. Buscar celdas con timestamps largos
3. Limpiar manualmente si es necesario (opcional, el sistema los ignora)
4. Verificar que columna TIMESTAMP (índice 9) tiene las fechas correctas

**Para debugging futuro:**
```javascript
// Query SQL para encontrar marcadores corruptos:
SELECT * FROM PRONOSTICOS 
WHERE LENGTH(PICK_MARCADOR) > 10 
   OR PICK_MARCADOR NOT LIKE '%-%'
   OR PICK_MARCADOR LIKE '%GMT%'
   OR PICK_MARCADOR LIKE '%Pacific%'
```

## 🔗 Archivos Modificados

1. **Code.gs** (Líneas 687-697):
   - Función: `api_getMyPicks()`
   - Cambio: Validación estricta de formato de marcador
   - Validaciones: longitud, formato numérico, límite de dígitos

2. **Index.html** (Líneas 512-529):
   - Función: `fillPicksInForm()`
   - Cambio: Validación antes de mostrar en UI
   - Validaciones: longitud, formato numérico, límite de dígitos

## 🎯 Commit

**Hash**: ac0e73f
**Mensaje**: "Fix: Validar formato de marcador para prevenir timestamps corruptos"
**Archivos**: Code.gs, Index.html
**Líneas modificadas**: +20, -5

## 💡 Lecciones Aprendidas

1. **Validar entrada de datos**: Nunca confiar en formato de datos del sheet
2. **Protección en capas**: Backend + Frontend = doble seguridad
3. **Ser específico en validaciones**: "includes('-')" no es suficiente
4. **Límites razonables**: 2 dígitos por valor es suficiente para fútbol (0-99)
5. **Logs para debugging**: Console logs ayudan a identificar datos corruptos

## 🔮 Prevención Futura

### Mejoras Adicionales Sugeridas

1. **Validación al escribir**: Agregar validación en `api_submit()` antes de escribir al sheet
2. **Data migration**: Script one-time para limpiar datos históricos
3. **Sheet protection**: Proteger columnas críticas de edición manual
4. **Type checking**: Usar Apps Script para validar tipos de datos en columnas
5. **Monitoring**: Alert cuando se detectan datos corruptos

### Código de Validación Sugerido para api_submit()

```javascript
// En upsertBatch(), antes de línea 818:
let pickMarc = "";
if (gl !== "" || gv !== "") {
  // Validar que gl y gv sean numéricos y cortos
  if (gl !== "" && gv !== "" && 
      String(gl).length <= 2 && String(gv).length <= 2 &&
      !isNaN(Number(gl)) && !isNaN(Number(gv))) {
    pickMarc = `${Number(gl)}-${Number(gv)}`;
  } else {
    // Log de advertencia para debugging
    console.warn(`Marcador inválido ignorado: gl=${gl}, gv=${gv}`);
  }
}
```

---

**Autor**: GitHub Copilot Workspace  
**Fecha**: Enero 2026  
**Commit**: ac0e73f  
**Status**: ✅ Resuelto y Testeado  
**Prioridad**: Alta (afecta experiencia de usuario)
