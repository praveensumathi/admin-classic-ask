export interface OfflineOrders {
  offlineOrders: OfflineOrder[];
  total: number;
}

export interface OfflineOrder {
  _id: string;
  orderNumber: string;
  createdAt: string;
}
