
<template>
    <div class="detail-page">
        <NavBar/>

        <div class="detail-main">
            <!-- Side Bar -->
            <div class="detail-panel">

                <div class="detail-cover">
                    <div class="back-btn " @click="goBack">Back</div>
                </div>

                <div class="detail-info">
                    <div class="fd-name">
                        {{ service?.name }}
                    </div>

                    <div>
                        ({{ service?.review_count }} reviews)
                        </div>

                    <div class="fd-meta" style="display: flex; align-items: center; gap: 6px;">
                        <span> {{ service?.avg_rating }}</span>
                        <vue3-star-ratings :model-value="Number( service?.avg_rating || 0)" :star-size="14" :disable-click="true" star-color="#f39c12" inactive-color="#e0e0e0"/>
                         
                        <span class="badge-open">Open · Closes 6PM</span>
                    </div>

                    <div class="fd-meta">📍 {{ service?.address }} · 🏪 {{  service?.provider_type }}</div>
                    <div class="price-row">
                         <div class="fd-price">${{ service?.price_min }} - ${{ service?.price_max }}</div>
                         <HeartButton :size="28" :serviceId="service?.id" v-model="isFav" />
                    </div>

                   
                    
                </div>
                
                
                <!-- Action Button -->
                 <div class="action-grid">
                    <button class="a-btn-primary">Chat</button>
                    <RouterLink :to="`/service/${slug}/full-detail`" class="a-btn">Full Detail</RouterLink>
                   
                 </div>  

                 <div class="detail-phone">
                   <p>Phone Number:</p>
                    {{ service?.phone }}
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

async function fetchService(){
    const res = await fetch(`http://localhost:3000/api/services/${slug}`)
    const data = await res.json()
    service.value = data
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


onMounted( async () => {
     await fetchService()
    checkIfFav()
    map = L.map('detail-map').setView([11.5564, 104.9282],15)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',{
        attribution: '© OpenStreetMap France'
    }).addTo(map)
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


body.dark-mode .detail-panel{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .detail-cover{ background: #1f3f3c;}
body.dark-mode .detail-info{ border-color: var(--border) ;}
body.dark-mode .action-grid{ border-color: var(--border);}
body.dark-mode .detail-phone{ color: var(--text-primary); border-color: var(--border);}

</style>