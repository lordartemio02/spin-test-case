import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  keyStores,
  connect,
  WalletConnection,
  ConnectedWalletAccount,
  utils,
  Account,
  providers,
  Contract,
} from "near-api-js";
import { Buffer } from "buffer";
import Big from "big.js";
import { Markets } from "./interfaces/Markets.interface";
import { Market } from "./interfaces/Market.interface";
import Profile from "./components/Profile";
import Table from "./components/Table";
import { connectionConfig } from "./config/connectionConfig";

window.Buffer = Buffer;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<ConnectedWalletAccount>();
  const [totalBalance, setTotalBalance] = useState("0");
  const [markets, setMarkets] = useState<Markets[]>([]);
  const [market, setMarket] = useState<Market | null>();

  const getConnections = async () => {
    // connect to NEAR
    const nearConnection = await connect(connectionConfig);
    // create wallet connection
    const walletConnection = new WalletConnection(
      nearConnection,
      "test-case-spin"
    );
    return { nearConnection, walletConnection };
  };
  const signIn = async () => {
    const { walletConnection } = await getConnections();
    walletConnection.requestSignIn({
      contractId: "lordartemio.testnet", // contract requesting access
      successUrl: "http://localhost:3000/", // optional redirect URL on success
      failureUrl: "http://localhost:3000/", // optional redirect URL on failure
    });
  };
  useEffect(() => {
    checkConnect();
  }, []);

  const checkConnect = async () => {
    const { walletConnection } = await getConnections();

    if (walletConnection.isSignedIn()) {
      getAccount();
      getNearContract();
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };
  const signOut = async () => {
    const { walletConnection } = await getConnections();
    walletConnection.signOut();
    setIsConnected(false);
    setMarkets([]);
    setMarket(null);
  };

  const getAccount = async () => {
    const { walletConnection, nearConnection } = await getConnections();
    const walletAccountObj = walletConnection.account();
    const account = await nearConnection.account(
      process.env.REACT_APP_CONTRACT_NAME || ""
    );
    const balance = await account.getAccountBalance();
    const totalBalance = utils.format.formatNearAmount(balance.total);
    setTotalBalance(totalBalance);
    setAccount(walletAccountObj);
  };

  const getNearContract = async () => {
    const { nearConnection } = await getConnections();
    const account = await nearConnection.account(
      process.env.REACT_APP_CONTRACT_NAME || ""
    );
    const contract = new Contract(
      account,
      process.env.REACT_APP_API_CONTRACT_NAME || "",
      {
        viewMethods: ["markets"],
        changeMethods: ["addMessage"],
      }
    ) as unknown as IContract;

    const markets = await contract.markets({});
    setMarkets(markets);
    if (markets.length > 0) {
      getMarket(markets[0].id);
    }
  };

  const getMarket = async (id: number) => {
    const { nearConnection } = await getConnections();
    const account = await nearConnection.account(
      process.env.REACT_APP_CONTRACT_NAME || ""
    );
    const contract = new Contract(
      account,
      process.env.REACT_APP_API_CONTRACT_NAME || "",
      {
        viewMethods: ["view_market"],
        changeMethods: ["addMessage"],
      }
    ) as unknown as IContract;
    const market = await contract.view_market({ market_id: id });
    setMarket(market);
  };

  return (
    <div className="App">
      {isConnected ? (
        <div className="flex flex-row justify-center m-8">
          <Profile account={account} balance={totalBalance} />
          <button onClick={signOut}>signout</button>
        </div>
      ) : (
        <button onClick={signIn}>signin</button>
      )}
      {markets.length > 0 && (
        <select
          className="select"
          onChange={(e) => getMarket(Number(e.target.value))}
        >
          {markets.map((el) => (
            <option key={el.id} value={el.id}>
              {el.base.ticker}/{el.quote.ticker}
            </option>
          ))}
        </select>
      )}
      <div className="flex justify-center m-8">
        {market && <Table market={market} />}
      </div>
    </div>
  );
}

export default App;
