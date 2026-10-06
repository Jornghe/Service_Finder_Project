

<template>
    <div class="home-page">

        <!-- Navigation Bar -->
         <NavBar />
         <!-- Main Content-->
         <div class="main-content">

            <!-- Left SideBar -->
            <div class="sidebar">
                <!-- Search -->
                 <div class="sidebar-section">
                    <div class="search">
                        <span>🔍</span>
                        <input type="text" placeholder="Search for services..." v-model="searchQuery" @keydown.enter="goToSearch">
                    </div>
                 </div>

                 <!-- Categories -->
                  <div class="sidebar-section">
                    <div class="sidebar-title">Categories</div>
                    <div class="cats-grid">
                       <div v-for="cat in DisplayedCategories" :key="cat.id" class="cat-item" :class="{ active: activeCategory === cat.name }" @click="activeCategory = activeCategory === cat.name ? '' : cat.name">
                        {{ cat.name }}
                       </div>
                    </div>
                    <div class="see-all-btn" @click="showAllCats = !showAllCats">
                        {{  showAllCats ? 'Show less < ': 'See All >' }}
                    </div>
                  </div>

                  <!-- Nearby Services -->
                   <div class="sidebar-section">
                    <div class="sidebar-title">📍 {{ userLocation ? 'Nearby Services' : 'All Services' }}</div>
                    <div v-if="userLocation" style="font-size: 12px; color: #2ec4b6; margin-top: 4px;">Showing within 5km · freelancers by their range</div>
                   </div>

                   <div class="service-list">
                    <div v-if="nearbyServices.length === 0" style="padding: 20px; text-align: center; color: #aaa; font-size: 14px;">No services found near you.</div>
                    <div class="service-row" v-for="service in nearbyServices" :key="service.id" @click="goToService(service.slug)">
                    <div class="service-image">
                        <img v-if="service.photo_url" :src="service.photo_url" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"/>
                    </div>
                    <div class="service-info">
                        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                            <div class="service-name">{{ service.name }}</div>
                            <span v-if="service?.is_verified" class="verified-badge">✓ Verified</span>
                        </div>
                        <div class="service-meta" style="display: flex; align-items: center; gap: 4px;">
                            <span>{{ service.avg_rating }}</span>
                            <vue3-star-ratings v-model="service.avg_rating"  :star-size="14"  :disable-click="true" star-color="#F39C12" inactive-color="#e0e0e0"/>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span class="badge-open" :class="{ 'badge-closed': !getTodayStatus(service.working_hours).open }">{{ getTodayStatus(service.working_hours).label }}</span>
                        </div>
                        <div>📍 {{ service.address }}</div>
                    </div>
                    <HeartButton :size="28" :serviceId="service.id" v-model="service.isFav" @click.stop/>

                     </div>


                   </div>

            </div>

            <!-- Map  -->
        <div class="map-wrapper">
            <div id="map"></div>
             <button class="nearby-btn" @click="findNearby">📍Nearby Me</button>
             </div>
         </div>

    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'vue-router'
import HeartButton from '@/components/HeartButton.vue'
import Vue3StarRatings from 'vue3-star-ratings'


const router = useRouter()
const services = ref([])
const categories = ref([])
const showAllCats = ref(false)
const allCategories = ref([])
const activeCategory = ref('')

function formatTime(time) {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const display = hour % 12 || 12
    return `${display}:${m} ${ampm}`
}

