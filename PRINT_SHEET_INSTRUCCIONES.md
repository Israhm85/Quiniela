# Función: Actualizar Hoja de Impresión

## Descripción
Esta función llena automáticamente la hoja **PRINT** con los 10 partidos de la jornada actual (9 de Liga MX + 1 opcional de La Liga/Premier), para poder imprimir y distribuir físicamente la quiniela.

## Uso

### Paso 1: Ejecutar la función
```
Menú → Quiniela → 🖨️ Actualizar hoja de impresión
```

### Paso 2: Formato automático
La función llena los siguientes rangos en la hoja PRINT:

**Primera sección:**
- `C4:C13` = Equipos locales (partidos 1-10)
- `E4:E13` = Equipos visitantes (partidos 1-10)

**Segunda sección (duplicado para imprimir dos columnas):**
- `C15:C24` = Equipos locales (partidos 1-10)
- `E15:E24` = Equipos visitantes (partidos 1-10)

## Ejemplo de Resultado

```
    C           D       E
3   [Header]            [Header]
4   América             Guadalajara
5   Cruz Azul           Pumas
6   Tigres              Monterrey
7   Atlas               León
8   Toluca              Santos
9   Puebla              Querétaro
10  Pachuca             Necaxa
11  Mazatlán            Tijuana
12  Juárez              San Luis
13  Real Madrid         Barcelona    ← Décimo partido (si existe)

15  América             Guadalajara  ← Duplicado
16  Cruz Azul           Pumas
... (igual que arriba)
```

## Características

✅ **Dinámico**: Se actualiza con la jornada actual (CONFIG → JornadaActual)
✅ **Incluye décimo partido**: Si está configurado, lo agrega automáticamente como partido #10
✅ **Auto-completado**: Si hay menos de 10 partidos, rellena con espacios vacíos
✅ **Dos secciones**: Duplica los datos para imprimir en dos columnas
✅ **Crea hoja si no existe**: Si la hoja PRINT no existe, la crea automáticamente

## Cuándo Ejecutar

- Después de configurar el décimo partido
- Después de importar el calendario de Liga MX
- Antes de imprimir las quinielas para distribuir físicamente
- Cada vez que cambie la jornada actual

## Formato de la Hoja PRINT

La hoja PRINT debe tener un formato predefinido con:
- Encabezados en la fila 3
- Inicio de datos en la fila 4 (B4 o C4)
- Columna C para equipos locales
- Columna E para equipos visitantes
- Dos secciones: filas 4-13 y 15-24

## Notas Técnicas

- Usa `getConfig_("JornadaActual")` para obtener la jornada
- Usa `getPartidosPorJornada_(jornada)` para obtener partidos de Liga MX
- Usa `getDecimoPartidoPorJornada_(jornada)` para obtener el décimo partido
- Limita a 9 partidos de Liga MX si hay más
- Siempre genera exactamente 10 filas (rellena con vacíos si es necesario)

## Integración con el Sistema

Esta función es parte del sistema de décimo partido opcional y se integra perfectamente con:
- Selección de décimo partido
- Generación de pronósticos
- Importación de calendario ESPN
- Sistema de jornadas

---

**Implementado:** Commit 9eb3e75
**Última actualización:** Enero 19, 2026
