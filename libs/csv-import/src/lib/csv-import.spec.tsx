import { render } from '@testing-library/react';

import CsvImport from './csv-import';

describe('CsvImport', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CsvImport />);
    expect(baseElement).toBeTruthy();
  });
});
