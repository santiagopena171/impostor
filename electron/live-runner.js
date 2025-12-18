/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const cp = require('child_process');
const chokidar = require('chokidar');
const electron = require('electron');
const path = require('path');

let child = null;
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const electronCmd = process.platform === 'win32' ? electron + '.cmd' : electron;
const reloadWatcher = {
  debouncer: null,
  ready: false,
  watcher: null,
  restarting: false,
};

///*
function runBuild() {
  return new Promise((resolve, _reject) => {
    let tempChild = cp.spawn(npmCmd, ['run', 'build'], {
      cwd: __dirname,
      shell: true
    });
    tempChild.once('exit', () => {
      resolve();
    });
    tempChild.stdout.pipe(process.stdout);
    tempChild.stderr.pipe(process.stderr);
  });
}
//*/

async function spawnElectron() {
  if (child !== null) {
    child.stdin.pause();
    child.kill();
    child = null;
    await runBuild();
  }
  
  // Get the electron executable path
  const electronPath = require('electron');
  
  // Spawn electron with proper options for Windows
  child = cp.spawn(electronPath, ['--inspect=5858', '.'], {
    cwd: __dirname,
    stdio: 'inherit',
    windowsHide: false
  });
  
  child.on('exit', () => {
    if (!reloadWatcher.restarting) {
      process.exit(0);
    }
  });
}

function setupReloadWatcher() {
  reloadWatcher.watcher = chokidar
    .watch('./src/**/*', {
      ignored: /[/\\]\./,
      persistent: true,
    })
    .on('ready', () => {
      reloadWatcher.ready = true;
    })
    .on('all', (_event, _path) => {
      if (reloadWatcher.ready) {
        clearTimeout(reloadWatcher.debouncer);
        reloadWatcher.debouncer = setTimeout(async () => {
          console.log('Restarting');
          reloadWatcher.restarting = true;
          await spawnElectron();
          reloadWatcher.restarting = false;
          reloadWatcher.ready = false;
          clearTimeout(reloadWatcher.debouncer);
          reloadWatcher.debouncer = null;
          reloadWatcher.watcher = null;
          setupReloadWatcher();
        }, 500);
      }
    });
}

(async () => {
  await runBuild();
  await spawnElectron();
  setupReloadWatcher();
})();
