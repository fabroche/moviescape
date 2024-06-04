// copy-files.js
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function copyFiles(srcPath, distPath) {
    const files = fs.readdirSync(srcPath);

    files.forEach((file) => {
        const srcFile = path.join(srcPath, file);
        const distFile = path.join(distPath, file);

        if (fs.statSync(srcFile).isDirectory()) {
            // Si es un directorio, crea la carpeta en dist
            fs.mkdirSync(distFile);
            copyFiles(srcFile, distFile);
        } else {
            // Si es un archivo, copia el archivo a dist
            fs.copyFileSync(srcFile, distFile);
        }
    });
}

copyFiles(srcDir, distDir);
console.log('Archivos copiados correctamente.');
