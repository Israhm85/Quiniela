/***************
 * QUINIELA LIGA MX - SISTEMA PRO (Apps Script)
 * - 1 punto por acierto (L/V/E)
 * - Bloqueo picks: LockMinutes antes del kickoff
 * - Bloqueo picks inmediato si ya hay MARCADOR
 * - Bloqueo si JornadaCerrada=SI
 * - WebApp: registro por NOMBRE (sin repetidos) => TOKEN (no lo memoriza)
 * - 2x1: ENTRY=1 y ENTRY=2 por jugador
 ***************/

const SHEETS = {
  CONFIG: "CONFIG",
  PARTIDOS: "PARTIDOS",
  JUGADORES: "JUGADORES",
  PRONOSTICOS: "PRONOSTICOS",
  TABLA: "TABLA",
  EQUIPOS: "EQUIPOS", // ✅ NUEVO
  DECIMO_PARTIDO: "DECIMO_PARTIDO", // ✅ DÉCIMO PARTIDO
};


const WEBAPP = {
  TITLE: "Quiniela Liga MX",
};

/***************
 * MENU
 ***************/
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Quiniela")
    .addItem("0) Setup inicial", "setupInicial")
    .addSeparator()
    .addItem("1) Agregar jugador (admin)", "uiAgregarJugador")
    .addItem("2) Generar pronósticos (jornada en CONFIG)", "generarPronosticosJornadaConfig")
    .addItem("3) Calcular puntos (jornada en CONFIG)", "calcularPuntosJornadaConfig")
    .addItem("4) Actualizar tabla general", "actualizarTablaGeneral")
    .addSeparator()
    .addItem("🔒 Cerrar jornada actual", "cerrarJornadaActual")
    .addItem("🔓 Abrir jornada actual", "abrirJornadaActual")
    .addItem("📲 Resumen WhatsApp (jornada actual)", "whatsResumenJornadaActual")
    .addItem("📅 Importar calendario (ESPN)", "importarCalendarioESPN")
    .addItem("🧠 Rellenar jornadas faltantes", "rellenarJornadasFaltantes")
    .addItem("🧹 Normalizar jornadas a 17", "normalizarJornadasLigaMX")
    .addItem("⚽ Sync marcadores (ESPN)", "syncMarcadoresESPN")
    .addSeparator()
    .addItem("🌍 Seleccionar décimo partido", "uiSeleccionarDecimoPartido")
    .addItem("⚽ Capturar marcador décimo partido", "uiCapturarMarcadorDecimoPartido")
    .addItem("🗑️ Quitar décimo partido", "quitarDecimoPartido")
    .addSeparator()
    .addItem("🗓️ Programar Sync por calendario (hoy/mañana)", "programarSyncPorCalendario")
    .addItem("🧹 Borrar triggers de Sync", "desactivarAutoSyncMarcadores")
    .addSeparator()
    .addItem("⏰ Activar programación diaria (10am)", "activarProgramacionDiariaSync")
    .addItem("🛑 Desactivar programación diaria", "desactivarProgramacionDiariaSync")
    .addItem("📲 Ver último resumen WhatsApp", "verUltimoResumenWA")
    .addToUi();
}

/***************
 * SETUP
 ***************/
function setupInicial() {
  const ss = SpreadsheetApp.getActive();

  ensureHeaders_(ss.getSheetByName(SHEETS.CONFIG), ["KEY", "VALUE"]);
  ensureHeaders_(ss.getSheetByName(SHEETS.PARTIDOS), ["JORNADA", "FECHA", "LOCAL", "VISITANTE", "MARCADOR", "RES"]);
  ensureHeaders_(ss.getSheetByName(SHEETS.JUGADORES), ["ID", "NOMBRE", "TOKEN", "ACTIVO", "PAGADO", "FECHA_REG"]);

  // ✅ PRONOSTICOS con ENTRY
  ensureHeaders_(ss.getSheetByName(SHEETS.PRONOSTICOS), ["JORNADA", "ID", "NOMBRE", "ENTRY", "LOCAL", "VISITANTE", "PICK", "PICK_MARCADOR", "PUNTOS", "TIMESTAMP"]);

  // ✅ TABLA con ENTRY
  ensureHeaders_(ss.getSheetByName(SHEETS.TABLA), ["ID", "ENTRY", "NOMBRE", "PUNTOS_TOTALES", "ULTIMA_JORNADA"]);

  // ✅ NUEVA hoja de logos
  let shEq = ss.getSheetByName(SHEETS.EQUIPOS);
  if (!shEq) shEq = ss.insertSheet(SHEETS.EQUIPOS);
  ensureHeaders_(shEq, ["NOMBRE", "LOGO"]);

  // ✅ NUEVA hoja para décimo partido
  let shDecimo = ss.getSheetByName(SHEETS.DECIMO_PARTIDO);
  if (!shDecimo) shDecimo = ss.insertSheet(SHEETS.DECIMO_PARTIDO);
  ensureHeaders_(shDecimo, ["JORNADA", "LIGA", "LOCAL", "VISITANTE", "FECHA", "LOGO_LOCAL", "LOGO_VISITANTE"]);

  const shCfg = ss.getSheetByName(SHEETS.CONFIG);
  const map = readConfigMap_(shCfg);

  const defaults = [
    ["JornadaActual", map["JornadaActual"] ?? 1],
    ["Puntos_Acierto", map["Puntos_Acierto"] ?? 1],
    ["LockMinutes", map["LockMinutes"] ?? 10],
    ["Admins", map["Admins"] ?? ""],
    ["JornadaCerrada", map["JornadaCerrada"] ?? "NO"],
    ["CostoEntry", map["CostoEntry"] ?? 50],
    ["PorcentajeComision", map["PorcentajeComision"] ?? 20],
    ["PorcentajePremioMenor", map["PorcentajePremioMenor"] ?? 15],
    ["PorcentajePremioMayor", map["PorcentajePremioMayor"] ?? 85],
  ];

  if (shCfg.getLastRow() > 1) shCfg.getRange(2, 1, shCfg.getLastRow() - 1, 2).clearContent();
  shCfg.getRange(2, 1, defaults.length, 2).setValues(defaults);

  SpreadsheetApp.getUi().alert("Setup listo ✅ (incluye ENTRY 2x1 + EQUIPOS logos + sistema de pagos + % configurables + décimo partido opcional).");
}


/***************
 * ADMIN: agregar jugador manual
 ***************/
function uiAgregarJugador() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt("Agregar jugador", "Nombre del jugador:", ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const nombre = (r.getResponseText() || "").trim();
  if (!nombre) return ui.alert("Nombre vacío.");

  const out = registrarJugador_(nombre);
  if (!out.ok) return ui.alert(out.error);

  ui.alert(`Jugador agregado ✅\nNombre: ${nombre}\nTOKEN (solo admin): ${out.token}`);
}

/***************
 * Registro interno (con nombre único)
 ***************/
function registrarJugador_(nombre) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.JUGADORES);
  ensureHeaders_(sh, ["ID", "NOMBRE", "TOKEN", "ACTIVO", "PAGADO", "FECHA_REG"]);

  const norm = normalizeName_(nombre);
  const lr = sh.getLastRow();
  if (lr >= 2) {
    const rows = sh.getRange(2,1,lr-1,6).getValues();
    for (const r of rows) {
      if (normalizeName_(r[1]) === norm) {
        return { ok:false, error:"⛔ Ese nombre ya existe (no se permiten repetidos)." };
      }
    }
  }

  const id = nextJugadorId_(sh);
  const token = Utilities.getUuid();
  sh.appendRow([id, nombre, token, "SI", "NO", new Date()]);
  
  // Setup checkbox for PAGADO column (column 5)
  const newRow = sh.getLastRow();
  setupCheckboxForPagado_(sh, newRow);
  
  return { ok:true, id, token };
}

/**
 * Setup checkbox data validation for PAGADO column
 */
function setupCheckboxForPagado_(sheet, row) {
  const pagadoCol = 5; // Column E (PAGADO)
  const cell = sheet.getRange(row, pagadoCol);
  
  // Create checkbox validation with checked="SI" and unchecked="NO"
  const rule = SpreadsheetApp.newDataValidation()
    .requireCheckbox("SI", "NO")
    .setAllowInvalid(false)
    .build();
  
  cell.setDataValidation(rule);
  
  // Set initial value to unchecked (NO)
  cell.setValue("NO");
}

/**
 * Batch setup checkboxes for all existing players in JUGADORES sheet
 * Run this manually once to convert existing SI/NO values to checkboxes
 */
function setupAllCheckboxesForPagado() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.JUGADORES);
  const lr = sh.getLastRow();
  
  if (lr < 2) {
    Logger.log("No players to setup");
    return;
  }
  
  const pagadoCol = 5; // Column E (PAGADO)
  const range = sh.getRange(2, pagadoCol, lr - 1, 1);
  
  // Create checkbox validation
  const rule = SpreadsheetApp.newDataValidation()
    .requireCheckbox("SI", "NO")
    .setAllowInvalid(false)
    .build();
  
  // Apply to all player rows
  range.setDataValidation(rule);
  
  Logger.log(`Setup checkboxes for ${lr - 1} players`);
  SpreadsheetApp.getUi().alert(`✅ Checkboxes configurados para ${lr - 1} jugadores en la columna PAGADO`);
}

function nextJugadorId_(shJug) {
  const lr = shJug.getLastRow();
  if (lr < 2) return 1;
  const ids = shJug.getRange(2, 1, lr - 1, 1).getValues().flat().map(Number).filter(n => n > 0);
  return (ids.length ? Math.max(...ids) : 0) + 1;
}

/***************
 * GENERAR PRONOSTICOS (JornadaActual) con 2x1 ENTRY
 ***************/
