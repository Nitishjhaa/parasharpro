// src/lib/db.js
import { get, set, del } from "idb-keyval";

const KEY = "kundali_list_v1"; // versioned key (safe to bump later)

// Save a new kundali record (keep last 5)
export const saveKundali = async (entry) => {
  // entry should be an object that contains:
  // { raw: <fullKundaliResponse>, meta: { name, birthDate, birthTime, city, gender, ... } }
  let list = (await get(KEY)) || [];

  // Add ID and timestamp
  const record = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...entry,
  };

  // Add new one at top
  list.unshift(record);

  // Keep only last 100
  list = list.slice(0, 100);

  await set(KEY, list);

  return record;
};

// Get all saved kundalis (most recent first)
export const loadKundalis = async () => {
  return (await get(KEY)) || [];
};

// Get one kundali by index (0 = newest)
export const loadKundaliByIndex = async (index) => {
  const list = (await get(KEY)) || [];
  return list[index] || null;
};

// Remove all saved kundalis
export const clearKundalis = async () => {
  await del(KEY);
};
