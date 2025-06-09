import { formatCurrency } from './texts'

describe('formatCurrency', () => {
  it('formats USD for US locale', () => {
    const result = formatCurrency(1234.56, 'US', 'en')
    expect(result).toBe('$1,234.56')
  })

  it('formats MXN for MX locale', () => {
    const result = formatCurrency(1234.56, 'MX', 'es')
    expect(result).toBe('$1,234.56')
  })
})
