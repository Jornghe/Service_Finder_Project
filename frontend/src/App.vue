<script setup>

import { onMounted } from 'vue';
import { supabase } from './supabase';
import { useRouter } from 'vue-router';

const router = useRouter()

onMounted(async () =>{
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.id) {
        const res = await fetch(`http://localhost:3000/api/auth/check-suspend/${user.id}`)
        const data = await res.json()
        if (data.is_suspend) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            alert('Your account has been suspended.')
            router.push('/login')
            return
        }
    }

    const {data} = await supabase.auth.getSession()

    if(data.session && !localStorage.getItem('token')){
        const authUser = data.session.user

        const res = await fetch('http://localhost:3000/api/auth/oauth-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: authUser.id, name: authUser.user_metadata.full_name, email: authUser.email })
        })
        const existingUser = await res.json()

        localStorage.setItem('token', data.session.access_token)
        if (existingUser && existingUser.id) {
            localStorage.setItem('user', JSON.stringify({
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                phone: existingUser.phone,
                is_admin: existingUser.is_admin,
                is_provider: existingUser.is_provider
            }))
        }
        router.push('/')
    }
})

</script>

<template>

<RouterView />

</template>

<style scoped></style>
