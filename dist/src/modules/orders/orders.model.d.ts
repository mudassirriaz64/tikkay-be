import { Document, Types } from 'mongoose';
export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
export interface IOrderItem {
    itemId?: Types.ObjectId | string;
    title: string;
    quantity: number;
    price: number;
    image_url: string;
    breakdown?: string;
}
export interface IOrderTimelineStep {
    status: OrderStatus;
    label: string;
    timestamp: string;
}
export interface IOrder extends Document {
    user_id: Types.ObjectId;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    items: IOrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: OrderStatus;
    payment_method: 'cash' | 'card' | 'online';
    payment_status: 'pending' | 'paid' | 'failed';
    order_notes?: string;
    timeline: IOrderTimelineStep[];
    placedAt: string;
}
export declare const Order: import("mongoose").Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=orders.model.d.ts.map