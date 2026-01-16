interface CookieStoreSetOptions {
  name: string;
  value: string;
  expires?: number | Date;
  domain?: string;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

interface CookieStoreGetOptions {
  name: string;
}

interface CookieStoreDeleteOptions {
  name: string;
  domain?: string;
  path?: string;
}

interface CookieListItem {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

interface CookieStore {
  get(name: string): Promise<CookieListItem | null>;
  get(options: CookieStoreGetOptions): Promise<CookieListItem | null>;
  getAll(name?: string): Promise<CookieListItem[]>;
  getAll(options?: CookieStoreGetOptions): Promise<CookieListItem[]>;
  set(name: string, value: string): Promise<void>;
  set(options: CookieStoreSetOptions): Promise<void>;
  delete(name: string): Promise<void>;
  delete(options: CookieStoreDeleteOptions): Promise<void>;
}

interface Window {
  cookieStore?: CookieStore;
}
