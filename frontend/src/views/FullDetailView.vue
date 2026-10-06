<template>
    <div class="full-detail-page">
        <NavBar/>
        
        <div class="fd-body">
            <div class="fd-hero">
                <div class="fd-hero-img" :style="service?.photo_url ? `background-image:url('${service.photo_url}');background-size:cover;background-position:center;` : ''"></div>
                <div class="avatar-img"></div>
            </div>

            <div class="fd-info">
                <div class="fd-name">
                    {{ service?.name }}
                    <span v-if="service?.is_verified" class="verified">✓ Verified</span>
                </div>

                <div class="fd-meta"> ({{ service?.review_count }} reviews) </div>

                <div class="fd-meta" style="display: flex; align-items: center; gap: 4px;">  
                     {{ service?.avg_rating }} 
                     <vue3-star-ratings :model-value="Number(service?.avg_rating || 0 )" star-size="14" :disable-click="true" star-color="#f39c12" inactive-color="#e0e0e0" />
                      · <span class="badge-open" :class="{ 'badge-closed': !getTodayStatus().open }">{{ getTodayStatus().label }}</span>
                    </div>
                <div class="fd-meta">📍 {{ service?.address }} · 🏪 {{ service?.provider_type }}</div>
                <div class="fd-price"> ${{ service?.price_min }} - ${{ service?.price_max }} </div>
            </div>
            <!--Action Button-->

            <div class="fd-action">
                <button class="a-btn-primary" @click="startChat">Chat</button>
                <div class="fav-action" @click="toggleFav" :class="{ 'fav-active': isFav}">
                <HeartButton :size="32" :serviceId= "service?.id" v-model="isFav"/>
                <span :style="{ color: isFav ? '#e74c3c': '#555'}">Add To Favorites</span>
                </div>
            </div>

            <!-- Description -->
             <div class="fd-section">
                <div class="fd-section-title">About</div>
                <div class="fd-desc">
                    {{ service?.description || 'No description provided.' }}
                </div>
             </div>

             <div class="fd-section">
                <div class="fd-section-title">Contact</div>
                <div class="fd-phone">{{ service?.phone }}</div>
             </div>

             <!-- Working Hours -->
             <div class="fd-section" v-if="workingHours.length > 0">
                <div class="fd-section-title">Working Hours</div>
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

             <div class="fd-section">
                <div class="fd-section-title">Location</div>
                <div id="fd-map"></div>
             </div>

             <div class="fd-section">
                <div class="fd-section-title">Reviews</div>
                <div class="fd-review" v-for= "review in reviews" :key="review.id">
                    <div class="fd-review-name">{{ review.users?.name }}</div>
                    <div class="fd-review-star" style="display: flex; align-items: center; gap: 4px;">
                          {{ review.rating }}
                        <vue3-star-ratings :model-value="Number(review.rating || 0)" :star-size="12" :disable-click="true" star-color="#f39c12" inactive-color="#e0e0e0" />
                      
                    </div>
                    <div class="fd-review-text">{{ review.comment }}</div>
                </div>

                <div v-if="user.id && !hasReviewed " class="fd-review-form">
                    <div class="fd-section-title">Leave a Reveiw</div>
                    <vue3-star-ratings v-model="newRating" :star-size="28" star-color="#f39c12" inactive-color="#e0e0e0" />
                    <textarea v-model="newComment" placeholder="Write your comment here..." class="review-textarea"></textarea>
                    <button class="a-btn-primary" @click="submitReview" :disabled="submitting">
                        {{ submitting ? 'Submitting...': 'Submit Review' }}
                    </button>
                </div> 
                <div v-else-if="user.id && hasReviewed" class="already-reviewd">
                    You have already made a reviewed to this services 
                </div>
             </div>
        </div>
    </div>
</template>

<script setup>

import NavBar from '@/components/NavBar.vue';
import {useRoute, useRouter} from 'vue-router'
import L from  'leaflet'
import 'leaflet/dist/leaflet.css'
import{ ref, onMounted } from 'vue'
import HeartButton from '@/components/HeartButton.vue';
import Vue3StarRatings from 'vue3-star-ratings'

const route= useRoute()
const router = useRouter()
const slug = route.params.slug
const service = ref(null)
const reviews = ref([])
const user = JSON.parse(localStorage.getItem('user') || '{}')
const hasReviewed = ref(false)
const newRating = ref(0)
const newComment = ref('')
const submitting = ref(false)
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

