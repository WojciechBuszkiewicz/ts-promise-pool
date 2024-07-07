import { PromisePool } from "./src/promise-pool";

const promisePool = new PromisePool(["1", "2", "3"], {
  timeout: 100,
  poolSize: 1,
});

const example = async () => {
  const data = await promisePool.execute(async (data, index, pool) => {
    if (data === "3") {
      pool.stopExecution();
    }

    return await Promise.resolve(data);
  });
};
