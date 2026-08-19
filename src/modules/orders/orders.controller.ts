import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { Order, OrderStatus, IOrderTimelineStep } from './orders.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Types } from 'mongoose';

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing Your Order',
  ready: 'Ready for Pickup',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
};

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    items,
    subtotal,
    deliveryFee = 0,
    total,
    payment_method = 'cash',
    order_notes,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  if (user_id !== undefined && user_id !== null && !Types.ObjectId.isValid(user_id)) {
    throw new ApiError(400, 'Invalid user_id');
  }

  const placedAt = new Date().toISOString();
  const order = await Order.create({
    user_id: user_id ? new Types.ObjectId(user_id) : undefined,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    items,
    subtotal,
    deliveryFee,
    total,
    payment_method,
    order_notes,
    placedAt,
  });

  res
    .status(201)
    .json(new ApiResponse(201, order, 'Order placed successfully'));
});

export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  const orders = await Order.find({ user_id: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, orders, 'User orders fetched successfully'));
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, limit } = req.query;

  const filter: Record<string, any> = {};
  if (status) filter.status = status;

  const query = Order.find(filter).sort({ createdAt: -1 });
  const parsedLimit = limit ? parseInt(limit as string, 10) : NaN;
  if (Number.isFinite(parsedLimit) && parsedLimit > 0) query.limit(parsedLimit);

  const orders = await query;

  res
    .status(200)
    .json(new ApiResponse(200, orders, 'All orders fetched successfully'));
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // If order was placed as a guest (no user_id), allow retrieval
  // If order is linked to a user, enforce owner or admin access
  if (order.user_id) {
    const isAdmin = req.user?.role === 'admin';
    const isOwner = req.user?._id && order.user_id.toString() === req.user._id;
    if (!isAdmin && !isOwner) {
      throw new ApiError(403, 'You do not have permission to view this order');
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, order, 'Order fetched successfully'));
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: OrderStatus };

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const validStatuses: OrderStatus[] = ['placed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid order status');
  }

  const currentIndex = validStatuses.indexOf(order.status as OrderStatus);
  const newIndex = validStatuses.indexOf(status);

  if (newIndex < currentIndex) {
    throw new ApiError(400, 'Cannot revert order status to an earlier stage');
  }

  order.status = status;

  const timelineStatuses = order.timeline.map((t: IOrderTimelineStep) => t.status);
  if (!timelineStatuses.includes(status)) {
    order.timeline.push({
      status,
      label: STATUS_LABELS[status],
      timestamp: new Date().toISOString(),
    });
  }

  if (status === 'delivered') {
    order.payment_status = 'paid';

    // Award loyalty points to member if order is linked to a user account
    if (order.user_id) {
      try {
        const { User } = await import('../auth/auth.model');
        const user = await User.findById(order.user_id);
        if (user && user.is_loyalty_member) {
          const pointsEarned = Math.floor(order.total / 100);
          if (pointsEarned > 0) {
            user.loyalty_points = (user.loyalty_points || 0) + pointsEarned;
            await user.save();
          }
        }
      } catch {
        // Continue silently if user loyalty points update fails
      }
    }
  }

  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, order, 'Order status updated successfully'));
});

export const getOrderStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [totalOrders, pending, preparing, ready, outForDelivery, delivered, today] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'placed' }),
    Order.countDocuments({ status: 'preparing' }),
    Order.countDocuments({ status: 'ready' }),
    Order.countDocuments({ status: 'out-for-delivery' }),
    Order.countDocuments({ status: 'delivered' }),
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      },
      { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } },
    ]),
  ]);

  const stats = {
    total: totalOrders,
    byStatus: {
      placed: pending,
      preparing,
      ready,
      'out-for-delivery': outForDelivery,
      delivered,
    },
    today: today[0]?.count || 0,
    todayRevenue: today[0]?.revenue || 0,
  };

  res
    .status(200)
    .json(new ApiResponse(200, stats, 'Order statistics fetched successfully'));
});
