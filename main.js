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
      backgroundThrottling: false  // バックグラウンドでも止まらない
    }
  })

  // スリープ・停止を防止
  powerSaveBlocker.start('prevent-display-sleep')
  powerSaveBlocker.start('prevent-app-suspension')

  // マイク許可
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'microphone']
    callback(allowed.includes(permission))
  })

  // 画面音声キャプチャ（loopback）
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
      callback({ video: sources[0], audio: 'loopback' })
    })
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
