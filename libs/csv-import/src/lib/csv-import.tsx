import Papa from 'papaparse';
interface CsvImportProps<T> {
  store: T;
}

interface AssessmentActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: () => void;
}

export function CsvImport<T extends AssessmentActions
  >({ store }: CsvImportProps<T>) {
  return (
    <div>
      <input
        type="file"
        accept=".csv, .tsv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const csvData = event.target?.result as string;
              if (csvData) {
                const headers: string[] = [];
                // Parse CSV with PapaParse
                Papa.parse(csvData, {
                  header: true,
                  skipEmptyLines: true,
                  quoteChar: '"',
                  escapeChar: '\\',
                  fastMode: false,
                  transformHeader: (header: string, index: number) => {
                    if (header === "") {
                      header = headers[index -1]
                    }
                    headers.push(header);
                    return header;
                  },
                  complete: (results) => {
                    store.setRawData(results.data);
                    store.transformData();
                    console.log(results.data);
                  },
                  error: (error: Papa.ParseError) => {
                    // todo: global logger with log level flags.
                    console.error('Error parsing CSV:', error);
                    store.setError(error);
                  }
                });
              }
            };
            reader.readAsText(file);
          }
        }}
      />
    </div>
  );
}

export default CsvImport;
