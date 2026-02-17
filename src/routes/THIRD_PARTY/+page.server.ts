import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, readdir } from 'node:fs/promises'; // readdirを追加
import path from 'node:path';
import type { PageServerLoad } from './$types';
import type { PnpmPackageWithDetails, PnpmLicenseResponse } from '$lib/types/pnpm';

const execPromise = promisify(exec);

// ライセンスファイルっぽい名前を探す関数
async function findLicenseText(packagePath: string): Promise<string | null> {
  try {
    const files = await readdir(packagePath);
    // LICENSE, LICENCE, COPYING などの名前にマッチするものを探す（大文字小文字無視）
    const licenseFile = files.find(f => 
      /^(license|licence|copying|notice)(\.(md|txt|dist))?$/i.test(f)
    );

    if (licenseFile) {
      return await readFile(path.join(packagePath, licenseFile), 'utf-8');
    }
    return null;
  } catch {
    return null;
  }
}

export const load: PageServerLoad = async () => {
  try {
    const { stdout } = await execPromise('pnpm licenses list --json', {
      maxBuffer: 1024 * 1024 * 10
    });
    const licenses = JSON.parse(stdout) as PnpmLicenseResponse;

    // 全パッケージを並列で処理（高速化）
    await Promise.all(
      Object.values(licenses).flat().map(async (pkg: PnpmPackageWithDetails) => {
        const pkgPath = pkg.paths[0];
        
        // 1. package.json の読み込み
        try {
          const pJsonData = await readFile(path.join(pkgPath, 'package.json'), 'utf-8');
          pkg.rawPackageJson = JSON.parse(pJsonData);
        } catch { pkg.rawPackageJson = null; }

        // 2. ライセンス原文の読み込み
        pkg.licenseText = await findLicenseText(pkgPath);
      })
    );

    return { licenses };
  } catch (error) {
    return { licenses: {}, error: '取得失敗' };
  }
};