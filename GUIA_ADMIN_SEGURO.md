# Guía de Configuración: Panel de Administrador Seguro

## 🔐 Configuración de Seguridad

### Paso 1: Configurar Contraseña de Administrador

1. Abre tu hoja de Google Sheets
2. Ve a la pestaña **CONFIG**
3. Agrega o modifica la siguiente fila:

| KEY | VALUE |
|-----|-------|
| AdminPassword | tu-contraseña-segura |

**Ejemplo:**
```
KEY: AdminPassword
VALUE: Quiniela2026!
```

⚠️ **IMPORTANTE:** 
- Usa una contraseña segura (mínimo 8 caracteres)
- No compartas esta contraseña
- Cámbiala regularmente

### Paso 2: Configurar Nombres de Administradores

La fila `AdminPlayers` controla quién ve el botón de administrador:

| KEY | VALUE |
|-----|-------|
| AdminPlayers | Juan Pérez,María García |

**Nota:** Esto solo controla la visibilidad del botón. La seguridad real está en la contraseña.

---

## 🎯 Cómo Usar el Panel de Administrador

### Acceso al Panel

1. **Inicia sesión** en la web app con tu cuenta normal
2. Si tu nombre está en `AdminPlayers`, verás el botón **"🔐 Administrador"**
3. Haz clic en el botón
4. **Ingresa la contraseña** de administrador
5. Accede al **Panel de Administrador**

### Funciones Disponibles

#### 📅 Gestión de Jornada

**Ver Estado Actual:**
- Jornada activa
- Estado (🔒 Cerrada o 🔓 Abierta)

**Cambiar Jornada:**
1. Selecciona la jornada del dropdown (1-17)
2. Click en "📅 Cambiar Jornada"
3. Confirmación inmediata

**Cerrar Jornada:**
- Click en "🔒 Cerrar Jornada"
- Confirma la acción
- Los picks quedan bloqueados

**Abrir Jornada:**
- Click en "🔓 Abrir Jornada"
- Confirma la acción
- Los picks quedan permitidos

#### ⚽ Capturar Resultados (Partidos Regulares)

**Proceso:**
1. El panel muestra todos los partidos de la jornada actual
2. Ingresa el marcador en cada campo (formato: `2-1`)
3. Puedes ingresar solo los partidos que ya terminaron
4. Click en "✅ Capturar Todos los Resultados"
5. El sistema:
   - Valida los marcadores
   - Calcula el resultado (L/E/V)
   - Actualiza la hoja PARTIDOS
   - Recalcula puntos de todos los jugadores
   - Actualiza la tabla general

**Formato del Marcador:**
- ✅ Correcto: `3-1`, `2-2`, `0-1`
- ❌ Incorrecto: `3 1`, `tres-uno`, `3:`

#### 🌍 Décimo Partido

- Click en "Gestionar Décimo Partido"
- Accede a todas las funciones del décimo partido
- Configurar, capturar resultado, eliminar

---

## 🔒 Seguridad Mejorada

### Antes (Problema)

❌ Cualquiera podía registrarse con el nombre de un admin
❌ Acceso inmediato al panel de administrador
❌ No había autenticación real

### Ahora (Solución)

✅ **Contraseña requerida** para acceso admin
✅ **Sesión con token** de 2 horas de duración
✅ **Validación en servidor** en todas las operaciones
✅ **Imposible falsificar** credenciales de admin

### Cómo Funciona

1. **Login:** Usuario ingresa contraseña de admin
2. **Validación:** Sistema verifica contra CONFIG.AdminPassword
3. **Token:** Se genera un token de sesión único
4. **Cache:** Token se guarda por 2 horas
5. **Operaciones:** Cada operación valida el token
6. **Expiración:** Después de 2 horas, debe reiniciar sesión

---

## 📱 Desde Móvil

Todo funciona perfectamente en celular:

1. Abre la web app
2. Login normal
3. Click "🔐 Administrador"
4. Ingresa contraseña
5. Accede al panel completo
6. Todas las funciones disponibles

---

## 💡 Consejos

### Seguridad

- ✅ Usa una contraseña fuerte
- ✅ No la compartas
- ✅ Cámbiala periódicamente
- ✅ Solo comparte con admins de confianza

### Uso Eficiente

- ✅ Captura todos los resultados juntos
- ✅ Verifica los marcadores antes de capturar
- ✅ Cierra la jornada después de capturar todos los resultados
- ✅ Cambia a la siguiente jornada cuando corresponda

### Troubleshooting

**"Sesión de administrador expirada"**
- La sesión dura 2 horas
- Cierra sesión y vuelve a iniciar sesión

**"Contraseña incorrecta"**
- Verifica la contraseña en CONFIG
- Asegúrate de escribirla exactamente igual

**"No veo el botón de administrador"**
- Verifica que tu nombre esté en AdminPlayers
- Cierra sesión y vuelve a iniciar sesión

---

## 🎯 Beneficios

### Para Administradores

✅ **Todo en un lugar** - No necesitas abrir Google Sheets
✅ **Móvil-friendly** - Gestiona desde tu celular
✅ **Seguro** - Contraseña protege el acceso
✅ **Rápido** - Captura múltiples resultados a la vez
✅ **Claro** - Mensajes de confirmación inmediatos

### Para el Sistema

✅ **Seguridad robusta** - No más falsificación de identidad
✅ **Auditable** - Sesiones registradas
✅ **Escalable** - Fácil agregar más funciones
✅ **Mantenible** - Código limpio y organizado

---

## 📋 Checklist de Configuración

- [ ] Abrir Google Sheets
- [ ] Ir a pestaña CONFIG
- [ ] Agregar fila con KEY = "AdminPassword"
- [ ] Establecer VALUE con contraseña segura
- [ ] Verificar que AdminPlayers esté configurado
- [ ] Guardar cambios
- [ ] Probar login en web app
- [ ] Verificar acceso al panel
- [ ] Probar cambiar jornada
- [ ] Probar capturar resultados
- [ ] Probar cerrar/abrir jornada

---

## 🚨 Importante

### Respalda la Contraseña

Guarda la contraseña en un lugar seguro. Si la pierdes:
1. Accede a Google Sheets
2. Ve a CONFIG
3. Cambia el valor de AdminPassword
4. Usa la nueva contraseña

### Sesiones Múltiples

- Puedes tener varias sesiones admin activas
- Cada sesión dura 2 horas independientemente
- Cierra sesión cuando termines para seguridad

### Cambiar Contraseña

Para cambiar la contraseña:
1. Abre Google Sheets
2. CONFIG → AdminPassword
3. Cambia el VALUE
4. Las sesiones activas siguen válidas por 2 horas
5. Nuevos logins requieren la nueva contraseña

---

## ✨ Resumen

**Configuración Mínima:**
```
CONFIG Sheet:
- AdminPassword: tu-contraseña
- AdminPlayers: nombre1,nombre2
```

**Flujo de Uso:**
```
1. Login normal → 2. Click Admin → 3. Ingresar contraseña → 4. Panel completo
```

**Todo lo que puedes hacer:**
- ✅ Cambiar jornada activa
- ✅ Cerrar/abrir jornada
- ✅ Capturar resultados de partidos
- ✅ Gestionar décimo partido
- ✅ Todo desde móvil

**Seguridad garantizada** 🔐
