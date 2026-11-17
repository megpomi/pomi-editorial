// Server-derived ad-free entitlement — base44/functions/getSubscriberStatus/entry.ts
//
// The ad-free flag is NEVER read from the User record: `plan` there is client-writable
// (updateMe), so it cannot decide access. The flag is derived from the Base44Purchase rows
// the payments webhook writes — a purchase grants access when it is "paid" and no canceled
// purchase for the same subscription followed it. Purchases are joined to the caller by
// appUserId (signed-in checkout) or buyerEmail (anonymous checkout).

import { createClientFromRequest } from "npm:@base44/sdk@0.8.54";

// A cancel only revokes when it happened after the payment it would revoke.
const isLater = (later, earlier) => {
  const after = later ? Date.parse(later) : NaN;
  if (!Number.isFinite(after)) return false;
  const before = earlier ? Date.parse(earlier) : NaN;
  if (!Number.isFinite(before)) return true;
  return after > before;
};

export default async function (req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    // No signed-in user: there is no purchase to own, and nothing to disclose.
    if (!user) return Response.json({ subscriber: false });

    // Service role so the buyer's own purchase rows can be read on their behalf; the query is
    // pinned to this user's id/email, so no other user's rows are ever touched.
    const purchases = await base44.asServiceRole.entities.Base44Purchase.filter({
      $or: [{ appUserId: user.id }, { buyerEmail: user.email }],
    });

    const subscriber = purchases.some(
      (purchase) =>
        purchase.status === "paid" &&
        !purchases.some(
          (other) =>
            other.status === "canceled" &&
            !!other.subscriptionId &&
            other.subscriptionId === purchase.subscriptionId &&
            isLater(other.canceledAt, purchase.paidAt)
        )
    );

    return Response.json({ subscriber });
  } catch (error) {
    console.error("getSubscriberStatus failed", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}