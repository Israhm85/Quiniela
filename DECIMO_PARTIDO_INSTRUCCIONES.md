# Instrucciones: Décimo Partido Opcional

## Descripción
El sistema ahora soporta un **décimo partido opcional** que puede ser de la **Liga Española (La Liga)** o la **Liga Premier Inglesa (Premier League)**. Este partido se agrega a los 9 partidos regulares de la Liga MX.

## Características
- **Selección Manual**: El administrador selecciona el partido a través del menú de Quiniela
- **Equipos Predefinidos**: Se incluyen 20 equipos de cada liga con sus escudos
- **Almacenamiento**: El partido se guarda en la hoja `DECIMO_PARTIDO` vinculado a la jornada actual
- **Visualización**: El décimo partido se destaca en el formulario con un borde azul y un badge que indica la liga

## Cómo Usar

### 1. Configurar el Décimo Partido
1. Abre la hoja de cálculo de la Quiniela
2. Ve al menú: **Quiniela → 🌍 Seleccionar décimo partido**
3. Se abrirá un diálogo preguntando qué liga usar:
   - **YES** = La Liga Española
   - **NO** = Premier League
   - **CANCEL** = Cancelar
4. Escribe el nombre del **equipo local** (ejemplo: "Real Madrid", "Manchester City")
5. Escribe el nombre del **equipo visitante**
6. Opcionalmente, ingresa la fecha del partido en formato: `MM/DD/YYYY HH:MM AM/PM`
   - Ejemplo: `01/25/2026 3:00 PM`
7. El sistema confirmará la configuración

### 2. Generar Pronósticos
Después de configurar el décimo partido:
1. Ve al menú: **Quiniela → 2) Generar pronósticos (jornada en CONFIG)**
2. El sistema creará automáticamente las filas de pronóstico para todos los jugadores, incluyendo el décimo partido

### 3. Capturar Marcador del Décimo Partido
Cuando el partido finalice:
1. Ve al menú: **Quiniela → ⚽ Capturar marcador décimo partido**
2. Ingresa el marcador final en formato: `2-1` (goles local - goles visitante)
3. El sistema calculará automáticamente:
   - El resultado (L/E/V)
   - Los puntos de todos los jugadores
   - La tabla general

### 4. Ver en el Frontend
Los jugadores verán:
- El décimo partido con un **borde azul** que lo distingue
- Un badge que dice **"🌍 PARTIDO EXTRA - LALIGA"** o **"🌍 PARTIDO EXTRA - PREMIER"**
- Los escudos de los equipos
- Los mismos campos de pronóstico (L/E/V y marcador exacto)

### 5. Quitar el Décimo Partido
Si deseas eliminar el décimo partido de la jornada actual:
1. Ve al menú: **Quiniela → 🗑️ Quitar décimo partido**
2. Se eliminará el partido de la jornada actual

## Equipos Disponibles

### La Liga Española
- Real Madrid, Barcelona, Atlético Madrid, Sevilla, Real Betis
- Real Sociedad, Villarreal, Athletic Bilbao, Valencia, Getafe
- Osasuna, Celta Vigo, Rayo Vallecano, Mallorca, Girona
- Alavés, Las Palmas, Espanyol, Leganés, Valladolid

### Premier League
- Manchester City, Arsenal, Liverpool, Manchester United, Chelsea
- Tottenham, Newcastle, Aston Villa, Brighton, West Ham
- Everton, Crystal Palace, Fulham, Bournemouth, Brentford
- Nottingham Forest, Wolves, Leicester City, Ipswich Town, Southampton

## Notas Técnicas
- El décimo partido se almacena en la hoja `DECIMO_PARTIDO` con las columnas:
  - JORNADA, LIGA, LOCAL, VISITANTE, FECHA, LOGO_LOCAL, LOGO_VISITANTE
- Los escudos se obtienen de URLs de ESPN y se guardan en la hoja `EQUIPOS`
- El sistema soporta un solo décimo partido por jornada
- Los pronósticos del décimo partido se manejan igual que los partidos de Liga MX
- El cálculo de puntos incluye automáticamente el décimo partido

## Limitaciones
- No hay sincronización automática de marcadores para el décimo partido (debe capturarse manualmente)
- Solo se puede tener un décimo partido por jornada
- Los nombres de equipos deben coincidir exactamente con los predefinidos (sin acentos ni mayúsculas)
