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
                <button class="a-btn-primary" @click="showModal = true">+ Post a Request</button>
             </div>
            

             <!-- Requests Card-->
              <div class="requests-list">
                <div class="request-card" v-for="req in browsableRequests" :key="req.id">
                    <div class="request-top">
                        <div class="request-category">{{ req.category }}</div>
                        <div class="request-time">{{ new Date(req.created_at).toLocaleDateString() }}</div>
                    </div>
                    <div class="request-title">{{ req.title }}</div>
                    <div class="fd-meta">📍 {{ req.location_name }} </div>
                    <div class="request-desc">{{ req.description }}</div>
                    <a v-if="user.is_provider && req.latitude && req.longitude"
                       :href="`https://www.google.com/maps/dir/?api=1&destination=${req.latitude},${req.longitude}`"
                        target="_blank" class="direction-link"
                        @click.stop>📍 Get Directions</a>
                    <button v-if="user.is_provider" class="a-btn" style ="font-size: 12px; padding:4px 10px; margin-top: 6px;" @click.stop="respondingRequest = req">Respond</button>
                </div>
              </div>

               </div>

              <!-- My Requests-->
              <div v-if="activeTab === 'my-requests'">
                <div class="requests-header">

                    <div class="requests-title">My Requests</div>
                    <button class="a-btn-primary" @click="showModal = true">+ Post a Request</button>

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

                    <div class="request-action">
                        <span :class="['status-badge', req.status]">{{ req.status }}</span>
                        <div style = "display: flex; gap: 6px; margin-left: auto;">
                             <button class="a-btn" style="font-size: 12px; padding:4px 10px;" @click.stop="openEdit(req)">Edit</button>
                             <button class="a-btn" style="font-size: 12px; padding:4px 10px;" @click.stop="updateStatus(req.id, 'filled')" v-if="req.status === 'open'">Mark Filled</button>
                             <button class="a-btn" style="font-size: 12px; padding:4px 10px;" @click.stop="updateStatus(req.id, 'closed')" v-if="req.status !== 'closed'">Closed</button>
                             <button class="a-btn" style="font-size: 12px; padding:4px 10px; color: #e74c3c; border-color:#e74c3c;" @click.stop="deleteRequest(req.id)">Delete</button>
                        </div>
                    </div>
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

        <div v-if= "showModal" class="modal-overlay" @click.self="showModal=false; mapVisible=false; if(mapInstance){mapInstance.remove();mapInstance=null;marker=null}">
            <div class="modal">
                <div class="modal-title">{{ editingRequest ? 'Edit Request' : 'Post a Request' }}</div>
                <div v-if ="formError" class="form-error">⚠️ {{ formError }}</div>
                <div class="form-group">
                    <label>Title</label>
                    <input v-model="newTitle" class="Input" placeholder="e.g. Need an AC repair"/>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select v-model="newCategory" class="Input">
                        <option value="" disabled> Select a Category</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                    </select>   
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea v-model="newDescription" class="Input" placeholder="Describe what u need or what the problem u face" style="min-height:80px; resize:vertical;"></textarea>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input v-model="newLocation" class="Input" placeholder="Pin a location on the map below" readonly/>
                    <button type="button" class="a-btn-primary find-loc-btn" @click="openMap">📍 Get Location</button>
                    <div id="request-map" class="request-map" v-show="mapVisible"></div>
                </div>
                <div class="modal-actions">
                    <button class="a-btn" @click="showModal = false">Cancel</button>
                    <button class="a-btn-primary" @click="submitRequest" :disabled ="posting">
                        {{ posting ? 'Saving...' : editingRequest ? 'Save Changes' : 'Post Request' }}
                    </button> 
                </div>

            </div>
        </div>

        <div v-if="respondingRequest" class="modal-overlay" @click.self="respondingRequest = null">
            <div class="modal">
                <div class="modal-title">Respond to Request</div>
                <div class="fd-meta">{{ respondingRequest.title }}</div>
                <div class="form-group">
                    <label>Your Message</label>
                    <textarea v-model="responseMessage" class="Input" placeholder="Write Yours Responses..." style="min-height:100px; resize:vertical;"></textarea>
                </div>
                <div class="modal-actions">
                    <button class="a-btn" @click="respondingRequest = null">Cancel</button>
                    <button class="a-btn-primary" @click="submitResponse" :disabled="responding">
                        {{ responding ? 'Sending...' : 'Send Response' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
  
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted, computed, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


const activeTab = ref('browse')
const user = JSON.parse(localStorage.getItem('user') || '{}')
const requests = ref([])
const myRequests = ref([])
const myResponses = ref([])
const showModal = ref(false)
const newTitle = ref('')
const newCategory = ref('')
const newDescription = ref('')
const newLocation = ref('')
const posting = ref(false)
const formError = ref('')
const categories = ref([])
const editingRequest = ref(null)
const respondingRequest = ref(null)
const responseMessage = ref('')
const responding = ref(false)
const newLat = ref(null)
const newLng = ref(null)
const mapVisible = ref(false)
let mapInstance = null
let marker = null

const browsableRequests = computed(() => {
    const respondedIds = new Set(myResponses.value.map(r => r.request_id))
    return requests.value.filter(r => !respondedIds.has(r.id))
})

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

async function submitRequest(){
    if ( !newTitle.value || !newCategory.value || !newDescription.value || !newLocation.value){
    formError.value = ' Please fill in all the forms '
   return 
 }
    formError.value = ''
    posting.value = true

if(editingRequest.value){
    await fetch(`http://localhost:3000/api/requests/${editingRequest.value.id}`,{
        method: 'PATCH',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
            title:newTitle.value,
            category: newCategory.value,
            description: newDescription.value,
            location_name: newLocation.value,
            latitude: newLat.value,
            longitude: newLng.value
        })
    })
}else{
    await fetch(`http://localhost:3000/api/requests`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            customer_id: user.id,
            title: newTitle.value,
            category: newCategory.value,
            description: newDescription.value,
            location_name: newLocation.value,
            latitude: newLat.value,
            longitude: newLng.value
        })
    })
}

