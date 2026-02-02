# Guía Rápida: Configurar Administradores

## 🚀 Configuración en 3 Pasos

### Paso 1: Abrir la Hoja CONFIG

1. Abre tu hoja de cálculo de Google Sheets de la Quiniela
2. Ve a la pestaña **CONFIG**

### Paso 2: Agregar Administradores

Busca o crea una fila con:
- **KEY**: `AdminPlayers`
- **VALUE**: Los nombres de los 2 administradores separados por coma

**Ejemplo:**
```
KEY: AdminPlayers
VALUE: Juan Pérez,María García
```

**⚠️ IMPORTANTE:**
- Los nombres deben ser **exactamente** como aparecen en la hoja JUGADORES
- Separar con coma, SIN espacios extra
- Puedes copiar y pegar los nombres desde JUGADORES para evitar errores

### Paso 3: Verificar en la Aplicación

1. Cierra sesión en la aplicación web (si estás logueado)
2. Vuelve a iniciar sesión
3. Si tu nombre está en AdminPlayers, verás el botón "👤 Administrador"
4. Si tu nombre NO está, el botón estará oculto

---

## ✅ Verificación Rápida

### Para verificar que funciona correctamente:

1. **Como Admin:**
   - Login con un nombre que esté en AdminPlayers
   - Debes ver el botón "👤 Administrador"
   - Haz clic y verifica que puedes acceder
   - Intenta guardar/modificar un décimo partido

2. **Como Usuario Regular:**
   - Login con un nombre que NO esté en AdminPlayers
   - El botón "👤 Administrador" NO debe aparecer
   - Si intentas acceder por consola, debes ver un error

---

## 📝 Ejemplo Completo

### Hoja JUGADORES (ejemplo)
| ID | NOMBRE | TOKEN | ACTIVO |
|----|--------|-------|--------|
| 1 | Juan Pérez | abc123 | SI |
| 2 | María García | xyz789 | SI |
| 3 | Pedro López | def456 | SI |
| 4 | Ana Martínez | ghi012 | SI |

### Hoja CONFIG
| KEY | VALUE |
|-----|-------|
| JornadaActual | 5 |
| Puntos_Acierto | 1 |
| **AdminPlayers** | **Juan Pérez,María García** |
| LockMinutes | 10 |

Con esta configuración:
- ✅ Juan Pérez → ES ADMIN → Ve el botón
- ✅ María García → ES ADMIN → Ve el botón
- ❌ Pedro López → NO ES ADMIN → NO ve el botón
- ❌ Ana Martínez → NO ES ADMIN → NO ve el botón

---

## 🔧 Solución de Problemas

### "No veo el botón de Administrador"

**Posibles causas:**
1. Tu nombre no está en AdminPlayers
2. Hay un error de tipeo en tu nombre
3. Hay espacios extra en CONFIG

**Solución:**
1. Verifica tu nombre exacto en JUGADORES (copia y pega)
2. En CONFIG, asegúrate que el nombre coincide exactamente
3. Verifica que no haya espacios: `Juan Pérez,María García` (correcto)
4. No debe ser: `Juan Pérez, María García` (incorrecto - espacio después de coma)

### "El botón aparece pero dice que no tengo permisos"

**Causa:** Problema de caché o inconsistencia

**Solución:**
1. Cierra completamente el navegador
2. Abre nuevamente la aplicación
3. Inicia sesión desde cero
4. Verifica que AdminPlayers esté correctamente configurado

### "Quiero cambiar quién es administrador"

**Solución:**
1. Ve a CONFIG
2. Edita el VALUE de AdminPlayers
3. Cambia los nombres (ej: `Carlos Ruiz,Laura Torres`)
4. Guarda
5. Los usuarios deben cerrar sesión y volver a iniciar

---

## 📱 Vista en Móvil

### Usuario Admin (Móvil)
```
┌─────────────────────┐
│ Jornada 5           │
├─────────────────────┤
│ [Tus pronósticos]   │
│                     │
│ ┌─────────────────┐ │
│ │ 📊 Ver tabla    │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 👤 Administrador│ │  ← VE ESTE BOTÓN
│ └─────────────────┘ │
└─────────────────────┘
```

### Usuario Regular (Móvil)
```
┌─────────────────────┐
│ Jornada 5           │
├─────────────────────┤
│ [Tus pronósticos]   │
│                     │
│ ┌─────────────────┐ │
│ │ 📊 Ver tabla    │ │
│ └─────────────────┘ │
│                     │  ← NO VE BOTÓN ADMIN
└─────────────────────┘
```

---

## 🎯 Checklist de Configuración

- [ ] Abrir Google Sheets
- [ ] Ir a pestaña CONFIG
- [ ] Agregar/modificar fila con KEY = `AdminPlayers`
- [ ] Poner VALUE = `nombre1,nombre2` (sin espacios extra)
- [ ] Verificar que los nombres existen en JUGADORES
- [ ] Guardar los cambios
- [ ] Probar con cuenta admin: debe ver botón
- [ ] Probar con cuenta regular: NO debe ver botón
- [ ] Verificar que admin puede guardar/eliminar 10° partido
- [ ] Verificar que regular NO puede acceder

---

## 💾 Respaldo de Configuración

**Antes de hacer cambios, anota:**
```
AdminPlayers actuales: _______________________
Fecha del cambio: _______________________
Razón del cambio: _______________________
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa `ADMIN_CONFIG_GUIDE.md` para documentación completa
2. Abre `DEMO_ADMIN_ACCESS.html` para ver el demo visual
3. Verifica que los nombres en CONFIG coincidan con JUGADORES
4. Asegúrate de cerrar sesión y volver a entrar después de cambios

---

## ✨ Resumen

**Para hacer a alguien administrador:**
1. Abre CONFIG en Google Sheets
2. Agrega su nombre exacto a AdminPlayers
3. Formato: `nombre1,nombre2` (sin espacios)
4. ¡Listo! Ya puede gestionar el décimo partido

**Configuración mínima:**
```
En CONFIG sheet:
KEY: AdminPlayers
VALUE: Nombre del Admin 1,Nombre del Admin 2
```

¡Es así de simple! 🎉
