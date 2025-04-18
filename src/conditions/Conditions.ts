export const Conditions = {
  hold: () => true,
  fail: () => false,

  greaterThan: (aNumber: number) => (value: number) => value > aNumber,
};
