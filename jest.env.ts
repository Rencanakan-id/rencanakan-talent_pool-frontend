import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// Load .env.test file
dotenvConfig({ path: path.resolve(__dirname, '.env.test') });
