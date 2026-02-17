import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PageServerLoad } from './$types';
import type { PnpmLicenseResponse, PnpmPackageWithDetails } from '$lib/types/pnpm';

const execPromise = promisify(exec);

export const load: PageServerLoad = async () => {
  try {
    const { stdout } = await execPromise('pnpm licenses list --json', {
      maxBuffer: 1024 * 1024 * 10
    });

    // 1. まず parse した結果を型定義に合わせる
    const licenses = JSON.parse(stdout) as PnpmLicenseResponse;

    // 2. package.jsonの中身を結合する
    // Object.values を使うとループが少しスッキリします
    for (const packages of Object.values(licenses)) {
      for (const pkg of packages) {
        try {
          if (pkg.paths && pkg.paths.length > 0) {
            const packageJsonPath = path.join(pkg.paths[0], 'package.json');
            const rawData = await readFile(packageJsonPath, 'utf-8');
            pkg.rawPackageJson = JSON.parse(rawData);
          }
        } catch (e) {
          pkg.rawPackageJson = null;
        }
      }
    }

    // 3. 型に沿ったデータを返す
    return {
      licenses
    };
  } catch (error) {
    console.error(error);
    return {
      licenses: {} as PnpmLicenseResponse,
      error: '取得失敗'
    };
  }
};
