const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build-extension');
const manifestPath = path.join(buildDir, 'manifest.json');
const extensionVersion = '0.1.0';

const packages = [
    {
        name: 'chrome-edge-brave',
        fileName: `keymoji-extension-chrome-edge-brave-v${extensionVersion}.zip`,
        transformManifest: manifest => manifest
    },
    {
        name: 'firefox',
        fileName: `keymoji-extension-firefox-v${extensionVersion}.zip`,
        transformManifest: manifest => ({
            ...manifest,
            browser_specific_settings: {
                gecko: {
                    id: 'extension@keymoji.wtf',
                    strict_min_version: '140.0',
                    data_collection_permissions: {
                        required: ['none']
                    }
                }
            }
        })
    }
];

function assertBuildExists() {
    if (!fs.existsSync(manifestPath)) {
        throw new Error(
            'Missing build-extension/manifest.json. Run npm run build:extension first.'
        );
    }
}

function copyDirectory(source, target) {
    fs.cpSync(source, target, {
        recursive: true,
        force: true
    });
}

function zipDirectory(sourceDir, outputPath) {
    if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath);
    }

    childProcess.execFileSync('zip', ['-r', outputPath, '.'], {
        cwd: sourceDir,
        stdio: 'inherit'
    });
}

function createPackage(packageConfig) {
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), `keymoji-extension-${packageConfig.name}-`)
    );
    const packageDir = path.join(tempDir, 'extension');
    const outputPath = path.join(rootDir, packageConfig.fileName);

    copyDirectory(buildDir, packageDir);

    const manifest = JSON.parse(
        fs.readFileSync(path.join(packageDir, 'manifest.json'), 'utf8')
    );
    const nextManifest = packageConfig.transformManifest(manifest);

    fs.writeFileSync(
        path.join(packageDir, 'manifest.json'),
        `${JSON.stringify(nextManifest, null, 4)}\n`
    );

    zipDirectory(packageDir, outputPath);
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log(`Created ${packageConfig.fileName}`);
}

assertBuildExists();
packages.forEach(createPackage);