function generarPronosticosJornadaConfig() {
  const ss = SpreadsheetApp.getActive();
  const jornada = Number(getConfig_("JornadaActual")) || 1;

  const partidos = getPartidosPorJornada_(jornada);
  if (!partidos.length) return SpreadsheetApp.getUi().alert(`No hay partidos para jornada ${jornada}.`);
  
  // ✅ Agregar décimo partido si existe
  const decimoPartido = getDecimoPartidoPorJornada_(jornada);
  if (decimoPartido && decimoPartido.local && decimoPartido.visitante) {
    partidos.push({
      jornada: jornada,
      local: decimoPartido.local,
      visitante: decimoPartido.visitante
    });
  }

  const jugadores = getJugadoresActivos_();
  if (!jugadores.length) return SpreadsheetApp.getUi().alert("No hay jugadores activos.");

  const shPro = ss.getSheetByName(SHEETS.PRONOSTICOS);
  ensureHeaders_(shPro, ["JORNADA","ID","NOMBRE","ENTRY","LOCAL","VISITANTE","PICK","PICK_MARCADOR","PUNTOS","TIMESTAMP"]);

  const lr = shPro.getLastRow();
  const data = (lr >= 2) ? shPro.getRange(2,1,lr-1,10).getValues() : [];
  const set = new Set();

  for (const r of data) {
    const jor = Number(r[0]);
    const id  = Number(r[1]);
    const entry = Number(r[3]) || 1;
    const local = String(r[4]||"");
    const vis   = String(r[5]||"");
    if (jor && id && local && vis) set.add(`${jor}|${id}|${entry}|${local}`.toLowerCase() + `|${vis}`.toLowerCase());
  }

  const now = new Date();
  const rows = [];

  for (const j of jugadores) {
    for (const p of partidos) {
      for (const entry of [1, 2]) {
        const key = `${jornada}|${j.id}|${entry}|${p.local}`.toLowerCase() + `|${p.visitante}`.toLowerCase();
        if (!set.has(key)) {
          rows.push([jornada, j.id, j.nombre, entry, p.local, p.visitante, "", "", "", now]);
        }
      }
    }
  }

  if (!rows.length) return SpreadsheetApp.getUi().alert("No hay pronósticos faltantes.");
  shPro.getRange(shPro.getLastRow() + 1, 1, rows.length, 10).setValues(rows);
  SpreadsheetApp.getUi().alert(`Listo ✅ agregué ${rows.length} filas (ENTRY 1 y 2).`);
}

/***************
 * CALCULAR PUNTOS (por jornada CONFIG)
 ***************/
function calcularPuntosJornadaConfig() {
  const jornada = Number(getConfig_("JornadaActual")) || 1;
  calcularPuntosParaJornada_(jornada);
  SpreadsheetApp.getUi().alert(`Puntos recalculados ✅ para jornada ${jornada}.`);
}

function calcularPuntosParaJornada_(jornada) {
  const ss = SpreadsheetApp.getActive();
  const puntosAcierto = Number(getConfig_("Puntos_Acierto")) || 1;

  const shPar = ss.getSheetByName(SHEETS.PARTIDOS);
  const shPro = ss.getSheetByName(SHEETS.PRONOSTICOS);

  const resMap = buildResultadosMap_(shPar, jornada);

  const lr = shPro.getLastRow();
  if (lr < 2) return;

  const data = shPro.getRange(2, 1, lr - 1, 10).getValues();
  let changed = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const jor = Number(row[0]);
    if (jor !== Number(jornada)) continue;

    const local = String(row[4] || "");
    const vis   = String(row[5] || "");
    const pick  = String(row[6] || "").trim().toUpperCase();

    const key = makeKeyRes_(jornada, local, vis);
    const real = resMap[key];
    if (!real || !real.res) continue;

    const pts = (pick && pick === real.res) ? puntosAcierto : 0;
    if (Number(row[8]) !== pts) {
      row[8] = pts;
      changed++;
    }
  }

  if (changed) shPro.getRange(2, 1, data.length, 10).setValues(data);
}

/***************
 * TABLA GENERAL (ID+ENTRY)
 ***************/
function actualizarTablaGeneral() {
  const ss = SpreadsheetApp.getActive();
  const shPro = ss.getSheetByName(SHEETS.PRONOSTICOS);
  const shTab = ss.getSheetByName(SHEETS.TABLA);

  ensureHeaders_(shTab, ["ID","ENTRY","NOMBRE","PUNTOS_TOTALES","ULTIMA_JORNADA"]);

  const lr = shPro.getLastRow();
  if (lr < 2) return;

  const data = shPro.getRange(2, 1, lr - 1, 10).getValues();
  const totals = new Map(); // key = id|entry

  for (const r of data) {
    const jor = Number(r[0]);
    const id = Number(r[1]);
    const nombre = String(r[2] || "");
    const entry = Number(r[3]) || 1;
    const pts = Number(r[8]) || 0;
    if (!id) continue;

    const key = `${id}|${entry}`;
    if (!totals.has(key)) totals.set(key, { id, entry, nombre, puntos: 0, maxJornada: 0 });

    const obj = totals.get(key);
    obj.nombre = obj.nombre || nombre;
    obj.puntos += pts;
    obj.maxJornada = Math.max(obj.maxJornada, jor || 0);
  }

  if (shTab.getLastRow() > 1) shTab.getRange(2, 1, shTab.getLastRow() - 1, 5).clearContent();

  const rows = Array.from(totals.values())
    .map(o => [o.id, o.entry, `${o.nombre} (${o.entry})`, o.puntos, o.maxJornada])
    .sort((a, b) => b[3] - a[3]);

  if (rows.length) shTab.getRange(2, 1, rows.length, 5).setValues(rows);
}

/***************
 * onEdit
 * A) PARTIDOS: MARCADOR -> RES + puntos + tabla + auto avanzar
 * B) PRONOSTICOS: bloquear picks
 ***************/
function onEdit(e) {
  try {
    if (!e || !e.range) return;

    const ss = e.source || SpreadsheetApp.getActiveSpreadsheet();
    const sh = e.range.getSheet();
    const sheetName = sh.getName();

    // A) PARTIDOS
    if (sheetName === SHEETS.PARTIDOS) {
      const row = e.range.getRow();
      if (row < 2) return;

      const startCol = e.range.getColumn();
      const numCols = e.range.getNumColumns();
      const touchesMarcador = (startCol <= 5 && (startCol + numCols - 1) >= 5);
      if (!touchesMarcador) return;

      const jornada = sh.getRange(row, 1).getValue();
      const local   = sh.getRange(row, 3).getValue();
      const visit   = sh.getRange(row, 4).getValue();
      const marcador = String(sh.getRange(row, 5).getValue() || "").trim();
      if (!jornada || !local || !visit || !marcador) return;

      const res = calcResFromMarcador_(marcador);
      if (res) sh.getRange(row, 6).setValue(res);

      calcularPuntosParaJornada_(Number(jornada));
      actualizarTablaGeneral();

      if (typeof autoAvanzarJornadaSiAplica_ === "function") {
        autoAvanzarJornadaSiAplica_(Number(jornada));
      }

      ss.toast(`✅ Actualizado: RES=${res || "?"}, puntos y tabla (J${jornada}).`, "Quiniela", 6);
      return;
    }

    // B) PRONOSTICOS: bloquear picks (PICK col 7, PICK_MARCADOR col 8)
    if (sheetName === SHEETS.PRONOSTICOS) {
      const row = e.range.getRow();
      if (row < 2) return;

      const startCol = e.range.getColumn();
      const numCols = e.range.getNumColumns();
      const touchesPick = (startCol <= 7 && (startCol + numCols - 1) >= 7);
      const touchesPickMarc = (startCol <= 8 && (startCol + numCols - 1) >= 8);
      if (!touchesPick && !touchesPickMarc) return;

      if (typeof isAdmin_ === "function" && isAdmin_()) return;

      if (isJornadaCerrada_()) {
        revertEdit_(e);
        ss.toast("⛔ Picks bloqueados: la jornada está CERRADA.", "Quiniela", 6);
        return;
      }

      const jornada = sh.getRange(row, 1).getValue();
      const local   = sh.getRange(row, 5).getValue();
      const visit   = sh.getRange(row, 6).getValue();

      const info = getPartidoInfo_(ss, jornada, local, visit);

      if (info.hasMarcador) {
        revertEdit_(e);
        ss.toast("⛔ Picks bloqueados: ya hay MARCADOR capturado para este partido.", "Quiniela", 7);
        return;
      }

      if (!info.startTime) {
        ss.toast("⚠️ No encontré FECHA/HORA del partido en PARTIDOS.", "Quiniela", 6);
        return;
      }

      const lockMinutes = Number(getConfig_("LockMinutes")) || 10;
      const lockTime = new Date(info.startTime.getTime() - lockMinutes * 60 * 1000);

      if (new Date() >= lockTime) {
        revertEdit_(e);
        ss.toast(`⛔ Picks bloqueados ${lockMinutes} min antes. Kickoff: ${formatDate_(info.startTime)}`, "Quiniela", 7);
        return;
      }
    }
  } catch (err) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Error onEdit: " + err.message, "Quiniela", 8);
  }
}

function revertEdit_(e) {
  const r = e.range;
  const oldVal = (typeof e.oldValue !== "undefined") ? e.oldValue : "";
  if (r.getNumRows() === 1 && r.getNumColumns() === 1) {
    r.setValue(oldVal);
    return;
  }
  r.clearContent();
}

/***************
 * PARTIDO INFO (fecha + marcador)
 ***************/
