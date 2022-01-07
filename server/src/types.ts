declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: "development" | "production";
    }
  }
}

interface CellData {
  room: string;
  secret: string;
  idx: number;
  code: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  outputs: Array<Map<string, string>>;
}

export { CellData };
