// componente para copiar los archivos de la carpeta src en dist
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function deleteFolderContents(folderPath) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Si es un directorio, borra su contenido recursivamente
            deleteFolderContents(filePath);
            fs.rmdirSync(filePath);
        } else {
            // Si es un archivo, elimínalo
            fs.unlinkSync(filePath);
        }
    }
}

function copyFiles(srcPath, distPath) {
    // Borra el contenido de la carpeta dist
    deleteFolderContents(distPath);

    const files = fs.readdirSync(srcPath);
    for (const file of files) {
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
    }
}

copyFiles(srcDir, distDir);
console.log('Archivos copiados correctamente.');
