const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function main() {
    const srcDir = './artifacts/contracts/**/';
    const destDir = './../frontend/src/contracts';

    // Ensure the destination directory exists
    fs.ensureDirSync(destDir);

    // Filter only .json files
    const jsonFiles = glob.sync(srcDir + '*.json').filter(
        filePath => path.extname(filePath) === '.json' && !filePath.endsWith('.dbg.json')
    );

    console.log(`Found ${jsonFiles.length} artifacts to be copied to ${destDir}`);

    // Copy each json file to the destination directory
    for (const file of jsonFiles) {
        const fileName = path.basename(file);
        fs.copySync(file, path.join(destDir, fileName));
        console.log(`Copied ${fileName}`);
    }
}

main()
    .then(() => console.log('Artifacts copied successfully'))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
