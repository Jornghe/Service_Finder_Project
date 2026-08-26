<template>
    <div class="provider-page">
        <NavBar/>

        <div class="provider-main">
            <!-- Sidebar -->
            <div class="provider-sidebar">
                <div class="sidebar-item" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'"> Dashboard</div>
                <div class="sidebar-item" :class="{ active: activeTab === 'listings' }" @click="activeTab = 'listings'"> My Listings</div>
                <div class="sidebar-item" :class="{ active: activeTab === 'requests' }" @click="activeTab = 'requests'"> Requests</div>
                <div class="sidebar-item" :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'"> Reviews</div>
            </div>

            <!-- Content -->
            <div class="provider-body">
                <div class="provider-header">
                    <div class="provider-title">{{ tabTitle[activeTab] }}</div>
                </div>

                <!-- Dashboard Tab -->
                <div v-if="activeTab === 'dashboard'" class="provider-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">12</div>
                            <div class="stat-label">Total Requests</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">4.8⭐</div>
                            <div class="stat-label">Average Rating</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">32</div>
                            <div class="stat-label">Total Reviews</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">95%</div>
                            <div class="stat-label">Response Rate</div>
                        </div>
                    </div>

                    <div class="p-section">
                        <div class="p-section-title">Recent Requests</div>
                        <div class="p-item">
                            <div class="p-item-info">
                                <div class="p-item-name">Dara K.</div>
                                <div class="p-item-desc">Need AC repair at home</div>
                            </div>
                            <div class="p-item-time">2 hours ago</div>
                        </div>
                        <div class="p-item">
                            <div class="p-item-info">
                                <div class="p-item-name">Sreyla M.</div>
                                <div class="p-item-desc">AC installation needed</div>
                            </div>
                            <div class="p-item-time">5 hours ago</div>
                        </div>
                    </div>
                </div>

                <!-- Listings Tab -->
                <div v-if="activeTab === 'listings'" class="provider-content">
                    <div class="p-section">
                        <div class="p-section-header">
                            <div class="p-section-title">My Listings</div>
                            <button class="a-btn-primary" @click="showModal = true">+ Add Listing</button>
                        </div>
                        <div class="p-listing">
                            <div class="p-listing-image"></div>
                            <div class="p-item-info">
                                <div class="p-item-name">Sokha AC Repair</div>
                                <div class="p-item-desc">📍 Toul Kork · ⭐ 4.8 · 32 reviews</div>
                            </div>
                            <button class="a-btn">Edit</button>
                        </div>
                    </div>
                </div>

                <!-- Requests Tab -->
                <div v-if="activeTab === 'requests'" class="provider-content">
                    <div class="p-section">
                        <div class="p-section-title">Incoming Requests</div>
                        <div class="p-request">
                            <div class="p-item-info">
                                <div class="p-item-name">Dara K. · 📍 Toul Kork</div>
                                <div class="p-item-desc">Need AC repair at home urgently</div>
                                <div class="p-item-time">2 hours ago</div>
                            </div>
                            <div class="p-request-btns">
                                <button class="a-btn-primary">Accept</button>
                                <button class="a-btn">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reviews Tab -->
                <div v-if="activeTab === 'reviews'" class="provider-content">
                    <div class="p-section">
                        <div class="p-section-title">Customer Reviews</div>
                        <div class="p-review">
                            <div class="p-review-top">
                                <div class="p-item-name">Dara K.</div>
                                <div>⭐⭐⭐⭐⭐</div>
                            </div>
                            <div class="p-item-desc">Very professional and fast. Highly recommend!</div>
                            <div class="p-item-time">2 days ago</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Add Listing Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-box">
                <div class="step-indicator">
                    <div class="step" :class="{ active: currentStep >= 1, done: currentStep > 1 }">1</div>
                    <div class="step-line"></div>
                    <div class="step" :class="{ active: currentStep >= 2, done: currentStep > 2 }">2</div>
                    <div class="step-line"></div>
                    <div class="step" :class="{ active: currentStep >= 3, done: currentStep > 3 }">3</div>
                    <div class="step-line"></div>
                    <div class="step" :class="{ active: currentStep >= 4 }">4</div>
                </div>

                <div v-if="currentStep === 1">
                    <div class="modal-title">Basic Information</div>
                    <div class="form-group">
                        <label class="label">Business / Service Name</label>
                        <input class="Input" type="text" placeholder="e.g. Sokha AC Repair"/>
                    </div>
                    <div class="form-group">
                        <label class="label">Service Category</label>
                        <select class="Input">
                            <option value="">Select Category</option>
                            <option value="ac-repair">AC & Repair</option>
                            <option value="electrical">Electrical</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="pet-care">Pet Care</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="label">Phone Number</label>
                        <input class="Input" type="text" placeholder="e.g. 012 345 678"/>
                    </div>
                </div>

                <div v-if="currentStep === 2">
                    <div class="modal-title">Location and Description</div>
                    <div class="form-group">
                        <label class="label">Address / Location</label>
                        <input class="Input" type="text" placeholder="e.g. Toul Kork, PhnomPenh"/>
                        <button class="a-btn-primary find-loc-btn" @click="findLocation">Find Location</button>
                    </div>
                    <div class="form-group">
                        <label class="label">Description</label>
                        <textarea class="Input" rows="4" placeholder="Write a brief description..."></textarea>
                    </div>
                </div>

                <div v-if="currentStep === 3">
                    <div class="modal-title">Identity Verification</div>
                    <div class="form-group">
                        <label class="label">National ID - Front</label>
                        <input class="Input" type="file" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label class="label">National ID - Back</label>
                        <input class="Input" type="file" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label class="label">Selfie With Your ID</label>
                        <input class="Input" type="file" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label class="label">Business License <span class="optional">(Optional)</span></label>
                        <input class="Input" type="file" accept="image/*">
                    </div>
                </div>

                <div v-if="currentStep === 4">
                    <div class="modal-title">Review & Submit</div>
                    <div class="p-item-desc">Please review your information before submitting. Our team will review your application and get back to you soon.</div>
                </div>

                <div class="modal-button">
                    <button v-if="currentStep > 1" class="a-btn" @click="currentStep--">Back</button>
                    <button v-if="currentStep < 4" class="a-btn-primary" @click="currentStep++">Next</button>
                    <button v-if="currentStep === 4" class="a-btn-primary">Submit</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { ref } from 'vue'

