import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the API server
const apiServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

// Start the frontend development server
const frontendServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  apiServer.kill('SIGINT');
  frontendServer.kill('SIGINT');
  process.exit(0);
});

console.log('Servers started. Press Ctrl+C to stop.'); 