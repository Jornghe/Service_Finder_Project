<template>
    <nav class="topnav" :class="{ 'nav-hidden': isHidden}">
        <RouterLink to="/" class="nav-logo">📍ServiceFinder</RouterLink>

        <div class="nav-links">
            <RouterLink to="/" class="nav-link" :class="{active:route.path ==='/'}">Home</RouterLink>
            <div class="nav-divider"></div>

            <RouterLink to="/requests" class="nav-link" :class="{active:route.path ==='/requests'}">Request</RouterLink>
            <div class="nav-divider"></div>

            <RouterLink to="/chat" class="nav-link" :class="{active:route.path ==='/chat'}">Chat</RouterLink>
            <div class="nav-divider"></div>

            <RouterLink to="/profile" class="nav-link" :class="{active:route.path ==='/profile'}">Profile</RouterLink>
            <div class="nav-divider"></div>

            <div class="nav-settings" @click= "toggleMenu" :class="{ open: isOpen}">
                <div class="nav-settings-line"></div>
                <div class="nav-settings-line"></div>
                <div class="nav-settings-line"></div>
            </div>


            <div class="dropdown" v-if="isOpen">
                <RouterLink to="/settings" class="dropdown-item">Setting</RouterLink>
                <RouterLink to="/profile" class="dropdown-item">Edit Profile</RouterLink>
                <RouterLink to="/favorites" class="dropdown-item">My Favorites</RouterLink>
                <RouterLink v-if="user.is_provider" to="/provider" class="dropdown-item">Provider Dashboard</RouterLink>
                <div class="dropdown-item theme-toggle" @click="toggleTheme">
                    <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
                    <div class="toggle-switch" :class="{ active: isDark}">
                        <span class="toggle-icon left">🌙</span>
                        <span class="toggle-icon right">☀️</span>
                        <div class="toggle-knob"></div>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item logout" @click="logout">Logout</div>
            </div>

        </div>
    </nav>
  
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import {ref, onMounted, onUnmounted} from 'vue'
import { supabase } from '@/supabase';

const route = useRoute()
const router = useRouter()
const isOpen = ref(false)
const isDark =ref(false)
const isHidden = ref(false)
const user = JSON.parse(localStorage.getItem('user') || '{}')

let lastScroll=0

function toggleMenu(){
    isOpen.value = !isOpen.value
}

async function logout() {
    await supabase.auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
}

function toggleTheme(){
    isDark.value = !isDark.value
    document.body.classList.toggle('dark-mode', isDark.value)
    localStorage.setItem('darkMode', isDark.value)
}

function handleScroll(){
    const currentScroll = window.scrollY
    if(currentScroll > lastScroll && currentScroll > 80){
        isHidden.value=true
    }else{
        isHidden.value = false
    }
    lastScroll= currentScroll
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    const savedDark = localStorage.getItem('darkMode') === 'true'
    isDark.value = savedDark
    document.body.classList.toggle('dark-mode',savedDark)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
.topnav {
    transition: transform 0.3s ease;
}

.nav-hidden{
    transform: translateY(-100%);
}

.theme-toggle{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.toggle-switch{
    width: 44px;
    height: 20px;
    border-radius: 10px;
    background: #ccc;
    position: relative;
    transition: background  0.3s;
    flex-shrink: 0;
}

.toggle-switch.active{
    background: #2ec4b6;
}

.toggle-knob{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: left 0.3s;
}

.toggle-switch.active .toggle-knob{
    left: 26px;
}

.toggle-icon{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    line-height: 1;
}

.toggle-icon.left{
    left: 3px;
}

.toggle-icon.right{
    right: 3px;
}

body.dark-mode .topnav{
    background: #1f3f3c;
}

</style>