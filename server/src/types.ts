declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: "development" | "production";
    }
  }
}

interface CellData {
  secret: string;
  result: string;
  type: DataType;
  rawCode: string;
}

enum DataType {
  IMG,
}

export { CellData };
