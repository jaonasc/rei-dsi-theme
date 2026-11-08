import {
  collection,
  doc,
  getCountFromServer,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const IP_CACHE_KEY = "visitor_ip";

async function fetchJson(url: string): Promise<{ ip?: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ip lookup failed: ${res.status}`);
  return (await res.json()) as { ip?: string };
}

/**
 * Public IP of the visitor. Cached in sessionStorage so we call the
 * third-party API at most once per browser tab.
 */
export async function getVisitorIp(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem(IP_CACHE_KEY);
    if (cached) return cached;
  } catch {
    /* storage blocked */
  }

  const sources = [
    "https://api64.ipify.org?format=json",
    "https://api.ipify.org?format=json",
  ];

  for (const url of sources) {
    try {
      const data = await fetchJson(url);
      const ip = typeof data.ip === "string" ? data.ip.trim() : "";
      if (ip) {
        try {
          sessionStorage.setItem(IP_CACHE_KEY, ip);
        } catch {
          /* storage blocked */
        }
        return ip;
      }
    } catch {
      /* try next source */
    }
  }

  return null;
}

/** Firestore document IDs cannot contain "/". */
function toDocId(ip: string): string {
  return ip.replace(/\//g, "_");
}

/**
 * Records one download for this IP. The document ID is the IP itself, so a
 * second click from the same IP hits an existing document. Firestore rules
 * forbid updates, which makes the write fail with permission-denied — we
 * swallow that and treat it as "already counted".
 */
export async function registerDownload(): Promise<boolean> {
  const ip = await getVisitorIp();
  if (!ip) return false;

  try {
    await setDoc(doc(db, "download_ips", toDocId(ip)), {
      ts: serverTimestamp(),
    });
    return true;
  } catch {
    return false;
  }
}

/** Total of unique IPs that clicked download. */
export async function getDownloadCount(): Promise<number | null> {
  try {
    const snapshot = await getCountFromServer(collection(db, "download_ips"));
    return snapshot.data().count;
  } catch {
    return null;
  }
}