export interface PnpmLicensePackage {
  name: string;
  versions: [string];
  paths: [string];
  author?: string;
  description?: string;
  license: string;
  licenseText?: string;
  vendorUrl?: string;
  vendorName?: string;
  repository?: string;
}

export type PnpmLicenseResponse = Record<string, PnpmLicensePackage[]>;
