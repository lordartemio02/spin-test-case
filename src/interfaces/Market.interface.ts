export interface Market {
  ask_orders: Order[];
  bid_orders: Order[];
}

export interface Order {
  price: number;
  quantity: number;
}
