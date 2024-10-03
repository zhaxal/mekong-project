/* eslint-disable @typescript-eslint/no-explicit-any */
import shp from "shpjs";
import readXlsxFile from "read-excel-file";

interface ShapeResult {
  hasError: boolean;
  errorMessage: string | null;
  data: any;
}

const extractShapes = async (files: FileList): Promise<any> => {
  const result: ShapeResult = {
    hasError: false,
    errorMessage: null,
    data: null,
  };

  const _formatShape = (_data: any): any[] => {
    return _data.features;
  };

  const _parseFile = async (_file: File): Promise<ShapeResult> => {
    const _result: ShapeResult = {
      hasError: false,
      errorMessage: null,
      data: null,
    };

    const _data = await _file
      .arrayBuffer()
      .then((_buffer) => shp(_buffer))
      .catch((_err) => {
        console.error(_err);
        _result.hasError = true;
        _result.errorMessage = "IMPORT_UNRECOGNISED_FILE";
        return null;
      });

    if (_data) {
      _result.data = _formatShape(_data);
    }

    if (_result.hasError) return _result;

    if (!_result.data || _result.data.length < 1) {
      _result.hasError = true;
      _result.errorMessage = "EXTRACT_FILE_EMPTY";
    }

    return _result;
  };

  // read the files
  result.data = await Promise.all(
    Array.prototype.map.call(files, _parseFile)
  ).catch((err) => {
    console.error(err);
    result.hasError = true;
    result.errorMessage = "Extract went wrong";
    return null;
  });

  if (result.hasError) return result;

  if (!result.data || result.data.length < 1) {
    result.hasError = true;
    result.errorMessage = "IMPORT_SHAPE_EMPTY";
  }

  return result.data[0].data;
};

const excelToJson = async (file: File): Promise<any> => {
  try {
    const rows = await readXlsxFile(file);
    const headers = rows[0];
    const json = rows.slice(1).map((row) => {
      const obj: any = {};
      row.forEach((cell, index) => {
        const header = headers[index];
        if (typeof header === "string") {
          obj[header] = cell;
        }
      });
      return obj;
    });
    return json;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw new Error("Failed to read Excel file");
  }
};

export { extractShapes, excelToJson };
