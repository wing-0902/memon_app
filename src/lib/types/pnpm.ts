/**
 * 各パッケージの情報の詳細
 */
export interface PnpmLicensePackage {
  name: string;
  versions: string[];
  paths: string[];
  license: string;
  author?: string;
  homepage: string;
  description: string;
}

export type PnpmLicenseResponse = Record<string, PnpmLicensePackage[]>;
