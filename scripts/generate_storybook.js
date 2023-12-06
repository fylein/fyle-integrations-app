const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/app/shared/components');
const storiesDir = path.join(__dirname, 'src/stories');

function generateStory(componentName, componentPath, hyphenSeparatedComponentName) {
  const content = `
import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ${componentName}Component } from '${componentPath}/${hyphenSeparatedComponentName}.component';

const meta: Meta<${componentName}Component> = {
  title: 'Components/${componentName}',
  component: ${componentName}Component,
  tags: ['autodocs'],
  render: (args: ${componentName}Component) => ({
    props: { ...args }
  }),
  decorators: [
    moduleMetadata({
      declarations: [${componentName}Component],
      imports: [CommonModule]
    })
  ],
  argTypes: {
    ngOnInit: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<${componentName}Component>;

export const simple: Story = {};
`;

  const filePath = path.join(storiesDir, `${componentName}.stories.ts`);
  fs.writeFileSync(filePath, content);
}

function generateStories(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      generateStories(filePath); // Recursively traverse subdirectories
    } else if (file.endsWith('.component.ts')) {
      let componentName = file.replace('.component.ts', '');
      componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
      componentName = componentName.replace(/(-\w)/g, m => m[1].toUpperCase()); // Convert kebab-case to camelCase
      
      // Corrected component path based on the provided corrections
      let componentPath = directory.split('src/app/shared/components/').pop();
      componentPath = 'src/app/shared/components/' + componentPath 
      const hyphenSeparatedComponentName = directory.split('/').pop();

      generateStory(componentName, componentPath, hyphenSeparatedComponentName);
    }
  });
}

generateStories(componentsDir);
