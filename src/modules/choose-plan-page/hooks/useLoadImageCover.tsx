import { IMAGES_FORMAT as imagesFormat } from "../../../common/constants";
import BooleanValue from "../../../enums/BooleanValue";
import InternalFileType from "../../../enums/InternalFileTypeEnum";
import { API } from "../../../services/api";
import { ApiFile } from "../../../services/api/types";
import { ParsedUrlQuery } from "querystring";
import { useCallback, useEffect, useState } from "react";

export const useLoadImageCover = (file: ApiFile, query: ParsedUrlQuery) => {
  const [fileLink, setFileLink] = useState<string | null>(null);

  const loadImageCover = useCallback(async () => {
    if (
      !file ||
      !imagesFormat.includes(file.internal_type) ||
      // @NOTE: this two checks for filename exists because sometimes OS do not pass file.type correctly
      !imagesFormat.includes(
        file.filename.slice(-3).toUpperCase() as InternalFileType
      ) ||
      !imagesFormat.includes(
        file.filename.slice(-4).toUpperCase() as InternalFileType
      )
    ) {
      return;
    }

    const fileUrl = await (async () => {
      if (query?.file) {
        return query.editedFile === BooleanValue.True
          ? API.files
              .editedFile(query.file as string)
              .then((response) => response.url)
          : API.files
              .downloadFile(query.file as string)
              .then((response) => response.url);
      }

      return API.files.downloadFile(file.id).then((response) => response.url);
    })();

    setFileLink(fileUrl);
  }, [file, query]);

  useEffect(() => {
    loadImageCover();
  }, [loadImageCover]);

  return fileLink;
};
