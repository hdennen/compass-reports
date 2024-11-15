import Papa from 'papaparse';

export function CsvImport() {
  return (
    <div>
      <input
        type="file"
        accept=".csv"
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
                  transformHeader: (header: string, index: number) => {
                    // If header is empty, use previous header
                    if (header === "") {
                      header = headers[index -1]
                    }
                    headers.push(header);
                    return header;
                  },
                  complete: (results) => {
                    console.log('Parsed CSV:', results.data);
                  },
                  error: (error: Papa.ParseError) => {
                    console.error('Error parsing CSV:', error);
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
