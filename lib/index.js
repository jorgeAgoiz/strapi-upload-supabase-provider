"use strict";

const { StorageClient } = require("@supabase/storage-js");
const { getBearerToken, getPathKey } = require("./utils");
const { ReadStream } = require("fs");

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
  init({ endpoint, apiKey, bucket, directory = "" }) {
    const storage = new StorageClient(endpoint, {
      apikey: apiKey,
      Authorization: getBearerToken(apiKey),
    });

    /**
     *
     * @param {StrapiFile} file
     */
    const uploadFile = async (file) => {
      const path = getPathKey(file, directory);

      try {
        const { data, error } = await storage
          .from(bucket)
          .upload(path, file?.stream, {
            contentType: file?.mime,
            duplex: "half",
            upsert: true,
            cacheControl: "3600",
          });

        if (!data) {
          throw new Error(error?.message || "Something is wrong");
        }

        const {
          data: { publicUrl },
        } = await storage.from(bucket).getPublicUrl(path);

        const assetUrl = new URL(publicUrl, endpoint);

        file.url = assetUrl.href;
      } catch (error) {
        console.error(error?.message || JSON.stringify(error));
      }
    };

    /**
     *
     * @param {StrapiFile} file
     */
    const deleteFile = async (file) => {
      const path = getPathKey(file, directory);

      try {
        const { error } = await storage.from(bucket).remove([path]);
        if (error) {
          throw new Error(error?.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error?.message || JSON.stringify(error));
      }
    };

    /**
     *
     * @param {StrapiFile} file
     * @param {Object} options
     */
    const checkFileSize = async (file, options) => {
      /**
       * @todo - implement the logic
       */
      console.log({ file, options });
    };

    return {
      upload: uploadFile,
      uploadStream: uploadFile,
      delete: deleteFile,
      checkFileSize,
    };
  },
};
