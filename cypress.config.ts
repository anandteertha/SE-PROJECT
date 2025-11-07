import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
// Use require to avoid ESM/CJS default export pitfalls inside Cypress
// eslint-disable-next-line @typescript-eslint/no-var-requires
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

export default defineConfig({
	video: true,
	screenshotsFolder: 'e2e/screenshots',
	videosFolder: 'e2e/videos',
	fixturesFolder: 'e2e/fixtures',
	e2e: {
		baseUrl: 'http://localhost:4200',
		supportFile: 'e2e/support/e2e.ts',
		specPattern: 'e2e/features/**/*.feature',
		async setupNodeEvents(on, config) {
			await addCucumberPreprocessorPlugin(on, config);

					on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));

			// Code coverage task
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require('@cypress/code-coverage/task')(on, config);

			return config;
		},
	},
			cucumber: {
				stepDefinitions: ['e2e/steps/**/*.ts'],
			},
});

