/**
 *
 * @function createListOfSize - Creates a list of length `size` containing integers from `start`
 * @param {number} size - specifies size of list
 * @param {number} start - specifies first value of list
 * @returns list containing integers from start to start + size - 1
 *
 */
const createListOfSize = (size, start = 1) =>
    size > 0 ? Array.from(Array(size)).map(() => start++) : [];

module.exports = createListOfSize;