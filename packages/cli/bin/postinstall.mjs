#!/usr/bin/env -S node --experimental-import-meta-resolve

/**
 * This scripts patches Shopify CLI to add a Node experimental flag required by MiniOxygen
 */

import path from 'path';
import fs from 'fs/promises';
import {fileURLToPath} from 'url';

try {
  const cliPkgPath = fileURLToPath(await import.meta.resolve('@shopify/cli'));

  // @shopify/cli/dist/xyz => @shopify/cli/bin/run.js
  const cliFilePath = path.join(cliPkgPath, '..', '..', 'bin', 'run.js');

  const content = await fs.readFile(cliFilePath, 'utf-8');
  await fs.writeFile(
    cliFilePath,
    // Add flag at the end of the shebang and -S param to support Linux (CI)
    content.replace(
      '#!/usr/bin/env node',
      '#!/usr/bin/env -S node --experimental-vm-modules\n',
    ),
    'utf-8',
  );
} catch (error) {
  console.warn(
    'Shopify CLI could not be patched. This might generate issues when running MiniOxygen.\n',
    error.message + '\n',
    error.stack,
  );
}