# Configuración de Administradores para Décimo Partido

## Resumen

Para restringir el acceso a la gestión del décimo partido (partidos opcionales de La Liga/Premier League), el sistema ahora requiere que los usuarios sean administradores autorizados.

## Configuración

### 1. Agregar Administradores en la Hoja CONFIG

En la hoja de cálculo de Google Sheets, ve a la hoja **CONFIG** y agrega o modifica la siguiente fila:

| KEY | VALUE |
|-----|-------|
| AdminPlayers | nombre1,nombre2 |

**Ejemplo:**
| KEY | VALUE |
|-----|-------|
| AdminPlayers | Juan Pérez,María García |

**Notas:**
- Los nombres deben coincidir **exactamente** con los nombres registrados en la hoja JUGADORES
- Separar múltiples nombres con comas (sin espacios extra)
- Los nombres NO son sensibles a mayúsculas/minúsculas
- Se recomienda configurar solo 2 personas como administradores

### 2. Verificar Nombres en JUGADORES

Asegúrate de que los nombres en `AdminPlayers` coincidan con los nombres en la columna **NOMBRE** de la hoja **JUGADORES**.

**Ejemplo de JUGADORES:**
| ID | NOMBRE | TOKEN | ACTIVO | PAGADO | FECHA_REG |
|----|--------|-------|--------|--------|-----------|
| 1 | Juan Pérez | abc123 | SI | SI | 2026-01-15 |
| 2 | María García | xyz789 | SI | SI | 2026-01-16 |
| 3 | Pedro López | def456 | SI | NO | 2026-01-17 |

En este ejemplo, solo **Juan Pérez** y **María García** tendrían acceso a gestionar el décimo partido.

## Funcionalidad

### Para Administradores

Cuando un administrador inicia sesión en la aplicación web:

1. **Botón visible**: Verá un botón "👤 Administrador" en el formulario principal
2. **Acceso completo**: Puede:
   - Configurar el décimo partido (seleccionar liga y equipos)
   - Modificar el décimo partido existente
   - Eliminar el décimo partido de la jornada actual
3. **Sin restricciones**: Todas las funciones del décimo partido están disponibles

### Para Usuarios Regulares

Cuando un usuario NO administrador inicia sesión:

1. **Botón oculto**: El botón "👤 Administrador" NO aparecerá
2. **Sin acceso**: No pueden acceder a la gestión del décimo partido
3. **Error al intentar acceder**: Si de alguna forma intentan acceder, recibirán mensajes de error:
   - "⛔ Solo los administradores pueden acceder a esta función."
   - "Solo los administradores pueden configurar el décimo partido."
   - "Solo los administradores pueden eliminar el décimo partido."

## Sistema de Validación

El sistema implementa **validación en múltiples capas**:

### 1. Validación en el Frontend (Index.html)
- El botón de administrador está oculto por defecto
- Solo se muestra si `api_isPlayerAdmin()` retorna `true`
- Verificación adicional al hacer clic en el botón

### 2. Validación en el Backend (Code.gs)
- `api_guardarDecimoPartido()`: Verifica token y nombre de jugador
- `api_quitarDecimoPartido()`: Verifica token y nombre de jugador
- Si el usuario no es admin, retorna error inmediatamente

### 3. Verificación por Token
- Cada operación requiere el token del jugador
- El sistema busca el jugador por token en JUGADORES
- Compara el nombre del jugador con la lista de AdminPlayers

## Flujo de Autorización

```
1. Usuario inicia sesión con token
   ↓
2. Sistema valida token con api_loginByToken()
   ↓
3. Sistema verifica si es admin con api_isPlayerAdmin()
   ↓
4. Si es admin:
   - Muestra botón "👤 Administrador"
   - Permite acceso a gestión del décimo partido
   ↓
5. Si NO es admin:
   - Oculta botón
   - Bloquea cualquier intento de acceso
```

## Cambios en la Interfaz

### Antes
- Botón: "🌍 Gestionar décimo partido"
- Visible para todos los usuarios
- Sin restricciones de acceso

### Ahora
- Botón: "👤 Administrador"
- Solo visible para administradores autorizados
- Acceso restringido con validación backend

## Mensajes de Error

### Si un usuario NO administrador intenta acceder:

**En el navegador:**
```
⛔ Solo los administradores pueden acceder a esta función.
```

**Al intentar guardar (si bypasean el frontend):**
```
⛔ Solo los administradores pueden configurar el décimo partido.
```

**Al intentar eliminar (si bypasean el frontend):**
```
⛔ Solo los administradores pueden eliminar el décimo partido.
```

## Testing

### Probar como Administrador

