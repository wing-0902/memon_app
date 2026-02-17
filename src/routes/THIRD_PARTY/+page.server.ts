import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { PageServerLoad } from './$types';
import type { PnpmLicenseResponse } from '$lib/types/pnpm';

const execPromise = promisify(exec);

export const load: PageServerLoad = async () => {
  try {
    const { stdout } = await execPromise('pnpm licenses list --json --long', {
      maxBuffer: 1024 * 1024 * 10
    });

    const licenses = JSON.parse(stdout) as PnpmLicenseResponse;

    return {
      licenses
    };
  } catch (error) {
    console.error('pnpm error:', error);
    return {
      licenses: {} as PnpmLicenseResponse,
      error: '取得失敗'
    };
  }
};
