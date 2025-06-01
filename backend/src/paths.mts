import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const __src = resolve(__dirname)
export const __serverData = resolve(__src, '..', 'serverData')
export const __static = resolve(__src, 'static')
export const __public = resolve(__static, 'public')

export const SESSION_DB_FILE_PATH = resolve(__serverData, 'sessions.sqlite')

export const SERVER_CRT_FILE_PATH = resolve(__serverData, 'server.crt')
// export const SERVER_CSR_FILE_PATH = resolve(__serverData, 'server.csr')
export const SERVER_KEY_FILE_PATH = resolve(__serverData, 'server.key')

export const ENV_FILE_PATH = resolve(__serverData, '.env')

export const STORAGE_DB_FILE_PATH = resolve(__serverData, 'storage.sqlite')