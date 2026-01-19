# Plan: Rediseño Completo a Tabla Tradicional de Quiniela

## 🎯 Objetivo
Reemplazar el diseño actual de cards con un formato de tabla tradicional tipo quiniela física.

## 📋 Especificaciones del Usuario

### Estructura de Tabla (24x5)
```
Fila  | Col A (☐L) | Col B (Local) | Col C (☐E) | Col D (Visitante) | Col E (☐V)
------|------------|---------------|------------|-------------------|------------
1-10  | Entry 1 - Primeros 10 partidos
11    | SEPARADOR: "QUINIELA 2X1"
12-21 | Entry 2 - MISMOS 10 partidos repetidos
```

### Formato de Cada Fila
```
[☐ Local] [Logo + Nombre Equipo Local] [☐ Empate] [Logo + Nombre Equipo Visitante] [☐ Visitante]
```

### Funcionalidad a Mantener
- ✅ Guardar predicciones (picks)
- ✅ Cargar predicciones existentes
- ✅ Logos de equipos
- ✅ Validaciones
- ✅ Mensajes de éxito/error
- ✅ Registro de jugadores
- ✅ Bloqueo de partidos (locked)
- ✅ Backend actual (api_submit, api_getMyPicks)

### Cambios Principales
- ❌ Eliminar: Campos de marcador ("2-1")
- ❌ Eliminar: Diseño de cards
- ❌ Eliminar: Dropdowns `<select>`
- ✅ Agregar: Checkboxes para L/E/V
- ✅ Agregar: Tabla HTML tradicional
- ✅ Agregar: Separador "QUINIELA 2X1"

## 🛠️ Implementación

### Paso 1: Nuevo CSS para Tabla de Quiniela
```css
/* Tabla de Quiniela */
.quiniela-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.quiniela-table th {
  background: rgba(124, 156, 255, 0.1);
  padding: 12px 8px;
  font-weight: 700;
  font-size: 14px;
  border-bottom: 2px solid var(--line);
}

.quiniela-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.quiniela-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

/* Checkbox Container */
.checkbox-cell {
  text-align: center;
  width: 60px;
}

.checkbox-cell input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--accent);
}

.checkbox-cell input[type="checkbox"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Team Cell */
.team-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-cell .logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.team-cell .team-name {
  font-weight: 600;
  font-size: 14px;
}

/* Separator Row (QUINIELA 2X1) */
.separator-row {
  background: linear-gradient(90deg, var(--accent), #5a74ff);
  text-align: center;
  font-weight: 900;
  font-size: 16px;
  color: #fff;
  padding: 12px !important;
}

.separator-row td {
  border: none !important;
}

/* Locked Row */
.quiniela-table tr.locked {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.02);
}

.quiniela-table tr.locked td {
  color: var(--bad);
}

/* Missing Pick Highlight */
.quiniela-table tr.pick-missing {
  background: rgba(255, 107, 107, 0.1);
  animation: shake 0.3s ease;
}

.quiniela-table tr.pick-missing td {
  border-color: var(--bad);
}
```

