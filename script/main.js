import { initCanvas } from './canvas.js';
import { setupTools } from './tools.js';
import { initUI } from './ui.js';
import { saveProject } from './storage.js';

initCanvas();
setupTools();
initUI();
saveProject();