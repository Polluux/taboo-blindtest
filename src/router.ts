import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: {},
    component: () => import('@/views/home.vue')
  },
  {
    path: '/test',
    name: 'test',
    meta: {},
    component: () => import('@/views/second-page.vue')
  },
  {
    path: '/not-found',
    alias: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