function getPartidoInfo_(ss, jornada, local, visitante) {
  const sh = ss.getSheetByName(SHEETS.PARTIDOS);
  const lr = sh.getLastRow();
  if (lr < 2) return { startTime: null, hasMarcador: false };

  const data = sh.getRange(2, 1, lr - 1, 6).getValues();
  const j = Number(jornada);

  const L = normalize_(local);
  const V = normalize_(visitante);

  for (const r of data) {
    const rJ = Number(r[0]);
    const rFecha = r[1];
    const rLocal = normalize_(r[2]);
    const rVis = normalize_(r[3]);
    const rMarc = String(r[4] || "").trim();

    if (rJ === j && rLocal === L && rVis === V) {
      let startTime = null;
      if (rFecha instanceof Date && !isNaN(rFecha.getTime())) {
        startTime = rFecha;
      } else if (rFecha) {
        const parsed = new Date(rFecha);
        startTime = isNaN(parsed.getTime()) ? null : parsed;
      }
      return { startTime, hasMarcador: !!rMarc };
    }
  }
  return { startTime: null, hasMarcador: false };
}

function calcResFromMarcador_(marcador) {
  const m = String(marcador || "").trim();
  if (!m.includes("-")) return null;

  const parts = m.split("-").map(s => Number(String(s).trim()));
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;

  if (parts[0] > parts[1]) return "L";
  if (parts[0] < parts[1]) return "V";
  return "E";
}

function buildResultadosMap_(shPar, jornada) {
  const lr = shPar.getLastRow();
  const map = {};
  if (lr < 2) return map;

  const rows = shPar.getRange(2, 1, lr - 1, 6).getValues();
  for (const r of rows) {
    const jor = Number(r[0]);
    if (jor !== Number(jornada)) continue;

    const local = String(r[2] || "");
    const vis = String(r[3] || "");
    const marcador = String(r[4] || "").trim();
    let res = String(r[5] || "").trim().toUpperCase();

    if (!res && marcador) res = calcResFromMarcador_(marcador) || "";

    const key = makeKeyRes_(jornada, local, vis);
    map[key] = { res, marcador };
  }
  return map;
}

/***************
 * CONFIG / ADMIN / LOCK
 ***************/
function cerrarJornadaActual() {
  setConfig_("JornadaCerrada", "SI");
  setConfig_("Cierre_Jornada", new Date());
  SpreadsheetApp.getActiveSpreadsheet().toast("🔒 Jornada cerrada. Picks bloqueados.", "Quiniela", 6);
}

function abrirJornadaActual() {
  setConfig_("JornadaCerrada", "NO");
  setConfig_("Cierre_Jornada", "");
  SpreadsheetApp.getActiveSpreadsheet().toast("🔓 Jornada abierta. Picks permitidos.", "Quiniela", 6);
}

function isJornadaCerrada_() {
  return String(getConfig_("JornadaCerrada") || "NO").toUpperCase() === "SI";
}

function isAdmin_() {
  const admins = String(getConfig_("Admins") || "").trim();
  if (!admins) return false;
  const adminList = admins.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const email = (Session.getActiveUser().getEmail() || "").toLowerCase();
  return email && adminList.includes(email);
}

/***************
 * JUGADORES
 ***************/
function getJugadoresActivos_() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.JUGADORES);
  const lr = sh.getLastRow();
  if (lr < 2) return [];

  const rows = sh.getRange(2, 1, lr - 1, 5).getValues();
  return rows
    .filter(r => String(r[3] || "").toUpperCase() === "SI")
    .map(r => ({ id: Number(r[0]), nombre: String(r[1] || "") }));
}

function findJugadorByToken_(token) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.JUGADORES);
  const lr = sh.getLastRow();
  if (lr < 2) return null;

  const rows = sh.getRange(2,1,lr-1,6).getValues();
  for (const r of rows) {
    if (String(r[2] || "").trim() === String(token || "").trim()) {
      return { 
        id: Number(r[0]), 
        nombre: String(r[1] || ""), 
        token: String(r[2]||""), 
        activo: String(r[3]||"SI"),
        pagado: String(r[4]||"NO").toUpperCase() === "SI"
      };
    }
  }
  return null;
}

/***************
 * PARTIDOS helpers
 ***************/
function readPartidos_(shPartidos) {
  const lr = shPartidos.getLastRow();
  if (lr < 2) return [];
  const rows = shPartidos.getRange(2, 1, lr - 1, 6).getValues();
  return rows
    .filter(r => r[0] !== "" && r[2] && r[3])
    .map(r => ({ jornada: Number(r[0]), local: String(r[2]), visitante: String(r[3]) }));
}

function getPartidosPorJornada_(jornada) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.PARTIDOS);
  return readPartidos_(sh).filter(p => p.jornada === Number(jornada));
}

/***************
 * WEBAPP: doGet + API endpoints
 ***************/
function doGet(e) {
  const tpl = HtmlService.createTemplateFromFile("Index");
  tpl.urlToken = (e?.parameter?.t || "").toString().trim();
  return tpl.evaluate()
    .setTitle("⚽ Quiniela Liga MX - Participa Ahora")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function api_bootstrap() {
  const jornada = Number(getConfig_("JornadaActual")) || 1;
  const lockMinutes = Number(getConfig_("LockMinutes")) || 10;
  return {
    ok: true,
    jornada,
    lockMinutes,
    jornadaCerrada: isJornadaCerrada_(),
    partidos: getPartidosWebPorJornada_(jornada, lockMinutes),
    nowMs: Date.now(),
  };
}

function api_register(nombreRaw) {
  const nombre = String(nombreRaw || "").trim();
  if (!nombre) return { ok:false, error:"Escribe tu nombre." };

  const out = registrarJugador_(nombre);
  if (!out.ok) return out;

  return { ok:true, token: out.token, nombre };
}

function api_loginByToken(tokenRaw) {
  const token = String(tokenRaw || "").trim();
  if (!token) return { ok:false, error:"Sin token." };

  const player = findJugadorByToken_(token);
  if (!player) return { ok:false, error:"Sesión inválida (token)." };
  if (String(player.activo).toUpperCase() !== "SI") return { ok:false, error:"Jugador inactivo." };

  return { ok:true, id: player.id, nombre: player.nombre };
}

function api_getMyPicks(token, jornada, entry) {
  const player = findJugadorByToken_(token);
  if (!player) return { ok:false };

  jornada = Number(jornada);
  entry = Number(entry) || 1;

  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.PRONOSTICOS);
  ensureHeaders_(sh, ["JORNADA","ID","NOMBRE","ENTRY","LOCAL","VISITANTE","PICK","PICK_MARCADOR","PUNTOS","TIMESTAMP"]);

  const lr = sh.getLastRow();
  if (lr < 2) return { ok:true, picks:{} };

  const data = sh.getRange(2,1,lr-1,10).getValues();
  const map = {};

  for (const r of data) {
    if (Number(r[0]) !== jornada) continue;
    if (Number(r[1]) !== Number(player.id)) continue;
    if ((Number(r[3]) || 1) !== entry) continue;

    const local = String(r[4]||"");
    const visit = String(r[5]||"");
    const key = makeKeyRes_(jornada, local, visit);

    let gl="", gv="";
    const pm = String(r[7]||"").trim();
    if (pm && pm.includes("-")) {
      const parts = pm.split("-");
      gl = parts[0]; gv = parts[1];
    }

    map[key] = { pick: String(r[6]||""), gl, gv };
  }

  return { ok:true, picks: map };
}

