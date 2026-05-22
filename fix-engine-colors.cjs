const fs = require('fs');

let css = fs.readFileSync('src/templates/engine/engine.css', 'utf8');

css = css.replace(/color:\s*rgba\(255,255,255,0\.5\);/g, 'color: var(--text-muted);');
css = css.replace(/border-bottom:\s*1px\s*solid\s*rgba\(255,255,255,0\.04\);/g, 'border-bottom: 1px solid var(--panel-border);');
css = css.replace(/color:\s*#e2e8f0;/g, 'color: var(--text-on-surface);');
css = css.replace(/color:\s*rgba\(255,255,255,0\.35\);/g, 'color: var(--text-dim);');
css = css.replace(/color:\s*rgba\(255,255,255,0\.3\);/g, 'color: var(--text-dim);');
css = css.replace(/color:\s*rgba\(255,255,255,0\.6\);\s*background:\s*rgba\(255,255,255,0\.03\);/g, 'color: var(--text-on-surface); background: var(--surface-container-high);');
css = css.replace(/color:\s*#8b5cf6\s*!important;/g, 'color: var(--color-primary) !important;');
css = css.replace(/background:\s*rgba\(139,92,246,0\.1\)\s*!important;/g, 'background: var(--color-primary-glow) !important;');
css = css.replace(/border:\s*1\.5px\s*solid\s*rgba\(255,255,255,0\.05\);/g, 'border: 1.5px solid var(--panel-border);');
css = css.replace(/background:\s*rgba\(255,255,255,0\.02\);/g, 'background: var(--surface-container);');
css = css.replace(/border-color:\s*rgba\(255,255,255,0\.1\);/g, 'border-color: var(--color-primary);');
css = css.replace(/background:\s*rgba\(255,255,255,0\.04\);/g, 'background: var(--surface-container-high);');
css = css.replace(/background:\s*#1e293b;/g, 'background: var(--surface-container-high);');
css = css.replace(/border:\s*1px\s*solid\s*rgba\(255,255,255,0\.06\);/g, 'border: 1px solid var(--panel-border);');
css = css.replace(/color:\s*white;/g, 'color: var(--text-on-surface);');
// Fix .composer-block-check text color explicitly so it doesn't get swept into var(--text-on-surface) if it was white
css = css.replace(/\.composer-block-check\s*{[^}]+}/g, match => match.replace(/color: var\(--text-on-surface\);/, 'color: #ffffff;')); // it needs to be white checkmark

fs.writeFileSync('src/templates/engine/engine.css', css);

let jsx = fs.readFileSync('src/templates/engine/ComposerPanel.jsx', 'utf8');
jsx = jsx.replace(/rgba\(255,255,255,0\.03\)/g, 'var(--surface-container-high)');
jsx = jsx.replace(/rgba\(255,255,255,0\.4\)/g, 'var(--text-dim)');
fs.writeFileSync('src/templates/engine/ComposerPanel.jsx', jsx);
