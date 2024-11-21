import { parse } from 'csv-parse/browser/esm';


interface CsvImportProps<T> {
  store: T;
}

interface AssessmentActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: () => void;
}

export function CsvImport<T extends AssessmentActions>({ store }: CsvImportProps<T>) {

  function readCsvInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
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
            store.transformData();
          });
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv, .tsv"
        onChange={readCsvInput}
      />
    </div>
  );
}

export default CsvImport;
