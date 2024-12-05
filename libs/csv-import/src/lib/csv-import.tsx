import { parse } from 'csv-parse/browser/esm';
import { useState } from 'react';

interface CsvImportProps<T> {
  store: T;
  buttonText: string;
  transformer: (data: any[]) => any[];
}

interface AssessmentActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: (transformer: (data: any[]) => any[]) => void;
}

export function CsvImport<T extends AssessmentActions>({ store, buttonText, transformer }: CsvImportProps<T>) {
  const [fileName, setFileName] = useState<string | null>(null);

  function readCsvInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        if (csvData) {
          const records: any[] = [];
          parse(csvData, {
            columns: (row) => {
              let offset = 0;
              return row.map((col: string, index: number, columns: string[]) => {
                if (col === "") {
                  offset++;
                  return `${columns[index - offset]}_${offset}`;
                } else {
                  offset = 0;
                  return col;
                }
              });
            },
            trim: true,
            skip_empty_lines: true,

          })
          .on('data', (row) => {
            records.push(row);
          })
          .on('end', () => {
            store.setRawData(records);
            store.transformData(transformer);
          });
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <div>
      <label className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded">
        {fileName ? 'Change File' : `${buttonText}`}
        <input
          type="file"
          accept=".csv, .tsv"
          onChange={readCsvInput}
          className="hidden"
        />
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600 break-words max-w-[14rem]">
          {fileName}
        </p>
      )}
    </div>
  );
}

export default CsvImport;
