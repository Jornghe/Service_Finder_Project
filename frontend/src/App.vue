<script setup>

import { onMounted } from 'vue';
import { supabase } from './supabase';
import { useRouter } from 'vue-router';

const router = useRouter()

onMounted(async () =>{
    const {data} = await supabase.auth.getSession()

    if(data.session && !localStorage.getItem('token')){
        const user = data.session.user
        localStorage.setItem('token', data.session.access_token)
        localStorage.setItem('user', JSON.stringify({
            id: user.id,
            name: user.user_metadata.full_name,
            email: user.email,
            is_admin: false
        }))
        router.push('/')
    }
})

</script>

<template>

<RouterView />

</template>

<style scoped></style>
