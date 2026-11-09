import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function addFolderToZip(zip, folderPath, baseFolder = '') {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    // Ignore node_modules, .git, etc.
    if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
    const fullPath = path.join(folderPath, item);
    const relPath = path.join(baseFolder, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subZip = zip.folder(item);
      if (subZip) {
        await addFolderToZip(subZip, fullPath, relPath);
      }
    } else {
      zip.file(item, fs.readFileSync(fullPath));
    }
  }
}

async function createPackages() {
  console.log('Generating downloadable packages in /public...');

  // 1. Android Native Project Package
  if (fs.existsSync('android')) {
    const androidZip = new JSZip();
    await addFolderToZip(androidZip, 'android', 'android');
    // Add README
    androidZip.file(
      'LEIA-ME_COMO_GERAR_APK.txt',
      `PROJETO ANDROID OFICIAL — VAMOS À LUTA
Criado por: Constantino Costa
ID da Aplicação: ao.vamosaluta.app

COMO GERAR O APK / AAB NO SEU COMPUTADOR:
1. Descompacte esta pasta.
2. Abra o software Android Studio (gratuito em developer.android.com/studio).
3. Selecione "Open an Existing Project" e escolha a pasta "android".
4. Vá ao menu "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)".
5. O seu ficheiro APK estará pronto na pasta app/build/outputs/apk/debug/app-debug.apk para instalar no seu telemóvel Android!
`
    );
    const buffer = await androidZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    fs.writeFileSync('public/vamos_a_luta_android.zip', buffer);
    console.log('Created public/vamos_a_luta_android.zip');
  }

  // 2. Web Offline Package
  if (fs.existsSync('dist')) {
    const webZip = new JSZip();
    await addFolderToZip(webZip, 'dist', 'dist');
    webZip.file(
      'COMO_USAR_OFFLINE.txt',
      `VAMOS À LUTA — Versão Web Offline Completa
Criado por: Constantino Costa

Para usar no computador ou servidor local:
Basta abrir o ficheiro "index.html" no Google Chrome ou em qualquer navegador!`
    );
    const webBuffer = await webZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    fs.writeFileSync('public/vamos_a_luta_offline.zip', webBuffer);
    console.log('Created public/vamos_a_luta_offline.zip');
  }

  console.log('Finished generating packages!');
}

createPackages().catch(console.error);
