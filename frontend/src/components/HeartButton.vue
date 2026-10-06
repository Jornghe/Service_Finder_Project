<template>
  <div class="heart-btn" @click="toggleFav">
        <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" :fill="props.modelValue ? '#e74c3c' : 'none'" viewBox="0 0 24 24" :stroke="props.modelValue ? '#e74c3c' : '#aaa'" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    </div>
</template>

<script setup>

import {ref} from 'vue'

const props = defineProps({
  size: { default: 28 },
  modelValue: {default: false},
  serviceId: { default: null}
})

const emit = defineEmits(['update:modelValue'])

async function toggleFav(){
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if(!user.id || !props.serviceId) return

    const token = localStorage.getItem('token')
    if (props.modelValue){
        await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`,{
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ user_id: user.id, service_id: props.serviceId})
        })
        emit('update:modelValue', false)
    } else{
        await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ user_id: user.id, service_id: props.serviceId })
        })
        emit('update:modelValue', true)
    }
}

</script>

<style scoped>

.heart-btn{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>