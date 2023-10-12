const path = require("path");
const { ReadStream } = require("fs");

/**
 * Create a Bearer token
 *
 * @param {string} key
 * @returns {string}
 */
const getBearerToken = (key) => `Bearer ${key}`;

/**
 * Generate path key for files
 *
 * @param {{
 *    name: string
 *   hash: string
 *   ext: string
 *   mime: string
 *   path: object
 *   width: number
 *   height: number
 *   size: number
 *   url: string
 *   buffer?: string
 *   stream?: ReadStream
 *   getStream: () => {}
 * }} file
 * @param {string} directory
 * @returns {string}
 */
const getPathKey = (file, directory) => {
  const key = `${file.hash}${file.ext}`;
  return path.posix.join(directory, key);
};

module.exports = {
  getBearerToken,
  getPathKey,
};
