<template>
    <div class="admin-page">
        <!-- SideBar -->
     <div class="admin-sidebar">
        <div class="sidebar-header"> 🛡️ Admin Panel</div>

        <nav class="admin-nav">
            <div v-for="tab in tabs" 
            :key="tab.key" 
            class="admin-nav-item" 
            :class="{ active: activeTab === tab.key}" 
            @click="activeTab = tab.key">
            
            <span class="admin-nav-icon">{{ tab.icon }}</span>
            {{ tab.label }}
            </div>
        </nav>

        <div class="admin-sidebar-space"></div>
        <div class="admin-sidebar-divider"></div>
        <div class="admin-nav-item admin-signout" @click="signOut"><span class="admin-nav-icon">🚪</span>Sign Out</div>
     </div>

        <!-- Content -->

        <div class="admin-body">
            <div class="admin-header">
                <h1 class="admin-title">{{ tabTitle[activeTab] }}</h1>
            </div>

            <div class="admin-content">
                <!-- Dashboard -->
                 <div v-if="activeTab === 'dashboard'">
                    <div class="admin-stats">
                        <div class="admin-stat-card">
                            <div class="admin-stat-num">{{ stats.totalUsers }}</div>
                            <div class="admin-stat-label">Total Users</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="admin-stat-num">{{ stats.totalProviders }}</div>
                            <div class="admin-stat-label">Providers</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="admin-stat-num">{{ stats.pendingVerifications }}</div>
                            <div class="admin-stat-label">Pending</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="admin-stat-num">{{ stats.avgRating }}</div>
                            <div class="admin-stat-label">Average Rating</div>
                        </div>
                    </div>
               </div>
               <!-- Manage Users -->
                     <div v-else-if="activeTab === 'users'">
                        <div class="admin-table-wrap">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th style="text-align: center;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="u in users" :key="u.id">
                                        <td>{{ u.name }}</td>
                                        <td>{{ u.email }}</td>
                                        <td>
                                            <span class="admin-badge" :class="u.is_suspend ? 'danger-badge' : u.is_provider ? 'provider' : 'user'">
                                                {{ u.is_suspend ? 'Suspended' : u.is_provider ? 'Provider' : 'User' }}
                                            </span>
                                        </td>
                                        <td>{{ new Date(u.created_at).toLocaleDateString() }}</td>
                                        <td style="text-align: center;">
                                            <button class="admin-btn-sm" :class="u.is_suspend ? 'approve' : 'danger'" @click="suspendUser(u.id, u.is_suspend)">
                                                {{ u.is_suspend ? 'Unsuspend' : 'Suspend' }}
                                            </button>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                     </div>

                     <!-- Manage Listing -->
                      <div v-else-if="activeTab === 'listings'">
                        <div class="admin-table-wrap">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Provider</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th style="text-align: center;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="s in listings" :key="s.id">
                                        <td>{{ s.name }}</td>
                                        <td>{{ s.users?.name }}</td>
                                        <td>{{ s.category }}</td>
                                        <td><span class="admin-badge active">Active</span></td>
                                        <td style="text-align: center;"><button class="admin-btn-sm danger" @click="removeListing(s.id)">Remove</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                      </div>

                      <!-- Manage Verification -->
                       <div v-else-if="activeTab === 'verification'">
                        <div class="admin-table-wrap">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Provider</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th style="text-align: center;">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <template v-for="v in verifications" :key="v.service_id">
                                        <tr>
                                            <td>{{ v.service_name }}</td>
                                            <td>{{ v.provider_name }}</td>
                                            <td>{{ new Date(v.submitted_at).toLocaleDateString() }}</td>
                                            <td><span class="admin-badge" :class="v.status === 'pending' ? 'pending' : v.status === 'approved' ? 'active' : 'danger-badge'">{{ v.status }}</span></td>
                                            <td>
                                                <div class="admin-btn-group">
                                                    <button class="admin-btn-sm approve" @click="expandedVerification = expandedVerification === v.service_id ? null : v.service_id">Documents</button>
                                                    <template v-if="v.status === 'pending'">
                                                        <button class="admin-btn-sm approve" @click="approveVerification(v.service_id)">Approve</button>
                                                        <button class="admin-btn-sm danger" @click="rejectVerification(v.service_id)">Reject</button>
                                                    </template>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="expandedVerification === v.service_id" :key="v.service_id + '-docs'">
                                            <td colspan="5" style="background: #f5f8ff; padding: 12px 20px;">
                                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                                    <div v-for="doc in v.documents" :key="doc.id" style="display: flex; align-items: center; gap: 8px; background: white; border: 1px solid #bfcfe8; border-radius: 8px; padding: 8px 12px;">
                                                        <span style="font-size: 13px; font-weight: 600; color: #1e3a5f;">{{ doc.document_type }}</span>
                                                        <button class="admin-btn-sm approve" @click="viewDocument(doc.document_url)">View</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                       </div>

                       <!-- Manage Requests -->
                        <div v-else-if="activeTab === 'requests'">
                            <div class="admin-table-wrap">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Posted By</th>
                                            <th>Location</th>
                                            <th>Date</th>
                                            <th style="text-align: center;">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="r in requests" :key="r.id">
                                            <td>{{ r.title }}</td>
                                            <td>{{ r.users?.name }}</td>
                                            <td>{{ r.location_name }}</td>
                                            <td>{{ new Date(r.created_at).toLocaleDateString() }}</td>
                                            <td style="text-align: center;"><span class="admin-badge" :class="r.status ==='open' ? 'pending' : 'active'">{{ r.status }}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div v-else-if="activeTab === 'categories'">
                            <div class="admin-table-wrap" style="margin-bottom: 20px; padding: 20px;">
                                <div style="font-size: 15px; font-weight: 700; color: #1e3a5f; margin-bottom: 12px;">Add New Category</div>
                                <div style="display: flex; gap: 10px;">
                                    <input
                                        class="admin-cat-input"
                                        type="text"
                                        placeholder="e.g. Photography"
                                        v-model="newCategoryName"
                                        @keydown.enter="addCategory"
                                    />
                                    <button class="admin-btn-sm approve" style="padding: 8px 20px; font-size: 14px;" @click="addCategory">Add</button>
                                </div>
                            </div>
                            <div class="admin-table-wrap">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Category Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(cat, index) in categories" :key="cat.id">
                                            <td style="color: #aaa; width: 50px;">{{ index + 1 }}</td>
                                            <td>{{ cat.name }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Manage Reviews -->
                         <div v-else-if="activeTab === 'reviews'">
                            <div class="admin-table-wrap">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Reviews</th>
                                            <th>By</th>
                                            <th>For</th>
                                            <th>Rating</th>
                                            <th style="text-align: center;">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="r in reviews" :key="r.id">
                                            <td>"{{ r.comment }}"</td>
                                            <td>{{ r.users?.name }}</td>
                                            <td>{{ r.services?.name }}</td>
                                            <td>⭐ {{ r.rating }}</td>
                                            <td style="text-align: center;"><button class="admin-btn-sm danger" @click="removeReview(r.id)">Remove</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                         </div>
            </div>
        </div>


  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router   = useRouter()
const activeTab = ref('dashboard')

const stats = ref({
    totalUsers: 0,
    totalProviders: 0,
    pendingVerifications: 0,
    averageRating: 0
})
const expandedVerification = ref(null)
const users = ref([])
const listings = ref([])
const verifications = ref([])
const requests = ref([])
const reviews = ref([])

onMounted(async ()=>{
    await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchListings(),
        fetchVerifications(),
        fetchRequests(),
        fetchReviews(),
        fetchCategories()
    ])
})

