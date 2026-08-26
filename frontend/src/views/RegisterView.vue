
<template>
<div class ="auth-page">
    <div class="auth-left">
        <div style="font-size: 40px; margin-bottom: 12px;">📍</div>

        <div class="brand-name">Join our Service Finder</div>

        <div class="brand-desc">One Account that come with multiple Benefit:</div>

        <div class="feature-list">
            <div class="feature-item">👤 Find a diverse variety of service providers</div>
            <div class="feature-item">🏪 List your own services</div>
            <div class="feature-item">💬 Real time chat for both users and providers</div>
            <div class="feature-item">⭐ Real reviews from actual customers</div>
        </div>

    </div> 
    
    <div class="auth-right">
        <div class="auth-form">
            <div class="auth-title">Account Registration</div>           
        
        <div class="form-group">
            <label class="label">Full Name</label>
            <input class="Input" type="text" placeholder="Enter your full name" v-model="name">
        </div>

        <div class="form-group">
            <label class="label"> Email </label>
            <input class="Input" type="email" placeholder="Enter your email" v-model="email">
        </div>

        <div class="form-group">
            <label class="label">Password</label>
            <input class="Input" type="password" placeholder="Enter your password" v-model="password">
        </div>

        <div class="form-group">
            <label class="label">Confirm Password</label>
            <input class="Input" type="password" placeholder="Confirm your password" v-model="confirmPassword">
        </div>
        
        <div class="form-group">
            <label class="label">Phone Number</label>
            <input class="Input" type="tel" placeholder="012 *** ***" v-model="phone">
        </div>
        
        <div v-if = "error" class="auth-error">{{ error }}</div>
        <button class="btn-primary" @click="handleRegister">Create Account</button>

        <div class="auth-divider">or</div>

        <div class="social-btn" @click="loginWithGoogle">
            <svg width="18" height="18" viewBox="0 0 48 48">
                   <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                   <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                   <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                   <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.96 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
        </div>

        <div class="auth-link">
            Already have an account? <router-link to="/login">Sign In</router-link>
        </div>


    </div>
    </div>

</div>  
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const phone = ref('');
const router = useRouter();
const error = ref('');


async function handleRegister() {
    error.value= ''
   if(password.value !== confirmPassword.value) {
        error.value = 'Password do not match'
        return;
    }

    try{
        const res = await fetch('http://localhost:3000/api/auth/register',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ name: name.value, email: email.value, phone: phone.value, password: password.value })
        })
        const data = await res.json()

        if( !res.ok){
            error.value = data.message
            return
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
    } catch(err){
        error.value = ' Something went wrong. Please try again.'
    }
   
}
onMounted(() =>{
    const savedDark =localStorage.getItem('darkMode') === 'true'
    document.body.classList.toggle('dark-mode', savedDark)

})


async function loginWithGoogle(){
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:5173'
        }
    })
}
</script>

<style scoped>

.auth-error{
    color: #e74c3c;
    font-size: 13px;
    margin-bottom: 8px;
}

</style>