const activeTab = ref('dashboard')
const showModal = ref(false)
const currentStep = ref(1)

const tabTitle = {
    'dashboard': 'Dashboard',
    'listings': 'My Listings',
    'requests': 'Requests',
    'reviews': 'Reviews',
}

function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
        })
    } else {
        alert('Geolocation is not supported by your browser')
    }
}
</script>

<style scoped>
.provider-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.provider-main {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.provider-sidebar {
    width: 220px;
    background: #edfcfa;
    border-right: 2px solid #b2ede8;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 16px 10px;
    gap: 4px;
}

.sidebar-item {
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 20px;
    color: #22223b;
    cursor: pointer;
    transition: background 0.15s;
}

.sidebar-item:hover {
    background: #d9f7f4;
    color: #2ec4b6;
}

.sidebar-item.active {
    background: #2ec4b6;
    color: white;
    font-weight: 600;
}

.provider-body {
    flex: 1;
    overflow-y: auto;
    background: #f2f2f2;
    display: flex;
    flex-direction: column;
}

.provider-header {
    background: #f2f2f2;
    border-bottom: 3px solid #b2ede8;
    padding: 20px 40px;
}

.provider-title {
    font-size: 24px;
    font-weight: 700;
    color: #22223b;
    padding: 18px;
}

.provider-content {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 22px 36px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.stat-card {
    background: white;
    border: 2px solid #b2ede8;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-number {
    font-size: 26px;
    font-weight: 700;
    color: #2ec4b6;
}

.stat-label {
    font-size: 13px;
    color: #777;
}

.p-section {
    background: white;
    border-radius: 12px;
    border: 2px solid #b2ede8;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.p-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.p-section-title {
    font-size: 18px;
    font-weight: 700;
    color: #22223b;
    border-bottom: 2px solid #b2ede8;
    padding-bottom: 12px;
}

.p-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-radius: 10px;
    background: #f9fffe;
    border: 1px solid #b2ede8;
}

.p-item-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.p-item-name {
    font-size: 15px;
    font-weight: 600;
    color: #22223b;
}

.p-item-desc {
    font-size: 15px;
    color: #777;
    margin-top: 2px;
    line-height: 1.5;
}

.p-item-time {
    font-size: 12px;
    color: #aaa;
    flex-shrink: 0;
}

.p-listing {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px;
    border-radius: 10px;
    background: #f9fffe;
    border: 1px solid #b2ede8;
}

.p-listing-image {
    width: 70px;
    height: 70px;
    border-radius: 10px;
    background: #b2ede8;
    flex-shrink: 0;
}

.p-request {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-radius: 10px;
    background: #f9fffe;
    border: 1px solid #b2ede8;
    gap: 16px;
}

.p-request-btns {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.p-review {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px;
    border-radius: 10px;
    background: #f9fffe;
    border: 1px solid #b2ede8;
}

.p-review-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
}

.modal-box {
    background: white;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 520px;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
}

.step {
    width: 30px;
    height: 32px;
    border-radius: 50%;
    background: #e0e0e0;
    color: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
}

.step.active { background: #2ec4b6; color: white; }
.step.done { background: #2ec4b6; color: white; }

.step-line {
    flex: 1;
    height: 2px;
    background: #e0e0e0;
    max-width: 60px;
}

.modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #22223b;
    margin-bottom: 12px;
}

.modal-button {
    display: flex;
    gap: 10px;
    margin-top: 8px;
}

.find-loc-btn {
    margin-top: 4px;
    margin-bottom: 15px;
}

.optional {
    font-size: 12px;
    color: #aaa;
    font-weight: 400;
}

/* Dark Mode */
body.dark-mode .provider-sidebar { background: var(--bg-sidebar); border-color: var(--border); }
body.dark-mode .sidebar-item { color: var(--text-primary); }
body.dark-mode .sidebar-item:hover { background: #1f3f3c; color: #2ec4b6; }
body.dark-mode .sidebar-item.active { background: #498f88; color: white; }
body.dark-mode .provider-body { background: var(--bg-page); }
body.dark-mode .provider-header { background: var(--bg-page); border-color: var(--border); }
body.dark-mode .provider-title { color: var(--text-primary); }
body.dark-mode .stat-card { background: var(--bg-card); border-color: var(--border); }
body.dark-mode .stat-label { color: var(--text-secondary); }
body.dark-mode .p-section { background: var(--bg-card); border-color: var(--border); }
body.dark-mode .p-section-title { color: var(--text-primary); border-color: var(--border); }
body.dark-mode .p-item { background: var(--bg-input); border-color: var(--border); }
body.dark-mode .p-item-name { color: var(--text-primary); }
body.dark-mode .p-item-desc { color: var(--text-secondary); }
body.dark-mode .p-listing { background: var(--bg-input); border-color: var(--border); }
body.dark-mode .p-request { background: var(--bg-input); border-color: var(--border); }
body.dark-mode .p-review { background: var(--bg-input); border-color: var(--border); }
body.dark-mode .modal-box { background: var(--bg-card); }
body.dark-mode .modal-title { color: var(--text-primary); }
body.dark-mode .step { background: #1f3f3c; color: var(--text-secondary); }
body.dark-mode .step-line { background: #1f3f3c; }
</style>
