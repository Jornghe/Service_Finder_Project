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

                    <div class="service-strip" v-for="service in myServices" :key="service.id">
                        <div class="strip-head">
                            <div class="strip-name-row">
                                <div class="svc-dot"></div>
                                <div class="svc-name">{{ service.name }}</div>
                                <div class="cat-badge">{{ service.category }}</div>
                            </div>
                            <div class="status-badge">
                                <div class="status-dot"></div>
                                Active
                            </div>
                        </div>
                        <div class="strip-stats">
                            <div class="stat-col">
                                <div class="stat-val">{{ service.avg_rating || 0 }} <span class="stat-unit">★</span></div>
                                <div class="stat-lbl">Rating</div>
                            </div>
                            <div class="stat-col">
                                <div class="stat-val">{{ service.review_count || 0 }}</div>
                                <div class="stat-lbl">Reviews</div>
                            </div>
                            <div class="stat-col">
                                <div class="stat-val">{{ myResponses.length }}</div>
                                <div class="stat-lbl">Responses</div>
                            </div>
                            <div class="stat-col">
                                <div class="stat-val">{{ openRequests.length }} <span class="stat-unit">open</span></div>
                                <div class="stat-lbl">Requests</div>
                            </div>
                        </div>
                    </div>

                    <div class="p-section">
                        <div class="p-section-title">Recent Requests</div>
                        <div class="p-item" v-for="req in openRequests.slice(0,3)" :key="req.id">
                            <div class="p-item-info">
                                <div class="p-item-name">{{ req.location_name }}</div>
                                <div class="p-item-desc">{{ req.description }}</div>
                            </div>
                            <div class="p-item-time">{{ new Date(req.created_at).toLocaleDateString() }}</div>
                        </div>
                    </div>

                </div>

                <!-- Listings Tab -->
                <div v-if="activeTab === 'listings'" class="provider-content">
                    <div class="p-section">
                        <div class="p-section-header">
                            <div class="p-section-title">My Listings</div>
                            <button class="a-btn-primary" @click="editingId = null; form = { name: '', category: '', phone: '', address: '', description: '', latitude: null, longitude: null }; currentStep = 1; mapVisible = false; mapInstance = null; marker = null; showModal = true">+ Add Listing</button>
                        </div>
                        <div class="p-listing" v-for="service in myServices" :key="service.id">
                            <div class="p-listing-image">
                                <img v-if="service.photo_url" :src="service.photo_url" style="width:100%; height:100%; object-fit:cover; border-radius:10px;"/>
                            </div>
                            <div class="p-item-info">
                                <div class="p-item-name">{{ service.name }}</div>
                                <div class="p-item-desc">📍 {{ service.address}} · ⭐ {{ service.avg_rating }} · {{ service.review_count }} reviews</div>
                            </div>
                            <button class="a-btn" @click="openEdit(service)">Edit</button>
                            <button class="a-btn" @click="verifyingServiceId = service.id; showVerifyModal = true">Verify</button>
                            <button class="a-btn-danger" @click="deleteService(service.id)">Delete</button>
                        </div>
                    </div>
                </div>

                <!-- Requests Tab -->
                <div v-if="activeTab === 'requests'" class="provider-content">
                    <div class="p-section">
                        <div class="p-section-title">Response History</div>
                        <div v-if="myResponses.length === 0" class="p-item-desc">You have not responded to any requests yet.</div>
                        <div class="p-request" v-for="resp in myResponses" :key="resp.id">
                            <div class="p-item-info">
                                <div class="p-item-name">{{ resp.service_requests?.title }}</div>
                                <div class="p-item-desc">{{ resp.message }}</div>
                                <div class="p-item-time">{{ new Date(resp.created_at).toLocaleDateString() }}</div>
                            </div>
                            <div class="resp-status-badge" :class="resp.service_requests?.status">
                                {{ resp.service_requests?.status }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reviews Tab -->
                <div v-if="activeTab === 'reviews'" class="provider-content">
                    <div class="p-section" v-for="service in myServices" :key="service.id">
                        <div class="p-section-title">{{ service.name }}</div>
                       <div v-if="!reviewsByService[service.id]?.length" class="p-item-desc">No reviews yet.</div>
                       <div v-for="review in (expandedServices[service.id] ? reviewsByService[service.id] : reviewsByService[service.id]?.slice(0,3))" :key="review.id">
                        <div class="p-review">
                            <div class="p-review-top">
                                <div class="p-item-name">{{ review.users?.name }}</div>
                               <vue3-star-ratings :model-value="Number(review.rating)" :star-size="14" :disable-click="true" star-color="#F39C12" inactive-color="#e0e0e0"/>
                            </div>
                            <div class="p-item-desc">{{ review.comment }}</div>
                            <div class="p-item-time">{{ new Date(review.created_at).toLocaleDateString() }}</div>
                        </div>
                       </div>
                       <button v-if="reviewsByService[service.id]?.length > 3" class="a-btn" style="margin-top: 8px; font-size: 13px;" @click="toggleExpanded(service.id)">
                            {{ expandedServices[service.id] ? 'Show Less' : `Show More(${reviewsByService[service.id]?.length})` }}
                        </button>
                </div>
                </div>

            </div>
        </div>

        <!-- Add Listing Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false; editingId = null; currentStep = 1; mapVisible = false; if(mapInstance){ mapInstance.remove(); mapInstance = null; marker = null; }">
            <div class="modal-box">
                <div class="step-indicator">
                    <div class="step" :class="{ active: currentStep >= 1, done: currentStep > 1 }">1</div>
                    <div class="step-line"></div>
                    <div class="step" :class="{ active: currentStep >= 2, done: currentStep > 2 }">2</div>
                    <div class="step-line"></div>
                    <div class="step" :class="{ active: currentStep >= 3 }">3</div>
                </div>

                <div v-if="currentStep === 1">
                    <div class="modal-title">Basic Information</div>
                    <div class="form-group">
                        <label class="label">Service Photo <span class="optional">(Optional)</span></label>
                        <input class="Input" type="file" accept="image/*" @change="handlePhotoUpload"/>
                        <img v-if="photoPreview" :src="photoPreview" style="margin-top:8px; width:100%; height:160px; object-fit:cover; border-radius:10px;"/>
                    </div>
                    <div class="form-group">
                        <label class="label">Business / Service Name</label>
                        <input class="Input" type="text" placeholder="e.g. Sokha AC Repair" v-model="form.name"/>
                    </div>
                    <div class="form-group">
                        <label class="label">Service Category</label>
                        <select class="Input" v-model="categorySelection">
                            <option value="">Select Category</option>
                            <option v-for="cat in availableCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                            <option value="__other__">Other (type your own)</option>
                        </select>
                        <input v-if="categorySelection === '__other__'" class="Input" style="margin-top: 8px;" type="text" placeholder="Type your category..." v-model="form.category"/>
                    </div>
                    <div class="form-group">
                        <label class="label">Phone Number</label>
                        <input class="Input" type="text" placeholder="e.g. 012 345 678" v-model="form.phone"/>
                    </div>
                    <div class="form-group">
                        <label class="label">Price Range ($)</label>
                        <div style="display: flex; gap: 10px;">
                            <input class="Input" type="number" placeholder="Min" v-model="form.price_min"/>
                            <input class="Input" type="number" placeholder="Max" v-model="form.price_max"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="label">Provider Type</label>
                        <select class="Input" v-model="form.provider_type">
                            <option value="freelancer">Freelancer (I travel to the customer)</option>
                            <option value="shop">Shop / Business next</option>
                        </select>
                    </div>
                    <div class="form-group" v-if="form.provider_type === 'freelancer'">
                        <label class="label">Service Range (km)</label>
                        <select class="Input" v-model="form.service_range_km">
                            <option :value="5">5 km</option>
                            <option :value="10">10 km</option>
                            <option :value="15">15 km</option>
                            <option :value="20">20 km</option>
                            <option :value="30">30 km</option>
                            <option :value="50">50 km</option>
                        </select>
                    </div>
                </div>

                <div v-if="currentStep === 2">
                    <div class="modal-title">Location and Description</div>
                    <div class="form-group">
                        <label class="label">Address / Location</label>
                        <input class="Input" type="text" placeholder="Pin a location on the map below" v-model="form.address" readonly/>
                        <button class="a-btn-primary find-loc-btn" @click="openMap">📍 Get Location</button>
                        <div id="listing-map" class="listing-map" v-show="mapVisible"></div>
                    </div>
                    <div class="form-group">
                        <label class="label">Description</label>
                        <textarea class="Input" rows="4" placeholder="Write a brief description..." v-model="form.description"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="label">Working Hours</label>
                        <div v-for="day in workingHours" :key="day.day" class="wh-row">
                            <div class="wh-day">{{ day.day.charAt(0).toUpperCase() + day.day.slice(1) }}</div>
                            <label class="wh-toggle">
                                <input type="checkbox" v-model="day.is_open"/>
                                <span>{{ day.is_open ? 'Open' : 'Closed' }}</span>
                            </label>
                            <template v-if="day.is_open">
                                <input class="Input wh-time" type="time" v-model="day.open_time"/>
                                <span>to</span>
                                <input class="Input wh-time" type="time" v-model="day.close_time"/>
                            </template>
                        </div>
                    </div>
                </div>

                <div v-if="currentStep === 3">
                    <div class="modal-title">Review & Submit</div>
                    <div class="p-item-desc">Please review your information before submitting. You can submit verification documents separately after your listing is created.</div>
                </div>

                <div class="modal-button">
                    <button v-if="currentStep > 1" class="a-btn" @click="currentStep--">Back</button>
                    <button v-if="currentStep < 3" class="a-btn-primary" @click="currentStep++">Next</button>
                    <button v-if="currentStep === 3" class="a-btn-primary" @click="submitListing">Submit</button>
                </div>
            </div>
        </div>

        <!-- Verify Modal -->
        <div v-if="showVerifyModal" class="modal-overlay" @click.self="showVerifyModal = false; verifyingServiceId = null">
            <div class="modal-box">
                <div class="modal-title">Submit Verification Documents</div>
                <div class="form-group">
                    <label class="label">National ID - Front</label>
                    <input class="Input" type="file" accept="image/*" @change="e => vIdFrontFile = e.target.files[0]">
                </div>
                <div class="form-group">
                    <label class="label">National ID - Back</label>
                    <input class="Input" type="file" accept="image/*" @change="e => vIdBackFile = e.target.files[0]">
                </div>
                <div class="form-group">
                    <label class="label">Selfie With Your ID</label>
                    <input class="Input" type="file" accept="image/*" @change="e => vSelfieFile = e.target.files[0]">
                </div>
                <div class="form-group">
                    <label class="label">Business License <span class="optional">(Optional)</span></label>
                    <input class="Input" type="file" accept="image/*" @change="e => vLicenseFile = e.target.files[0]">
                </div>
                <div class="modal-button">
                    <button class="a-btn" @click="showVerifyModal = false; verifyingServiceId = null">Cancel</button>
                    <button class="a-btn-primary" @click="submitVerification">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import Vue3StarRatings from 'vue3-star-ratings'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const user = JSON .parse(localStorage.getItem('user') || '{}') 
const myServices = ref([])
const myResponses = ref([])
const reviewsByService = ref({})
const openRequests = ref([])
const activeTab = ref('dashboard')
const showModal = ref(false)
const currentStep = ref(1)
const expandedServices = ref({})
const editingId = ref(null)
const form = ref({ name: '', category: '', phone: '', address: '', description: '', latitude: null, longitude: null, photo_url: null, price_min: 0, price_max: 0, provider_type: 'freelancer', service_range_km: 10 })
const workingHours = ref([
    { day: 'monday', is_open: true, open_time: '00:00', close_time: '23:00' },
    { day: 'tuesday', is_open: true, open_time: '00:00', close_time: '23:00' },
    { day: 'wednesday', is_open: true, open_time: '00:00', close_time: '23:00' },
    { day: 'thursday', is_open: true, open_time: '00:00', close_time: '23:00' },
    { day: 'friday', is_open: true, open_time: '00:00', close_time: '23:00' },
    { day: 'saturday', is_open: false, open_time: '00:00', close_time: '23:00' },
    { day: 'sunday', is_open: false, open_time: '00:00', close_time: '23:00' },
])
const mapVisible = ref(false)
let mapInstance = null
let marker = null
const photoFile = ref(null)
const photoPreview = ref(null)

const showVerifyModal = ref(false)
const verifyingServiceId = ref(null)
const vIdFrontFile = ref(null)
const vIdBackFile = ref(null)
const vSelfieFile = ref(null)
const vLicenseFile = ref(null)

const availableCategories = ref([])
const categorySelection = ref('')

watch(categorySelection, (val) => {
    if (val !== '__other__') form.value.category = val
    else form.value.category = ''
})

async function fetchCategories() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/all`)
    const data = await res.json()
    availableCategories.value = Array.isArray(data) ? data : []
}

const tabTitle = {
    'dashboard': 'Dashboard',
    'listings': 'My Listings',
    'requests': 'Requests',
    'reviews': 'Reviews',
}

async function openMap() {
    if (mapInstance) { mapInstance.remove(); mapInstance = null; marker = null }
    form.value.address = 'Getting your location...'
    mapVisible.value = true
    await nextTick()

    mapInstance = L.map('listing-map').setView([11.5564, 104.9282], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance)
    marker = L.marker([11.5564, 104.9282]).addTo(mapInstance)

    navigator.geolocation?.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        mapInstance.setView([lat, lng], 16)
        marker.setLatLng([lat, lng])
        form.value.latitude = lat
        form.value.longitude = lng
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        form.value.address = data.display_name || `${lat}, ${lng}`
    }, () => {
        form.value.address = ''
    })

    mapInstance.on('dblclick', async (e) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        form.value.latitude = lat
        form.value.longitude = lng
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        form.value.address = data.display_name || `${lat}, ${lng}`
    })
}

function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    photoFile.value = file
    photoPreview.value = URL.createObjectURL(file)
}

async function uploadVerificationDoc(file, documentType) {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user.id)
    formData.append('documentType', documentType)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verifications/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.url
}

function openEdit(service) {
    editingId.value = service.id
    form.value = {
        name: service.name,
        category: service.category,
        phone: service.phone,
        address: service.address,
        description: service.description,
        latitude: service.latitude,
        longitude: service.longitude,
        photo_url: service.photo_url || null,
    }
    photoFile.value = null
    photoPreview.value = service.photo_url || null
    currentStep.value = 1
    showModal.value = true
}

async function submitListing() {
    const { name, category, phone, address, description, latitude, longitude, price_min, price_max, provider_type, service_range_km } = form.value

    const token = localStorage.getItem('token')
    let photo_url = form.value.photo_url || null
    if (photoFile.value) {
        const formData = new FormData()
        formData.append('photo', photoFile.value)
        formData.append('userId', user.id)
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/services/upload-photo`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })
        if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            photo_url = uploadData.photo_url
        }
    }

    if (editingId.value) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${editingId.value}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name, category, phone, address, description, latitude, longitude, photo_url, price_min, price_max, provider_type, service_range_km: provider_type === 'freelancer' ? service_range_km : null })
        })
        if (!res.ok) { alert('Failed to update service'); return }
    } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ user_id: user.id, name, category, phone, address, description, latitude, longitude, photo_url, price_min, price_max, provider_type, service_range_km: provider_type === 'freelancer' ? service_range_km : null })
        })
        if (!res.ok) { alert('Failed to create service'); return }
        const createdService = await res.json()

        for (const wh of workingHours.value) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/working-hours`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ service_id: createdService.id, day: wh.day, is_open: wh.is_open, open_time: wh.open_time, close_time: wh.close_time })
            })
        }
    }
    showModal.value = false
    editingId.value = null
    form.value = { name: '', category: '', phone: '', address: '', description: '', latitude: null, longitude: null, photo_url: null, price_min: 0, price_max: 0, provider_type: 'freelancer', service_range_km: 10 }
    workingHours.value = [
        { day: 'monday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'tuesday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'wednesday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'thursday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'friday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'saturday', is_open: false, open_time: '08:00', close_time: '18:00' },
        { day: 'sunday', is_open: false, open_time: '08:00', close_time: '18:00' },
    ]
    photoFile.value = null
    photoPreview.value = null
    categorySelection.value = ''
    currentStep.value = 1
    mapVisible.value = false
    if (mapInstance) { mapInstance.remove(); mapInstance = null; marker = null }
    await fetchMyServices()
}

async function fetchMyServices(){
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/user/${user.id}`)
    myServices.value = await res.json()
}

