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
                            <div class="admin-stat-num">1,284</div>
                            <div class="admin-stat-label">Total Users</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="admin-stat-num">342</div>
                            <div class="admin-stat-label">Providers</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="admin-stat-num">89</div>
                            <div class="admin-stat-label">Pending</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="admin-stat-num">4.7</div>
                            <div class="admin-stat-label">Average Rating</div>
                        </div>
                    </div>
               </div>
               <!-- Manage Users -->
                     <div v-else-if="activeTab==='users'">
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
                                    <tr>
                                        <td>Sokha Dara</td>
                                        <td>sokhadara@gmail.com</td>
                                        <td><span class="admin-badge provider">Provider</span></td>
                                        <td>2025-01-10</td>
                                        <td><button class="admin-btn-sm danger">Suspend</button></td>
                                    </tr>
                                    <tr>
                                        <td>Meas Kosal</td>
                                        <td>kosal@email.com</td>
                                        <td style="text-align: center;"><span class="admin-badge user">User</span></td>
                                        <td>2025-03-22</td>
                                        <td style="text-align: center;"><button class="admin-btn-sm danger">Suspend</button></td>
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
                                    <tr>
                                        <td>AC Repair Pro</td>
                                        <td>Dara</td>
                                        <td>Repairs</td>
                                        <td><span class="admin-badge active">Active</span></td>
                                        <td style="text-align: center;"><button class="admin-btn-sm danger">Remove</button></td>
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
                                        <th>Provider</th>
                                        <th>ID Type</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th style="text-align: center;">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Ly Ratha</td>
                                        <td>ID + License</td>
                                        <td>2026-09-01</td>
                                        <td><span class="admin-badge pending">Pending</span></td>
                                        <td>
                                            <div class="admin-btn-group">
                                                <button class="admin-btn-sm approve">Approve</button>
                                                <button class="admin-btn-sm danger">Reject</button>
                                            </div>
                                        </td>
                                    </tr>
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
                                            <th>Request</th>
                                            <th>User</th>
                                            <th>Provider</th>
                                            <th>Date</th>
                                            <th style="text-align: center;">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>Plumbing fix</td>
                                            <td>Sokha</td>
                                            <td>Mean Seav</td>
                                            <td>2026-09-08</td>
                                            <td style="text-align: center;"><span class="admin-badge active">Completed</span></td>
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
                                        <tr>
                                            <td>"Very Professional and fast"</td>
                                            <td>Sokha</td>
                                            <td>Mean Seav</td>
                                            <td>⭐ 5.0</td>
                                            <td style="text-align: center;"><button class="admin-btn-sm danger">Remove</button></td>
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

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router   = useRouter()
const activeTab = ref('dashboard')

const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon:'📊'},
    { key: 'users', label: 'Manage Users', icon: '👥'},
    { key: 'listings', label: 'Manage Listings', icon: '📋'},
    { key: 'verification', label: 'Manage Verifications', icon: '✅'},
    { key: 'requests', label: 'Manage Requests', icon: '📨'},
    { key: 'reviews', label: 'Manage Reviews', icon: '⭐'},

]

const tabTitle ={
    dashboard: 'Dashboard',
    users: 'User',
    listings: 'Manage Listings',
    verifications: 'Manage Verifications',
    requests: 'Manage Requests',
    reviews: 'Manage Reviews'

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
</style>