function api_submit(payload) {
  try {
    const ss = SpreadsheetApp.getActive();

    const token = String(payload?.token || "").trim();
    const jornada = Number(payload?.jornada) || Number(getConfig_("JornadaActual")) || 1;

    const picks1 = Array.isArray(payload?.picks1) ? payload.picks1 : [];
    const picks2 = Array.isArray(payload?.picks2) ? payload.picks2 : [];

    if (!token) return { ok: false, error: "Falta token." };
    if (!picks1.length && !picks2.length) return { ok: false, error: "No hay picks para guardar." };

    // Bloqueo manual de jornada
    if (typeof isJornadaCerrada_ === "function" && isJornadaCerrada_()) {
      return { ok: false, error: "La jornada está CERRADA. No se pueden guardar picks." };
    }

    // Jugador
    const player = findJugadorByToken_(token);
    if (!player) return { ok: false, error: "Sesión inválida. Vuelve a entrar con tu link." };

    const lockMinutes = Number(getConfig_("LockMinutes")) || 10;

    // Partidos jornada
    const shPar = ss.getSheetByName(SHEETS.PARTIDOS);
    const lrP = shPar.getLastRow();
    if (lrP < 2) return { ok: false, error: "No hay PARTIDOS cargados." };

    const parData = shPar.getRange(2, 1, lrP - 1, 6).getValues()
      .filter(r => Number(r[0]) === Number(jornada))
      .map(r => ({
        fecha: parseDateSafe_(r[1]),
        local: String(r[2] || ""),
        visit: String(r[3] || ""),
        marcador: String(r[4] || "").trim()
      }))
      .filter(p => p.local && p.visit);

    if (!parData.length) return { ok: false, error: `No hay partidos para jornada ${jornada}.` };

    const partidoIndex = {};
    for (const p of parData) {
      const k = makeKeyRes_(jornada, p.local, p.visit);
      partidoIndex[k] = p;
    }

    // PRONOSTICOS
    const shPro = ss.getSheetByName(SHEETS.PRONOSTICOS);
    ensureHeaders_(shPro, ["JORNADA","ID","NOMBRE","ENTRY","LOCAL","VISITANTE","PICK","PICK_MARCADOR","PUNTOS","TIMESTAMP"]);

    const lr = shPro.getLastRow();
    const data = (lr >= 2) ? shPro.getRange(2, 1, lr - 1, 10).getValues() : [];

    // Índice existente: jornada|id|entry|local|visit
    const existingIdx = new Map();
    for (let i = 0; i < data.length; i++) {
      const r = data[i];
      if (Number(r[0]) !== Number(jornada)) continue;
      if (Number(r[1]) !== Number(player.id)) continue;

      const entry = Number(r[3]) || 1;
      const local = String(r[4] || "");
      const visit = String(r[5] || "");
      if (!local || !visit) continue;

      const key = `${jornada}|${player.id}|${entry}|${local}`.toLowerCase() + `|${visit}`.toLowerCase();
      existingIdx.set(key, i);
    }

    const now = new Date();

    function upsertBatch(entry, picksArr) {
      let updated = 0, created = 0, blocked = 0;

      for (const it of picksArr) {
        const local = String(it?.local || "").trim();
        const visit = String(it?.visit || "").trim();
        const pick = String(it?.pick || "").trim().toUpperCase();
        const gl = String(it?.gl ?? "").trim();
        const gv = String(it?.gv ?? "").trim();

        if (!local || !visit) continue;
        if (pick && !["L","E","V"].includes(pick)) continue;

        const kRes = makeKeyRes_(jornada, local, visit);
        const partido = partidoIndex[kRes];
        if (!partido) continue;

        // Lock por marcador real
        if (partido.marcador) { blocked++; continue; }

        // Lock por tiempo
        if (partido.fecha instanceof Date && !isNaN(partido.fecha.getTime())) {
          const lockTime = new Date(partido.fecha.getTime() - lockMinutes * 60 * 1000);
          if (now >= lockTime) { blocked++; continue; }
        }

        let pickMarc = "";
        if (gl !== "" || gv !== "") {
          if (gl !== "" && gv !== "" && !isNaN(Number(gl)) && !isNaN(Number(gv))) {
            pickMarc = `${Number(gl)}-${Number(gv)}`;
          }
        }

        const key = `${jornada}|${player.id}|${entry}|${partido.local}`.toLowerCase() + `|${partido.visit}`.toLowerCase();

        if (existingIdx.has(key)) {
          const idx = existingIdx.get(key);
          data[idx][0] = jornada;
          data[idx][1] = player.id;
          data[idx][2] = player.nombre;
          data[idx][3] = entry;
          data[idx][4] = partido.local;
          data[idx][5] = partido.visit;
          data[idx][6] = pick;
          data[idx][7] = pickMarc;
          data[idx][9] = now;
          updated++;
        } else {
          data.push([jornada, player.id, player.nombre, entry, partido.local, partido.visit, pick, pickMarc, "", now]);
          existingIdx.set(key, data.length - 1);
          created++;
        }
      }

      return { updated, created, blocked };
    }

    const r1 = upsertBatch(1, picks1);
    const r2 = upsertBatch(2, picks2);

    if (data.length) shPro.getRange(2, 1, data.length, 10).setValues(data);

    return {
      ok: true,
      updated: r1.updated + r2.updated,
      created: r1.created + r2.created,
      blocked: r1.blocked + r2.blocked,
      detail: { entry1: r1, entry2: r2 }
    };

  } catch (err) {
    return { ok: false, error: "api_submit error: " + err.message };
  }
}


function api_getPublicState() {
  return { ok:true, jornada: Number(getConfig_("JornadaActual")) || 1, jornadaCerrada: isJornadaCerrada_() };
}

/***************
 * OBTENER INFORMACIÓN DEL POOL DE PREMIOS
 * Calcula montos basados en jugadores que pagaron
 ***************/
function api_getPrizePool() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.JUGADORES);
  const lr = sh.getLastRow();
  
  if (lr < 2) return { ok: true, jugadoresPagados: 0, costoEntry: 0, totalPool: 0, premioMayor: 0, premioMenor: 0 };
  
  const costoEntry = Number(getConfig_("CostoEntry")) || 50;
  
  // Obtener porcentajes configurables
  const pctComision = Number(getConfig_("PorcentajeComision")) || 20;
  const pctPremioMenor = Number(getConfig_("PorcentajePremioMenor")) || 15;
  const pctPremioMayor = Number(getConfig_("PorcentajePremioMayor")) || 85;
  
  // Contar jugadores que han pagado
  const rows = sh.getRange(2, 1, lr - 1, 6).getValues();
  let jugadoresPagados = 0;
  
  for (const r of rows) {
    const activo = String(r[3] || "").toUpperCase();
    const pagado = String(r[4] || "").toUpperCase();
    if (activo === "SI" && pagado === "SI") {
      jugadoresPagados++;
    }
  }
  
  // Calcular pool de premios con porcentajes configurables
  const totalRecaudado = jugadoresPagados * costoEntry;
  const comision = totalRecaudado * (pctComision / 100);
  const poolPremios = totalRecaudado * (1 - pctComision / 100);
  
  const premioMenor = poolPremios * (pctPremioMenor / 100);
  const premioMayor = poolPremios * (pctPremioMayor / 100);
  
  return {
    ok: true,
    jugadoresPagados,
    costoEntry,
    totalRecaudado,
    comision,
    poolPremios,
    premioMayor: Math.floor(premioMayor),
    premioMenor: Math.floor(premioMenor),
    porcentajes: {
      comision: pctComision,
      premioMenor: pctPremioMenor,
      premioMayor: pctPremioMayor
    }
  };
}

function api_getTablaGeneral() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.TABLA);
  ensureHeaders_(sh, ["ID","ENTRY","NOMBRE","PUNTOS_TOTALES","ULTIMA_JORNADA"]);
  const lr = sh.getLastRow();
  if (lr < 2) return { ok:true, rows: [] };

  const values = sh.getRange(2, 1, lr - 1, 5).getValues();
  const rows = values.map((r, i) => ({
    pos: i + 1,
    id: r[0],
    entry: r[1],
    nombre: r[2],
    puntos: r[3],
    ultimaJ: r[4],
  }));
  return { ok:true, rows };
}

/***************
 * PREMIO MAYOR (MÁS ACIERTOS) - POR JORNADA
 * - Gana quien tenga más aciertos (L/V/E correctos)
 * - Si hay empate, se reparte el premio (múltiples ganadores)
 * - Solo visible si JornadaCerrada=SI
 ***************/
function api_getPremioMayor(jornadaOpt) {
  const jornada = Number(jornadaOpt) || Number(getConfig_("JornadaActual")) || 1;

  // Solo visible si está cerrada
  if (!isJornadaCerrada_()) {
    return { ok: false, error: "La jornada aún no está cerrada." };
  }

  const ss = SpreadsheetApp.getActive();

  // 1) Index de resultados reales por partido
  const shPar = ss.getSheetByName(SHEETS.PARTIDOS);
  const lrP = shPar.getLastRow();
  if (lrP < 2) return { ok: false, error: "PARTIDOS vacío." };

  const partidos = shPar.getRange(2, 1, lrP - 1, 6).getValues()
    .filter(r => Number(r[0]) === jornada)
    .map(r => ({
      local: String(r[2] || "").trim(),
      visit: String(r[3] || "").trim(),
      marcadorReal: String(r[4] || "").trim(),
      resReal: String(r[5] || "").trim() || (r[4] ? (calcResFromMarcador_(String(r[4]).trim()) || "") : "")
    }))
    .filter(p => p.local && p.visit);

  if (!partidos.length) return { ok: false, error: `No hay partidos para jornada ${jornada}.` };

  const resIndex = {};
  for (const p of partidos) {
    resIndex[makeKeyRes_(jornada, p.local, p.visit)] = p.resReal;
  }

  // 2) Leer PRONOSTICOS de la jornada
  const shPro = ss.getSheetByName(SHEETS.PRONOSTICOS);
  const lr = shPro.getLastRow();
  if (lr < 2) return { ok: false, error: "PRONOSTICOS vacío." };

  // 2.1) Obtener IDs de jugadores que pagaron
  const shJug = ss.getSheetByName(SHEETS.JUGADORES);
  const lrJ = shJug.getLastRow();
  const jugadoresPagados = new Set();
  if (lrJ >= 2) {
    const jugRows = shJug.getRange(2, 1, lrJ - 1, 6).getValues();
    for (const j of jugRows) {
      const id = Number(j[0]);
      const activo = String(j[3] || "").toUpperCase();
      const pagado = String(j[4] || "").toUpperCase();
      if (activo === "SI" && pagado === "SI") {
        jugadoresPagados.add(id);
      }
    }
  }

  const data = shPro.getRange(2, 1, lr - 1, 10).getValues();

  // 3) Contar aciertos por entry (solo jugadores pagados)
  const map = new Map(); // key = id|entry
  for (const r of data) {
    const jor = Number(r[0]);
    if (jor !== jornada) continue;

    const id = Number(r[1]);
    
    // Solo incluir jugadores que pagaron
    if (!jugadoresPagados.has(id)) continue;
    
    const nombre = String(r[2] || "");
    const entry = Number(r[3]) || 1;
    const local = String(r[4] || "").trim();
    const visit = String(r[5] || "").trim();
    const pick = String(r[6] || "").trim().toUpperCase();

    if (!id || !local || !visit) continue;

    const key = `${id}|${entry}`;
    if (!map.has(key)) {
      map.set(key, { id, entry, nombre, aciertos: 0 });
    }

    const obj = map.get(key);
    if (!obj.nombre && nombre) obj.nombre = nombre;

    // Contar aciertos si hay resultado real
    const kPartido = makeKeyRes_(jornada, local, visit);
    const resReal = resIndex[kPartido];
    if (resReal && pick && pick === resReal) {
      obj.aciertos += 1;
    }
  }

  const rows = Array.from(map.values());
  if (!rows.length) {
    return { ok: true, jornada, winners: [], maxAciertos: 0 };
  }

  // 4) Encontrar el máximo de aciertos
  const maxAciertos = Math.max(...rows.map(r => r.aciertos));

  // 5) Todos los que tengan el máximo son ganadores (se reparte el premio)
  const winners = rows
    .filter(r => r.aciertos === maxAciertos)
    .sort((a, b) => {
      if (a.id !== b.id) return a.id - b.id;
      return a.entry - b.entry;
    });

  return {
    ok: true,
    jornada,
    maxAciertos,
    winners: winners.map(w => ({
      id: w.id,
      entry: w.entry,
      nombre: w.nombre,
      aciertos: w.aciertos
    }))
  };
}

