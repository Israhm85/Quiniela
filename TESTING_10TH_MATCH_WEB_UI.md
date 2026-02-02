# Testing Guide: 10th Match Web UI and Auto-Updates

## Overview
This guide explains how to test the new web UI for managing the 10th match (décimo partido) and verify automatic updates in Google Sheets.

## Prerequisites
1. Deploy the Google Apps Script as a web app
2. Access the web app from a mobile device or browser
3. Have admin access to the Google Sheets (for testing admin features)

## Test Cases

### Test 1: Access 10th Match Management UI
**Steps:**
1. Open the Quiniela web app
2. Register or log in with your player token
3. Click the "🌍 Gestionar décimo partido" button
4. Verify the new card appears with:
   - League selector (La Liga / Premier League)
   - Team selectors (Local / Visitante)
   - Date/time input
   - Save and Delete buttons

**Expected Result:**
- New UI card displays correctly
- All controls are visible and accessible on mobile

### Test 2: Configure 10th Match from Web UI
**Steps:**
1. In the décimo partido card, select a league (e.g., "🇪🇸 La Liga Española")
2. Wait for team lists to load
3. Select "Real Madrid" as local team
4. Select "Barcelona" as visitante team
5. Optionally set a date/time
6. Click "💾 Guardar Décimo Partido"

**Expected Result:**
- Success message appears: "✅ Décimo partido configurado: Real Madrid vs Barcelona"
- Current 10th match box shows the configured match with blue border
- Match appears in the picks form with special styling

### Test 3: Verify API Endpoints
**Test `api_getDecimoPartido`:**
- Should return current 10th match or null if not configured

**Test `api_getEquiposPorLiga`:**
- With "LALIGA" parameter: returns 20 La Liga teams
- With "PREMIER" parameter: returns 20 Premier League teams

**Test `api_guardarDecimoPartido`:**
- With valid payload: saves 10th match to DECIMO_PARTIDO sheet
- With invalid data: returns appropriate error messages

**Test `api_quitarDecimoPartido`:**
- Removes 10th match from specified jornada

### Test 4: Mobile Responsiveness
**Steps:**
1. Access the web app from a mobile device
2. Navigate to décimo partido management
3. Test all interactions:
   - Dropdown selections
   - Date picker
   - Button clicks
   - Form submission

**Expected Result:**
- All controls work smoothly on mobile
- No need to open Google Sheets menu
- Touch targets are appropriately sized

### Test 5: Automatic Updates - Regular Match
**Steps:**
1. Open Google Sheets
2. Go to PARTIDOS sheet
3. Edit a marcador (e.g., change "1-0" to "2-1")
4. Wait a moment for onEdit trigger

**Expected Result:**
- RES column automatically updates (L/E/V)
- Toast notification appears: "✅ Actualizado: RES=L, puntos y tabla"
- PRONOSTICOS sheet updates with new points
- TABLA sheet updates with recalculated standings

### Test 6: Automatic Updates - 10th Match
**Steps:**
1. Configure a 10th match via web UI
2. Use the menu: Quiniela → ⚽ Capturar marcador décimo partido
3. Enter a marcador (e.g., "3-2")

**Expected Result:**
- Marcador saved to PARTIDOS sheet
- Points automatically recalculated
- General table automatically updated
- Success message shows recalculation happened

### Test 7: Delete 10th Match
**Steps:**
1. In décimo partido card, click "🗑️ Eliminar Décimo Partido"
2. Confirm deletion

**Expected Result:**
- Success message: "✅ Décimo partido eliminado para jornada X"
- Current 10th match box shows "No hay décimo partido configurado"
- Match no longer appears in picks form

### Test 8: Form Validation
**Test invalid inputs:**
1. Try to save without selecting league → Error message
2. Try to save without selecting teams → Error message
3. Try to save same team for both local and visitante → Error message
4. Enter invalid team name → Error message

**Expected Result:**
- Each validation shows appropriate error message
- Form does not submit invalid data

### Test 9: Integration with Existing Features
**Steps:**
1. Configure 10th match
2. Generate pronósticos (using menu)
3. Make picks for all matches including 10th
4. Submit picks
5. Capture results for all matches
6. View table general

**Expected Result:**
- Pronósticos include 10th match rows
- Picks save correctly for 10th match
- Points calculated correctly including 10th match
- General table includes all points

### Test 10: Cross-Browser Testing
**Test on:**
- Chrome mobile
- Safari iOS
- Chrome desktop
- Firefox desktop

**Expected Result:**
- UI renders correctly in all browsers
- All functionality works without errors

## Manual Verification Checklist

- [ ] Web UI accessible from mobile without opening Sheets
- [ ] League selector loads teams correctly
- [ ] Save button stores 10th match in DECIMO_PARTIDO sheet
- [ ] 10th match appears in picks form with special styling
- [ ] Delete button removes 10th match
- [ ] onEdit trigger works for regular matches
- [ ] onEdit trigger works for 10th match
- [ ] Points recalculate automatically
- [ ] General table updates automatically
- [ ] UI is mobile-friendly
- [ ] No JavaScript console errors

## Common Issues and Solutions

### Issue: Teams not loading
**Solution:** Check that `api_getEquiposPorLiga` is correctly calling `getEquiposLaLiga_()` or `getEquiposPremierLeague_()`

### Issue: Save fails silently
**Solution:** Check browser console for JavaScript errors. Verify API function names match between HTML and Code.gs

### Issue: Auto-updates not working
**Solution:** 
1. Verify onEdit trigger is installed in Apps Script
2. Check that trigger has proper permissions
3. Ensure PARTIDOS sheet column structure is correct (MARCADOR in column 5)

### Issue: Mobile UI not responsive
**Solution:** Check viewport meta tag and CSS media queries in Index.html

## Notes

- This implementation allows any player to access the 10th match UI, but the backend should validate admin permissions
- Consider adding explicit admin checks in the API functions if needed
- The onEdit trigger already existed and handles automatic updates
- No additional configuration needed for automatic updates

## Success Criteria

✅ **Issue 1 Resolved:** Users can configure 10th match directly from web UI without opening Google Sheets menu
✅ **Issue 2 Verified:** Tables automatically update when match results change via existing onEdit trigger
