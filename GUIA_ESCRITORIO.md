# Guía de Desarrollo - Versión de Escritorio (Electron)

## 📋 Requisitos Previos

- Node.js instalado (versión 16 o superior)
- Git instalado
- Editor de código (VS Code recomendado)

## 🚀 Configuración Inicial

### 1. Instalar dependencias del proyecto principal

```bash
npm install
```

### 2. Instalar dependencias de Electron

```bash
cd electron
npm install
cd ..
```

## 💻 Desarrollo

### Ejecutar en modo desarrollo

Para iniciar la aplicación en modo desarrollo con hot-reload:

```bash
npm run electron:dev
```

Este comando:
1. Construye la aplicación web con Vite
2. Copia los archivos al directorio electron/app
3. Inicia Electron en modo live-reload

La aplicación se abrirá en una ventana de Electron y se recargará automáticamente cuando hagas cambios en el código.

**Nota para Windows**: Si tienes espacios en el nombre de usuario, el hot-reload puede presentar problemas menores. En ese caso, usa el modo desarrollo alternativo.

### Modo desarrollo alternativo (recomendado para Windows)

Si prefieres tener más control, puedes ejecutar los comandos por separado:

```bash
# Terminal 1: Construye y observa cambios en la app web
npm run build -- --watch

# Terminal 2: En otra terminal, ejecuta Electron
cd electron
npm run electron:start-live
```

## 📦 Construcción para Producción

### Compilar el código

```bash
npm run electron:build
```

Este comando:
1. Construye la versión optimizada de la app web
2. Copia los archivos a la carpeta electron
3. Compila el código TypeScript de Electron

### Empaquetar la aplicación (sin instalador)

Para crear un paquete portable sin instalador:

```bash
npm run electron:pack
```

Los archivos empaquetados se encontrarán en `electron/dist/`

### Crear instalador

Para crear un instalador completo de la aplicación:

```bash
npm run electron:make
```

Este comando creará instaladores para tu sistema operativo actual:
- **Windows**: .exe (instalador NSIS)
- **macOS**: .dmg
- **Linux**: .AppImage, .deb, .rpm (según configuración)

Los instaladores se encontrarán en `electron/dist/`

## 🔧 Configuración de Electron

### Archivo principal de configuración

La configuración de Electron se encuentra en:
- `electron/src/index.ts` - Punto de entrada principal
- `electron/electron-builder.config.json` - Configuración del empaquetador
- `electron/capacitor.config.json` - Configuración de Capacitor

### Personalizar la ventana

Edita `electron/src/index.ts` para cambiar propiedades de la ventana:

```typescript
mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
});
```

### Personalizar el icono

Coloca tus iconos en `electron/assets/` y actualiza `electron-builder.config.json`:

```json
{
  "directories": {
    "output": "dist"
  },
  "win": {
    "icon": "assets/icon.ico"
  },
  "mac": {
    "icon": "assets/icon.icns"
  },
  "linux": {
    "icon": "assets/icon.png"
  }
}
```

### Configurar información de la app

Edita `electron/package.json` para actualizar:
- Nombre de la aplicación
- Versión
- Descripción
- Autor
- Licencia

## 🐛 Depuración

### Debug en VS Code

Puedes depurar la aplicación Electron agregando esta configuración en `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Electron Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/electron",
      "runtimeExecutable": "${workspaceFolder}/electron/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/electron/node_modules/.bin/electron.cmd"
      },
      "args": [".", "--remote-debugging-port=9223"],
      "outputCapture": "std"
    }
  ]
}
```

### DevTools

Las herramientas de desarrollo de Chrome están habilitadas automáticamente en modo desarrollo. Presiona:
- **Windows/Linux**: `Ctrl + Shift + I`
- **macOS**: `Cmd + Option + I`

### Logs

Los logs de Electron se encuentran en:
- **Windows**: `%APPDATA%\Impostor Futbolero\logs`
- **macOS**: `~/Library/Logs/Impostor Futbolero`
- **Linux**: `~/.config/Impostor Futbolero/logs`

## 📤 Distribución

### Firmar la aplicación (opcional)

Para firmar tu aplicación en Windows o macOS, configura las variables de entorno:

**Windows:**
```bash
set CSC_LINK=path/to/certificate.pfx
set CSC_KEY_PASSWORD=your-password
```

**macOS:**
```bash
export CSC_LINK=path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
```

### Auto-actualización

La aplicación está configurada para usar `electron-updater`. Para habilitar las actualizaciones automáticas:

1. Configura un servidor de releases (GitHub Releases recomendado)
2. Actualiza `electron/electron-builder.config.json` con tu repositorio
3. Publica tus releases con los instaladores

## ⚙️ Comandos Útiles

```bash
# Desarrollo
npm run electron:dev              # Modo desarrollo con hot-reload

# Construcción
npm run electron:build            # Solo compilar
npm run electron:pack             # Empaquetar sin instalador
npm run electron:make             # Crear instalador

# Dentro de la carpeta electron/
cd electron
npm run build                     # Compilar TypeScript
npm run electron:start            # Iniciar Electron (sin hot-reload)
npm run electron:start-live       # Iniciar con hot-reload
```

## 🔍 Solución de Problemas

### La aplicación no inicia

1. Asegúrate de haber construido la app web primero:
   ```bash
   npm run build
   ```

2. Verifica que las dependencias estén instaladas:
   ```bash
   cd electron && npm install && cd ..
   ```

### Pantalla en blanco

1. Verifica que `dist/` tenga archivos
2. Revisa la consola de Electron (DevTools)
3. Verifica que `electron/app/` tenga los archivos copiados

### Error de compilación TypeScript

```bash
cd electron
npm run build
```

Si persiste, elimina y reinstala:
```bash
rm -rf electron/node_modules
cd electron && npm install
```

### Los cambios no se reflejan

Asegúrate de:
1. Haber ejecutado `npm run build` después de cambios
2. Que el hot-reload esté activo (modo `electron:dev`)
3. Refrescar la ventana de Electron: `Ctrl+R` o `Cmd+R`

## 📚 Recursos Adicionales

- [Documentación de Electron](https://www.electronjs.org/docs)
- [Capacitor Electron](https://github.com/capacitor-community/electron)
- [Electron Builder](https://www.electron.build/)
- [Electron Forge](https://www.electronforge.io/)

## 🎯 Próximos Pasos

1. ✅ Configuración básica completada
2. 🔄 Probar la aplicación en modo desarrollo
3. 📦 Crear tu primer build
4. 🎨 Personalizar iconos y metadata
5. 🚀 Distribuir tu aplicación
