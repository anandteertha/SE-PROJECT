import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

// Instrument code for Cypress coverage when CYPRESS_COVERAGE is set
const enableCoverage = process.env.CYPRESS_COVERAGE === '1' || process.env.CYPRESS_COVERAGE === 'true';

export default defineConfig({
  plugins: [
    istanbul({
      cypress: true,
      requireEnv: false,
      include: [
        'src/**/*'
      ],
      extension: ['.ts', '.js']
    })
  ].filter(() => enableCoverage) as any,
  build: {
    sourcemap: true,
  },
});
