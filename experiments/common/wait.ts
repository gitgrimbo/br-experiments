export function wait(ms): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitFor<T>(timeoutMs = 5 * 1000, checkEveryMs = 1 * 1000, checkFn: () => boolean): Promise<T> {
  const now = +new Date();
  let checkValue = null;
  while (!(checkValue = checkFn())) {
    if (+new Date() - now > timeoutMs) {
      throw new Error("timeout");
    }
    await wait(checkEveryMs);
  }
  return checkValue;
}
