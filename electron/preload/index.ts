import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
  setProjectData: (projectData) => ipcRenderer.invoke('set-project-data', projectData),
  addProjectData: (newProjectData) => ipcRenderer.invoke('add-project-data', newProjectData),
  updateProjectData: (ProjectData) => ipcRenderer.invoke( "update-project-data", ProjectData),
  getProjectData: () => ipcRenderer.invoke('get-project-data'),
  openDirectoryDialog: () => ipcRenderer.invoke('open-folder'),
  openProjectDir: (projectPath:string) => ipcRenderer.invoke('open-folder-path', projectPath),
})