async function fetchWorkingHours() {
    if (!service.value?.id) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/working-hours/${service.value.id}`)
    const data = await res.json()
    workingHours.value = Array.isArray(data) ? data : []
}

let map = null

onMounted( async () =>{
    await fetchService()
    checkIfFav()
    await fetchReviews()
    await fetchWorkingHours()
    checkIfReviewed()

    const lat = service.value?.latitude || 11.5564
    const lng = service.value?.longitude || 104.9282
    const zoom = service.value?.latitude ? 16 : 13

    map = L.map('fd-map').setView([lat, lng], zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
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

const isFav = ref(false)
    
function toggleFav(){
    isFav.value = !isFav.value
}

async function checkIfFav(){
    const user = JSON.parse(localStorage.getItem('user') || '{}' )
    if(!user.id || !service.value)return
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    isFav.value = data.some(fav => fav.service_id === service.value.id)
}
async function fetchService(){
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${slug}`)
    const data = await res.json()
    service.value = data
}

async function startChat() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return router.push('/login')
    if (user.id === service.value?.user_id) return alert('You cannot chat with yourself.')
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_one_id: user.id, user_two_id: service.value.user_id })
    })
    const data = await res.json()
    router.push({ path: '/chat', query: { conversationId: data.id } })
}

async function fetchReviews(){
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${service.value.id}`)
    const data = await res.json()
    reviews.value = data
}

function checkIfReviewed(){
    if(!user.id)return
    hasReviewed.value = reviews.value.some(r => r.customer_id == user.id)
}

async function submitReview(){
    if(!newRating.value)return alert('Please select a star rating')
    submitting.value = true
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            service_id: service.value.id,
            customer_id: user.id,
            rating: newRating.value,
            comment: newComment.value
        })
    })
    if(res.ok){
        await fetchReviews()
        checkIfReviewed()
        await fetchService()
        newRating.value = 0
        newComment.value = ''
        
    }
    submitting.value = false
}
</script>

<style scoped>

.full-detail-page{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.fd-body{
    flex: 1;
    background: #f9fffe;
}
.fd-hero{
    position: relative;
    width: 100%;
    height: 220px;
    flex-shrink: 0;
}
.fd-hero-img{
    width: 100%;
    height: 100%;
    background: #b2ede8;;
}
.avatar-img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #edfcfa;
    border: 2px solid black;
    position: absolute;
    bottom: -35px;
    left: 24px;
}
.fd-info{
    padding: 44px 20px 14px 20px;
    border-bottom: 1px solid #b2ede8;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.fd-action{
    display: flex;
    gap: 10px;
    padding: 14px 20px;
}
.fd-section{
    padding: 14px 20px;
    border-bottom: 1px solid #b2ede8;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.fd-section-title{
    font-size: 16px;
    font-weight: 700;
    color: #22223b;
}
.fd-desc{
    font-size: 14px;
    color: #555;
    line-height: 1.6;
}
.fd-phone{
    font-size: 15px;
    font-weight: 600;
    color: #22223b;
}
#fd-map{
    width: 100% ;
    height: 350px;
    border-radius: 12px;
    background: #b2ede8;
}
.fd-review{
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: white;
    border-radius: 10px;
    border: 1px solid #b2ede8;
}
.fd-review-name{
    font-size: 15px;
    font-weight: 600;
    color: #22223b;
}
.fd-review-star{
    font-size: 14px;
}
.fd-review-text{
    font-size: 15px;
    color: #555;
}

.fav-action{
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #e74c3c;
    padding: 10px;
    border: 2px solid #aaa;
    border-radius: 12px;
}

.fav-active{
    border-color: #e74c3c;
}

.fd-review-form{
     display: flex;
     flex-direction: column;
     gap: 10px;
     padding: 14px;
     background: white;
     border-radius: 10px;
     border: 1px solid #b2ede8;
     margin-top: 10px;
}

.review-textarea{
    width: 100%;
    min-height: 80px;
    border-radius: 10px;
    border: 1px solid #b2ede8;
    padding: 10px;
    font-size: 14px;
    resize: vertical;
}

.already-reviewed{
    color: #2ec4b6;
    font-size: 14px;
    font-weight: 600;
    padding: 10px;
}

.badge-closed {
    background: #fee2e2 !important;
    color: #dc2626 !important;
}

.wh-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    padding: 4px 0;
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

body.dark-mode .fd-body{ background: var(--bg-page);}
body.dark-mode .fd-hero-img{background: #1f3f3c;}
body.dark-mode .avatar-img{background: var(--bg-card); border-color: var(--border);}
body.dark-mode .fd-info{ border-color: var(--border);}
body.dark-mode .fd-section{ border-color: var(--border);}
body.dark-mode .fd-section-title{ color: var(--text-primary);}
body.dark-mode .fd-desc{ color: var(--text-secondary);}
body.dark-mode .fd-phone{ color: var(--text-primary);}
body.dark-mode .fd-review{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .fd-review-name{ color: var(--text-primary);}
body.dark-mode .fd-review-text{ color: var(--text-secondary);}
body.dark-mode .fav-action{ border-color: var(--border);}
body.dark-mode .fav-active{ border-color: #e74c3c;}
body.dark-mode .fd-review-form{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .review-textarea{ background: var(--bg-input); color: var(--text-primary); border-color: var(--border);}
</style>