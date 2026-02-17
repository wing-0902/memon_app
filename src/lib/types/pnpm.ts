// src/lib/types/pnpm.ts (または +page.server.ts の上の方)
export interface PnpmLicensePackage {
  name: string;
  version: string;
  license: string;
  licenseText?: string;
  vendorUrl?: string;
  vendorName?: string;
  repository?: string;
}

// pnpm の JSON は { "MIT": [ ... ], "Apache-2.0": [ ... ] } という形式
export type PnpmLicenseResponse = Record<string, PnpmLicensePackage[]>;
