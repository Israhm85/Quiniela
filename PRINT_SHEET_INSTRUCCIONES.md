# Función: Actualizar Hoja de Impresión

## Descripción
Esta función llena automáticamente la hoja **PRINT** con los 10 partidos de la jornada actual (9 de Liga MX + 1 opcional de La Liga/Premier), y crea 5 copias adicionales del formato completo para imprimir múltiples quinielas en una sola hoja.

## Uso

### Paso 1: Ejecutar la función
```
Menú → Quiniela → 🖨️ Actualizar hoja de impresión
```

### Paso 2: Formato automático
La función llena los siguientes rangos en la hoja PRINT:

**Sección Original (A1:E22):**
- `B2:B11` = Equipos locales (partidos 1-10)
- `D2:D11` = Equipos visitantes (partidos 1-10)
- `B13:B22` = Equipos locales (partidos 1-10, duplicado)
- `D13:D22` = Equipos visitantes (partidos 1-10, duplicado)

**Copias Automáticas:**
El rango completo A1:E22 se copia automáticamente a:
1. `G1:K22` - Primera copia
2. `M1:Q22` - Segunda copia
3. `A24:E45` - Tercera copia
4. `G24:K45` - Cuarta copia
5. `M24:Q45` - Quinta copia

**Total:** 6 instancias del formato (1 original + 5 copias)

## Ejemplo de Resultado

```
Columnas:  A    B         C    D           E  |  G    H         I    J           K  |  M    N    ...
═══════════════════════════════════════════════════════════════════════════════════════════════
Fila 1:    [------- Formato Original --------] | [------- Copia 1 --------] | [--- Copia 2 ---]
Fila 2:         América        Guadalajara     |      América    Guadalajara|   América ...
Fila 3:         Cruz Azul      Pumas          |      Cruz Azul   Pumas     |   Cruz Azul ...
...
Fila 11:        Real Madrid    Barcelona       |      Real Madrid Barcelona |   Real Madrid...
Fila 12:                                       |                            |
Fila 13:        América        Guadalajara     |      América    Guadalajara|   América ...
...
Fila 22:        Real Madrid    Barcelona       |      Real Madrid Barcelona |   Real Madrid...

Fila 24:   [------- Copia 3 --------]         | [------- Copia 4 --------] | [--- Copia 5 ---]
Fila 25:        América        Guadalajara     |      América    Guadalajara|   América ...
...
```

## Características

✅ **Dinámico**: Se actualiza con la jornada actual (CONFIG → JornadaActual)
✅ **Incluye décimo partido**: Si está configurado, lo agrega automáticamente como partido #10
✅ **Auto-completado**: Si hay menos de 10 partidos, rellena con espacios vacíos
✅ **6 copias idénticas**: Crea 1 original + 5 copias automáticas
✅ **Preserva formato**: Copia colores de fondo, pesos de fuente y tamaños
✅ **Crea hoja si no existe**: Si la hoja PRINT no existe, la crea automáticamente
✅ **Eficiente para imprimir**: Permite imprimir 6 quinielas en una sola hoja

## Cuándo Ejecutar

- Después de configurar el décimo partido
- Después de importar el calendario de Liga MX
- Antes de imprimir las quinielas para distribuir físicamente
- Cada vez que cambie la jornada actual

## Formato de la Hoja PRINT

La hoja PRINT debe tener un formato predefinido con:
- Encabezados en la fila 1
- Inicio de datos en la fila 2 (columna B)
- Columna B para equipos locales
- Columna D para equipos visitantes
- Dos secciones por cada instancia: filas 2-11 y 13-22

## Layout de Impresión

El diseño está optimizado para:
- **3 copias horizontales** en la parte superior (columnas A-E, G-K, M-Q)
- **3 copias horizontales** en la parte inferior (columnas A-E, G-K, M-Q)
- Permite imprimir 6 quinielas en una sola página horizontal

## Notas Técnicas

- Usa `getConfig_("JornadaActual")` para obtener la jornada
- Usa `getPartidosPorJornada_(jornada)` para obtener partidos de Liga MX
- Usa `getDecimoPartidoPorJornada_(jornada)` para obtener el décimo partido
- Limita a 9 partidos de Liga MX si hay más
- Siempre genera exactamente 10 filas (rellena con vacíos si es necesario)
- Copia valores, formatos de fondo, pesos de fuente y tamaños de fuente

## Integración con el Sistema

Esta función es parte del sistema de décimo partido opcional y se integra perfectamente con:
- Selección de décimo partido
- Generación de pronósticos
- Importación de calendario ESPN
- Sistema de jornadas

---

**Implementado:** Commit 9eb3e75
**Actualizado:** Commit e1318e5 (nuevos rangos y 5 copias automáticas)
**Última actualización:** Enero 19, 2026

