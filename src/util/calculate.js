export const sum = function (nums) {
  if (!Array.isArray(nums)) {
    console.log(`${nums} is not array`);
    return 0;
  }
  return nums.reduce(function (subtotal, num) {
    return subtotal + num;
  }, 0);
};

export const average = function (nums) {
  if (!Array.isArray(nums)) {
    console.log(`${nums} is not array`);
    return 0;
  }
  return sum(nums) / nums.length;
};
