import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { update } from './update';
import Store from 'electron-store';

const store = new Store({
  name: 'ftrak',
  defaults: {
    theme: 'dark',
    fontSize: 14,
    projects: [], // Add default projects array
  },
});

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '../..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win = null;
const preload = path.join(__dirname, '../preload/index.mjs');
const indexHtml = path.join(RENDERER_DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  update(win);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.handle('set-project-data', (event, projectData) => {
  store.set('projects', projectData);
});

ipcMain.handle('add-project-data', (event, newProjectData) => {
  let projects = store.get('projects');
  console.error("prop", projects);
  projects.push(newProjectData);
  store.set('projects', projects);
});

ipcMain.handle('update-project-data', (event, updatedProject) => {
  const projects = store.get('projects') || [];
  const projectIndex = projects.findIndex(
    (project) => project.name === updatedProject.name
  );

  if (projectIndex !== -1) {
    projects[projectIndex] = updatedProject;
    store.set('projects', projects);
    return true;
  } else {
    console.error('Project not found');
    return false;
  }
});

ipcMain.handle('get-project-data', async () => {
  let projects = store.get('projects');
  for (let project of projects) {
    try {
      const files = await fs.readdir(project.folderPath);
      const existingFiles = project.files.map(f => f.name);

      // Add new files
      for (let file of files) {
        if (!existingFiles.includes(file)) {
          project.files.push({
            name: file,
            isDeleted: false,
            todos: [],
          });
        }
      }

      // Mark missing files as deleted
      project.files = project.files.map(f => {
        if (!files.includes(f.name)) {
          return { ...f, isDeleted: true };
        }
        return f;
      });

    } catch (error) {
      // Folder is deleted or moved
      if (error.code === 'ENOENT') {
        project.folderPath = null; // Or handle it as you see fit
      } else {
        console.error(`Failed to read directory: ${error.message}`);
      }
    }
  }
  store.set('projects', projects);
  return projects;
});

ipcMain.handle('open-folder', async (event) => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  });
  return result.filePaths[0];
});

ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.handle('open-folder-path', async (event, folderPath) => {
  const result = await shell.openPath(folderPath);
  if (result) {
    console.error(`Failed to open folder: ${result}`);
  }
  return result;
});
