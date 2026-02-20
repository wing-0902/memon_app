// pnpmの返答
export interface PnpmLicensePackage {
  name: string;
  versions: string[];
  paths: string[];
  license: string;
  homepage?: string;
  description?: string;
  author?: string;
}

// package.json
export interface RawPackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
  author?: string | {
    name: string;
    email: string;
    url: string;
  };
  homepage?: string;
  type?: string;
  // 他に取得したいフィールドがあればここに追加
  [key: string]: any;
}

// 最終的に frontend で扱う「package.json 情報込み」の型
export interface PnpmPackageWithDetails extends PnpmLicensePackage {
  rawPackageJson: RawPackageJson | null;
  licenseText?: string | null;
}

// API や load 関数が返す全体の構造
export type PnpmLicenseResponse = Record<string, PnpmPackageWithDetails[]>;
