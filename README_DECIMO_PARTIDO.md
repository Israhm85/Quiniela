# Décimo Partido Opcional - Implementación

## Resumen

Se ha implementado exitosamente la funcionalidad de **décimo partido opcional** que permite agregar un partido de **La Liga Española** o **Premier League** a los 9 partidos regulares de Liga MX en cada jornada.

## Cambios Realizados

### 1. Backend (Code.gs)

#### Nuevas Constantes
- `SHEETS.DECIMO_PARTIDO`: Nueva hoja para almacenar los partidos opcionales

#### Nuevas Funciones

**Equipos Predefinidos:**
- `getEquiposLaLiga_()`: Retorna array con 20 equipos de La Liga con sus logos
- `getEquiposPremierLeague_()`: Retorna array con 20 equipos de Premier League con sus logos

**Gestión del Décimo Partido:**
- `uiSeleccionarDecimoPartido()`: Diálogo UI para seleccionar liga, equipos local/visitante y fecha
- `guardarDecimoPartido_()`: Guarda el partido en la hoja DECIMO_PARTIDO
- `quitarDecimoPartido()`: Elimina el décimo partido de la jornada actual
- `getDecimoPartidoPorJornada_()`: Obtiene el décimo partido configurado para una jornada

**Captura de Resultados:**
- `uiCapturarMarcadorDecimoPartido()`: Permite capturar manualmente el marcador del décimo partido
  - Valida formato (ej: "2-1")
  - Calcula resultado automáticamente (L/E/V)
  - Actualiza o agrega el partido en PARTIDOS
  - Recalcula puntos automáticamente

#### Funciones Modificadas

**`setupInicial()`:**
- Crea la hoja DECIMO_PARTIDO con columnas: JORNADA, LIGA, LOCAL, VISITANTE, FECHA, LOGO_LOCAL, LOGO_VISITANTE

**`onOpen()`:**
- Agregados 3 nuevos items al menú:
  - 🌍 Seleccionar décimo partido
  - ⚽ Capturar marcador décimo partido
  - 🗑️ Quitar décimo partido

**`getPartidosWebPorJornada_()`:**
- Modificada para incluir el décimo partido al final del array de partidos
- Agrega propiedades adicionales:
  - `esDecimoPartido: true` - Identificador para el frontend
  - `liga: "LALIGA" | "PREMIER"` - Liga del partido

**`generarPronosticosJornadaConfig()`:**
- Modificada para incluir el décimo partido al generar pronósticos
- Crea filas de pronóstico para el décimo partido automáticamente

### 2. Frontend (Index.html)

#### Función Modificada

**`renderForm()`:**
- Detecta partidos con `esDecimoPartido === true`
- Aplica estilos especiales:
  - Borde azul (`border:2px solid #7c9cff`)
  - Fondo azul semi-transparente (`background:rgba(124,156,255,.05)`)
- Muestra badge con la liga: "🌍 PARTIDO EXTRA - LALIGA" o "PREMIER"
- Mantiene toda la funcionalidad de pronósticos (L/E/V y marcador exacto)

**Descripción del formulario:**
- Actualizada para mencionar "hasta 10 partidos (9 Liga MX + 1 partido extra opcional)"

### 3. Documentación

**DECIMO_PARTIDO_INSTRUCCIONES.md:**
- Guía completa de uso del sistema
- Instrucciones paso a paso para:
  1. Configurar el décimo partido
  2. Generar pronósticos
  3. Capturar marcador
  4. Ver en el frontend
  5. Quitar el décimo partido
- Lista completa de equipos disponibles por liga
- Notas técnicas y limitaciones

**DEMO_10TH_MATCH.html:**
- Demo visual del diseño del décimo partido
- Ejemplos de partidos regulares vs décimo partido
- Muestra las diferencias visuales (borde azul, badge)

## Estructura de Datos

