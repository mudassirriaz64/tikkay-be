"use client";

import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, Notice, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Select, Toggle } from "../ui/controls";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { AccountOrder, AccountReview, OrderStatus } from "@/types";
import { Package, Receipt, ShoppingBag, Wallet } from "lucide-react";

const ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
];

export function OrdersModule() {
  const { data, updateSlice } = useAdminData();
  const [notice, setNotice] = useState(false);

  const orders = data.orders.orders;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const active = orders.filter((o) => o.status !== "delivered").length;

  function commitOrders(next: AccountOrder[]) {
    updateSlice("orders", { ...data.orders, orders: next });
  }
  function setStatus(id: string, status: OrderStatus) {
    commitOrders(
      orders.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }
  function toggleReviewApproved(review: AccountReview) {
    updateSlice("orders", {
      ...data.orders,
      reviews: data.orders.reviews.map((r) =>
        r.id === review.id ? { ...r, is_approved: !r.is_approved } : r,
      ),
    });
  }

  const statusTone: Record<OrderStatus, "neutral" | "orange" | "gold" | "peach" | "green"> = {
    placed: "neutral",
    preparing: "orange",
    ready: "gold",
    "out-for-delivery": "peach",
    delivered: "green",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fulfilment"
        title="Orders"
        description="Track every order from the moment it's placed to the last plate delivered."
      />

      {notice ? <Notice tone="success">Order status updated.</Notice> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(orders.length)} sub="All channels" />
        <StatCard icon={Package} label="Active" value={String(active)} sub="Not yet delivered" />
        <StatCard icon={Receipt} label="Delivered" value={String(delivered)} sub="Completed" />
        <StatCard icon={Wallet} label="Revenue" value={formatCurrency(revenue)} sub="Across all orders" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="Order Queue" description="Change status to update the guest's tracking" className="xl:col-span-2">
          <ul className="divide-y divide-[var(--border-warm)]">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {order.id}
                    <span className="ml-2 font-normal text-[var(--text-faint)]">
                      {order.items.reduce((n, i) => n + i.quantity, 0)} items
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {new Date(order.placedAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                    {order.items.map((i) => `${i.title} ×${i.quantity}`).join(", ")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {formatCurrency(order.total)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onChange={(e) => setStatus(order.id, e.target.value as OrderStatus)}
                      className="h-9 w-44 py-1.5 text-xs"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/-/g, " ")}
                        </option>
                      ))}
                    </Select>
                    <Badge tone={statusTone[order.status]}>{order.status.replace(/-/g, " ")}</Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Guest Profile" description="Demo account shown on the accounts page">
            <dl className="space-y-3 text-sm">
              {(
                [
                  ["Name", data.orders.profile.name],
                  ["Email", data.orders.profile.email],
                  ["Phone", data.orders.profile.phone],
                  ["Address", data.orders.profile.address],
                  ["Member Since", data.orders.profile.memberSince],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="shrink-0 text-[var(--text-faint)]">{label}</dt>
                  <dd className="text-right text-[var(--text-primary)]">{value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard title="Customer Reviews" description="Reviews written from this account">
            <ul className="divide-y divide-[var(--border-warm)]">
              {data.orders.reviews.map((review) => (
                <li key={review.id} className="py-3">
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {review.dish}
                    <span className="ml-2 text-xs font-normal text-[var(--accent-gold)]">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">
                    {review.review_text}
                  </p>
                  <div className="mt-2">
                    <Toggle
                      checked={review.is_approved}
                      onChange={() => toggleReviewApproved(review)}
                      label="Approved"
                      description="Visible on the public site"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
