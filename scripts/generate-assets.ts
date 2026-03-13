import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually (no dotenv dependency needed)
function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const OUTPUT_DIR = path.resolve(process.cwd(), 'public/images');

interface AssetConfig {
  name: string;
  filename: string;
  prompt: string;
  aspectRatio: string;
}

const assets: AssetConfig[] = [
  {
    name: 'Logo VVIP',
    filename: 'logo-vvip.png',
    prompt:
      'Luxury gold crest emblem logo for a premium "VVIP" stock lottery brand. Dark background color #0a0a0f. Gold metallic colors #d4a829 and #f0d060. Ornate shield or crown shape with intricate details. Clean vector style, no text. The emblem should look prestigious and exclusive.',
    aspectRatio: '1:1',
  },
  {
    name: 'Logo Platinum',
    filename: 'logo-platinum.png',
    prompt:
      'Premium platinum silver crest emblem logo for a "Platinum" stock lottery brand. Dark background color #080a0e. Silver metallic colors #a8b4c4 and #d0dae8 with steel blue accent #7eb8e0. Ornate shield or crown shape with intricate details. Clean vector style, no text. The emblem should look prestigious and modern.',
    aspectRatio: '1:1',
  },
  {
    name: 'Card Frame VVIP',
    filename: 'card-frame-vvip.png',
    prompt:
      'Horizontal decorative border frame for a luxury lottery ticket. Gold ornamental pattern on a very dark background #0a0a0f. Subtle, elegant, thin borders with corner flourishes and fine line art. Gold color #d4a829 accents. The frame should be semi-transparent suitable for overlay use. Wide horizontal format.',
    aspectRatio: '16:9',
  },
  {
    name: 'Card Frame Platinum',
    filename: 'card-frame-platinum.png',
    prompt:
      'Horizontal decorative border frame for a premium lottery ticket. Silver platinum ornamental pattern on a very dark background #080a0e. Subtle, elegant, thin borders with corner flourishes and fine line art. Silver color #a8b4c4 and steel blue #7eb8e0 accents. The frame should be semi-transparent suitable for overlay use. Wide horizontal format.',
    aspectRatio: '16:9',
  },
  {
    name: 'Hero BG VVIP',
    filename: 'hero-bg-vvip.png',
    prompt:
      'Abstract luxury dark background texture with subtle gold light rays and soft bokeh effects. Main color is very dark #0a0a0f with gold #d4a829 and #f0d060 glow effects scattered throughout. Wide panoramic banner format. Premium luxurious atmospheric feel. No text, no objects, just abstract ambient light.',
    aspectRatio: '16:9',
  },
  {
    name: 'Hero BG Platinum',
    filename: 'hero-bg-platinum.png',
    prompt:
      'Abstract luxury dark background texture with subtle silver and blue light rays and soft bokeh effects. Main color is very dark #080a0e with silver #a8b4c4 and steel blue #7eb8e0 glow effects scattered throughout. Wide panoramic banner format. Premium luxurious atmospheric feel. No text, no objects, just abstract ambient light.',
    aspectRatio: '16:9',
  },
];

async function generateAsset(asset: AssetConfig, retryCount = 0): Promise<boolean> {
  console.log(`\n🎨 Generating: ${asset.name} (${asset.aspectRatio})...`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: asset.prompt,
      config: {
        responseModalities: ['image', 'text'],
        imageConfig: {
          aspectRatio: asset.aspectRatio,
        },
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('No content parts in response');
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        const outputPath = path.join(OUTPUT_DIR, asset.filename);
        fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, 'base64'));
        const stats = fs.statSync(outputPath);
        console.log(`  ✅ Saved: ${asset.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
        return true;
      }
    }

    throw new Error('No image data found in response parts');
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Failed: ${errMsg}`);

    if (retryCount < 1) {
      console.log(`  🔄 Retrying...`);
      await new Promise((r) => setTimeout(r, 3000));
      return generateAsset(asset, retryCount + 1);
    }

    return false;
  }
}

async function main() {
  console.log('=== Stock Lotto Brand Asset Generator ===');
  console.log(`Output directory: ${OUTPUT_DIR}`);

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let successCount = 0;
  let failCount = 0;

  for (const asset of assets) {
    const success = await generateAsset(asset);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay between requests to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\n=== Generation Complete ===');
  console.log(`✅ Success: ${successCount}/${assets.length}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${assets.length}`);
  }

  // List generated files
  console.log('\nGenerated files:');
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.png'));
  for (const file of files) {
    const stats = fs.statSync(path.join(OUTPUT_DIR, file));
    console.log(`  📁 ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

main().catch(console.error);
