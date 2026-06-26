# Firebase Security Specification: Balanza Bikes

This document outlines the data invariants, security boundaries, and attack vectors validated for the Balanza Bikes Firebase deployment.

## 1. Data Invariants

- **User Accounts (`/users/{userId}`)**:
  - A user profile must precisely match the authenticated user's UID.
  - Users are forbidden from altering their core account coordinates (such as the verified mobile number or creation timestamp) once initially registered.
  - Opt-in promotional notifications is the only mutating attribute authorized via standard client updates.

- **Purchase Transactions (`/orders/{orderId}`)**:
  - A customer's purchase document cannot be created unless the `userId` matches the actual authenticated customer's session (`request.auth.uid`).
  - To prevent state manipulation, orders are completely immutable (updates block entirely) on the client SDK. Subsequent tracking states must be processed via secure systems.
  - Subtotals, coupon deductions, and totals must be verified as positive integers.

- **Newsletter Subscriptions (`/newsletter/{email}`)**:
  - Anyone can submit their email to join the newsletter; however, reading or querying this collection is entirely locked down (`allow read: if false`) to prevent contact scraping.

---

## 2. Red Team "Dirty Dozen" Payloads & Mitigations

Below are the 12 specific hostile payloads designed to break our data guidelines, followed by the exact Fortress rule rules that reject them:

### Payload 1: The Identity Hijack (User Collection)
*Attack Goal:* Creating or modifying a user profile with an arbitrary UID that belongs to a different client.
```json
{
  "userId": "victim_uid_999",
  "phoneNumber": "9876543210",
  "notifyConsent": true,
  "createdAt": "2026-06-01T08:11:00Z"
}
```
*Mitigation:* Handled via standard UID matching in the rule path:
```javascript
allow create: if isSignedIn() && userId == request.auth.uid;
```

### Payload 2: Ghost Field Injection / Memory Pollution (User Collection)
*Attack Goal:* Injecting non-existent fields (e.g. `isAdmin: true` or `couponCredits: 5000`) into the document.
```json
{
  "userId": "request_auth_uid",
  "phoneNumber": "9876543210",
  "notifyConsent": true,
  "createdAt": "2026-06-01T08:11:00Z",
  "isAdmin": true
}
```
*Mitigation:* Handled via strict key and structure constraints:
```javascript
incoming().keys().hasAll(['userId', 'phoneNumber', 'notifyConsent', 'createdAt']) && incoming().keys().size() == 4
```

### Payload 3: Retroactive Creation Date Spoofing (User Collection)
*Attack Goal:* Setting an ancient registration date to trick promotional eligibility timers.
```json
{
  "userId": "request_auth_uid",
  "phoneNumber": "9876543210",
  "notifyConsent": true,
  "createdAt": "TIMESTAMP_OF_YEAR_2010"
}
```
*Mitigation:* Timestamps are verified against server-time ONLY:
```javascript
data.createdAt == request.time
```

### Payload 4: Invalid Mobile Registration Length (User Collection)
*Attack Goal:* Pollute contact details with strings or malicious scripts.
```json
{
  "userId": "request_auth_uid",
  "phoneNumber": "1",
  "notifyConsent": true,
  "createdAt": "request.time"
}
```
*Mitigation:* Number characters constrained explicitly:
```javascript
data.phoneNumber.size() >= 10 && data.phoneNumber.size() <= 15
```

### Payload 5: The Arbitrary Order Order (Order Collection)
*Attack Goal:* Inserting orders belonging to other customers to read order histories or make unauthorized checks.
```json
{
  "userId": "victim_uid_321",
  "items": [],
  "itemsSubtotal": 5000,
  "discountAmount": 0,
  "finalTotal": 5000,
  "status": "placed",
  "createdAt": "request.time"
}
```
*Mitigation:* Strictly blocks creation because `incoming().userId == request.auth.uid` is requested:
```javascript
allow create: if isSignedIn() && incoming().userId == request.auth.uid;
```

### Payload 6: The Free Bike Exploit (Order Collection)
*Attack Goal:* Placing a purchase order where the total price resolves to `0` or negative values.
```json
{
  "userId": "request_auth_uid",
  "items": [{"productId": "explorer-bike"}],
  "itemsSubtotal": 23000,
  "discountAmount": 23000,
  "finalTotal": -100,
  "status": "placed",
  "createdAt": "request.time"
}
```
*Mitigation:* Schema mandates subtotal limits:
```javascript
data.finalTotal is int && data.finalTotal >= 0
```

### Payload 7: Pre-authorized Shipping Hack (Order Collection)
*Attack Goal:* Placing an order with `status: 'shipped'` or `'delivered'` to bypass secure payment processing.
```json
{
  "userId": "request_auth_uid",
  "items": [{"productId": "explorer-bike"}],
  "itemsSubtotal": 23000,
  "discountAmount": 0,
  "finalTotal": 23000,
  "status": "shipped",
  "createdAt": "request.time"
}
```
*Mitigation:* Initial order creation states restricted to `'placed'`:
```javascript
data.status is string && data.status == 'placed'
```

### Payload 8: Immutable Attribute Violation (Order Collection)
*Attack Goal:* Modifying an existing, placed purchase order to change ordered items or decrease prices.
*Mitigation:* Client updates mapped strictly to `false`:
```javascript
allow update: if false; // Orders are client-side immutable
```

### Payload 9: Denial-of-Wallet Path Exhaustion (Order Collection)
*Attack Goal:* Creating collection items with huge, non-standard, randomized IDs.
```
POST /orders/this-is-an-extremely-long-string-designed-to-bloat-costs-...
```
*Mitigation:* Limit document ID length and syntax using `isValidId()`:
```javascript
function isValidId(id) { return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); }
```

### Payload 10: Email Scraping / Privacy Harvest (Newsletter Collection)
*Attack Goal:* Attempting to scan and query details of other registered mailing subscribers.
```
GET /newsletter
```
*Mitigation:* Reading blocks completely:
```javascript
allow read: if false;
```

### Payload 11: Bulk Ordering Denial of Service (Order Collection)
*Attack Goal:* Submitting an order document with thousands of items to exhaust back-end resources.
```json
{
  "userId": "request_auth_uid",
  "items": [{ "id": "bike" }, .../* 10,000 components */...],
  "itemsSubtotal": 23000,
  "discountAmount": 0,
  "finalTotal": 23000,
  "status": "placed",
  "createdAt": "request.time"
}
```
*Mitigation:* List size strictly capped:
```javascript
data.items is list && data.items.size() > 0 && data.items.size() <= 50
```

### Payload 12: Invalid Subscriber Email Injection (Newsletter Collection)
*Attack Goal:* Injecting random binary structures into subscription emails.
```json
{
  "email": "abc",
  "createdAt": "request.time"
}
```
*Mitigation:* Enforce strict email length constraints:
```javascript
data.email is string && data.email.size() >= 5 && data.email.size() <= 120
```
