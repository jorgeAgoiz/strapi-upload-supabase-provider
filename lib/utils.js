const path = require('path')

/**
 * Create a Bearer token
 *
 * @param {string} key Your SUPABASE API KEY (service_role)
 * @returns {string}
 */
const getBearerToken = (key) => `Bearer ${key}`

/**
 * Generate your storage endpoint
 *
 * @param {string} baseUrl Your RESTful endpoint
 * @returns {string}
 */
const getStorageEndpoint = (baseUrl) => `${baseUrl}/storage/v1`

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
 * }} file - Strapi File Interface
 * @param {string} directory - Bucket directory where to store our images
 * @returns {string}
 */
const getPathKey = (file, directory) => {
  const key = `${file.hash}${file.ext}`
  return path.posix.join(directory, key)
}

module.exports = {
  getBearerToken,
  getPathKey,
  getStorageEndpoint,
}
