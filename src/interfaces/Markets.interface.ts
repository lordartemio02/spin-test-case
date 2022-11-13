export interface Markets {
  base: Ticker;
  fee: number;
  id: number;
  quote: Ticker;
}

export interface Ticker {
  address: string;
  decimal: string;
  ticker: string;
}
