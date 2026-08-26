import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import ServiceDetailView from '@/views/ServiceDetailView.vue'
import FullDetailView from '@/views/FullDetailView.vue'
import SearchView from '@/views/SearchView.vue'
import RequestsView from '@/views/RequestsView.vue'
import ChatView from '@/views/ChatView.vue'
import ProfileView from '@/views/ProfileView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ProviderDashboard from '@/views/ProviderDashboard.vue'
import AdminView from '@/views/AdminView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/service/:slug',
      name: 'service-detail',
      component: ServiceDetailView
    },
    {
      path: '/service/:slug/full-detail',
      name: 'full-detail',
      component: FullDetailView,
    }, 
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/requests',
      name: 'requests',
      component: RequestsView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/provider',
      name: 'provider',
      component: ProviderDashboard,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true }
    }
  ],
})


const publicRoutes =['/login', '/register']

router.beforeEach((to, from)=>{
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPublic = publicRoutes.includes(to.path)

  if(!token && !isPublic){
   return '/login'
  }else if(token && isPublic){
   if(user.is_admin){
    return '/admin'
   }else{
    return '/'
   }
  }else if(user.is_admin && to.path !== '/admin'){
    return '/admin'
  }else if(to.meta.requiresAdmin && !user.is_admin){
    return '/'
  }
})
export default router
