import { Market } from "./Market.interface";
import { Markets } from "./Markets.interface";

export interface IContract {
  markets: (props: {}) => Markets[];
  view_market: (props: { market_id: nubmer }) => Market;
}
