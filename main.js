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

  // 全パーミッション強制許可
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true)
  })
  session.defaultSession.setPermissionCheckHandler(() => true)
  session.defaultSession.setDevicePermissionHandler(() => true)

  // Chromiumフラグで排他モードを無効化・WASAPI共有モード強制
  app.commandLine.appendSwitch('disable-features', 'WinSpeaker')
  app.commandLine.appendSwitch('audio-buffer-size', '2048')

  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
      callback({ video: sources[0], audio: 'loopback' })
    })
  })

  win.loadFile('index.html')
}

// Chromiumフラグはapp.ready前に設定する必要あり
app.commandLine.appendSwitch('shared-audio-device-factory')
app.commandLine.appendSwitch('disable-exclusive-audio')
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer')

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
