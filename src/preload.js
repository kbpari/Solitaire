const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('recorder', {
  listPatterns: () => ipcRenderer.invoke('patterns:list'),
  savePattern: pattern => ipcRenderer.invoke('patterns:save', pattern),
  deletePattern: id => ipcRenderer.invoke('patterns:delete', id)
});
