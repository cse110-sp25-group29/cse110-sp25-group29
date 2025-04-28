# PocketPass – The Business-Card Wallet

**CSE 110** - **Team #29** - **Boom Boom Powell**

**Author**: Aarav Vidhawan

**Organizer**: Xiaogeng Xu

---

## Statement of Purpose (SoP)

### Mission
Replace paper business cards with an open, privacy-first progressive web app that lets anyone create, store, and instantly share contact cards using only a web browser, QR codes, and (where available) NFC taps.

### Problem We Solve
- Networking events still rely on fragile, single-purpose paper cards.
- Existing digital-card tools force sign-ups, hide data behind paywalls, or require proprietary apps.
- Cross-platform sharing is inconsistent; users want a friction-free hand-off that works even offline.

### Target Users
- Students and early-career professionals who network frequently but lack budget for paid SaaS cards.
- Event organizers who need a low-tech, privacy-respecting solution for attendee info exchange.
- Privacy-conscious users who prefer local-first storage and open-source tooling.

### Objectives for the 6-week MVP
- Create / Edit / Delete contact cards locally (using IndexedDB).
- Display cards in a scrollable "wallet" list and detail view.
- Share a card via a dynamically generated QR code; receive by scanning.
- Optional: Web NFC tap share on supported Android devices.
- 100% offline functionality, installable PWA, and no login requirement.

### Key Differentiators
- Schema-lite cards (easy to extend in v2).
- 100% client-side — users own their data.
- Completely free & open-source; tiny codebase (HTML + CSS + ES modules, no framework).
