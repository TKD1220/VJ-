const { app, BrowserWindow, session } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#000000',
    title: 'VJ STUDIO — HYPER EDITION',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'microphone', 'display-capture', 'audioCapture', 'desktopCapture']
    callback(allowed.includes(permission))
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
