const { ipcMain, app, BrowserWindow } = require('electron')
const path = require('path')
const { Menu } = require('electron')

ipcMain.on('close-app', () => {
  app.quit()
})

Menu.setApplicationMenu(null)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    frame: false, 
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets/icons/icon.png')
  })

  win.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(createWindow)
