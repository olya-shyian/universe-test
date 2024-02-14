import { API } from "../../../services/api";
import { ApiFile } from "../../../services/api/types";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

export const useFile = (query: ParsedUrlQuery) => {
  const [file, setFile] = useState<ApiFile>();

  useEffect(() => {
    API.files.getFiles().then(({ files }) => {
      if (query?.file) {
        const chosenFile = files.find((item) => item.id === query!.file);

        setFile(chosenFile);

        return;
      }

      setFile(files[files.length - 1]);
    });
  }, []);

  return file;
};
