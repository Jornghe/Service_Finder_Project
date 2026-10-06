
<template>
    <div class="detail-page">
        <NavBar/>

        <div class="detail-main">
            <!-- Side Bar -->
            <div class="detail-panel">

                <div class="detail-cover" :style="service?.photo_url ? `background-image:url('${service.photo_url}');background-size:cover;background-position:center;` : ''">
                    <div class="back-btn " @click="goBack">Back</div>
                </div>

                <div class="detail-info">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <div class="fd-name">{{ service?.name }}</div>
                        <span v-if="service?.is_verified" class="verified-badge">✓ Verified</span>
                    </div>

                    <div>
                        ({{ service?.review_count }} reviews)
                        </div>

                    <div class="fd-meta" style="display: flex; align-items: center; gap: 6px;">
                        <span> {{ service?.avg_rating }}</span>
                        <vue3-star-ratings :model-value="Number( service?.avg_rating || 0)" :star-size="14" :disable-click="true" star-color="#f39c12" inactive-color="#e0e0e0"/>
                        <span class="badge-open" :class="{ 'badge-closed': !getTodayStatus().open }">{{ getTodayStatus().label }}</span>
                    </div>

                    <div class="fd-meta">📍 {{ service?.address }} · 🏪 {{  service?.provider_type }}</div>
                    <div class="price-row">
                         <div class="fd-price">${{ service?.price_min }} - ${{ service?.price_max }}</div>
                         <HeartButton :size="28" :serviceId="service?.id" v-model="isFav" />
                    </div>

                   
                    
                </div>
                
                
                <!-- Action Button -->
                 <div class="action-grid">
                    <button class="a-btn-primary" @click="startChat">Chat</button>
                    <RouterLink :to="`/service/${slug}/full-detail`" class="a-btn">Full Detail</RouterLink>
                    <button class="a-btn" style="grid-column: span 2;" @click="getDirections">🗺️ Get Directions</button>
                 </div>  

                 <div class="detail-phone">
                   <p>Phone Number:</p>
                    {{ service?.phone }}
                 </div>

                 <!-- Working Hours -->
                 <div class="wh-section" v-if="workingHours.length > 0">
                    <div class="wh-title">Working Hours</div>
                    <div v-for="day in dayOrder" :key="day" class="wh-row">
                        <div class="wh-day-name" :class="{ today: day === ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()] }">
                            {{ day.charAt(0).toUpperCase() + day.slice(1) }}
                        </div>
                        <div class="wh-hours">
                            <template v-if="workingHours.find(h => h.day === day)?.is_open">
                                <span class="wh-open-dot"></span>
                                {{ formatTime(workingHours.find(h => h.day === day)?.open_time) }} - {{ formatTime(workingHours.find(h => h.day === day)?.close_time) }}
                            </template>
                            <template v-else>
                                <span class="wh-closed">Closed</span>
                            </template>
                        </div>
                    </div>
                 </div>

            </div>
            <!-- Map -->
             <div class="map-wrapper">
                <div id="detail-map"></div>
             </div>
        </div>

    </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import L from 'leaflet'
import {useRoute,useRouter} from 'vue-router'
import { ref, onMounted} from 'vue'
import 'leaflet/dist/leaflet.css'
import HeartButton from '@/components/HeartButton.vue';
import Vue3StarRatings from 'vue3-star-ratings'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const service = ref(null)
const isFav = ref(false)
const workingHours = ref([])

const dayOrder = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

function getTodayStatus() {
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    const today = days[new Date().getDay()]
    const todayHours = workingHours.value.find(h => h.day === today)

    if (!todayHours) return { label: 'Hours unavailable', open: false }
    if (!todayHours.is_open) return { label: 'Closed today', open: false }

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const [openH, openM] = todayHours.open_time.split(':').map(Number)
    const [closeH, closeM] = todayHours.close_time.split(':').map(Number)
    const openMinutes = openH * 60 + openM
    const closeMinutes = closeH * 60 + closeM

    if (currentMinutes < openMinutes) {
        return { label: `Closed · Opens ${formatTime(todayHours.open_time)}`, open: false }
    } else if (currentMinutes >= closeMinutes) {
        return { label: `Closed · Opened until ${formatTime(todayHours.close_time)}`, open: false }
    } else {
        return { label: `Open · Closes ${formatTime(todayHours.close_time)}`, open: true }
    }
}

function formatTime(time) {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const display = hour % 12 || 12
    return `${display}:${m} ${ampm}`
}

async function fetchService(){
    const res = await fetch(`http://localhost:3000/api/services/${slug}`)
    const data = await res.json()
    service.value = data
}

async function fetchWorkingHours() {
    if (!service.value?.id) return
    const res = await fetch(`http://localhost:3000/api/working-hours/${service.value.id}`)
    const data = await res.json()
    workingHours.value = Array.isArray(data) ? data : []
}

 async function checkIfFav(){
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if( !user.id || !service.value)return
    const res = await fetch(`http://localhost:3000/api/favorites/${user.id}`)
    const data = await res.json()
    isFav.value = data.some(fav=> fav.service_id === service.value.id)
 }
