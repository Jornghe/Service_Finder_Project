<template>
    <div class="favorites-page">
        <NavBar/>

        <div class="favorites-body">
            <div class="favorites-header">
                <div class="favorites-title">My Favorites</div>
            </div>

            <div class="favorites-grid">

              <div class="fav-card" v-for="fav in favorites" :key="fav.id" @click="router.push(`/service/${fav.services.slug}`)">
                <div class="fav-image"></div>
                <div class="fav-info">
                    <div class="fd-name">{{ fav.services.name }} <span v-if="fav.services.is_verified" class="verified">✓ Verified</span></div>
                    <div class="fd-meta">⭐ {{ fav.services.avg_rating }} · <span class="badge-open">Open</span></div>
                    <div class="fd-price">${{ fav.services.price_min }} - ${{ fav.services.price_max }}</div>
                   
                </div>
                <div class="heart-wrapper"> 
                    <HeartButton :size="35" :serviceId = "fav.services.id" v-model="fav.isFav"/>
                </div>
            </div>

        
            </div>


        </div>
    </div>
  
</template>

<script setup>
import HeartButton from '@/components/HeartButton.vue';
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const favorites = ref([])



async function fetchFavorites(){
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if(!user.id)return
    const res = await fetch(`http://localhost:3000/api/favorites/${user.id}`)
    const data = await res.json()
   favorites.value = data.map(fav => ({...fav, isFav: true}) )
}

onMounted(()=>{
    fetchFavorites()
})

</script>

<style scoped>
.favorites-page{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.favorites-body{
    flex: 1;
    background: #f9fffe;
    display: flex;
    flex-direction: column;
}

.favorites-header{
    padding: 20px 30px;
    background: white;
    border-bottom: 3px solid #b2ede8;
}

.favorites-title{
    font-size: 20px;
    font-weight: 700;
    color: #22223b;
}

.favorites-grid{
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(500px,1fr));
    gap: 20px;
    padding: 24px 30px;
}

.fav-card{
    background: white;
    border: 2px solid #b2ede8;
    border-radius: 15px;
    overflow: hidden;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
}

.fav-card:hover{
    background: #f0fffe;
}

.fav-image{
    width: 100%;
    height: 150px;
    background: #b2ede8;
}

.fav-info{
    padding: 25px 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.heart-wrapper{
    position: absolute;
    bottom: 12px;
    right: 12px;

}

body.dark-mode .favorites-body{ background: var(--bg-page);}
body.dark-mode .favorites-header { background: var(--bg-card); border-color: var(--border);}
body.dark-mode .favorites-title{ color: var(--text-primary);}
body.dark-mode .fav-card { background: var(--bg-card); border-color: var(--border);}
body.dark-mode .fav-card:hover {background: #1f3f3c;}


</style>