const { StorageClient } = require('@supabase/storage-js')
const { getBearerToken, getPathKey, getStorageEndpoint } = require('./utils')

/**
 * Strapi File Object
 *
 * @typedef {{
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
 * }} StrapiFile
 */

module.exports = {
  init({ apiUrl, apiKey, bucket, directory = '' }) {
    const endpoint = getStorageEndpoint(apiUrl)

    const storage = new StorageClient(endpoint, {
      apikey: apiKey,
      Authorization: getBearerToken(apiKey),
    })

    /**
     *
     * @param {StrapiFile} file
     */
    const uploadFile = async (file) => {
      const path = getPathKey(file, directory)

      const { error } = await storage.from(bucket).upload(path, file?.stream, {
        contentType: file?.mime,
        duplex: 'half',
        upsert: true,
        cacheControl: '3600',
      })

      if (error) {
        throw new Error(error?.message || 'Something is wrong')
      }

      const {
        data: { publicUrl },
      } = await storage.from(bucket).getPublicUrl(path)

      const assetUrl = new URL(publicUrl, endpoint)
      file.url = assetUrl.href
    }

    /**
     *
     * @param {StrapiFile} file
     */
    const deleteFile = async (file) => {
      const path = getPathKey(file, directory)

      const { error } = await storage.from(bucket).remove([path])
      if (error) {
        throw new Error(error?.message || 'Something went wrong')
      }
    }

    /**
     *
     * @param {StrapiFile} file
     * @param {Object} options
     */
    // eslint-disable-next-line no-unused-vars
    const checkFileSize = async (file, options) => {
      /**
       * @todo - Work in progress
       */
      return
    }

    return {
      upload: uploadFile,
      uploadStream: uploadFile,
      delete: deleteFile,
      checkFileSize,
    }
  },
}
