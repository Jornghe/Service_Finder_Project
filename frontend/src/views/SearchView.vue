<template>
    <div class="search-page">
        <NavBar/>

        <div class="search-body">

            <!--Search Bar-->
            <div class="search-header">
            <div class="search-bar">
                <span>🔍</span>
                <input type="text" v-model="searchQuery" placeholder="Search for services...">
            </div>
            </div>

            <!-- Filter -->
             <div class="filter-row">
                <div v-for="cat in categories" :key="cat.id" class="filter-chip" :class="{ active: activeCategory === cat.name}" @click ="activeCategory = cat.name">
                    {{ cat.name }}
                </div>
             </div>

             <!-- Result -->
              <div class="result-list">
                <div class="result-card" v-for="service in filteredServices" :key="service.id" @click="router.push(`/service/${service.slug}`)">
                    <div class="result-image"></div>
                    <div class="result-info">
                        <div class="fd-name"> {{ service.name }}<span v-if="service.is_verified" class="verified"> ✓ Verified </span></div>
                        <div class="fd-meta" style="display: flex; align-items: center; gap:4px;">
                            <span> {{ service.avg_rating }} </span>
                            <vue3-star-ratings v-model="service.avg_rating" :star-size="14" :disable-click="true" star-color="#F39C12" inactive-color="#e0e0e0" />
                            · <span class="badge-open"> Open </span>
                        </div>
                        <div class="fd-meta">📍 {{ service.address }} · 🏪 {{  service.provider_type }}</div>
                        <div class="fd-price">${{ service.price_min }} - ${{ service.price_max }}</div>
                    </div>
                     <div class="heart-wrapper">
                        <HeartButton :size="35" :serviceId="service.id" v-model="service.isFav"/>
                        </div>
                </div>


              </div>
        </div>

    </div>
</template>

<script setup>
import HeartButton from '@/components/HeartButton.vue';
import NavBar from '@/components/NavBar.vue';
import {ref, computed, onMounted} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Vue3StarRatings from 'vue3-star-ratings'

const searchQuery = ref('')
const router = useRouter()
const services = ref([])
const categories = ref([])
const activeCategory = ref('All')
const route = useRoute()

async function fetchServices(){
    const res = await fetch('http://localhost:3000/api/services')
    const data = await res.json()
    services.value = data
}

async function fetchCategories(){
    const res = await fetch('http://localhost:3000/api/categories/all')
    const data = await res.json()
    categories.value = [{id: 'all' , name: 'All'}, ...data]
}

async function checkFavs(){
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if(!user.id)return
    const res = await fetch(`http://localhost:3000/api/favorites/${user.id}`)
    const favData = await res.json()
    services.value = services.value.map(s =>({
        ...s,
        isFav: favData.some(fav => fav.service_id === s.id)
    }))
}

const filteredServices = computed(() =>{
    return services.value.filter(s =>{
        const matchCategory = activeCategory.value === 'All' || s.category === activeCategory.value
        const matchSearch = s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchCategory && matchSearch
    })
})


onMounted(async () =>{
    if(route.query.q){
        searchQuery.value = route.query.q
    }
    fetchCategories()
   await fetchServices()
    checkFavs()
})



</script>

<style scoped>

.search-page{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.search-body{
    flex: 1;
    background: #f9fffe;
    display: flex;
    flex-direction: column;
}

.search-header{
    padding: 20px 30px;
    background: white;
    border-bottom: 1px solid #b2ede8;
}

.search-bar{
    background: #f0fffe;
    border: 2px solid #b2ede8;
    border-radius: 24px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 700px;
}

.search-bar input{
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: #22223b;
    width: 100%;
}

.search-bar input::placeholder{
    color: #aaa;
}

.filter-row{
    display: flex;
    gap: 10px;
    padding: 16px 30px;
    background: white;
    border-bottom: 1px solid #b2ede8;
    flex-wrap: wrap;
}

.filter-chip{
    padding: 6px 14px;
    border-radius: 24px;
    border: 1px solid #b2ede8;
    font-size: 13px;
    color: #22223b;
    cursor: pointer;
    background: white;
    transition: all 0.15s;
}

.filter-chip:hover{
    background: #d9f7f4;
    border-color: #2ec4b6 ;
    color: #2ec4b6;
}

.filter-chip.active{
    background: #2ec4b6;
    color: white;
    border-color: #2ec4b6;
}

.result-list{
   display:grid;
   grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
    padding: 20px 30px;
    gap: 16px;
}

.result-card{
    display: flex;
    position: relative;
    gap: 16px;
    background: white;
    border: 1px solid #b2ede8;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: background 0.15s;
}

.result-card:hover{
    background:  #f0fffe;
}

.result-image{
    width: 100px;
    height: 100px;
    border-radius: 12px;
    background: #b2ede8;
    flex-shrink: 0;
}
.result-info{
    display:flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
}

.heart-wrapper{
    position: absolute;
    bottom: 15px;
    right: 15px;
}

body.dark-mode .search-body{ background: var(--bg-page);}
body.dark-mode .search-header{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .search-bar{ background: var(--bg-input); border-color: var(--border);}
body.dark-mode .search-bar input { color: var(--text-primary);}
body.dark-mode .filter-row{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .filter-chip {background: var(--bg-card); border-color: var(--border); color: var(--text-primary);}
body.dark-mode .filter-chip:hover { background: #1f3f3c; color: #2ec4b6;}
body.dark-mode .result-card { background: var(--bg-card); border-color: var(--border);}
body.dark-mode .result-card:hover { background: #1f3f3c;}

</style>

