import { rmSync } from 'fs';
import { resolve } from 'path';

// Wipe the unit-test temp data dir once before the run for determinism.
export default function () {
  rmSync(resolve(import.meta.dirname, '.tmpdata'), { recursive: true, force: true });
}