async function fetchMyResponses(){
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/responses/provider/${user.id}`)
    myResponses.value = await res.json()
}

async function fetchReviews(){
    if(!myServices.value.length) return
    for(const service of myServices.value){
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${service.id}`)
        reviewsByService.value[service.id] = await res.json()
    }
}


async function fetchOpenRequests(){
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/requests`)
    openRequests.value = await res.json()
}

onMounted(async () => {
    await fetchMyServices()
    await fetchMyResponses()
    await fetchReviews()
    await fetchOpenRequests()
    await fetchCategories()
})

async function submitVerification() {
    const checkRes = await fetch(`${import.meta.env.VITE_API_URL}/api/verifications/check/${verifyingServiceId.value}`)
    const checkData = await checkRes.json()
    if (checkData.hasPending) {
        alert('You already have a pending verification for this service. Please wait for the admin to review it before submitting again.')
        showVerifyModal.value = false
        verifyingServiceId.value = null
        return
    }

    const docs = [
        { file: vIdFrontFile.value, type: 'id_front' },
        { file: vIdBackFile.value, type: 'id_back' },
        { file: vSelfieFile.value, type: 'selfie' },
        { file: vLicenseFile.value, type: 'business_license' },
    ]
    for (const doc of docs) {
        if (!doc.file) continue
        const url = await uploadVerificationDoc(doc.file, doc.type)
        if (!url) continue
        const token = localStorage.getItem('token')
        await fetch(`${import.meta.env.VITE_API_URL}/api/verifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ service_id: verifyingServiceId.value, provider_id: user.id, document_type: doc.type, document_url: url })
        })
    }
    showVerifyModal.value = false
    verifyingServiceId.value = null
    vIdFrontFile.value = null
    vIdBackFile.value = null
    vSelfieFile.value = null
    vLicenseFile.value = null
    alert('Verification documents submitted successfully!')
}

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service? This cannot be undone.')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) { alert('Failed to delete service'); return }
    await fetchMyServices()
}

