<script setup lang="ts">
import type { Item } from '~/components/common/AppSidebar.vue';
import SidebarProvider from '~/components/ui/sidebar/SidebarProvider.vue';
import SidebarTrigger from '~/components/ui/sidebar/SidebarTrigger.vue';
import {
  Home,
  Flame,
  Heart,
  MessageCircle,
  Sun,
  Shield,
  HeartHandshake,
  Scale
} from 'lucide-vue-next';

const items = ref([
  {
    title: 'Inicio',
    url: '/',
    icon: Home,
  },
  {
    title: 'Administrador de tareas',
    url: '/taskManager',
    icon: Flame,
  },
  {
    title: 'Bienestar Emocional',
    url: '/EmotionalWellness',
    icon: Heart,
  },
  {
    title: 'eNPS',
    url: '/EmployeeNPS',
    icon: MessageCircle,
  },
  {
    title: 'Clima Organizacional',
    url: '/OrganizationalClimate',
    icon: Sun,
  },
  {
    title: 'Seguridad Psicológica',
    url: '/PsychologicalSecurity',
    icon: Shield,
  },
  {
    title: 'Apoyo Social',
    url: '/SocialSupport',
    icon: HeartHandshake,
  },
  {
    title: 'Balance Vida-Trabajo',
    url: '/WorkLifeBalance',
    icon: Scale,
  }
]) as Ref<Item[]>

</script>

<template>
  <GSidebarProvider :default-open="true">
    <template #sidebar>
      <GAppSidebar :items="items" />
    </template>
    <template #header>
      <div>breadcrumbs</div>
    </template>
    <template #default>
      <slot />
    </template>
  </GSidebarProvider>
</template>