### Hoja DECIMO_PARTIDO
| Columna | Tipo | Descripción |
|---------|------|-------------|
| JORNADA | Number | Número de jornada |
| LIGA | String | "LALIGA" o "PREMIER" |
| LOCAL | String | Nombre del equipo local |
| VISITANTE | String | Nombre del equipo visitante |
| FECHA | Date | Fecha y hora del partido (opcional) |
| LOGO_LOCAL | String | URL del logo del equipo local |
| LOGO_VISITANTE | String | URL del logo del equipo visitante |

### Equipos Incluidos

**La Liga (20 equipos):**
Real Madrid, Barcelona, Atlético Madrid, Sevilla, Real Betis, Real Sociedad, Villarreal, Athletic Bilbao, Valencia, Getafe, Osasuna, Celta Vigo, Rayo Vallecano, Mallorca, Girona, Alavés, Las Palmas, Espanyol, Leganés, Valladolid

**Premier League (20 equipos):**
Manchester City, Arsenal, Liverpool, Manchester United, Chelsea, Tottenham, Newcastle, Aston Villa, Brighton, West Ham, Everton, Crystal Palace, Fulham, Bournemouth, Brentford, Nottingham Forest, Wolves, Leicester City, Ipswich Town, Southampton

## Flujo de Uso

```
1. Admin selecciona décimo partido
   ↓
2. Sistema guarda en DECIMO_PARTIDO
   ↓
3. Admin genera pronósticos
   ↓
4. Jugadores ven el partido en el formulario (con borde azul)
   ↓
5. Jugadores hacen sus picks (2 pronósticos)
   ↓
6. Partido se juega
   ↓
7. Admin captura marcador manualmente
   ↓
8. Sistema calcula puntos automáticamente
```

## Características Clave

✅ **Simplicidad:** Selección manual sin dependencia de APIs externas
✅ **Flexibilidad:** Opcional por jornada, se puede agregar o quitar
✅ **Visual:** Diseño distintivo con borde azul y badge de liga
✅ **Consistencia:** Usa la misma lógica de pronósticos y puntos
✅ **Documentación:** Instrucciones completas en español
✅ **40 equipos:** 20 de La Liga + 20 de Premier League con logos oficiales

## Limitaciones

⚠️ **No hay sincronización automática:** El marcador del décimo partido debe capturarse manualmente
⚠️ **Un partido por jornada:** Solo se puede configurar un décimo partido por jornada
⚠️ **Nombres exactos:** Los nombres de equipos deben coincidir con los predefinidos (normalización automática de acentos)

## Próximos Pasos (Opcionales)

1. **Sincronización automática de marcadores:** Integrar con API de ESPN para ligas europeas
2. **Más ligas:** Agregar Bundesliga, Serie A, Ligue 1
3. **Múltiples partidos extra:** Permitir más de un partido opcional
4. **Histórico:** Reportes de décimos partidos jugados
5. **Ponderación:** Opción de asignar más puntos al décimo partido

## Testing

**Tareas de testing manual requeridas:**
- [ ] Ejecutar `setupInicial()` para crear la hoja DECIMO_PARTIDO
- [ ] Usar menú "Seleccionar décimo partido" y probar flujo completo
- [ ] Verificar que el partido aparece en el frontend con el diseño correcto
- [ ] Hacer picks y guardarlos
- [ ] Capturar marcador y verificar cálculo de puntos
- [ ] Probar "Quitar décimo partido"
- [ ] Verificar tabla general incluye puntos del décimo partido

## Mantenimiento

**Actualizar logos de equipos:**
Los URLs de logos están hardcodeados en las funciones `getEquiposLaLiga_()` y `getEquiposPremierLeague_()`. Si ESPN cambia sus URLs, actualizar ahí.

**Agregar/quitar equipos:**
Modificar los arrays en las funciones mencionadas arriba.

## Soporte

Para preguntas o problemas, referirse a:
- `DECIMO_PARTIDO_INSTRUCCIONES.md` - Instrucciones de uso
- `DEMO_10TH_MATCH.html` - Demo visual del diseño
- Este archivo (README) - Documentación técnica