function toggleExpanded(serviceId){
    expandedServices.value = { ...expandedServices.value, [serviceId]: !expandedServices.value[serviceId] }
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

/* Strip card */
.service-strip {
    background: white;
    border: 1px solid #b2ede8;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    transition: box-shadow 0.2s, transform 0.15s;
}
.service-strip:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}
.strip-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 22px 13px;
    border-bottom: 1px solid #b2ede8;
    gap: 12px;
    flex-wrap: wrap;
}
.strip-name-row {
    display: flex;
    align-items: center;
    gap: 10px;
}
.svc-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #2ec4b6;
    flex-shrink: 0;
}
.svc-name {
    font-size: 15px;
    font-weight: 700;
    color: #22223b;
}
.cat-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    background: #d9f7f4;
    color: #1a8a83;
    text-transform: capitalize;
}
.status-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 11px;
    border-radius: 20px;
    background: #d9f7f4;
    color: #1a8a83;
}
.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #1a8a83;
}
.strip-stats {
    display: flex;
    padding: 15px 22px;
}
.stat-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding-right: 20px;
}
.stat-col + .stat-col {
    padding-left: 20px;
    border-left: 1px solid #b2ede8;
}
.stat-val {
    font-size: 21px;
    font-weight: 700;
    color: #22223b;
    display: flex;
    align-items: baseline;
    gap: 4px;
    font-variant-numeric: tabular-nums;
}
.stat-unit {
    font-size: 12px;
    font-weight: 500;
    color: #2ec4b6;
}
.stat-lbl {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #aaa;
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

.resp-status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    flex-shrink: 0;
    text-transform: capitalize;
    background: #d9f7f4;
    color: #1a8a83;
}
.resp-status-badge.filled { background: #eaedff; color: #4B55D1; }
.resp-status-badge.closed { background: #f2f2f2; color: #888; }

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

.wh-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}
.wh-day {
    width: 100px;
    font-weight: 600;
    font-size: 14px;
    text-transform: capitalize;
}
.wh-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    cursor: pointer;
    width: 80px;
}
.wh-time {
    width: 110px;
    padding: 6px 8px;
}

.find-loc-btn {
    margin-top: 4px;
    margin-bottom: 10px;
}

.listing-map {
    width: 100%;
    height: 280px;
    border-radius: 10px;
    border: 1px solid #b2ede8;
    margin-top: 4px;
    z-index: 0;
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
body.dark-mode .service-strip { background: var(--bg-card); border-color: var(--border); }

body.dark-mode .strip-head { border-color: var(--border); }
body.dark-mode .svc-name { color: var(--text-primary); }
body.dark-mode .stat-val { color: var(--text-primary); }
body.dark-mode .stat-col + .stat-col { border-color: var(--border); }
</style>
