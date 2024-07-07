import { PromisePoolExecutor } from "./promise-pool-executor";
import { type PromisePoolResult } from "./types";

export class PromisePool<T> {
  private poolSize: number;
  private timeout: number;
  private dataToProcess: T[];

  constructor(
    dataToProcess: T[],
    settigs?: { poolSize?: number; timeout?: number },
  ) {
    this.poolSize = settigs?.poolSize ?? 1;
    this.timeout = settigs?.timeout ?? 0;
    this.dataToProcess = dataToProcess;
  }

  setPoolSize(size: number) {
    this.poolSize = size;

    return this;
  }

  setTimeout(timeout: number) {
    this.timeout = timeout;

    return this;
  }

  addData(data: T | T[]) {
    this.dataToProcess = [
      ...this.dataToProcess,
      ...(Array.isArray(data) ? data : [data]),
    ];

    return this;
  }

  async execute<P>(
    handler: (
      data: T,
      index: number,
      pool: { stopExecution: () => void },
    ) => Promise<P>,
  ): Promise<PromisePoolResult<P>> {
    return await new PromisePoolExecutor([...this.dataToProcess], {
      poolSize: this.poolSize,
      timeout: this.timeout,
    }).execute(handler);
  }
}
