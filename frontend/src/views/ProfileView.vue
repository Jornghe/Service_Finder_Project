<template>
    <div class="profile-page">
        <NavBar/>

        <div class="profile-body">
            <div class="profile-container">

            <!-- Cover and Avatar -->
             <div class="profile-cover">
                <div class="profile-avatar"></div>
             </div>

             <!-- User Info -->
              <div class="profile-info">
                <div class="profile-name">{{ user.name }}</div>
                <div class="profile-email">{{ user.email }}</div>
                <div class="profile-phone">{{ user.phone }}</div>
              </div>

              <!-- State -->
               <div class="profile-state">
                <div class="state-item">
                    <div class="state-number">{{ requests.length }}</div>
                    <div class="state-label">Requests</div>
                </div>

                <div class="state-item">
                    <div class="state-number">{{ favorites.length }}</div>
                    <div class="state-label">Favorites</div>
                </div>

                <div class="state-item">
                    <div class="state-number">{{ reviewCount }}</div>
                    <div class="state-label">reviews</div>
                </div>
               </div>


               <!-- Recent Requests -->
                <div class="profile-section">
                    <div class="profile-section-title">My Recent Requests</div>
                    <div v-if= "requests.length === 0" class="empty-state">No requests yet.</div>
                    <div v-for="req in requests.slice(0,3)" :key="req.id" class="profile-item">
                        <div class="profile-item-title">{{ req.title }}</div>
                        <div class="profile-item-meta">{{  req.category }} . {{ new Date(req.created_at).toLocaleDateString() }}</div>
                    </div>

                </div>

                <!-- Recent Favorite -->
                 <div class="profile-section">
                    <div class="profile-section-title">My Recent Favorites</div>
                    <div v-if="favorites.length === 0" class="empty-state">No favorites yet</div>
                    <div v-for="fav in favorites.slice(0,3)" :key="fav.id" class="profile-item">
                        <div class = "profile-item-title">{{  fav.services.name }}</div>
                        <div class = "profile-item-meta">{{ fav.services.category }}</div>
                    </div>
                 </div>
         </div>
        </div>
    </div>
  
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || '{}' )
const requests = ref([])
const favorites = ref([])
const reviewCount = ref(0)


async function fetchRequests(){
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    requests.value = Array.isArray(data) ? data : []
}

async function fetchFavorites(){
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    favorites.value = Array.isArray(data) ? data : []
}

async function fetchReviewCount(){
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/user/${user.id}`)
    const data = await res.json()
    reviewCount.value = Array.isArray(data) ? data.length : 0
}

onMounted(() =>{
    fetchRequests()
    fetchFavorites()
    fetchReviewCount()
})

</script>

<style scoped>

.profile-page{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.profile-body{
    flex:1;
    background: #d9f0ee;
    display: flex;
    justify-content: center;
    padding: 30px 0;
}

.profile-container{
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.profile-cover{
    width: 100%;
    height: 220px;
    background: #b2ede8;
    position: relative;
    flex-shrink: 0;
}

.profile-avatar{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: #edfcfa;
    border: 4px solid white;
    position: absolute;
    bottom: -40px;
    left: 60px;
}

.profile-info{
    padding: 56px 20px 16px 20px;
    border-radius: 12px;
    background: white;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.profile-name{
    font-size: 22px;
    font-weight: 700;
    color: #22233b;
}

.profile-email,
.profile-phone{
    font-size: 14px;
    color: #555;
}

.profile-state{
    display: flex;
    background: white;
    border-radius: 12px;
}

.state-item{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-right: 1px solid #b2ede8;
    gap: 4px;
}

.state-item:last-child{
    border-right: none;
}

.state-number{
    font-size: 22px;
    font-weight: 700;
    color: #2ec4b6;
}

.state-label{
    font-size: 13px;
    color: #555;
}

.profile-section {
    padding: 24px 30px;
    background: white;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.profile-section-title{
    font-size: 16px;
    font-weight: 700;
    color: #22223b;
}

.profile-item{
    padding: 10px 0;
    border-bottom: 1px solid #b2ede8;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.profile-item:last-child{ border-bottom: none;}
.profile-item-title{
    font-size: 15px;
    font-weight: 600;
    color: #22223b;
}

.profile-item-meta{
    font-size: 13px;
    color: #555;
}

body.dark-mode .profile-body{ background: var(--bg-page); }
body.dark-mode .profile-cover{ background: #1f3f3c;}
body.dark-mode .profile-avatar{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .profile-info{ background: var(--bg-card);}
body.dark-mode .profile-name{ color: var(--text-primary);}
body.dark-mode .profile-email,
body.dark-mode .profile-phone{ color: var(--text-secondary);}
body.dark-mode .profile-state{ background: var(--bg-card);}
body.dark-mode .state-item{ border-color: var(--border);}
body.dark-mode .state-label{color: var(--text-secondary);}
body.dark-mode .profile-section{ background: var(--bg-card);}
body.dark-mode .profile-section-title{ color: var(--text-primary);}
body.dark-mode .empty-state { color: var(--text-muted);}
body.dark-mode .profile-item{ border-color: var(--border);}
body.dark-mode .profile-item-title{ color: var(--text-primary);}
body.dark-mode .profile-item-meta{ color: var(--text-secondary);}
</style>