function getTodayStatus(workingHours) {
    if (!workingHours || !workingHours.length) return { label: 'Hours unavailable', open: false }
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    const today = days[new Date().getDay()]
    const todayHours = workingHours.find(h => h.day === today)
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

async function fetchServices(){
    const res = await fetch('http://localhost:3000/api/services')
    const data = await res.json()
    services.value = data
}

async function fetchCategories(){
    const res = await fetch('http://localhost:3000/api/categories/all')
    const data = await res.json()
    allCategories.value = data
    categories.value = data.slice(0, 6)
}

async function checkFavs(){
    const user = JSON.parse(localStorage.getItem('user') || '{}' )
    if(!user.id)return
    const res = await fetch(`http://localhost:3000/api/favorites/${user.id}`)
    const favData = await res.json()
    services.value = services.value.map(s => ({
        ...s,
        isFav: favData.some(fav=> fav.service_id === s.id)
    }))
}

function goToService(slug){
    router.push(`/service/${slug}`)
}

window.goToServiceFromMap = (slug) => router.push(`/service/${slug}`)

/* Initially leaflet*/

let map = null
let userMarker = null
const userLocation = ref(null)

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

const nearbyServices = computed(() => {
    let filtered = services.value
    if (activeCategory.value) {
        filtered = filtered.filter(s => s.category === activeCategory.value)
    }
    if (!userLocation.value) return filtered
    return filtered.filter(s => {
        if (!s.latitude || !s.longitude) return false
        const dist = getDistance(userLocation.value.lat, userLocation.value.lng, s.latitude, s.longitude)
        if (s.provider_type === 'freelancer') return dist <= (s.service_range_km || 10)
        return dist <= 5
    })
})

function placeServiceMarkers() {
    services.value.forEach(s => {
        if (!s.latitude || !s.longitude) return
        const isFreelancer = s.provider_type === 'freelancer'
        const rangeKm = s.service_range_km || 10

        const color = isFreelancer ? '#0d9488' : '#2ec4b6'
        const icon = L.divIcon({
            className: '',
            html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${color}"/>
                    <circle cx="16" cy="16" r="7" fill="white"/>
                </svg>
                <div style="background:${color};color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.2);">${s.category || 'Service'}</div>
            </div>`,
            iconSize: [32, 62],
            iconAnchor: [16, 54]
        })

        let rangeCircle = null
        if (isFreelancer) {
            rangeCircle = L.circle([s.latitude, s.longitude], {
                radius: rangeKm * 1000,
                color: '#0d9488',
                fillColor: '#0d9488',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '6,4'
            })
        }

        const marker = L.marker([s.latitude, s.longitude], { icon }).addTo(map)

        const stars = '★'.repeat(Math.round(s.avg_rating || 0)) + '☆'.repeat(5 - Math.round(s.avg_rating || 0))
        const verifiedBadge = s.is_verified ? `<span style="background:#ede9fe;color:#6d28d9;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px;margin-left:4px;">✓ Verified</span>` : ''
        const typeBadge = isFreelancer
            ? `<span style="background:#ccfbf1;color:#0d9488;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px;">🧑‍🔧 Freelancer</span>`
            : `<span style="background:#ccfbf1;color:#0d9488;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px;">🏪 Shop</span>`
        const locationLine = isFreelancer
            ? `<div style="color:#666;font-size:12px;margin-top:2px;">📍 Works within ${rangeKm}km of this area</div>`
            : `<div style="color:#666;font-size:12px;margin-top:2px;">📍 ${s.address || 'No address'}</div>`
        const photoHtml = s.photo_url
            ? `<img src="${s.photo_url}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;margin-bottom:8px;"/>`
            : `<div style="width:100%;height:80px;background:#ccfbf1;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;font-size:28px;">${isFreelancer ? '🧑‍🔧' : '🏪'}</div>`

        const popupHtml = `
            <div style="width:200px;font-family:sans-serif;">
                ${photoHtml}
                <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:4px;">
                    <b style="font-size:14px;">${s.name}</b>${verifiedBadge}
                </div>
                <div style="margin-bottom:4px;">${typeBadge}</div>
                <div style="color:#f39c12;font-size:13px;">${stars} <span style="color:#666;">(${s.review_count || 0})</span></div>
                ${locationLine}
                <button onclick="window.goToServiceFromMap('${s.slug}')" style="margin-top:10px;width:100%;background:#2ec4b6;color:white;border:none;border-radius:8px;padding:7px;font-size:13px;font-weight:700;cursor:pointer;">View Details</button>
            </div>`

        marker.bindPopup(popupHtml, { maxWidth: 220 })

        if (isFreelancer) {
            marker.on('click', () => {
                if (rangeCircle && map.hasLayer(rangeCircle)) {
                    map.removeLayer(rangeCircle)
                } else if (rangeCircle) {
                    rangeCircle.addTo(map)
                }
            })
        }
    })
}

function placeUserMarker(lat, lng) {
    if (userMarker) { userMarker.remove(); userMarker = null }
    const icon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(37,99,235,0.5)"></div>`,
        iconAnchor: [8, 8]
    })
    userMarker = L.marker([lat, lng], { icon }).addTo(map)
    userMarker.bindPopup('<b>You are here</b>').openPopup()
}

const searchQuery = ref('')

onMounted(async () => {
    map = L.map('map').setView([11.5564, 104.9282], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap France'
    }).addTo(map)

    await fetchServices()
    checkFavs()
    fetchCategories()
    placeServiceMarkers()

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            userLocation.value = { lat, lng }
            map.setView([lat, lng], 14)
            placeUserMarker(lat, lng)
        })
    }
})

