import { ITable } from "./Table.interface";
import { FC } from "react";
import Big from "big.js";

const Table: FC<ITable> = (props) => {
  const { market } = props;
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="table__head-text">Price</th>
          <th className="table__head-text">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {market.ask_orders.map((el, index) => (
          <tr key={"ask_orders" + index}>
            <td className="color-red">
              {Big(el.price)
                .div(10 ** 24)
                .toFixed(4)
                .toString()}
            </td>
            <td className="color-red">
              {Big(el.quantity)
                .div(10 ** 22)
                .toFixed(2)
                .toString()}
            </td>
          </tr>
        ))}
        <tr>
          <td className="table__head-text">Second Price</td>
          <td className="table__head-text">Second Quantity</td>
        </tr>
        {market.bid_orders.map((el, index) => (
          <tr key={"bid_orders" + index}>
            <td className="color-green">
              {Big(el.price)
                .div(10 ** 24)
                .toFixed(4)
                .toString()}
            </td>
            <td className="color-green">
              {Big(el.quantity)
                .div(10 ** 22)
                .toFixed(2)
                .toString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default Table;