function getPartidosWebPorJornada_(jornada, lockMinutes) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.PARTIDOS);
  const lr = sh.getLastRow();
  
  const now = new Date();
  const partidos = [];
  
  // Obtener partidos de Liga MX
  if (lr >= 2) {
    const rows = sh.getRange(2,1,lr-1,6).getValues();

    rows
      .filter(r => Number(r[0]) === Number(jornada))
      .forEach(r => {
        const fecha = parseDateSafe_(r[1]);
        const local = String(r[2] || "");
        const visit = String(r[3] || "");
        const marcador = String(r[4] || "").trim();

        let locked = false;
        let reason = "";

        if (marcador) { locked = true; reason = "MARCADOR"; }
        else if (fecha) {
          const lockTime = new Date(fecha.getTime() - lockMinutes*60*1000);
          if (now >= lockTime) { locked = true; reason = "TIEMPO"; }
        }

        if (local && visit) {
          partidos.push({
            local, visit,
            fechaTxt: fecha ? formatDate_(fecha) : "",
            marcador,
            locked, reason,
            logoLocal: getLigaMxLogoUrl_(local),
            logoVisit: getLigaMxLogoUrl_(visit),
          });
        }
      });
  }
  
  // ✅ Agregar décimo partido si existe
  const decimoPartido = getDecimoPartidoPorJornada_(jornada);
  if (decimoPartido && decimoPartido.local && decimoPartido.visitante) {
    let locked = false;
    let reason = "";
    
    if (decimoPartido.fecha) {
      const lockTime = new Date(decimoPartido.fecha.getTime() - lockMinutes*60*1000);
      if (now >= lockTime) { locked = true; reason = "TIEMPO"; }
    }
    
    partidos.push({
      local: decimoPartido.local,
      visit: decimoPartido.visitante,
      fechaTxt: decimoPartido.fecha ? formatDate_(decimoPartido.fecha) : "",
      marcador: "", // No tiene marcador en tiempo real
      locked, 
      reason,
      logoLocal: decimoPartido.logoLocal,
      logoVisit: decimoPartido.logoVisit,
      esDecimoPartido: true, // ✅ Marcador para identificarlo
      liga: decimoPartido.liga,
    });
  }
  
  return partidos;
}

/***************
 * HELPERS
 ***************/
function ensureHeaders_(sh, headers) {
  const existing = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  const ok = headers.every((h, i) => String(existing[i] || "").trim() === h);
  if (!ok) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function readConfigMap_(shCfg) {
  const lr = shCfg.getLastRow();
  if (lr < 2) return {};
  const rows = shCfg.getRange(2, 1, lr - 1, 2).getValues().filter(r => r[0]);
  const map = {};
  rows.forEach(r => map[String(r[0]).trim()] = r[1]);
  return map;
}

function getConfig_(key) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.CONFIG);
  const map = readConfigMap_(sh);
  return map[key];
}

function setConfig_(key, value) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.CONFIG);
  const lr = sh.getLastRow();
  if (lr < 2) {
    sh.appendRow([key, value]);
    return;
  }
  const rows = sh.getRange(2,1,lr-1,2).getValues();
  for (let i=0; i<rows.length; i++) {
    if (String(rows[i][0]).trim() === key) {
      sh.getRange(i+2,2).setValue(value);
      return;
    }
  }
  sh.appendRow([key, value]);
}

function makeKeyRes_(jornada, local, visitante) {
  return `${jornada}|${local}`.toLowerCase() + `|${visitante}`.toLowerCase();
}

function normalize_(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeName_(s) {
  return normalize_(s);
}

function parseDateSafe_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return v;
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "MMM d, yyyy h:mm a");
}
function upsertEquipoLogo_(nombre, logoUrl) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEETS.EQUIPOS);
  if (!sh) sh = ss.insertSheet(SHEETS.EQUIPOS);
  ensureHeaders_(sh, ["NOMBRE", "LOGO"]);

  const n = String(nombre || "").trim();
  const url = String(logoUrl || "").trim();
  if (!n || !url) return false;

  const lr = sh.getLastRow();
  const norm = normalize_(n);

  if (lr >= 2) {
    const rows = sh.getRange(2, 1, lr - 1, 2).getValues();
    for (let i = 0; i < rows.length; i++) {
      const existingName = String(rows[i][0] || "");
      if (normalize_(existingName) === norm) {
        sh.getRange(i + 2, 2).setValue(url);
        return true;
      }
    }
  }

  sh.appendRow([n, url]);
  return true;
}

