import 'server-only';

import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { StorageAdapter } from './index';

const ROOT = path.join(process.cwd(), 'public', 'uploads');

export const localStorageAdapter: StorageAdapter = {
  name: 'local',

  async put(key, data) {
    const target = path.join(ROOT, key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data);
    return { url: `/uploads/${key}`, key };
  },

  async remove(key) {
    await unlink(path.join(ROOT, key)).catch(() => {
      // Файла может уже не быть — это не ошибка удаления.
    });
  },
};
