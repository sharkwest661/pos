/**
 * Generates a random number between min (inclusive) and max (exclusive).
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} A random number between min and max.
 */
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects a random element from an array.
 * @param {Array} array - The array to select from.
 * @returns {*} A random element from the array.
 */
function getRandomElement(array) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error("Input must be a non-empty array.");
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export { getRandomInteger, getRandomElement };
