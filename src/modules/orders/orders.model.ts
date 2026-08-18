import { Schema, model, Document, Types, CallbackError } from 'mongoose';

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

const orderItemSchema = new Schema<IOrderItem>(
  {
    itemId: { type: Schema.Types.Mixed, required: false },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image_url: { type: String, required: false, default: '' },
    breakdown: { type: String, required: false },
  },
  { _id: false }
);

const orderTimelineStepSchema = new Schema<IOrderTimelineStep>(
  {
    status: {
      type: String,
      enum: ['placed', 'preparing', 'ready', 'out-for-delivery', 'delivered'],
      required: true,
    },
    label: { type: String, required: true },
    timestamp: { type: String, required: true, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', index: true, default: undefined },
    customer_name: { type: String, required: true, trim: true },
    customer_email: { type: String, required: true, lowercase: true, trim: true },
    customer_phone: { type: String, required: true, default: '' },
    customer_address: { type: String, required: true, default: '' },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['placed', 'preparing', 'ready', 'out-for-delivery', 'delivered'],
      default: 'placed',
      index: true,
    },
    payment_method: {
      type: String,
      enum: ['cash', 'card', 'online'],
      default: 'cash',
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    order_notes: { type: String, default: '' },
    timeline: [orderTimelineStepSchema],
    placedAt: { type: String, required: true, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

orderSchema.index({ user_id: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

orderSchema.pre<IOrder>('save', function (this: IOrder, next: (err?: CallbackError) => void) {
  if (this.timeline.length === 0) {
    this.timeline = [
      { status: 'placed', label: 'Order Placed', timestamp: this.placedAt || new Date().toISOString() },
    ];
  }
  next();
});

export const Order = model<IOrder>('Order', orderSchema);
