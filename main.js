const { app, BrowserWindow, session, desktopCapturer, powerSaveBlocker } = require('electron')

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
      backgroundThrottling: false
    }
  })

  powerSaveBlocker.start('prevent-display-sleep')
  powerSaveBlocker.start('prevent-app-suspension')

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true) // 全パーミッション強制許可
  })

  // デバイスが使用中でも強制取得
  session.defaultSession.setDevicePermissionHandler((details) => {
    return true
  })

  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
      callback({ video: sources[0], audio: 'loopback' })
    })
  })

  // getUserMediaを強制的に通す
  win.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    return true
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
