#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const SVGSpriter = require('svg-sprite');

// Configuration for the sprite
const config = {
  mode: {
    symbol: {
      dest: '',
      sprite: 'sprite.svg',
      example: false,
      bust: false
    }
  },
  shape: {
    transform: [{
      svgo: {
        plugins: [
          { name: 'removeAttrs', params: { attrs: '(fill|stroke|id)' } },
          { name: 'removeXMLNS' },
          { name: 'removeViewBox', active: false }
        ]
      }
    }]
  },
  svg: {
    xmlDeclaration: false,
    doctypeDeclaration: false,
    namespaceIDs: false,
    namespaceClassnames: false
  }
};

// Input and output paths
const inputDir = path.resolve('./src/assets/icons');
const outputFile = path.resolve('./src/assets/sprites/sprite.svg');

// Create SVGSpriter instance
const spriter = new SVGSpriter(config);

function processDirectory(dir, baseDir = dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(itemPath, baseDir);
    } else if (path.extname(item) === '.svg') {
      // Add SVG file to spriter
      const relativePath = path.relative(baseDir, itemPath);
      const content = fs.readFileSync(itemPath, 'utf8');
      spriter.add(relativePath, null, content);
    }
  }
}

// Process the icons directory
try {
  console.log('🔄 Processing SVG icons...');
  processDirectory(inputDir);
  
  // Generate the sprite
  spriter.compile((error, result) => {
    if (error) {
      console.error('❌ Error generating sprite:', error);
      process.exit(1);
    }
    
    // Write the sprite file
    const spriteContent = result.symbol.sprite.contents;
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, spriteContent);
    console.log(`✅ SVG sprite generated successfully: ${path.relative(process.cwd(), outputFile)}`);
    
    // Get some stats
    try {
      const iconCount = result.symbol.sprite.data?.shapes ? Object.keys(result.symbol.sprite.data.shapes).length : 'unknown';
      console.log(`📊 Generated sprite with ${iconCount} icons`);
    } catch (e) {
      console.log('📊 SVG sprite generated successfully');
    }
  });
  
} catch (error) {
  console.error('❌ Error processing icons:', error);
  process.exit(1);
}