async function fetchStats(){
    const res = await fetch('http://localhost:3000/api/admin/stats')
    const data = await res.json()
    stats.value = data
}

async function fetchUsers(){
    const res = await fetch('http://localhost:3000/api/admin/users')
    const data = await res.json()
    users.value = Array.isArray(data) ? data : []
}

async function fetchListings(){
    const res = await fetch('http://localhost:3000/api/admin/listings')
    const data = await res.json()
    listings.value = Array.isArray(data) ? data : []
}

async function fetchVerifications(){
    const res = await fetch('http://localhost:3000/api/admin/verifications')
    const data = await res.json()
    verifications.value = Array.isArray(data) ? data : []
}

async function fetchRequests(){
    const res = await fetch('http://localhost:3000/api/admin/requests')
    const data = await res.json()
    requests.value = data
}

async function fetchReviews(){
    const res = await fetch('http://localhost:3000/api/admin/reviews')
    const data = await res.json()
    reviews.value = Array.isArray(data) ? data : []
}


async function suspendUser(id, currentlySuspended){
    await fetch(`http://localhost:3000/api/admin/users/${id}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspend: !currentlySuspended })
    })
    await fetchUsers()
}

async function removeListing(id){
    await fetch(`http://localhost:3000/api/admin/listings/${id}`, { method: 'DELETE' })
    await fetchListings()
}

async function approveVerification(serviceId){
    await fetch(`http://localhost:3000/api/admin/verifications/${serviceId}/approve`, { method: 'PATCH' })
    expandedVerification.value = null
    await fetchVerifications()
}

async function rejectVerification(serviceId){
    await fetch(`http://localhost:3000/api/admin/verifications/${serviceId}/reject`, { method: 'PATCH' })
    expandedVerification.value = null
    await fetchVerifications()
}

async function removeReview(id){
    await fetch(`http://localhost:3000/api/admin/reviews/${id}`, { method: 'DELETE' })
    await fetchReviews()
}
const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon:'📊'},
    { key: 'users', label: 'Manage Users', icon: '👥'},
    { key: 'listings', label: 'Manage Listings', icon: '📋'},
    { key: 'verification', label: 'Manage Verifications', icon: '✅'},
    { key: 'requests', label: 'Manage Requests', icon: '📨'},
    { key: 'reviews', label: 'Manage Reviews', icon: '⭐'},
    { key: 'categories', label: 'Categories', icon: '🏷️'},
]

