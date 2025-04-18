export const Conditions = {
  hold: () => true,
  fail: () => false,

  greaterThan: (aNumber: number) => (value: number) => value > aNumber,
  lessThan(aNumber: number) {
    return (value: number) => !this.greaterThan(aNumber)(value) && value !== aNumber;
  },

  greaterThanOrEqual(aNumber: number) {
    return (value: number) => this.greaterThan(aNumber)(value) || value === aNumber;
  },
};