function findNearby() {
    if (!navigator.geolocation) { alert('Geolocation is not supported by your browser'); return }
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        userLocation.value = { lat, lng }
        map.setView([lat, lng], 15)
        placeUserMarker(lat, lng)
    }, () => {
        alert('Could not get your location. Please allow location access.')
    })
}

const DisplayedCategories = computed(() =>{
    return showAllCats.value ? allCategories.value : categories.value
})

function goToSearch(){
    if(searchQuery.value.trim()){
        router.push(`/search?q=${searchQuery.value}`)
    }
}

</script>

<style scoped> 

.home-page{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.main-content{
    display: flex;
    flex: 1;
    overflow: hidden;
}

#map {
    flex: 1;
    background: #d4f5ee;
}

.sidebar {
    width: 25%;
    min-width: 250px;
    max-width: 600px;
    background: #edfcfa;
    border-right: 3px solid #b2ede8;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow-y: auto;
}

.sidebar-section{
    padding: 15px 18px;
    border-bottom: 2px solid #b2ede8;
}

.sidebar-title{
    font-size: 18px;
    font-weight: 900;
    color: #22223b;
    margin-bottom: 10px;
    align-items: center;

}
        /* Search */

.search{
    background: rgb(222, 220, 220);
    border: 1px solid #b2ede8;
    border-radius: 24px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;

}

.search input{
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #22223b;
    width: 100%
}

.search input::placeholder{
    color: #aaa;
}

/* Categories */

.cats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  
}

.cat-item{
    padding: 6px 14px;
    border-radius: 24px;
    border: 1px solid #b2ede8;
    font-size: 14px;
    color: #22223b;
    cursor: pointer;
    background: white;
    transition: all 0.15s;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.cat-item:hover{
    background: #d9f7f4;
    border-color: #2ec4b6;
    color:#2ec4b6
}

.cat-item.active{
    background: #2ec4b6;
    color: white;
    border-color: #2ec4b6;
}

/* Service List */
.service-list{
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex:1;
}

.service-row{
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid #b2ede8;
    cursor: pointer;
    transition: background 0.15s;
}

.service-row:hover{
    background: #b5efe5;
}

.service-info{
    flex:1;
}

.service-name{
    font-size: 16px;
    font-weight: 600;
    color: #22223b;
    margin-bottom: 4px;
}

.service-meta {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
}


.service-image{
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background: #E8FaF8;
    border: 1px solid #b2ede8;
    flex-shrink: 0;
}

/*Neaby btn */
.nearby-btn{
 position: absolute;
 bottom: 25px;
 right: 25px;
 background: #2EC4B6;
 color: #fff;
 border: none;
 border-radius: 24px;
 padding: 10px 16px;
 font-size: 15px;
 font-weight: 600;
 cursor: pointer;
 z-index: 999;
box-shadow: 0 20px 8px rgba(46,196,182,0,4);
}

.nearby-btn:hover{
    background:#26a89c;
}

.map-wrapper{
    flex:1;
    position: relative;
}

#map{
    width:100%;
    height:100%;
}

.see-all-btn{
    font-size: 15px;
    color: #2ec4b6;
    cursor: pointer;
    text-align: right;
    margin-top: 8px;
    font-weight: 600;
}

.see-all-btn:hover{
    text-decoration: underline;
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


body.dark-mode .sidebar{ background: var(--bg-sidebar); border-color: var(--border);}
body.dark-mode .sidebar-section { border-color: var(--border);}
body.dark-mode .sidebar-title {color: var(--text-primary);}
body.dark-mode .search{ background: #1a3a38; border-color: var(--border);}
body.dark-mode .search input{ color:var(--text-primary);}
body.dark-mode .cat-item { background: var(--bg-card); border-color: var(--border); color: var(--text-primary);}
body.dark-mode .cat-item:hover { background: #1f3f3c; color: #2ec4b6;}
body.dark-mode .service-row{ border-color: var(--border);}
body.dark-mode .service-row:hover { background: #1a3a38; }
body.dark-mode .service-name { color: var(--text-primary);}
body.dark-mode .service-image { border-color: var(--border); background: #515a58;}
body.dark-mode .nearby-btn { background: #1a3a38 ; border: 2px solid #2ec4b6; color: #2ec4b6;}
body.dark-mode .service-meta{ color: var(--text-secondary);}


</style>