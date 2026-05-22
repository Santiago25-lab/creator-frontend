const fs = require('fs');
const files = [
  'src/components/ProfileModal.css',
  'src/components/Dashboard.css',
  'src/CVTemplate.css',
  'src/components/AuthPage.css'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/color:\s*white;/gi, 'color: var(--text-on-surface);');
    content = content.replace(/color:\s*#fff;/gi, 'color: var(--text-on-surface);');
    content = content.replace(/color:\s*#ffffff;/gi, 'color: var(--text-on-surface);');
    
    content = content.replace(/color:\s*#958ea0;/gi, 'color: var(--text-dim);');
    content = content.replace(/color:\s*#cbc3d7;/gi, 'color: var(--text-muted);');
    
    content = content.replace(/background:\s*#0f0d15;/gi, 'background: var(--bg-app);');
    content = content.replace(/background-color:\s*#0f0d15;/gi, 'background-color: var(--bg-app);');
    
    content = content.replace(/background:\s*rgba\(15,\s*13,\s*21,\s*0\.[0-9]+\);/gi, 'background: var(--surface-container);');
    content = content.replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.2\);/gi, 'background: var(--surface-bright);');
    content = content.replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.15\);/gi, 'background: var(--panel-border);');
    
    // AuthPage specific
    content = content.replace(/--background:\s*#0f0d15;/gi, '--background: var(--bg-app);');
    content = content.replace(/--surface-lowest:\s*#0f0d15;/gi, '--surface-lowest: var(--bg-app);');
    content = content.replace(/--surface-default:\s*#15121b;/gi, '--surface-default: var(--surface-container);');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
