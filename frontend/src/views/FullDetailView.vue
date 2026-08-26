<template>
    <div class="full-detail-page">
        <NavBar/>
        
        <div class="fd-body">
            <div class="fd-hero">
                <div class="fd-hero-img"></div>
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
                      · <span class="badge-open"> Open · Closes 6PM </span>
                    </div>
                <div class="fd-meta">📍 {{ service?.address }} · 🏪 {{ service?.provider_type }}</div>
                <div class="fd-price"> ${{ service?.price_min }} - ${{ service?.price_max }} </div>
            </div>
            <!--Action Button-->

            <div class="fd-action">
                <button class="a-btn-primary">Chat</button>
                <div class="fav-action" @click="toggleFav" :class="{ 'fav-active': isFav}">
                <HeartButton :size="32" :serviceId= "service?.id" v-model="isFav"/>
                <span :style="{ color: isFav ? '#e74c3c': '#555'}">Add To Favorites</span>
                </div>
            </div>

            <!-- Description -->
             <div class="fd-section">
                <div class="fd-section-title">About</div>
                <div class="fd-desc">
                      We provide professional AC repair, installation and maintenance services.
                      Available 7 days a week. Fast response and affordable prices.
                </div>
             </div>

             <div class="fd-section">
                <div class="fd-section-title">Contact</div>
                <div class="fd-phone">{{ service?.phone }}</div>
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

let map = null

onMounted( async () =>{
    await fetchService()
    checkIfFav()
    await fetchReviews()
    checkIfReviewed()

    map = L.map('fd-map').setView([11.5564, 104.9282],15)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap France'
}).addTo(map)
})

const isFav = ref(false)
    
function toggleFav(){
    isFav.value = !isFav.value
}

async function checkIfFav(){
    const user = JSON.parse(localStorage.getItem('user') || '{}' )
    if(!user.id || !service.value)return
    const res = await fetch(`http://localhost:3000/api/favorites/${user.id}`)
    const data = await res.json()
    isFav.value = data.some(fav => fav.service_id === service.value.id)
}
async function fetchService(){
    const res = await fetch(`http://localhost:3000/api/services/${slug}`)
    const data = await res.json()
    service.value = data
}

async function fetchReviews(){
    const res = await fetch(`http://localhost:3000/api/reviews/${service.value.id}`)
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
    const res = await fetch('http://localhost:3000/api/reviews',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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