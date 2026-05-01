const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'node_modules/@weweb/cli/bin/weweb.js');
const marker = 'pkg.weweb.type';

try {
    const src = fs.readFileSync(target, 'utf8');
    if (src.includes(marker)) process.exit(0); // already patched

    const patched = src.replace(
        '    return null;\n};',
        `    try {
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        if (argvName === 'name' && pkg.name) return pkg.name;
        if (argvName === 'type' && pkg.weweb && pkg.weweb.type) return pkg.weweb.type;
    } catch (e) {}

    return null;\n};`
    );

    if (patched === src) {
        console.error('patch-weweb-cli: could not locate patch target, skipping.');
        process.exit(0);
    }

    // weweb.js uses require('fs') already; add it at top if missing
    const final = patched.includes("require('fs')") || patched.includes('require("fs")')
        ? patched
        : patched.replace('#! /usr/bin/env node\n', '#! /usr/bin/env node\nconst fs = require("fs");\n');

    fs.writeFileSync(target, final, 'utf8');
    console.log('patch-weweb-cli: applied successfully.');
} catch (e) {
    console.error('patch-weweb-cli: failed —', e.message);
}
