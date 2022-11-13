import { ConnectedWalletAccount } from "near-api-js";

export interface IProfile {
  account: ConnectedWalletAccount | undefined;
  balance: string;
}
