const fs = require('fs');
const path = require('path');

const files = [
  'app/community/posts/[id].js',
  'app/community/posts/create.js',
  'app/community/create.js',
  'app/contact.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove KeyboardAwareScrollView import
  content = content.replace(
    /import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';?\n?/g,
    ''
  );

  // Add KeyboardAvoidingView to imports if not present
  if (!content.includes('KeyboardAvoidingView')) {
    content = content.replace(
      /from 'react-native';/,
      (match) => {
        const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*'react-native';/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(i => i.trim());
          if (!imports.includes('KeyboardAvoidingView')) {
            imports.push('KeyboardAvoidingView');
          }
          if (!imports.includes('Platform')) {
            imports.push('Platform');
          }
          if (!imports.includes('ScrollView')) {
            imports.push('ScrollView');
          }
          return `import { ${imports.join(', ')} } from 'react-native';`;
        }
        return match;
      }
    );
  }

  // Replace KeyboardAwareScrollView with KeyboardAvoidingView + ScrollView
  content = content.replace(
    /<KeyboardAwareScrollView([^>]*)>/g,
    `<KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
      >
        <ScrollView$1>`
  );

  content = content.replace(
    /<\/KeyboardAwareScrollView>/g,
    `</ScrollView>
      </KeyboardAvoidingView>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${file}`);
});

console.log('\n🎉 All files fixed!');
