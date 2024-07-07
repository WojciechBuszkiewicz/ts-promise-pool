export const wait = async (timeout: number) => {
  return await new Promise((resolve: (data: any) => void) =>
    setTimeout(() => {
      resolve(true);
    }, timeout),
  );
};