let map = null

function goBack(){
    router.back()
}

async function startChat() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return router.push('/login')
    if (user.id === service.value?.user_id) return alert('You cannot chat with yourself.')
    const res = await fetch('http://localhost:3000/api/chat/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_one_id: user.id, user_two_id: service.value.user_id })
    })
    const data = await res.json()
    router.push({ path: '/chat', query: { conversationId: data.id } })
}

function getDirections() {
    if (!service.value?.latitude || !service.value?.longitude) {
        alert('This service has no location set.')
        return
    }
    const dest = `${service.value.latitude},${service.value.longitude}`
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const origin = `${position.coords.latitude},${position.coords.longitude}`
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank')
        }, () => {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank')
        })
    } else {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank')
    }
}

onMounted( async () => {
    await fetchService()
    await fetchWorkingHours()
    checkIfFav()

    const lat = service.value?.latitude || 11.5564
    const lng = service.value?.longitude || 104.9282
    const zoom = service.value?.latitude ? 16 : 13

    map = L.map('detail-map').setView([lat, lng], zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',{
        attribution: '© OpenStreetMap France'
    }).addTo(map)

    if (service.value?.latitude && service.value?.longitude) {
        const isFreelancer = service.value.provider_type === 'freelancer'
        const color = isFreelancer ? '#0d9488' : '#2ec4b6'
        const rangeKm = service.value.service_range_km || 10

        const icon = L.divIcon({
            className: '',
            html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${color}"/>
                    <circle cx="16" cy="16" r="7" fill="white"/>
                </svg>
                <div style="background:${color};color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;white-space:nowrap;">${service.value.category || 'Service'}</div>
            </div>`,
            iconSize: [32, 62],
            iconAnchor: [16, 54]
        })

        L.marker([lat, lng], { icon }).addTo(map)
            .bindPopup(`<b>${service.value.name}</b><br>${isFreelancer ? `Works within ${rangeKm}km` : service.value.address || ''}`)
            .openPopup()

        if (isFreelancer) {
            L.circle([lat, lng], {
                radius: rangeKm * 1000,
                color,
                fillColor: color,
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '6,4'
            }).addTo(map)
        }
    }
})

</script>

<style scoped>



.detail-page{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.detail-main{
    display:flex;
    flex: 1;  
    overflow: hidden;
}

.detail-panel{
    width: 30%;
    min-width: 300px;
    max-width: 600px;
    background: #edfcfa;
    border: 2px solid #b2ede8;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow-y:  auto;
}

.detail-cover{
   width: 100%;
   height: 300px;
   background:#b2ede8;
   position: relative;
   flex-shrink: 0;
}

.back-btn{
    background:#2EC4B6;
    color: white;
    position: absolute;
    top: 15px;
    left: 15px;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    padding: 6px 10px;
}

.back-btn:hover{
    background: #26a89c;
}

.detail-info{
    padding: 18px 20px;
    border-bottom: 1px solid #b2ede8;
    display: flex;
    flex-direction: column;
    gap: 8px;
}


.action-grid{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 18px 20px;
    border-bottom: 1px solid #b2ede8;
}


.detail-phone{
    margin-top: auto;
    padding: 14px 16px;
    font-size: 15px;
    font-weight: 600;
    color: #22223b;
    border-top: 1px solid #b2ede8;
}

.map-wrapper{
    flex: 1;
    position: relative;
}

#detail-map{
    width: 100%;
    height: 100%;
}

.price-row{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.verified-badge {
    display: inline-block;
    background: #ede9fe;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
}


.badge-closed {
    background: #fee2e2 !important;
    color: #dc2626 !important;
}

.wh-section {
    padding: 16px 20px;
    border-top: 1px solid #b2ede8;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.wh-title {
    font-size: 15px;
    font-weight: 700;
    color: #22223b;
    margin-bottom: 4px;
}

.wh-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
}

.wh-day-name {
    width: 100px;
    font-weight: 600;
    color: #555;
}

.wh-day-name.today {
    color: #2ec4b6;
    font-weight: 700;
}

.wh-hours {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #333;
}

.wh-open-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #2ec4b6;
    flex-shrink: 0;
}

.wh-closed {
    color: #aaa;
    font-style: italic;
}

body.dark-mode .detail-panel{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .detail-cover{ background: #1f3f3c;}
body.dark-mode .detail-info{ border-color: var(--border) ;}
body.dark-mode .action-grid{ border-color: var(--border);}
body.dark-mode .detail-phone{ color: var(--text-primary); border-color: var(--border);}
body.dark-mode .wh-section { border-color: var(--border); }
body.dark-mode .wh-title { color: var(--text-primary); }
body.dark-mode .wh-day-name { color: var(--text-secondary); }
body.dark-mode .wh-hours { color: var(--text-primary); }

</style>