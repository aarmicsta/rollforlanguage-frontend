
---

````md
/**
 * Admin Dashboard Core Components Documentation
 * 
 * Related Documentation:
 * /docs/frontend/admin-dashboard-overview.md
 * 
 * Purpose:
 * - Documents the core foundational components of the admin dashboard view
 * - Captures routing, layout, shared components, and dashboard-specific view
 * - Establishes a clean baseline for iterative development and future expansion
 * 
 * Development Mantra:
 * "We build not for today, but for tomorrow and beyond."
 */

# AdminLayout Component

## Overview
> Serves as the primary wrapper for all admin-related routes. Handles shared admin UI elements like the Topbar, Sidebar, and background styling. Ensures layout consistency across dashboard, user management, campaigns, content, and system monitoring views.

## Location
> `/src/features/admin/layouts/AdminLayout.vue`

## Features
- [x] Static background image rendered at layout-level for persistence
- [x] Contains `<Topbar>` and `<Sidebar>` components
- [x] Wraps `<router-view>` to render child admin views

## Dependencies
- `@/features/admin/components/Topbar.vue` — top navigation bar
- `@/features/admin/components/Sidebar.vue` — side navigation menu

## Usage
```vue
<template>
  <AdminLayout />
</template>
````

---

# AdminDashboardView Component

## Overview

> Represents the default landing view when an admin logs into `/admin/dashboard`. Displays a welcome banner, grid of interactive widgets, and prepares placeholders for additional dashboard-specific content.

## Location

> `/src/features/admin/views/AdminDashboardView.vue`

## Features

* [x] Displays `WelcomeBanner` with dynamic username and role
* [x] Renders a responsive grid of 3 primary widgets (System Overview, User Metrics, Content Summary)
* [x] Each widget includes icon, title, description
* [ ] Widgets designed to expand (via `AdminModal`) on click (partial implementation)

## Dependencies

* `@/features/admin/components/dashboard/WelcomeBanner.vue`
* `@/features/admin/components/dashboard/UserMetricsWidget.vue`
* `@/features/admin/components/dashboard/SystemOverviewWidget.vue`
* `@/features/admin/components/dashboard/ContentSummaryWidget.vue`
* `@/components/atoms/AppIcon.vue`

## Usage

```vue
<AdminDashboardView />
```

---

# WelcomeBanner Component

## Overview

> Displays a personalized greeting message for the logged-in user. Color-codes text based on user role (admin = periwinkle; superadmin = rose). Positioned at top of dashboard content.

## Location

> `/src/features/admin/components/dashboard/WelcomeBanner.vue`

## Features

* [x] Dynamic username interpolation
* [x] Dynamic role interpolation
* [x] Role-based color styling of greeting message

## Props

| Prop Name | Type   | Default | Description                            |
| :-------- | :----- | :------ | :------------------------------------- |
| username  | String | "Admin" | The name of the logged-in user         |
| role      | String | "admin" | The user's role for role-based styling |

## Usage

```vue
<WelcomeBanner :username="userName" :role="userRole" />
```

---

# AdminModal Component

## Overview

> A reusable modal dialog for all admin needs (widget expansion, confirmations, forms, etc). Implements fade transition, click-to-close overlay, optional title, and slot for content injection.

## Location

> `/src/shared/components/AdminModal.vue`

## Features

* [x] Closeable via ❌ button or clicking background overlay
* [x] Optional title prop
* [x] Transition animation on show/hide
* [x] Uses slot for custom modal content

## Props

| Prop Name | Type    | Default | Description                 |
| :-------- | :------ | :------ | :-------------------------- |
| visible   | Boolean | false   | Controls modal visibility   |
| title     | String  | null    | Optional modal header title |

## Emits

| Event Name | Payload | Description                  |
| :--------- | :------ | :--------------------------- |
| close      | —       | Emitted when modal is closed |

## Usage

```vue
<AdminModal :visible="showModal" title="Widget Details" @close="showModal = false">
  <p>Modal content here</p>
</AdminModal>
```

---

# UserMetricsWidget Component

## Overview

> A standalone widget for displaying user-related metrics. Renders inside the dashboard grid. Clicking the widget opens an `AdminModal` with more detailed static data.

## Location

> `/src/features/admin/components/dashboard/UserMetricsWidget.vue`

## Features

* [x] Displays icon, title, total user count
* [x] Opens `AdminModal` on click
* [x] Shows additional static details inside modal

## Dependencies

* `@/components/shared/AdminCard.vue`
* `@/shared/components/AdminModal.vue`
* `@/components/atoms/AppIcon.vue`

## Usage

```vue
<UserMetricsWidget />
```

---

## 📚 **Additional Notes:**

✅ All routing is configured in `/src/router/index.ts` using `/admin` parent route with `AdminLayout.vue` as layout wrapper.
✅ Each child admin route (dashboard, users, campaigns, content, system) renders inside `<router-view>` in `AdminLayout.vue`.
✅ Sidebar and Topbar are rendered globally via `AdminLayout.vue`.

---

**Development Mantra:**
“We build not for today, but for tomorrow and beyond.”

---
