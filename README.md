# Promise Pool (In progress)

Concurrent promise processing with defined pool size and timeout.

## Usage/Examples

```typescript
import { PromisePool } from "./src/promise-pool";

const promisePool = new PromisePool(["1", "2", "3"], {
  timeout: 100,
  poolSize: 1,
});

const data = await promisePool.execute(async (data, index, pool) => {
  if (data === "3") {
    pool.stopExecution();
  }

  return await Promise.resolve(data);
});
```
