"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface ActivityEvent {
  id: string;
  type: "CART_ADD" | "ORDER_PLACED" | "CART_REMOVE";
  title: string;
  description: string;
  amount: number;
  customerName: string;
  productImage?: string;
  timestamp: string;
  rawTime: number;
}

const CHANNEL_NAME = "keethankart-realtime-channel";
const ACTIVITY_STORAGE_KEY = "keethankart-live-activities-v1";

let globalBroadcastChannel: BroadcastChannel | null = null;

// Helper to get channel safely in browser environment
function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }
  try {
    if (!globalBroadcastChannel) {
      globalBroadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    }
    return globalBroadcastChannel;
  } catch {
    return null;
  }
}

// Initial sample activities for immediate rich visual feel
export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-init-1",
    type: "ORDER_PLACED",
    title: "Order #KK-94281 Confirmed",
    description: "Samsung Galaxy S24 Ultra 5G purchased",
    amount: 74999,
    customerName: "Rahul Sharma (Delhi)",
    productImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
    timestamp: "2 mins ago",
    rawTime: Date.now() - 120000,
  },
  {
    id: "act-init-2",
    type: "CART_ADD",
    title: "Item Added to Cart",
    description: "boAt Airdopes 141 TWS Earbuds (₹1,299)",
    amount: 1299,
    customerName: "Priya Nair (Bengaluru)",
    productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    timestamp: "4 mins ago",
    rawTime: Date.now() - 240000,
  },
  {
    id: "act-init-3",
    type: "CART_ADD",
    title: "Item Added to Cart",
    description: "Manyavar Silk Kurta Set (₹4,999)",
    amount: 4999,
    customerName: "Ananya Roy (Kolkata)",
    productImage: "https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?w=600&q=80",
    timestamp: "7 mins ago",
    rawTime: Date.now() - 420000,
  },
  {
    id: "act-init-4",
    type: "ORDER_PLACED",
    title: "Order #KK-73192 Confirmed",
    description: "Noise ColorFit Pro 4 & Campus Running Shoes",
    amount: 4798,
    customerName: "Karthik Verma (Hyderabad)",
    productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    timestamp: "12 mins ago",
    rawTime: Date.now() - 720000,
  },
];

export function getStoredActivities(): ActivityEvent[] {
  if (typeof window === "undefined") return INITIAL_ACTIVITIES;
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) return INITIAL_ACTIVITIES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function saveStoredActivities(activities: ActivityEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities.slice(0, 30)));
  } catch {
    /* ignore quota */
  }
}

export function broadcastActivity(event: Omit<ActivityEvent, "id" | "rawTime">) {
  const fullEvent: ActivityEvent = {
    ...event,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    rawTime: Date.now(),
  };

  // 1. Update localStorage
  const existing = getStoredActivities();
  const next = [fullEvent, ...existing].slice(0, 30);
  saveStoredActivities(next);

  // 2. Broadcast across tabs via BroadcastChannel
  const ch = getChannel();
  if (ch) {
    ch.postMessage({ type: "NEW_ACTIVITY", payload: fullEvent });
  }

  // 3. Dispatch local window custom event for same-tab listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("keethankart-activity", { detail: fullEvent })
    );
  }

  return fullEvent;
}

export function useRealtimeActivity() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [liveOrderCount, setLiveOrderCount] = useState(0);
  const [liveRevenueBonus, setLiveRevenueBonus] = useState(0);
  const seenEventIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const initial = getStoredActivities();
    initial.forEach((act) => seenEventIds.current.add(act.id));
    setActivities(initial);

    const handleNewActivity = (act: ActivityEvent) => {
      if (seenEventIds.current.has(act.id)) return;
      seenEventIds.current.add(act.id);

      setActivities((prev) => [act, ...prev.filter((item) => item.id !== act.id)].slice(0, 30));
      if (act.type === "ORDER_PLACED") {
        setLiveOrderCount((c) => c + 1);
        setLiveRevenueBonus((r) => r + act.amount);
      }
    };

    // 1. Listen on BroadcastChannel
    const ch = getChannel();
    const handleChannelMessage = (msgEvent: MessageEvent) => {
      if (msgEvent.data?.type === "NEW_ACTIVITY" && msgEvent.data?.payload) {
        handleNewActivity(msgEvent.data.payload);
      }
    };
    if (ch) {
      ch.addEventListener("message", handleChannelMessage);
    }

    // 2. Listen on storage event (inter-tab fallback)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ACTIVITY_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            handleNewActivity(parsed[0]);
          }
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Listen on local CustomEvent (same-tab)
    const handleLocal = (e: Event) => {
      const customEvent = e as CustomEvent<ActivityEvent>;
      if (customEvent.detail) {
        handleNewActivity(customEvent.detail);
      }
    };
    window.addEventListener("keethankart-activity", handleLocal);

    return () => {
      if (ch) ch.removeEventListener("message", handleChannelMessage);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("keethankart-activity", handleLocal);
    };
  }, []);

  return { activities, liveOrderCount, liveRevenueBonus };
}
