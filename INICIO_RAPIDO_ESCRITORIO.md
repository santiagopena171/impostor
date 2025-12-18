# 🚀 Inicio Rápido - Versión de Escritorio

## Instalación y Primera Ejecución

### 1. Instalar Dependencias

```bash
# En el directorio raíz del proyecto
npm install

# En el directorio electron
cd electron
npm install
cd ..
```

### 2. Construir y Ejecutar

```bash
# Opción 1: Script todo-en-uno (recomendado)
npm run electron:dev

# Opción 2: Paso a paso
npm run build                                  # 1. Construir la app web
npx cap copy @capacitor-community/electron    # 2. Copiar a electron
cd electron && npm run electron:start          # 3. Iniciar Electron
```

### 3. Compilar Instalador

```bash
# Crear instalador completo
npm run electron:make

# Los archivos estarán en: electron/dist/
```

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run electron:dev` | Desarrollo con hot-reload |
| `npm run electron:build` | Solo compilar el código |
| `npm run electron:pack` | Empaquetar sin instalador |
| `npm run electron:make` | Crear instalador completo |

---

## Desarrollo

### Hacer Cambios en el Código

1. Edita los archivos en `src/`
2. Ejecuta `npm run build`
3. Ejecuta `npx cap copy @capacitor-community/electron`
4. La app se refrescará automáticamente (si usaste `electron:dev`)

### Personalizar la Aplicación

#### Cambiar el Nombre
```json
// electron/package.json
{
  "name": "Tu App Name"
}
```

#### Cambiar el Icono
1. Coloca tus iconos en `electron/assets/`
2. Actualiza `electron/electron-builder.config.json`

#### Configurar la Ventana
```typescript
// electron/src/index.ts
const mainWindow = new BrowserWindow({
  width: 1400,      // Ancho
  height: 900,      // Alto
  minWidth: 800,    // Mínimo ancho
  minHeight: 600,   // Mínimo alto
  // ...más opciones
});
```

---

## Solución de Problemas

### ❌ Error: "npm run build" falla
**Solución**: Asegúrate de estar en el directorio raíz del proyecto

### ❌ Error: Electron no inicia
**Solución**: 
```bash
cd electron
npm install
npm run build
cd ..
```

### ❌ Error: Pantalla en blanco
**Solución**: 
1. Verifica que `dist/` tenga archivos
2. Verifica que `electron/app/` tenga archivos
3. Ejecuta: `npx cap copy @capacitor-community/electron`

### ❌ Error: Los cambios no se reflejan
**Solución**: Recuerda ejecutar `npm run build` después de cada cambio

---

## Distribución

### Windows
```bash
npm run electron:make
# Archivo: electron/dist/Impostor Futbolero Setup X.X.X.exe
```

### macOS
```bash
npm run electron:make
# Archivo: electron/dist/Impostor Futbolero-X.X.X.dmg
```

### Linux
```bash
npm run electron:make
# Archivos: 
# - electron/dist/impostor-futbolero_X.X.X_amd64.deb
# - electron/dist/impostor-futbolero-X.X.X.x86_64.rpm
# - electron/dist/Impostor-Futbolero-X.X.X.AppImage
```

---

## Recursos

- [GUIA_ESCRITORIO.md](GUIA_ESCRITORIO.md) - Guía completa
- [Documentación de Electron](https://www.electronjs.org/docs)
- [Capacitor Electron](https://github.com/capacitor-community/electron)

---

¡Listo! Tu aplicación de escritorio está configurada y lista para desarrollar 🎉
