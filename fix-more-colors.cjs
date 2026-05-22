const fs = require('fs');

const fixCVTemplate = () => {
  let content = fs.readFileSync('src/CVTemplate.css', 'utf8');
  
  content = content.replace(/background:\s*rgba\(7,\s*13,\s*31,\s*0\.6\);/g, 'background: var(--surface-container-high);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.03\);/g, 'background: var(--surface-container);');
  content = content.replace(/border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.1\);/g, 'border: 1px solid var(--panel-border);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.08\);/g, 'background: var(--surface-container-high);');
  content = content.replace(/border-color:\s*rgba\(255,\s*255,\s*255,\s*0\.2\);/g, 'border-color: var(--color-primary);');
  content = content.replace(/color:\s*#4cd7f6;/g, 'color: var(--color-secondary);');
  content = content.replace(/background:\s*rgba\(29,\s*26,\s*35,\s*0\.6\);/g, 'background: var(--surface-container);');
  content = content.replace(/background:\s*rgba\(44,\s*40,\s*50,\s*0\.8\);/g, 'background: var(--surface-container-high);');
  content = content.replace(/border-color:\s*rgba\(208,\s*188,\s*255,\s*0\.5\);/g, 'border-color: var(--color-primary);');
  content = content.replace(/color:\s*var\(--color-primary-light\);/g, 'color: var(--color-primary);');
  content = content.replace(/background:\s*rgba\(208,\s*188,\s*255,\s*0\.1\);/g, 'background: var(--color-primary-glow);');
  content = content.replace(/border:\s*1px\s*solid\s*rgba\(208,\s*188,\s*255,\s*0\.2\);/g, 'border: 1px solid var(--color-primary);');
  
  fs.writeFileSync('src/CVTemplate.css', content, 'utf8');
};

const fixProfileModal = () => {
  let content = fs.readFileSync('src/components/ProfileModal.css', 'utf8');
  content = content.replace(/color:\s*#d0bcff;/g, 'color: var(--color-primary);');
  content = content.replace(/background:\s*rgba\(208,\s*188,\s*255,\s*0\.1\);/g, 'background: var(--color-primary-glow);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.03\);/g, 'background: var(--surface-container-high);');
  fs.writeFileSync('src/components/ProfileModal.css', content, 'utf8');
};

fixCVTemplate();
fixProfileModal();
