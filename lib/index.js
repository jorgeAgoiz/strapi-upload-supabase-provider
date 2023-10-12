"use strict";

const { StorageClient } = require("@supabase/storage-js");
const path = require("path");

module.exports = {
  init(providerOptions) {
    const { endpoint, apiKey, bucket, directory, options } = providerOptions;
    const storage = new StorageClient(endpoint, {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
    });

    const getPath = (file) => {
      if (directory) {
        return `${directory}/${file.hash}${file.ext}`;
      }

      return `${file.hash}${file.ext}`;
    };

    return {
      async upload(file) {},
      async uploadStream(file) {
        const path = getPath(file);

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

          const assetUrl = new URL(publicUrl);
          assetUrl.hostname = endpoint;
          file.url = assetUrl;
        } catch (error) {
          console.error(error?.message || JSON.stringify(error));
        }
      },
      async delete(file) {},
      async checkFileSize(file, options) {
        console.log({ file, options });
      },
    };
  },
};
