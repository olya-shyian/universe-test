import BooleanValue from "../../../enums/BooleanValue";
import InternalFileType from "../../../enums/InternalFileTypeEnum";
import { API } from "../../../services/api";
import { ApiFile } from "../../../services/api/types";
import { generatePDFCover } from "../../../use-cases/generate-pdf-cover";
import { ParsedUrlQuery } from "querystring";
import { useCallback, useEffect, useState } from "react";

export const useLoadPdfCover = (file: ApiFile, query: ParsedUrlQuery) => {
  const [imagePDF, setImagePDF] = useState<Blob | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // @NOTE: generating cover for pdf-documents
  const loadPdfCover = useCallback(async (): Promise<void> => {
    if (!file || file.internal_type !== InternalFileType.PDF) {
      return;
    }

    setIsImageLoading(true);

    try {
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

      const pdfCover = await generatePDFCover({
        pdfFileUrl: fileUrl,
        width: 640,
      });

      setImagePDF(pdfCover);
    } catch (error) {
      console.error("Error while loading image cover:", error);
    } finally {
      setIsImageLoading(false);
    }
  }, [file, query]);

  useEffect(() => {
    loadPdfCover();
  }, [loadPdfCover]);

  return {
    isImageLoading,
    imagePDF,
  };
};
