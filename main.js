'use strict';

const electron = require('electron');
const fs = require('fs');
const ipcMain = electron.ipcMain;
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({fullscreen: true});
    mainWindow.setMenu(null);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    // Save current layout for layout mode
    ipcMain.on('layout-changed', function(event, layout) {
        if(process.argv.includes('--layout')) {
            var layoutJSON = JSON.stringify(layout.map(function(widget) {
                return {
                    i: widget.i,
                    x: widget.x,
                    y: widget.y,
                    w: widget.w,
                    h: widget.h
                }
            }), undefined, 4);
            fs.writeFile('./current_layout.json', layoutJSON);
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
