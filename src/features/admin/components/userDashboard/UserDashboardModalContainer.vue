<template>
  <!--
    =========================================================
    User Dashboard Modal Container
    =========================================================

    Centralized modal mounting layer for the Users dashboard.

    Responsibilities:
    - mount canonical user workflow modals in one place
    - keep modal rendering separate from trigger surfaces
    - rely on store-controlled visibility state

    Notes:
    - this component does not own modal logic
    - this component does not own modal visibility state
    - individual modals remain responsible for their own workflows
  -->
  <div>
    <UserCreateModal />
    <UserEditModal />
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Dashboard Modal Container
 * =========================================================
 *
 * Centralized render registry for the major Users dashboard
 * workflow modals.
 *
 * Architectural role:
 * - mirrors the canonical modal-container pattern established
 *   by the Playables dashboard
 * - keeps modal mounting centralized and predictable
 */

import UserCreateModal from '@/features/admin/components/userDashboard/UserCreateModal.vue'
import UserEditModal from '@/features/admin/components/userDashboard/UserEditModal.vue'
</script>