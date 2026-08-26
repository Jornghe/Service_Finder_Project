<template>
    <div class="requests-page">
        <NavBar/>

        <div class="requests-main">
            <!-- SideBar -->
             <div class="requests-sidebar">
                <div class="sidebar-item" :class="{ active: activeTab === 'browse'}" @click= "activeTab = 'browse'">Browse Requests</div>
                <div class="sidebar-item" :class="{ active: activeTab === 'my-requests'}" @click= "activeTab = 'my-requests'">My Requests</div>
                <div v-if="user.is_provider" class="sidebar-item" :class="{ active: activeTab === 'my-responses'}" @click= "activeTab = 'my-responses'">My Responses</div>
             </div>

        <!-- Main Content -->
        <div class="requests-body">

            <!-- Header -->
             <div v-if="activeTab ==='browse'">
             <div class="requests-header">
                <div class="requests-title">Services Request</div>
                <button class="a-btn-primary">+ Post a Request</button>
             </div>
            

             <!-- Requests Card-->
              <div class="requests-list">
                <div class="request-card" v-for="req in requests" :key="req.id">
                    <div class="request-top">
                        <div class="request-category">{{ req.category }}</div>
                        <div class="request-time">{{ new Date(req.created_at).toLocaleDateString() }}</div>
                    </div>
                    <div class="request-title">{{ req.title }}</div>
                    <div class="fd-meta">📍 {{ req.location_name }} </div>
                    <div class="request-desc">{{ req.description }}</div>
                </div>
              </div>

               </div>

              <!-- My Requests-->
              <div v-if="activeTab === 'my-requests'">
                <div class="requests-header">

                    <div class="requests-title">My Requests</div>
                    <button class="a-btn-primary">+ Post a Request</button>

                </div>

                 <div v-if="myRequests.length === 0" class="empty-state">No requests posted yet</div>
                   <div class="request-card" v-for="req in myRequests" :key="req.id">
                    <div class="request-top">
                        <div class="request-category">{{ req.category }}</div>
                        <div class="request-item">{{ new Date(req.created_at).toLocaleDateString() }}</div>
                    </div>

                    <div class="request-title">{{ req.title }}</div>
                    <div class="fd-meta">📍 {{ req.location_name }}</div>
                    <div class="request-desc">{{ req.description }}</div>
                 </div>
                 
                 
                    
             </div>

               <!-- My Responses -->
                <div v-if="activeTab === 'my-responses'">
                    <div class="requests-header">
                        <div class="requests-title">My Responses</div>
                    </div>

                    <div class="requests-list">
                       <div v-if="myResponses.length === 0" class="empty-state">No Responses</div>
                       <div class="request-card" v-for="res in myResponses" :key="res.id">
                         <div class="request-top">
                            <div class="request-category">{{ res.service_requests.category }}</div>
                            <div class="request-time">{{ new Date(res.created_at).toLocaleDateString() }}</div>
                         </div>
                         <div class="request-title">{{ res.service_requests.title }}</div>
                         <div class="fd-meta">📍 {{ res.service_requests.location_name }}</div>
                         <div class="request-desc">{{ res.message }}</div>
                       </div>
                    </div>
                </div>
        </div>
        </div>

    </div>
  
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted } from 'vue'


const activeTab = ref('browse')
const user = JSON.parse(localStorage.getItem('user') || '{}')
const requests = ref([])
const myRequests = ref([])
const myResponses = ref([])

async function fetchRequests(){
    const res = await fetch(`http://localhost:3000/api/requests/`)
    const data = await res.json()
    requests.value = data
}

async function fetchMyRequests(){
    if(!user.id)return
    const res = await fetch(`http://localhost:3000/api/requests/user/${user.id}`)
    const data = await res.json()
    myRequests.value = data
}

async function fetchMyResponses(){
    if(!user.id) return
    const res = await fetch(`http://localhost:3000/api/responses/provider/${user.id}`)
    const data = await res.json()
    myResponses.value = data
}


onMounted(() =>{
    fetchRequests()
    fetchMyRequests()
    fetchMyResponses()
})

</script>

<style scoped>

.requests-page{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: hidden;
    overflow-x:auto;
}

.requests-main{
    display: flex;
    flex: 1;
    overflow: hidden;
    min-width: 600px;
}

.requests-sidebar{
    width: 220px;
    background: #edfcfa;
    border-right: 2px solid #b2ede8;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 16px 10px;
    gap: 4px;
}

.sidebar-item{
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 15px;
    color: #22223b;
    cursor: pointer;
    transition: background 0.15s;
}

.sidebar-item:hover{
    background: #d9f7f4;
    color: #2ec4b6;
}

.sidebar-item.active{
    background: #2ec4b6;
    color: white;
    font-weight: 600;
}

.requests-body{
    flex:1;
    overflow-y:auto ;
    background: #f9fffe;
    display: flex;
    flex-direction: column;
}

.requests-header{
    display: flex;
    align-items:  center;
    justify-content: space-between;
    padding: 20px 30px;
    background: white;
    border-bottom: 1px solid #b2ede8;
}

.requests-title{
    font-size: 20px;
    font-weight: 700;
    color: #22223b;
}

.requests-list{
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
    gap: 16px;
}

.request-card{
    background: white;
    border: 1px solid #b2ede8;
    border-radius: 12px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
    transition: background 0.15s;
}

.request-card:hover{
    background: #f0fffe;
}

.request-top{
    display: flex;
    justify-content: space-between;
    align-content: center;
}

.request-category{
    background: #d9f7f4;
    color: #1a8a83;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
}

.request-time{
    font-size: 13px;
    color: #aaa;
}

.request-title{
    font-size: 16px;
    font-weight: 700;
    color: #22223b;
}

.request-desc{
    font-size: 13px;
    color: #777;
    line-height: 1.5;
}

.empty-state{
    font-size: 26px;
    text-align: center;
    font-weight: 700;
    padding: 60px 40px;
    color: #aaa;

}

body.dark-mode .requests-sidebar{ background: var(--bg-sidebar); border-color: var(--border);}
body.dark-mode .sidebar-item{ color: var(--text-primary);}
body.dark-mode .sidebar-item:hover{background: #1f3f3c; color: #2ec4b6;}
body.dark-mode .sidebar-item.active { background: #498f88; color: white; }
body.dark-mode .requests-body{ background: var(--bg-page);}
body.dark-mode .requests-header{background: var(--bg-card); border-color: var(--border);}
body.dark-mode .requests-title{color: var(--text-primary);}
body.dark-mode .request-card{background: var(--bg-card); border-color: var(--border);}
body.dark-mode .request-card:hover{ background: #1f3f3c;}
body.dark-mode .request-title{ color: var(--text-primary);}
body.dark-mode .request-desc{color: var(--text-secondary);}
body.dark-mode .request-category{ background: #1f3f3c; color: #2ec4b6;}
body.dark-mode .empty-state{color: var(--text-muted);}
</style>