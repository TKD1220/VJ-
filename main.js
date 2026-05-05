const { app, BrowserWindow, session, desktopCapturer, ipcMain } = require('electron')

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
      preload: `${__dirname}/preload.js`
    }
  })

  // マイクのパーミッションを自動許可
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'microphone']
    callback(allowed.includes(permission))
  })

  // getDisplayMedia に desktopCapturer を使って画面音声を注入
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
      // 最初のスクリーンソースを返す（音声付き）
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
