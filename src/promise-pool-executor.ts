import { type PromisePoolResult } from "./types";
import { wait } from "./utils";

export class PromisePoolExecutor<T> {
  private readonly poolSize: number;
  private readonly timeout: number;
  private readonly dataToProcess: T[];
  private isStopped: boolean = false;

  constructor(
    dataToProcess: T[],
    settigs?: { poolSize?: number; timeout?: number },
  ) {
    this.poolSize = settigs?.poolSize ?? 1;
    this.timeout = settigs?.timeout ?? 0;
    this.dataToProcess = dataToProcess;
  }

  private stopExecution() {
    this.isStopped = true;
  }

  async execute<P>(
    handler: (
      data: T,
      index: number,
      pool: { stopExecution: () => void },
    ) => Promise<P>,
  ) {
    let currentPromises: Array<Promise<any>> = [];

    const results: PromisePoolResult<P> = [];
    for (let i = 0; i < this.dataToProcess.length; i++) {
      if (this.isStopped) {
        break;
      }

      const newTask = handler(this.dataToProcess[i], i, {
        stopExecution: this.stopExecution.bind(this),
      })
        .then((data) => {
          results.push({ status: "solved", data, index: i });
        })
        .catch((data) => {
          results.push({ status: "error", data, index: i });
        })
        .finally(() => {
          // eslint-disable-next-line
          currentPromises = currentPromises.filter(
            (promise) => promise !== newTask,
          );
        });
      currentPromises.push(newTask);

      await wait(this.timeout);

      if (currentPromises.length >= this.poolSize) {
        await Promise.race([...currentPromises]);
      }
    }

    await Promise.all(currentPromises);

    return results;
  }
}
