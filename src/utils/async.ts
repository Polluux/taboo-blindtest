export async function sleepUntil(conditionFunction: () => boolean, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const initialTime = new Date().valueOf();
    const intervalId = setInterval(() => {
      if (conditionFunction()) {
        clearInterval(intervalId);
        resolve();
      } else if ((new Date().valueOf() - initialTime.valueOf()) > timeoutMs) {
        clearInterval(intervalId);
        reject();
      }
    }, 20);
  });
}

export async function sleep(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}
