import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/insert',
    name: 'Insert',
    component: () => import('../views/AddTools.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: () => import('@/views/EditScorecard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/hls',
    name: 'hls',
    component: () => import('../views/ALL_HLS.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/hls/:serialNumber',
    name: 'HLSWithSerialNumber',
    component: () => import('../views/HLS.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/homeuser',
    name: 'homeuser',
    component: () => import('../views/HomeUser.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/panel',
    name: 'panel',
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mqtt',
    name: 'mqtt',
    component: () => import('../views/mqttView.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const auth = getAuth(); // Get the Firebase auth instance

  onAuthStateChanged(auth, user => {
    if (requiresAuth && !user) {
      next({ name: 'login' });
    } else {
      next();
    }
  });
});

export default router;