function getEquipoLogo_(nombre) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.EQUIPOS);
  if (!sh) return "";

  const lr = sh.getLastRow();
  if (lr < 2) return "";

  const norm = normalize_(nombre);
  const rows = sh.getRange(2, 1, lr - 1, 2).getValues();

  for (const r of rows) {
    const n = String(r[0] || "");
    const logo = String(r[1] || "").trim();
    if (n && logo && normalize_(n) === norm) return logo;
  }
  return "";
}
function importarCalendarioESPN() {
  const ss = SpreadsheetApp.getActive();
  const shPar = ss.getSheetByName(SHEETS.PARTIDOS);

  const desde = String(getConfig_("CalDesde") || "20260101").trim();
  const hasta = String(getConfig_("CalHasta") || "20260630").trim();

  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/mex.1/scoreboard?dates=${desde}-${hasta}&limit=1000`;

  const resp = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  if (resp.getResponseCode() !== 200) {
    throw new Error(`ESPN error HTTP ${resp.getResponseCode()}: ${resp.getContentText().slice(0,200)}`);
  }

  const json = JSON.parse(resp.getContentText());
  const events = json.events || [];
  if (!events.length) {
    SpreadsheetApp.getUi().alert("No encontré partidos en ese rango. Revisa CalDesde/CalHasta.");
    return;
  }

  const existing = existingPartidosKeySet_();
  const rows = [];
  let sinJornada = 0; // Track matches without jornada

  for (const ev of events) {
    const comp = (ev.competitions && ev.competitions[0]) ? ev.competitions[0] : null;
    if (!comp) continue;

    const fechaIso = comp.date;
    const fecha = fechaIso ? new Date(fechaIso) : null;

    const competitors = comp.competitors || [];
    const home = competitors.find(c => c.homeAway === "home");
    const away = competitors.find(c => c.homeAway === "away");
    if (!home || !away) continue;

    const local = (home.team && (home.team.shortDisplayName || home.team.displayName)) ? (home.team.shortDisplayName || home.team.displayName) : "";
    const visitante = (away.team && (away.team.shortDisplayName || away.team.displayName)) ? (away.team.shortDisplayName || away.team.displayName) : "";
    if (!local || !visitante) continue;

    // ✅ Guardar logos (ESPN suele traer team.logos[0].href o team.logo)
    const localLogo = home.team?.logos?.[0]?.href || home.team?.logo || "";
    const visitLogo = away.team?.logos?.[0]?.href || away.team?.logo || "";
    if (localLogo) upsertEquipoLogo_(local, localLogo);
    if (visitLogo) upsertEquipoLogo_(visitante, visitLogo);

    let jornada = "";
    
    // Try multiple locations for week/jornada number
    if (ev.week && typeof ev.week.number !== "undefined" && ev.week.number !== null) {
      const num = Number(ev.week.number);
      if (!isNaN(num) && num >= 0) jornada = num;
    }
    
    if (jornada === "" && comp.week && typeof comp.week.number !== "undefined" && comp.week.number !== null) {
      const num = Number(comp.week.number);
      if (!isNaN(num) && num >= 0) jornada = num;
    }
    
    // Try competition season type (sometimes has week info)
    if (jornada === "" && comp.season && comp.season.type && comp.season.type === 1) {
      // Regular season - try to extract from competition notes or status
      if (comp.status && comp.status.type && comp.status.type.detail) {
        const detailMatch = String(comp.status.type.detail).match(/(?:Week|Semana)\s+(\d+)/i);
        if (detailMatch) {
          const num = Number(detailMatch[1]);
          if (!isNaN(num) && num >= 0) jornada = num;
        }
      }
    }
    
    // Try week text as fallback
    if (jornada === "" && ev.week && ev.week.text) {
      const m = String(ev.week.text).match(/(\d+)/);
      if (m) {
        const num = Number(m[1]);
        if (!isNaN(num) && num >= 0) jornada = num;
      }
    }
    
    // Try competition notes
    if (jornada === "" && comp.notes && Array.isArray(comp.notes)) {
      for (const note of comp.notes) {
        if (note.headline && typeof note.headline === "string") {
          const noteMatch = note.headline.match(/(?:Week|Semana|Jornada)\s+(\d+)/i);
          if (noteMatch) {
            const num = Number(noteMatch[1]);
            if (!isNaN(num) && num >= 0) {
              jornada = num;
              break;
            }
          }
        }
      }
    }
    
    // Try event name (e.g., "Liga MX - Jornada 4")
    if (jornada === "" && (ev.name || ev.shortName)) {
      const eventName = String(ev.name || ev.shortName || "");
      const nameMatch = eventName.match(/(?:Week|Semana|Jornada|Matchday|J)\s*[:\-]?\s*(\d+)/i);
      if (nameMatch) {
        const num = Number(nameMatch[1]);
        if (!isNaN(num) && num >= 0) jornada = num;
      }
    }
    
    // Try season type and week (alternative season structure)
    if (jornada === "" && ev.season && ev.season.type) {
      // Check if there's week info in event season
      if (ev.season.week && typeof ev.season.week === "number") {
        const num = Number(ev.season.week);
        if (!isNaN(num) && num >= 0) jornada = num;
      }
    }
    
    // Try competition season slug or name
    if (jornada === "" && comp.season && comp.season.slug) {
      const slugMatch = String(comp.season.slug).match(/week-(\d+)|jornada-(\d+)/i);
      if (slugMatch) {
        const num = Number(slugMatch[1] || slugMatch[2]);
        if (!isNaN(num) && num >= 0) jornada = num;
      }
    }

    const key = makePartidoKey_(fecha, local, visitante);
    if (existing.has(key)) continue;

    // Track if jornada is missing
    if (jornada === "") {
      sinJornada++;
      Logger.log(`⚠️ Partido sin jornada: ${local} vs ${visitante} - ${fecha}`);
      Logger.log(`   ev.week: ${JSON.stringify(ev.week)}`);
      Logger.log(`   comp.week: ${JSON.stringify(comp.week)}`);
      Logger.log(`   comp.season: ${JSON.stringify(comp.season)}`);
      Logger.log(`   comp.status: ${JSON.stringify(comp.status)}`);
      Logger.log(`   ev.season: ${JSON.stringify(ev.season)}`);
      Logger.log(`   Nombre evento: ${ev.name || ev.shortName || "N/A"}`);
    }

    rows.push([jornada, fecha, local, visitante, "", ""]);
    existing.add(key);
  }

  if (!rows.length) {
    SpreadsheetApp.getUi().alert("Ya estaba todo importado (no había nuevos).");
    return;
  }

  shPar.getRange(shPar.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  shPar.getRange(2, 2, shPar.getLastRow() - 1, 1).setNumberFormat("mm/dd/yyyy hh:mm AM/PM");

  let mensaje = `✅ Importé ${rows.length} partidos desde ESPN y guardé logos en EQUIPOS.`;
  if (sinJornada > 0) {
    mensaje += `\n\n⚠️ ${sinJornada} partido(s) sin número de jornada. Revisa el log (Ver → Registros) para más detalles.`;
  }
  SpreadsheetApp.getUi().alert(mensaje);
}
function existingPartidosKeySet_() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.PARTIDOS);
  const lr = sh.getLastRow();

  const set = new Set();
  if (lr < 2) return set;

  // A..D = JORNADA, FECHA, LOCAL, VISITANTE
  const rows = sh.getRange(2, 1, lr - 1, 4).getValues();

  for (const r of rows) {
    const fecha = r[1] instanceof Date ? r[1] : (r[1] ? new Date(r[1]) : null);
    const local = String(r[2] || "").trim().toLowerCase();
    const visit = String(r[3] || "").trim().toLowerCase();
    if (!local || !visit) continue;

    const t = (fecha && !isNaN(fecha.getTime())) ? fecha.getTime() : "";
    const key = `${t}|${local}|${visit}`;
    set.add(key);
  }

  return set;
}
function makePartidoKey_(fecha, local, visitante) {
  const t = (fecha instanceof Date && !isNaN(fecha.getTime()))
    ? fecha.getTime()
    : "";

  const l = String(local || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const v = String(visitante || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return `${t}|${l}|${v}`;
}

/***************
 * PREMIO MENOR (MARCADOR EXACTO) - POR ENTRY
 * - Gana el ENTRY con más marcadores exactos
 * - Desempate: exactos -> aciertos -> primero en enviar (timestamp más viejo)
 * - Solo visible si JornadaCerrada=SI (transparencia)
 ***************/
function api_getPremioMarcadorExactoPorEntry(jornadaOpt) {
  const jornada = Number(jornadaOpt) || Number(getConfig_("JornadaActual")) || 1;

  // Transparencia solo si está cerrada
  if (!isJornadaCerrada_()) {
    return { ok: false, error: "La jornada aún no está cerrada." };
  }

  const ss = SpreadsheetApp.getActive();

  // 1) Index de MARCADOR real por partido
  const shPar = ss.getSheetByName(SHEETS.PARTIDOS);
  const lrP = shPar.getLastRow();
  if (lrP < 2) return { ok: false, error: "PARTIDOS vacío." };

  const partidos = shPar.getRange(2, 1, lrP - 1, 6).getValues()
    .filter(r => Number(r[0]) === jornada)
    .map(r => ({
      local: String(r[2] || "").trim(),
      visit: String(r[3] || "").trim(),
      marcadorReal: String(r[4] || "").trim(),
    }))
    .filter(p => p.local && p.visit);

  if (!partidos.length) return { ok: false, error: `No hay partidos para jornada ${jornada}.` };

  const marcadorIndex = {};
  for (const p of partidos) {
    marcadorIndex[ makeKeyRes_(jornada, p.local, p.visit) ] = p.marcadorReal; // "" si no hay
  }

  // 2) Leer PRONOSTICOS de la jornada
  const shPro = ss.getSheetByName(SHEETS.PRONOSTICOS);
  const lr = shPro.getLastRow();
  if (lr < 2) return { ok: false, error: "PRONOSTICOS vacío." };

  // 2.1) Obtener IDs de jugadores que pagaron
  const shJug = ss.getSheetByName(SHEETS.JUGADORES);
  const lrJ = shJug.getLastRow();
  const jugadoresPagados = new Set();
  if (lrJ >= 2) {
    const jugRows = shJug.getRange(2, 1, lrJ - 1, 6).getValues();
    for (const j of jugRows) {
      const id = Number(j[0]);
      const activo = String(j[3] || "").toUpperCase();
      const pagado = String(j[4] || "").toUpperCase();
      if (activo === "SI" && pagado === "SI") {
        jugadoresPagados.add(id);
      }
    }
  }

  // PRONOSTICOS: ["JORNADA","ID","NOMBRE","ENTRY","LOCAL","VISITANTE","PICK","PICK_MARCADOR","PUNTOS","TIMESTAMP"]
  const data = shPro.getRange(2, 1, lr - 1, 10).getValues();

  // 3) Agregación por key=id|entry (solo jugadores pagados)
  const map = new Map(); // key -> stats
  for (const r of data) {
    const jor = Number(r[0]);
    if (jor !== jornada) continue;

    const id = Number(r[1]);
    
    // Solo incluir jugadores que pagaron
    if (!jugadoresPagados.has(id)) continue;
    
    const nombre = String(r[2] || "");
    const entry = Number(r[3]) || 1;

    const local = String(r[4] || "").trim();
    const visit = String(r[5] || "").trim();
    const pick = String(r[6] || "").trim().toUpperCase(); // L/E/V
    const pickMarc = String(r[7] || "").trim();           // "x-y"
    const ts = parseDateSafe_(r[9]);

    if (!id || !local || !visit) continue;

    const kPartido = makeKeyRes_(jornada, local, visit);
    const marcadorReal = String(marcadorIndex[kPartido] || "").trim();

    const key = `${id}|${entry}`;
    if (!map.has(key)) {
      map.set(key, {
        id,
        entry,
        nombre,
        exactos: 0,
        aciertos: 0,
        firstTs: null,
      });
    }
    const obj = map.get(key);

    // first timestamp (más viejo gana en desempate)
    if (ts && (!obj.firstTs || ts.getTime() < obj.firstTs.getTime())) obj.firstTs = ts;

    // contar aciertos L/E/V (solo si ya hay marcador real o RES calculable)
    // Si no hay marcador real, no cuenta (todavía no hay resultado).
    if (marcadorReal) {
      const resReal = calcResFromMarcador_(marcadorReal);
      if (resReal && pick && pick === resReal) obj.aciertos += 1;

      // contar exactos marcador
      if (pickMarc && pickMarc === marcadorReal) obj.exactos += 1;
    }

    // mantener nombre actualizado
    if (!obj.nombre && nombre) obj.nombre = nombre;
  }

  const rows = Array.from(map.values());

  if (!rows.length) {
    return { ok: true, jornada, winner: null, rows: [] };
  }

  // 4) Orden ganador: exactos desc, aciertos desc, firstTs asc (más viejo), nombre
  rows.sort((a, b) => {
    if (b.exactos !== a.exactos) return b.exactos - a.exactos;
    if (b.aciertos !== a.aciertos) return b.aciertos - a.aciertos;
    const ta = a.firstTs ? a.firstTs.getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.firstTs ? b.firstTs.getTime() : Number.MAX_SAFE_INTEGER;
    if (ta !== tb) return ta - tb;
    return String(a.nombre).localeCompare(String(b.nombre));
  });

  const top = rows[0];
  return {
    ok: true,
    jornada,
    winner: {
      id: top.id,
      entry: top.entry,
      nombre: top.nombre,
      exactos: top.exactos,
      aciertos: top.aciertos,
      firstTs: top.firstTs ? top.firstTs.getTime() : null,
    },
    rows: rows.map((r, idx) => ({
      pos: idx + 1,
      id: r.id,
      entry: r.entry,
      nombre: r.nombre,
      exactos: r.exactos,
      aciertos: r.aciertos,
      firstTs: r.firstTs ? r.firstTs.getTime() : null,
    })),
  };
}

/***************
 * TRANSPARENCIA: TODOS LOS PICKS DE LA JORNADA (POR ENTRY)
 * Devuelve lista por jugador-entry y por partido.
 * Solo visible si jornada está cerrada.
 ***************/
function api_getTransparenciaPicks(jornadaOpt) {
  const jornada = Number(jornadaOpt) || Number(getConfig_("JornadaActual")) || 1;

  if (!isJornadaCerrada_()) {
    return { ok: false, error: "La jornada aún no está cerrada." };
  }

  const ss = SpreadsheetApp.getActive();

  // Partidos con marcador real
  const shPar = ss.getSheetByName(SHEETS.PARTIDOS);
  const lrP = shPar.getLastRow();
  const partidos = (lrP < 2) ? [] : shPar.getRange(2, 1, lrP - 1, 6).getValues()
    .filter(r => Number(r[0]) === jornada)
    .map(r => ({
      local: String(r[2] || "").trim(),
      visit: String(r[3] || "").trim(),
      marcadorReal: String(r[4] || "").trim(),
      resReal: String(r[5] || "").trim() || (r[4] ? (calcResFromMarcador_(String(r[4]).trim()) || "") : "")
    }))
    .filter(p => p.local && p.visit);

  const partKeyList = partidos.map(p => makeKeyRes_(jornada, p.local, p.visit));
  const partIndex = {};
  for (let i = 0; i < partidos.length; i++) partIndex[partKeyList[i]] = partidos[i];

  // Pronósticos
  const shPro = ss.getSheetByName(SHEETS.PRONOSTICOS);
  const lr = shPro.getLastRow();
  if (lr < 2) return { ok: true, jornada, partidos, rows: [] };

  const data = shPro.getRange(2, 1, lr - 1, 10).getValues();

  // Agrupar por (id|entry)
  const byEntry = new Map(); // key -> {id,entry,nombre,picks:[]}
  for (const r of data) {
    if (Number(r[0]) !== jornada) continue;
    const id = Number(r[1]);
    const nombre = String(r[2] || "");
    const entry = Number(r[3]) || 1;

    const local = String(r[4] || "").trim();
    const visit = String(r[5] || "").trim();
    const pick = String(r[6] || "").trim().toUpperCase();
    const pickMarc = String(r[7] || "").trim();
    const ts = parseDateSafe_(r[9]);

    if (!id || !local || !visit) continue;

    const k = `${id}|${entry}`;
    if (!byEntry.has(k)) byEntry.set(k, { id, entry, nombre, firstTs: ts, picks: [] });

    const obj = byEntry.get(k);
    if (!obj.nombre && nombre) obj.nombre = nombre;
    if (ts && (!obj.firstTs || ts.getTime() < obj.firstTs.getTime())) obj.firstTs = ts;

    const pk = makeKeyRes_(jornada, local, visit);
    const real = partIndex[pk] || { marcadorReal: "", resReal: "" };

    obj.picks.push({
      local, visit,
      pick,
      pickMarc,
      marcadorReal: real.marcadorReal || "",
      resReal: real.resReal || ""
    });
  }

  // ordenar picks por nombre y entry
  const rows = Array.from(byEntry.values()).sort((a, b) => {
    const na = String(a.nombre).toLowerCase();
    const nb = String(b.nombre).toLowerCase();
    if (na !== nb) return na.localeCompare(nb);
    return (a.entry - b.entry);
  });

  return { ok: true, jornada, partidos, rows };
}

function getLigaMxLogoUrl_(teamName) {
  const nameNorm = normalizeTeam_(teamName);
  if (!nameNorm) return "";

  const cache = CacheService.getScriptCache();
  const cached = cache.get("LIGAMX_LOGOS");
  let map = cached ? JSON.parse(cached) : null;

  if (!map) {
    map = buildLigaMxTeamLogoMap_();
    cache.put("LIGAMX_LOGOS", JSON.stringify(map), 6 * 60 * 60); // 6 horas
  }

  return map[nameNorm] || "";
}

function buildLigaMxTeamLogoMap_() {
  const url = "https://site.api.espn.com/apis/site/v2/sports/soccer/mex.1/teams";
  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions:true, headers:{ "User-Agent":"Mozilla/5.0" } });
  if (resp.getResponseCode() !== 200) return {};

  const json = JSON.parse(resp.getContentText());
  const teams = json?.sports?.[0]?.leagues?.[0]?.teams || [];

  const map = {};
  for (const t of teams) {
    const team = t.team || {};
    const name = team.shortDisplayName || team.displayName || "";
    const logo = team.logos?.[0]?.href || "";
    const key = normalizeTeam_(name);
    if (key && logo) map[key] = logo;
  }
  return map;
}
function rellenarJornadasFaltantes() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.PARTIDOS);
  const lr = sh.getLastRow();
  if (lr < 2) {
    SpreadsheetApp.getUi().alert("PARTIDOS está vacío.");
    return;
  }

  // Config opcional (si no existe usa defaults)
  const juegosPorJornada = Number(getConfig_("JuegosPorJornada")) || 9;
  const gapDias = Number(getConfig_("GapDiasNuevaJornada")) || 3;

  // A..F = [JORNADA, FECHA, LOCAL, VISITANTE, MARCADOR, RES]
  const data = sh.getRange(2, 1, lr - 1, 6).getValues();

  // Normaliza fechas y arma arreglo con timestamp para ordenar
  const rows = data.map((r, idx) => {
    const rawFecha = r[1];
    let d = null;

    if (rawFecha instanceof Date && !isNaN(rawFecha.getTime())) {
      d = rawFecha;
    } else if (rawFecha) {
      const parsed = new Date(rawFecha);
      d = isNaN(parsed.getTime()) ? null : parsed;
    }

    return {
      idx,
      jornada: r[0],
      dateObj: d,
      ts: d ? d.getTime() : null,
      local: r[2],
      visit: r[3],
    };
  });

  // Filas válidas (fecha + equipos)
  const valid = rows.filter(x =>
    x.ts !== null &&
    String(x.local || "").trim() &&
    String(x.visit || "").trim()
  );

  if (!valid.length) {
    SpreadsheetApp.getUi().alert("No encontré filas válidas con FECHA/LOCAL/VISITANTE. Revisa FECHA.");
    return;
  }

  // Orden cronológico
  valid.sort((a, b) => a.ts - b.ts);

  // Detectar jornada máxima ya existente
  let maxJornada = 0;
  for (const r of rows) {
    const j = Number(r.jornada);
    if (j && j > maxJornada) maxJornada = j;
  }

  // Si hay algunas jornadas ya puestas, NO las tocamos, solo rellenamos las vacías.
  // Empezamos en 1 (Liga MX)
  let currentJornada = 1;
  let countInBlock = 0;
  let lastTs = null;

  for (const v of valid) {
    const existingJ = Number(data[v.idx][0]);

    // Si ya hay jornada, sincroniza “estado” para seguir agrupando razonable
    if (existingJ) {
      currentJornada = existingJ;
      countInBlock = 0;
      lastTs = v.ts;
      continue;
    }

    // Si hay salto grande de días y ya llevamos suficiente bloque, pasamos a la sig jornada
    if (lastTs !== null) {
      const diffDays = (v.ts - lastTs) / (1000 * 60 * 60 * 24);
      if (diffDays >= gapDias && countInBlock >= Math.max(3, Math.floor(juegosPorJornada * 0.6))) {
        currentJornada += 1;
        countInBlock = 0;
      }
    }

    // Si ya juntamos muchos juegos en la jornada, saltamos
    if (countInBlock >= juegosPorJornada) {
      currentJornada += 1;
      countInBlock = 0;
    }

    data[v.idx][0] = currentJornada; // set JORNADA
    countInBlock += 1;
    lastTs = v.ts;
  }

  // Escribir solo columna A (JORNADA)
  const jornadaCol = data.map(r => [r[0]]);
  sh.getRange(2, 1, jornadaCol.length, 1).setValues(jornadaCol);

  SpreadsheetApp.getUi().alert("✅ Listo: se rellenó la columna JORNADA automáticamente.");
}
function normalizeTeam_(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, ""); // quita símbolos
}

/***************
 * DÉCIMO PARTIDO - EQUIPOS PREDEFINIDOS
 ***************/
function getEquiposLaLiga_() {
  return [
    { nombre: "Real Madrid", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/86.png" },
    { nombre: "Barcelona", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/83.png" },
    { nombre: "Atlético Madrid", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/1068.png" },
    { nombre: "Sevilla", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/243.png" },
    { nombre: "Real Betis", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/244.png" },
    { nombre: "Real Sociedad", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/243.png" },
    { nombre: "Villarreal", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/94.png" },
    { nombre: "Athletic Bilbao", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/81.png" },
    { nombre: "Valencia", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/93.png" },
    { nombre: "Getafe", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3447.png" },
    { nombre: "Osasuna", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3448.png" },
    { nombre: "Celta Vigo", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3449.png" },
    { nombre: "Rayo Vallecano", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/95.png" },
    { nombre: "Mallorca", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3452.png" },
    { nombre: "Girona", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3451.png" },
    { nombre: "Alavés", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3458.png" },
    { nombre: "Las Palmas", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3456.png" },
    { nombre: "Espanyol", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/88.png" },
    { nombre: "Leganés", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/7747.png" },
    { nombre: "Valladolid", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3457.png" },
  ];
}

function getEquiposPremierLeague_() {
  return [
    { nombre: "Manchester City", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/382.png" },
    { nombre: "Arsenal", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/359.png" },
    { nombre: "Liverpool", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/364.png" },
    { nombre: "Manchester United", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/360.png" },
    { nombre: "Chelsea", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/363.png" },
    { nombre: "Tottenham", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/367.png" },
    { nombre: "Newcastle", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/361.png" },
    { nombre: "Aston Villa", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/362.png" },
    { nombre: "Brighton", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/331.png" },
    { nombre: "West Ham", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/371.png" },
    { nombre: "Everton", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/368.png" },
    { nombre: "Crystal Palace", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/384.png" },
    { nombre: "Fulham", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/370.png" },
    { nombre: "Bournemouth", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/349.png" },
    { nombre: "Brentford", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/337.png" },
    { nombre: "Nottingham Forest", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/393.png" },
    { nombre: "Wolves", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/380.png" },
    { nombre: "Leicester City", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/375.png" },
    { nombre: "Ipswich Town", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/373.png" },
    { nombre: "Southampton", logo: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/376.png" },
  ];
}

/***************
 * UI: SELECCIONAR DÉCIMO PARTIDO
 ***************/
function uiSeleccionarDecimoPartido() {
  const ui = SpreadsheetApp.getUi();
  
  // Paso 1: Seleccionar liga
  const ligaResp = ui.alert(
    "Seleccionar Liga",
    "¿Qué liga deseas usar para el décimo partido?",
    ui.ButtonSet.YES_NO_CANCEL
  );
  
  let liga = "";
  if (ligaResp === ui.Button.YES) {
    liga = "LALIGA";
  } else if (ligaResp === ui.Button.NO) {
    liga = "PREMIER";
  } else {
    return; // Cancelado
  }
  
  // Obtener equipos según la liga
  const equipos = liga === "LALIGA" ? getEquiposLaLiga_() : getEquiposPremierLeague_();
  const nombresEquipos = equipos.map(e => e.nombre);
  
  // Paso 2: Seleccionar equipo local
  const localResp = ui.prompt(
    "Equipo Local",
    `Escribe el nombre del equipo local (${liga}):\n\nDisponibles: ${nombresEquipos.join(", ")}`,
    ui.ButtonSet.OK_CANCEL
  );
  
  if (localResp.getSelectedButton() !== ui.Button.OK) return;
  const localNombre = localResp.getResponseText().trim();
  const localEquipo = equipos.find(e => normalizeTeam_(e.nombre) === normalizeTeam_(localNombre));
  
  if (!localEquipo) {
    ui.alert(`⛔ No encontré el equipo "${localNombre}". Verifica el nombre.`);
    return;
  }
  
  // Paso 3: Seleccionar equipo visitante
  const visitResp = ui.prompt(
    "Equipo Visitante",
    `Escribe el nombre del equipo visitante (${liga}):\n\nDisponibles: ${nombresEquipos.join(", ")}`,
    ui.ButtonSet.OK_CANCEL
  );
  
  if (visitResp.getSelectedButton() !== ui.Button.OK) return;
  const visitNombre = visitResp.getResponseText().trim();
  const visitEquipo = equipos.find(e => normalizeTeam_(e.nombre) === normalizeTeam_(visitNombre));
  
  if (!visitEquipo) {
    ui.alert(`⛔ No encontré el equipo "${visitNombre}". Verifica el nombre.`);
    return;
  }
  
  if (normalizeTeam_(localNombre) === normalizeTeam_(visitNombre)) {
    ui.alert("⛔ Los equipos deben ser diferentes.");
    return;
  }
  
  // Paso 4: Fecha (opcional)
  const fechaResp = ui.prompt(
    "Fecha del Partido (opcional)",
    "Formato: MM/DD/YYYY HH:MM AM/PM (ejemplo: 01/25/2026 3:00 PM)\nDeja vacío si no sabes la fecha.",
    ui.ButtonSet.OK_CANCEL
  );
  
  let fechaObj = null;
  if (fechaResp.getSelectedButton() === ui.Button.OK) {
    const fechaStr = fechaResp.getResponseText().trim();
    if (fechaStr) {
      fechaObj = new Date(fechaStr);
      if (isNaN(fechaObj.getTime())) {
        ui.alert("⚠️ Fecha inválida, se guardará sin fecha.");
        fechaObj = null;
      }
    }
  }
  
  // Guardar en hoja DECIMO_PARTIDO
  const jornada = Number(getConfig_("JornadaActual")) || 1;
  guardarDecimoPartido_(jornada, liga, localEquipo.nombre, visitEquipo.nombre, fechaObj, localEquipo.logo, visitEquipo.logo);
  
  ui.alert(`✅ Décimo partido configurado:\n${localEquipo.nombre} vs ${visitEquipo.nombre}\nLiga: ${liga}\nJornada: ${jornada}`);
}

function guardarDecimoPartido_(jornada, liga, local, visitante, fecha, logoLocal, logoVisit) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEETS.DECIMO_PARTIDO);
  if (!sh) sh = ss.insertSheet(SHEETS.DECIMO_PARTIDO);
  
  ensureHeaders_(sh, ["JORNADA", "LIGA", "LOCAL", "VISITANTE", "FECHA", "LOGO_LOCAL", "LOGO_VISITANTE"]);
  
  // Buscar si ya existe un décimo partido para esta jornada
  const lr = sh.getLastRow();
  let found = false;
  
  if (lr >= 2) {
    const data = sh.getRange(2, 1, lr - 1, 7).getValues();
    for (let i = 0; i < data.length; i++) {
      if (Number(data[i][0]) === Number(jornada)) {
        // Actualizar fila existente
        sh.getRange(i + 2, 1, 1, 7).setValues([[jornada, liga, local, visitante, fecha || "", logoLocal, logoVisit]]);
        found = true;
        break;
      }
    }
  }
  
  if (!found) {
    // Agregar nueva fila
    sh.appendRow([jornada, liga, local, visitante, fecha || "", logoLocal, logoVisit]);
  }
  
  // Guardar logos en EQUIPOS para uso futuro
  upsertEquipoLogo_(local, logoLocal);
  upsertEquipoLogo_(visitante, logoVisit);
}

function quitarDecimoPartido() {
  const ui = SpreadsheetApp.getUi();
  const jornada = Number(getConfig_("JornadaActual")) || 1;
  
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.DECIMO_PARTIDO);
  
  if (!sh) {
    ui.alert("No hay hoja de décimo partido.");
    return;
  }
  
  const lr = sh.getLastRow();
  if (lr < 2) {
    ui.alert("No hay décimo partido configurado.");
    return;
  }
  
  const data = sh.getRange(2, 1, lr - 1, 7).getValues();
  let removed = false;
  
  for (let i = 0; i < data.length; i++) {
    if (Number(data[i][0]) === Number(jornada)) {
      sh.deleteRow(i + 2);
      removed = true;
      break;
    }
  }
  
  if (removed) {
    ui.alert(`✅ Décimo partido eliminado para jornada ${jornada}.`);
  } else {
    ui.alert(`No había décimo partido configurado para jornada ${jornada}.`);
  }
}

/***************
 * CAPTURAR MARCADOR DEL DÉCIMO PARTIDO
 ***************/
function uiCapturarMarcadorDecimoPartido() {
  const ui = SpreadsheetApp.getUi();
  const jornada = Number(getConfig_("JornadaActual")) || 1;
  
  const decimoPartido = getDecimoPartidoPorJornada_(jornada);
  
  if (!decimoPartido || !decimoPartido.local || !decimoPartido.visitante) {
    ui.alert("No hay décimo partido configurado para esta jornada.");
    return;
  }
  
  const resp = ui.prompt(
    "Capturar Marcador - Décimo Partido",
    `${decimoPartido.local} vs ${decimoPartido.visitante}\n\nIngresa el marcador final (ejemplo: 2-1):`,
    ui.ButtonSet.OK_CANCEL
  );
  
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  
  const marcador = resp.getResponseText().trim();
  
  if (!marcador || !marcador.includes("-")) {
    ui.alert("⛔ Formato inválido. Usa formato: 2-1");
    return;
  }
  
  // Agregar el resultado a la hoja PARTIDOS para que se calculen puntos
  const ss = SpreadsheetApp.getActive();
  const shPar = ss.getSheetByName(SHEETS.PARTIDOS);
  
  // Buscar si ya existe
  const lr = shPar.getLastRow();
  let found = false;
  
  if (lr >= 2) {
    const data = shPar.getRange(2, 1, lr - 1, 6).getValues();
    for (let i = 0; i < data.length; i++) {
      const jor = Number(data[i][0]);
      const local = String(data[i][2] || "").trim();
      const visit = String(data[i][3] || "").trim();
      
      if (jor === jornada && 
          normalizeTeam_(local) === normalizeTeam_(decimoPartido.local) && 
          normalizeTeam_(visit) === normalizeTeam_(decimoPartido.visitante)) {
        // Actualizar marcador
        const res = calcResFromMarcador_(marcador);
        shPar.getRange(i + 2, 5).setValue(marcador); // MARCADOR
        shPar.getRange(i + 2, 6).setValue(res || "");  // RES
        found = true;
        break;
      }
    }
  }
  
  if (!found) {
    // Agregar nuevo partido a PARTIDOS
    const res = calcResFromMarcador_(marcador);
    shPar.appendRow([jornada, decimoPartido.fecha || "", decimoPartido.local, decimoPartido.visitante, marcador, res || ""]);
  }
  
  // Recalcular puntos
  calcularPuntosParaJornada_(jornada);
  actualizarTablaGeneral();
  
  ui.alert(`✅ Marcador capturado: ${marcador}\nResultado: ${calcResFromMarcador_(marcador) || "?"}\nPuntos recalculados.`);
}

function getDecimoPartidoPorJornada_(jornada) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.DECIMO_PARTIDO);
  
  if (!sh) return null;
  
  const lr = sh.getLastRow();
  if (lr < 2) return null;
  
  const data = sh.getRange(2, 1, lr - 1, 7).getValues();
  
  for (const r of data) {
    if (Number(r[0]) === Number(jornada)) {
      return {
        liga: String(r[1] || ""),
        local: String(r[2] || ""),
        visitante: String(r[3] || ""),
        fecha: parseDateSafe_(r[4]),
        logoLocal: String(r[5] || ""),
        logoVisit: String(r[6] || ""),
      };
    }
  }
  
  return null;
}


