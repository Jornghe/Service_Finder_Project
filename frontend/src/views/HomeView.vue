

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
                       <div v-for="cat in DisplayedCategories" :key="cat.id" class="cat-item">
                        {{ cat.name }}
                       </div>
                    </div>
                    <div class="see-all-btn" @click="showAllCats = !showAllCats">
                        {{  showAllCats ? 'Show less < ': 'See All >' }}
                    </div>
                  </div>

                  <!-- Nearby Services -->
                   <div class="sidebar-section">
                    <div class="sidebar-title">📍 Nearby services</div>
                   </div>

                   <div class="service-list">
                    <div class="service-row" v-for ="service in services" :key = "service.id" @click="goToService(service.slug)">
                    <div class="service-image"></div>
                    <div class="service-info">
                        <div class="service-name">{{ service.name }}</div>
                        <div class="service-meta" style="display: flex; align-items: center; gap: 4px;">
                            <span>{{ service.avg_rating }}</span>
                            <vue3-star-ratings v-model="service.avg_rating"  :star-size="14"  :disable-click="true" star-color="#F39C12" inactive-color="#e0e0e0"/>                     
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

/* Initially leaflet*/

let map = null

const searchQuery = ref ('')
onMounted(async() => {
     map = L.map('map').setView([11.5564, 104.9282], 13)
    
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap France'
}).addTo(map)

await fetchServices()
checkFavs()
fetchCategories()

})

/*Nearby btn*/

function findNearby(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) =>{
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            map.setView([lat,lng],15)
        })

    }else {
        alert('Geologation does not support by your browser')
    }
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