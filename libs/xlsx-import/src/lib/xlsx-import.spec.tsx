import { render } from '@testing-library/react';

import XlsxImport from './xlsx-import';

describe('XlsxImport', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<XlsxImport />);
    expect(baseElement).toBeTruthy();
  });
});