### Paso 2: Nueva Función renderForm()
```javascript
function renderForm(){
  const box = document.getElementById("picksBox");
  if(!SESSION.partidos || SESSION.partidos.length === 0){
    box.innerHTML = `<div class="small bad">No hay partidos cargados para esta jornada.</div>`;
    return;
  }

  // Tomar solo primeros 10 partidos (no más)
  const partidos = SESSION.partidos.slice(0, 10);

  let html = `
    <div class="table-wrapper">
      <table class="quiniela-table">
        <thead>
          <tr>
            <th class="checkbox-cell">Local</th>
            <th>Equipo Local</th>
            <th class="checkbox-cell">Empate</th>
            <th>Equipo Visitante</th>
            <th class="checkbox-cell">Visitante</th>
          </tr>
        </thead>
        <tbody>
  `;

  // ENTRY 1: Primeros 10 partidos
  partidos.forEach((p, idx) => {
    const locked = !!p.locked;
    const rowClass = locked ? 'locked' : '';
    
    html += `
      <tr class="${rowClass}" data-idx="${idx}" data-entry="1">
        <td class="checkbox-cell">
          <input type="checkbox" 
                 id="pick_L_${idx}_1" 
                 name="pick_${idx}_1" 
                 value="L" 
                 ${locked ? 'disabled' : ''}
                 onchange="handleCheckboxChange(${idx}, 1, 'L')">
        </td>
        <td class="team-cell">
          ${p.logoLocal ? `<img class="logo" src="${esc(p.logoLocal)}" alt="">` : ''}
          <span class="team-name">${esc(p.local)}</span>
        </td>
        <td class="checkbox-cell">
          <input type="checkbox" 
                 id="pick_E_${idx}_1" 
                 name="pick_${idx}_1" 
                 value="E" 
                 ${locked ? 'disabled' : ''}
                 onchange="handleCheckboxChange(${idx}, 1, 'E')">
        </td>
        <td class="team-cell">
          <span class="team-name">${esc(p.visit)}</span>
          ${p.logoVisit ? `<img class="logo" src="${esc(p.logoVisit)}" alt="">` : ''}
        </td>
        <td class="checkbox-cell">
          <input type="checkbox" 
                 id="pick_V_${idx}_1" 
                 name="pick_${idx}_1" 
                 value="V" 
                 ${locked ? 'disabled' : ''}
                 onchange="handleCheckboxChange(${idx}, 1, 'V')">
        </td>
      </tr>
    `;
  });

  // SEPARATOR: QUINIELA 2X1
  html += `
    <tr class="separator-row">
      <td colspan="5">⚽ QUINIELA 2X1 ⚽</td>
    </tr>
  `;

  // ENTRY 2: Mismos 10 partidos repetidos
  partidos.forEach((p, idx) => {
    const locked = !!p.locked;
    const rowClass = locked ? 'locked' : '';
    
    html += `
      <tr class="${rowClass}" data-idx="${idx}" data-entry="2">
        <td class="checkbox-cell">
          <input type="checkbox" 
                 id="pick_L_${idx}_2" 
                 name="pick_${idx}_2" 
                 value="L" 
                 ${locked ? 'disabled' : ''}
                 onchange="handleCheckboxChange(${idx}, 2, 'L')">
        </td>
        <td class="team-cell">
          ${p.logoLocal ? `<img class="logo" src="${esc(p.logoLocal)}" alt="">` : ''}
          <span class="team-name">${esc(p.local)}</span>
        </td>
        <td class="checkbox-cell">
          <input type="checkbox" 
                 id="pick_E_${idx}_2" 
                 name="pick_${idx}_2" 
                 value="E" 
                 ${locked ? 'disabled' : ''}
                 onchange="handleCheckboxChange(${idx}, 2, 'E')">
        </td>
        <td class="team-cell">
          <span class="team-name">${esc(p.visit)}</span>
          ${p.logoVisit ? `<img class="logo" src="${esc(p.logoVisit)}" alt="">` : ''}
        </td>
        <td class="checkbox-cell">
          <input type="checkbox" 
                 id="pick_V_${idx}_2" 
                 name="pick_${idx}_2" 
                 value="V" 
                 ${locked ? 'disabled' : ''}
                 onchange="handleCheckboxChange(${idx}, 2, 'V')">
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  box.innerHTML = html;
  
  // Cargar picks guardados
  loadPicksForEntry(1);
  loadPicksForEntry(2);
}
```

### Paso 3: Manejar Checkboxes (Solo 1 Seleccionado)
```javascript
function handleCheckboxChange(idx, entry, value){
  // Desmarcar los otros checkboxes del mismo partido y entry
  const otherValues = ['L', 'E', 'V'].filter(v => v !== value);
  
  otherValues.forEach(v => {
    const checkbox = document.getElementById(`pick_${v}_${idx}_${entry}`);
    if(checkbox){
      checkbox.checked = false;
    }
  });
  
  // Limpiar marcas rojas si existían
  const row = document.querySelector(`tr[data-idx="${idx}"][data-entry="${entry}"]`);
  if(row){
    row.classList.remove('pick-missing');
  }
}
```

### Paso 4: Nueva Función submitAll()
```javascript
function submitAll(){
  const saveMsg = document.getElementById("saveMsg");
  saveMsg.innerHTML = "Guardando…";

  // Limpiar marcas previas
  document.querySelectorAll('.pick-missing').forEach(el => el.classList.remove('pick-missing'));

  if(!SESSION.partidos || SESSION.partidos.length === 0){
    saveMsg.innerHTML = `<span class="bad">⛔ Error: No hay partidos cargados.</span>`;
    return;
  }

  const partidos = SESSION.partidos.slice(0, 10);
  const picks1 = [];
  const picks2 = [];

  partidos.forEach((p, idx) => {
    // Entry 1
    const pickL1 = document.getElementById(`pick_L_${idx}_1`)?.checked;
    const pickE1 = document.getElementById(`pick_E_${idx}_1`)?.checked;
    const pickV1 = document.getElementById(`pick_V_${idx}_1`)?.checked;
    
    let pick1 = "";
    if(pickL1) pick1 = "L";
    else if(pickE1) pick1 = "E";
    else if(pickV1) pick1 = "V";
    
    picks1.push({ local: p.local, visit: p.visit, pick: pick1, gl: "", gv: "" });

    // Entry 2
    const pickL2 = document.getElementById(`pick_L_${idx}_2`)?.checked;
    const pickE2 = document.getElementById(`pick_E_${idx}_2`)?.checked;
    const pickV2 = document.getElementById(`pick_V_${idx}_2`)?.checked;
    
    let pick2 = "";
    if(pickL2) pick2 = "L";
    else if(pickE2) pick2 = "E";
    else if(pickV2) pick2 = "V";
    
    picks2.push({ local: p.local, visit: p.visit, pick: pick2, gl: "", gv: "" });
  });

  // Validar que hay al menos un pick
  const validPicks1 = picks1.filter(p => p.pick && VALID_PICK_VALUES.includes(p.pick));
  const validPicks2 = picks2.filter(p => p.pick && VALID_PICK_VALUES.includes(p.pick));

  if(validPicks1.length === 0 && validPicks2.length === 0){
    saveMsg.innerHTML = `<span class="bad">⛔ No hay picks para guardar.</span>`;
    
    // Marcar filas sin picks
    partidos.forEach((p, idx) => {
      const row1 = document.querySelector(`tr[data-idx="${idx}"][data-entry="1"]`);
      const row2 = document.querySelector(`tr[data-idx="${idx}"][data-entry="2"]`);
      
      if(row1 && !picks1[idx].pick) row1.classList.add('pick-missing');
      if(row2 && !picks2[idx].pick) row2.classList.add('pick-missing');
    });
    
    return;
  }

  // Enviar a API
  google.script.run
    .withSuccessHandler(r => {
      if(!r || !r.ok){
        saveMsg.innerHTML = `<span class="bad">⛔ ${esc(r?.error || "Error")}</span>`;
        return;
      }

      const detail = r.detail || {};
      const r1 = detail.entry1 || { created:0, updated:0, blocked:0 };
      const r2 = detail.entry2 || { created:0, updated:0, blocked:0 };
      
      saveMsg.innerHTML =
        `<span class="ok" style="font-size:18px;font-weight:900">🎉 ¡Tu quiniela ha sido guardada, suerte!!!</span>
         <div class="small" style="margin-top:6px">Entry 1: ${r1.created+r1.updated} · Entry 2: ${r2.created+r2.updated}</div>`;
      
      document.querySelectorAll('.pick-missing').forEach(el => el.classList.remove('pick-missing'));
    })
    .withFailureHandler(err => {
      saveMsg.innerHTML = `<span class="bad">⛔ Error: ${esc(err?.message || "intenta de nuevo")}</span>`;
    })
    .api_submit({ 
      token: SESSION.token, 
      jornada: SESSION.jornada, 
      picks1: picks1,
      picks2: picks2
    });
}
```

### Paso 5: Nueva Función fillPicksInForm()
```javascript
function fillPicksInForm(picks, entry){
  const partidos = SESSION.partidos.slice(0, 10);
  
  partidos.forEach((p, idx) => {
    const key = generateMatchKey(SESSION.jornada, p.local, p.visit);
    const saved = picks[key];
    if(!saved || !saved.pick) return;

    // Marcar el checkbox correspondiente
    const checkboxId = `pick_${saved.pick}_${idx}_${entry}`;
    const checkbox = document.getElementById(checkboxId);
    if(checkbox){
      checkbox.checked = true;
    }
  });
}
```

## 📱 Responsive Design
- En móviles: scroll horizontal en tabla
- Checkboxes más grandes (touch-friendly)
- Texto legible en pantallas pequeñas

## ✅ Testing Checklist
- [ ] Tabla se renderiza correctamente
- [ ] Checkboxes funcionan (solo uno por fila)
- [ ] Logos de equipos se muestran
- [ ] Guardar picks funciona
- [ ] Cargar picks funciona
- [ ] Separador "QUINIELA 2X1" visible
- [ ] Locked rows están deshabilitadas
- [ ] Validación de campos vacíos
- [ ] Mensaje de éxito aparece
- [ ] Responsive en móvil

## 🔄 Backward Compatibility
- Backend NO necesita cambios (ya acepta picks1/picks2)
- Solo cambio visual en frontend
- Datos existentes siguen funcionando

---

**Próximos pasos**: Implementar este diseño reemplazando el actual sistema de cards.