1. Configura tu nombre en CONFIG → AdminPlayers
2. Inicia sesión en la aplicación web
3. Verifica que el botón "👤 Administrador" esté visible
4. Haz clic y prueba:
   - Seleccionar liga y equipos
   - Guardar décimo partido
   - Eliminar décimo partido

### Probar como Usuario Regular

1. Inicia sesión con un nombre que NO esté en AdminPlayers
2. Verifica que el botón "👤 Administrador" NO esté visible
3. Intenta acceder mediante consola del navegador:
   ```javascript
   openDecimoPartido()
   ```
4. Deberías ver el mensaje de error de permisos

## Seguridad

✅ **Token-based authentication**: Todas las operaciones requieren token válido
✅ **Server-side validation**: Las validaciones críticas están en el backend
✅ **Name-based authorization**: Usa nombres de jugadores, no emails
✅ **Multiple layers**: Frontend oculta UI + backend valida permisos
✅ **Clear error messages**: Los usuarios saben por qué no tienen acceso

## Solución de Problemas

### "No veo el botón de Administrador"

**Causa:** Tu nombre no está en AdminPlayers o está mal escrito

**Solución:**
1. Verifica tu nombre exacto en la hoja JUGADORES
2. Agrega ese nombre exacto a CONFIG → AdminPlayers
3. Cierra sesión y vuelve a iniciar sesión

### "Aparece el botón pero dice 'Solo administradores...'"

**Causa:** Inconsistencia entre frontend y backend

**Solución:**
1. Recarga la página completamente (Ctrl+F5)
2. Verifica que el nombre en CONFIG coincida exactamente con JUGADORES
3. Verifica que no haya espacios extra en CONFIG

### "Quiero cambiar quién es administrador"

**Solución:**
1. Ve a la hoja CONFIG
2. Edita la fila con KEY = "AdminPlayers"
3. Cambia el VALUE con los nombres deseados (separados por comas)
4. Los cambios toman efecto inmediatamente en el próximo inicio de sesión

## Mantenimiento

### Agregar un Nuevo Administrador

1. Abre la hoja CONFIG
2. Encuentra la fila con KEY = "AdminPlayers"
3. Agrega el nombre al final: `nombre1,nombre2,nombre3`
4. Guarda los cambios

### Remover un Administrador

1. Abre la hoja CONFIG
2. Encuentra la fila con KEY = "AdminPlayers"
3. Elimina el nombre de la lista
4. Guarda los cambios

### Cambiar Todos los Administradores

1. Abre la hoja CONFIG
2. Reemplaza completamente el VALUE de AdminPlayers
3. Guarda los cambios

## Recomendaciones

1. **Mantén solo 2 administradores**: Como especifica el requerimiento original
2. **Usa nombres exactos**: Copia y pega desde JUGADORES para evitar errores
3. **Sin espacios extra**: La lista debe ser: `nombre1,nombre2` (no `nombre1, nombre2`)
4. **Documenta cambios**: Mantén un registro de quiénes son los administradores actuales
5. **Prueba después de cambios**: Verifica que los administradores pueden acceder y los demás no

## API Endpoints

### `api_isPlayerAdmin(token)`
**Propósito:** Verifica si un jugador es administrador

**Parámetros:**
- `token` (String): Token de sesión del jugador

**Retorno:**
```javascript
{
  ok: true,
  isAdmin: true/false,
  nombre: "Nombre del Jugador"
}
```

### `api_guardarDecimoPartido(payload)`
**Propósito:** Guarda o actualiza el décimo partido

**Parámetros:**
```javascript
{
  token: "abc123",        // REQUERIDO
  liga: "LALIGA",
  local: "Real Madrid",
  visitante: "Barcelona",
  fecha: "2026-01-26T15:00:00Z",
  jornada: 1
}
```

**Validación de Admin:** ✅ Verifica automáticamente

### `api_quitarDecimoPartido(payload)`
**Propósito:** Elimina el décimo partido

**Parámetros:**
```javascript
{
  token: "abc123",  // REQUERIDO
  jornada: 1
}
```

**Validación de Admin:** ✅ Verifica automáticamente

## Resumen

Este sistema de administración asegura que:
- ✅ Solo usuarios autorizados pueden gestionar el décimo partido
- ✅ La configuración es simple (solo agregar nombres a CONFIG)
- ✅ La seguridad se valida en backend (no solo frontend)
- ✅ Los usuarios regulares no ven ni pueden acceder a las funciones de admin
- ✅ Los mensajes de error son claros y descriptivos
- ✅ Fácil de mantener y modificar la lista de administradores

**Configuración mínima requerida:**
```
En CONFIG sheet:
KEY: AdminPlayers
VALUE: nombre1,nombre2
```

¡Y listo! Solo esos dos usuarios tendrán acceso a gestionar el décimo partido.