await fetchRequests()
await fetchMyRequests()
showModal.value = false
editingRequest.value = null
newTitle.value = ''
newCategory.value = ''
newDescription.value = ''
newLocation.value = ''
newLat.value = null
newLng.value = null
posting.value = false
mapVisible.value = false
if (mapInstance) { mapInstance.remove(); mapInstance = null; marker = null }
    

}

async function fetchCategories(){
    const res = await fetch('http://localhost:3000/api/categories/all')
    const data = await res.json()
    categories.value = data
}

async function openMap() {
    if (mapInstance) { mapInstance.remove(); mapInstance = null; marker = null }
    newLocation.value = 'Getting your location...'
    mapVisible.value = true
    await nextTick()

    mapInstance = L.map('request-map').setView([11.5564, 104.9282], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance)
    marker = L.marker([11.5564, 104.9282]).addTo(mapInstance)

    navigator.geolocation?.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        mapInstance.setView([lat, lng], 16)
        marker.setLatLng([lat, lng])
        newLat.value = lat
        newLng.value = lng
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        newLocation.value = data.display_name || `${lat}, ${lng}`
    }, () => {
        newLocation.value = ''
    })

    mapInstance.on('dblclick', async (e) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        newLat.value = lat
        newLng.value = lng
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        newLocation.value = data.display_name || `${lat}, ${lng}`
    })
}

function openEdit(req){
    editingRequest.value = req
    newTitle.value = req.title
    newCategory.value = req.category
    newDescription.value = req.description
    newLocation.value = req.location_name
    showModal.value = true
}

async function updateStatus(id, status){
    await fetch(`http://localhost:3000/api/requests/${id}/status`,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    })
    await fetchMyRequests()
}

async function deleteRequest(id){
    if(!confirm('Delete this request?')) return
    await fetch(`http://localhost:3000/api/requests/${id}`, {
        method : 'DELETE'
    })
    await fetchMyRequests()
}

async function submitResponse(){
    if(!responseMessage.value)return
    responding.value = true
    await fetch(`http://localhost:3000/api/responses`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            provider_id: user.id,
            request_id: respondingRequest.value.id,
            message: responseMessage.value
        })
    })
    responding.value = false
    respondingRequest.value = null
    responseMessage.value = ''
    await fetchMyResponses()
    activeTab.value = 'my-responses'
}


onMounted(() =>{
    fetchRequests()
    fetchMyRequests()
    fetchMyResponses()
    fetchCategories()
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

.modal-overlay{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal{
    background: white;
    border-radius: 16px;
    padding: 30px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.modal-title{
    font-size: 20px;
    font-weight: 700;
    color: #22223b;
}

.modal-actions{
    display: flex;
    justify-content: center;
    gap: 10px;
}

.form-error{
    background: #ffe8e8;
    color: #e74c3c;
    border: 1px solid #e74c3c;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 600;
}

select.Input{
    appearance: auto;
    padding-right: 32px;
}

.find-loc-btn {
    margin-top: 6px;
    margin-bottom: 8px;
}

.request-map {
    width: 100%;
    height: 280px;
    border-radius: 10px;
    border: 1px solid #b2ede8;
    margin-top: 4px;
    z-index: 0;
}

.request-action{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top:4px ;
}

.status-badge{
    font-size: 14px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 12px;
}
.status-badge.open { background: #d9f7f4; color: #1a8a83; }
.status-badge.filled { background: #eef0ff; color: #4b55d1; }
.status-badge.closed { background: #ffe8e8; color: #e74c3c; }

.direction-link{
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    color: #2ec4b6;
    text-decoration: none;
    margin-top: 4px;
    cursor: pointer;
}

.direction-link:hover{
    text-decoration: underline;
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
body.dark-mode .modal{ background: var(--bg-card);}
body.dark-mode .modal-title{ color: var(--text-primary)}

</style>