const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

function dataFile() {
  return path.join(app.getPath('userData'), 'solitaire-recorder.json');
}
function readStore() {
  try { return JSON.parse(fs.readFileSync(dataFile(), 'utf8')); }
  catch { return { patterns: [] }; }
}
function writeStore(store) {
  fs.mkdirSync(path.dirname(dataFile()), { recursive: true });
  fs.writeFileSync(dataFile(), JSON.stringify(store, null, 2), 'utf8');
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 850, minWidth: 980, minHeight: 680,
    backgroundColor: '#0b553e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, '..', 'index.html'));
}
ipcMain.handle('patterns:list', () => readStore().patterns);
ipcMain.handle('patterns:save', (_event, pattern) => {
  const store = readStore();
  const safe = {
    id: pattern.id, status: pattern.status,
    createdAt: pattern.createdAt, moves: pattern.moves,
    openCount: pattern.openCount, hiddenCount: pattern.hiddenCount,
    openCards: pattern.openCards, hiddenCards: pattern.hiddenCards,
    finalState: pattern.finalState
  };
  store.patterns.unshift(safe);
  writeStore(store);
  return safe;
});
ipcMain.handle('patterns:delete', (_event, id) => {
  const store = readStore();
  store.patterns = store.patterns.filter(p => p.id !== id);
  writeStore(store);
  return true;
});
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