const tabTitle ={
    dashboard: 'Dashboard',
    users: 'User',
    listings: 'Manage Listings',
    verifications: 'Manage Verifications',
    requests: 'Manage Requests',
    reviews: 'Manage Reviews',
    categories: 'Categories',
}

const categories = ref([])
const newCategoryName = ref('')

async function fetchCategories() {
    const res = await fetch('http://localhost:3000/api/categories/all')
    const data = await res.json()
    categories.value = Array.isArray(data) ? data : []
}

async function addCategory() {
    if (!newCategoryName.value.trim()) return
    const res = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.value.trim() })
    })
    if (!res.ok) { alert('Failed to add category'); return }
    newCategoryName.value = ''
    await fetchCategories()
}

async function viewDocument(filePath) {
    const res = await fetch(`http://localhost:3000/api/verifications/signed-url?path=${filePath}`)
    const data = await res.json()
    window.open(data.url, '_blank')
}

function signOut(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
}

</script>

<style scoped>

.admin-page{
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f0f4ff;
}


/* SideBar */
.admin-sidebar{
    width: 250px;
    flex-shrink: 0;
    background: #1e3a5f;
    display: flex;
    flex-direction: column;
    padding: 16px 10px;
    gap: 2px;
}


.sidebar-header{
    font-size: 22px;    
    font-weight: 700;
    color: #e0eeff;
    padding: 8px 12px 14px;
    border-bottom: 1px solid #2d4f7a;
    margin-bottom: 8px;
}

.admin-nav{
    display: flex;  
    flex-direction: column;
    gap: 2px;
}

.admin-nav-item{
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 12px;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 600;
    color: #93b8e0;
    cursor: pointer;
    transition: background  0.15s;
    margin: 5px;
}

.admin-nav-item:hover{
    background: #2d4f7a;
    color: #e0eeff;
    border-radius: 12px;
}

.admin-nav-item.active{
    background: #2563eb;
    color: white;
    font-weight: 600;
    border-radius: 12px;
}

.admin-nav-icon{
    font-size: 17px;
}

.admin-sidebar-space{
    flex: 1;
}

.admin-sidebar-divider{
    height: 1px;
    background: #2d4f7a;
    margin: 4px 8px;
}

.admin-signout{
    color: #e74c4c;
}

.admin-signout:hover{
    background: rgba(231, 76, 60, 0.15);
    color: #e74c3c;
    border-radius: 20px;
}

/* Body */
.admin-body{
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.admin-header{
    padding: 20px;
    border-bottom: 2px solid #bfcfe8 ;
    background: #f0f4ff;
}

.admin-title{
    font-size: 20px;
    font-weight: 700;
    color: #1e3a5f;
}

.admin-content{
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

/* State */

.admin-stats{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px ;
}

.admin-stat-card{
    background: white;
    border: 2px solid #bfcfe8;
    border-radius: 12px;
    padding: 20px 16px;
    text-align: center;

}

.admin-stat-num{
    font-size: 25px;
    font-weight: 600;
    color: #2563eb;
}

.admin-stat-label{
    font-size: 15px;
    color: #777;
    margin-top: 4px;
}

/* Table */
.admin-table-wrap{
    background: white;
    border: 1.5px solid #bfcfe8;
    border-radius: 12px;
    overflow: hidden;
}

.admin-table{
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
}

.admin-table th{
    background: #d1e0ff;
    color: #1e3a5f;
    font-weight: 600;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1.5px solid #bfcfe8;
}

.admin-table td{
    padding: 12px 16px;
    color: #333;
    border-bottom: 1px solid #e8edf5;
}

.admin-table tr:last-child td {
    border-bottom: none;
}

.admin-table tr:hover td{
    background: #f5f8ff;
}

/* Badges */
.admin-badge{
    font-size: 13px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
}

.admin-badge.provider { background: #dbeafe; color: #1d4ed8;}
.admin-badge.user { background: #f1f5f9; color: #477569;}
.admin-badge.active { background: #d1fae5; color: #065f46;}
.admin-badge.pending { background: #fef3c7; color: #b45309; }

/* Button */
.admin-btn-sm{
    padding: 5px 12px;
    border-radius: 6px;
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.admin-btn-sm.approve { background: #2563eb; color: white;}
.admin-btn-sm.danger { background: #fee2e2; color: #dc2626; padding: 5px 22px;}
.admin-btn-sm.danger:hover{ background: #dc2626; color: white;}

.admin-btn-group{
    display: flex;
    gap: 6px;
    justify-content: center;
}

.admin-cat-input {
    flex: 1;
    padding: 8px 12px;
    border: 1.5px solid #bfcfe8;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
}
.admin-cat-input:focus {
    border-color: #2563eb;
}
</style>