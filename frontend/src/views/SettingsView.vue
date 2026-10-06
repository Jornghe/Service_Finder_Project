<template>
    <div class="settings-page">
        <NavBar/>

        <div class="settings-main">

            <!-- Side Bar -->
             <div class="settings-sidebar">
                <div class="sidebar-item" :class="{ active: activeTab === 'account'}" @click="activeTab = 'account'"> Account </div>
                <div class="sidebar-item" :class="{ active: activeTab === 'notification'}" @click="activeTab = 'notification'"> Notification </div>
                <div class="sidebar-item" :class="{ active: activeTab === 'privacy'}" @click="activeTab = 'privacy'"> Privacy </div>
                <div class="sidebar-item" :class="{ active: activeTab === 'become-provider'}" @click="activeTab = 'become-provider'"> {{ isProvider ? 'My Services' : 'Become a Provider'}} </div>

                <div class="sidebar-space"></div>

                <div class="sidebar-item danger" :class="{ active: activeTab === 'delete-account'}" @click="activeTab = 'delete-account'"> Delete Account </div>
                <div class="sidebar-divider"></div>
                <div class="sidebar-item danger" @click="signOut"> Sign Out </div>

             </div>

             <!-- Content -->
              <div class="settings-body">
                <div class="settings-header">
                    <div class="settings-title">{{ tabTitle[activeTab] }}</div>
                </div>

                <div v-if="activeTab === 'account'" class="settings-content">
                    <div class="settings-section">
                        <div class="settings-section-title">Profile Information</div>

                        <div class="form-group">
                            <label class="label">Full Name</label>
                            <input class="Input" type="text" v-model="editName" :placeholder="user.name || 'Full Name'"/>
                        </div>

                        <div class="form-group">
                            <label class="label">Email Address</label>
                            <input class="Input" type="email" v-model="editEmail" :placeholder="user.email || 'Email Address'"/>
                        </div>

                        <div class="form-group">
                            <label class="label">Phone</label>
                            <input class="Input" type="text" v-model="editPhone" :placeholder="user.phone || 'Phone Number'"/>
                        </div>

                        <button class="a-btn-primary" @click="saveProfile">Save Change</button>

                    </div>

                    <div class="settings-section">
                        <div class="settings-section-title">{{ isGoogleAccount ? 'Set Password' : 'Change Password' }}</div>

                        <div v-if="passwordError" class="form-error">⚠️ {{ passwordError }}</div>
                        <div v-if="passwordSuccess" class="form-success">✓ {{ passwordSuccess }}</div>

                        <div v-if="!isGoogleAccount" class="form-group">
                            <label class="label">Current Password</label>
                            <input class="Input" type="password" v-model="currentPassword" placeholder="........"/>
                        </div>

                        <div v-if="isGoogleAccount" class="google-password-hint">
                            Your account uses Google Sign-In. Set a password to also log in with email and password.
                        </div>

                        <div class="form-group">
                            <label class="label">New Password</label>
                            <input class="Input" type="password" v-model="newPassword" placeholder="........"/>
                        </div>

                        <div class="form-group">
                            <label class="label">Confirm New Password</label>
                            <input class="Input" type="password" v-model="confirmPassword" placeholder="........"/>
                        </div>

                        <button class="a-btn-primary" @click="isGoogleAccount ? setPassword() : changePassword()">
                            {{ isGoogleAccount ? 'Set Password' : 'Update Password' }}
                        </button>

                    </div>
                </div>

                <!-- Notification Settings -->
                <div v-if="activeTab === 'notification'" class="settings-content">
                    <div class="settings-section">

                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">Email Notifications</div>
                                <div class="toggle-desc">Receive updates and alerts via email</div>
                            </div>
                            <div class="ios-toggle" :class="{active: emailNoti}" @click="emailNoti = !emailNoti">
                                <div class="ios-knob"></div>
                            </div>
                        </div>

                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">SMS Notifications</div>
                                <div class="toggle-desc">Receive updates and alerts via SMS</div>
                            </div>
                            <div class="ios-toggle" :class="{active: smsNoti}" @click="smsNoti = !smsNoti">
                                <div class="ios-knob"></div>
                            </div>
                        </div>

                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">Request Updates</div>
                                <div class="toggle-desc">Get notified when someone responds to your requests</div>
                            </div>
                            <div class="ios-toggle" :class="{active: requestUpdate}" @click="requestUpdate = !requestUpdate">
                                <div class="ios-knob"></div>
                            </div>
                        </div>

                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">Promotional Offers</div>
                                <div class="toggle-desc">Receive special offers and promotions</div>
                            </div>
                            <div class="ios-toggle" :class="{ active: promotionalOffer}" @click="promotionalOffer = !promotionalOffer">
                                <div class="ios-knob"></div>
                            </div>
                        </div>

                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">New Messages Alerts</div>
                                <div class="toggle-desc">Get notified when you receive new messages</div>
                            </div>
                            <div class="ios-toggle" :class="{ active: newMessage}" @click="newMessage = !newMessage">
                                <div class="ios-knob"></div>
                            </div>
                        </div>


                    </div>
                </div>

                <!-- Privacy Settings -->
                 <div v-if="activeTab === 'privacy'" class="settings-content">
                    <div class="settings-section">
                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">Profile Visibility</div>
                                <div class="toggle-desc">Allow other users to see your profile information</div>
                            </div>
                            <div class="ios-toggle" :class="{ active: profileVisible}" @click="profileVisible = !profileVisible">
                                <div class="ios-knob"></div>
                            </div>
                        </div>

                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">Show Phone Number</div>
                                <div class="toggle-desc">Display your phone number on your profile</div>
                            </div>
                           <div class="ios-toggle" :class="{ active: showPhone}" @click="showPhone = !showPhone">
                            <div class="ios-knob"></div>
                           </div>
                        </div>

                        <div class="toggle-row">
                            <div class="toggle-info">
                                <div class="toggle-label">Show Email Address</div>
                                <div class="toggle-desc">Display your email address on your profile</div>
                            </div>
                            <div class="ios-toggle" :class="{ active: showEmail}" @click="showEmail = !showEmail">
                                <div class="ios-knob"></div>
                            </div>
                        </div>
                    </div>
                 </div>

                 <!-- Become Provider -->
                  <div v-if= "activeTab === 'become-provider'" class="settings-content">

                    <!-- Not a provider yet -->
                    <div v-if = "!isProvider" class="settings-section provider-card">
                    <div class="settings-section provider-card">
                        <div class="provider-icon">🏪</div>
                        <div class="provider-title">Start Offering Services</div>
                        <div class="provider-desc">Join hundreds of trusted providers on ServiceFinder. Register your business and welcoming the requests from potential customers.</div>
                        <button class="a-btn-primary" @click="showProviderModal = true">Become a Provider</button>
                    </div>
                   </div>

                   <!-- Already is a Provider -->
                    <div v-else>
                        <div class="settings-section provider-card">
                            <div class="provider-icon">🏪</div>
                            <div class="provider-title">{{ myServices[0]?.name || 'My Services' }}</div>
                            <div class="provider-desc"> {{ myServices[0]?.rating || 0 }} ⭐  ·  {{ myServices[0]?.review_count || 0 }} reviews</div>
                            <div class="provider-action">
                                <button class="a-btn-primary" @click="showProviderModal = true">+ Add New Listing</button>
                                <RouterLink to="/provider" class="a-btn">Provider Daskboard</RouterLink>
                            </div>
                        </div>

                        <div class="settings-section">
                            <div class="settings-section-title">My Listing</div>
                            <div class="listing-item" v-for="service in myServices" :key="service.id">
                                <div class="listing-name">{{ service.name }}</div> 
                                <div class="listing-meta">📍 {{ service.location }} · {{ service.rating }} ⭐</div>
                            </div>
                        </div>

                    </div>


                  </div>

                  <!-- Provider Modal -->
                   <div v-if="showProviderModal" class="modal-overlay" @click.self="showProviderModal = false; currentStep = 1; mapVisible = false; if(providerMapInstance){ providerMapInstance.remove(); providerMapInstance = null; providerMarker = null; }">
                    <div class="modal-box">

                        <!-- Step Indicator -->
                         <div class="step-indicator">
                            <div class="step" :class="{ active: currentStep >= 1, done: currentStep > 1}">1</div>
                            <div class="step-line"></div>
                            <div class="step" :class="{ active: currentStep >= 2, done: currentStep > 2}">2</div>
                            <div class="step-line"></div>
                            <div class="step" :class="{ active: currentStep >= 3 }">3</div>
                         </div>

                         <!-- Step 1: Basic Info -->
                          <div v-if="currentStep === 1">
                            <div class="modal-title">Basic Information</div>
                            <div class="form-group">
                                <label class="label">Service Photo <span class="optional">(Optional)</span></label>
                                <input class="Input" type="file" accept="image/*" @change="handleProviderPhotoUpload"/>
                                <img v-if="providerPhotoPreview" :src="providerPhotoPreview" style="margin-top:8px; width:100%; height:160px; object-fit:cover; border-radius:10px;"/>
                            </div>
                            <div class="form-group">
                                <label class="label">Business / Service Name</label>
                                <input class="Input" type="text" v-model="providerForm.name" placeholder="e.g. Sokha AC Repair"/>
                            </div>
                            <div class="form-group">
                                <label class="label">Service Category</label>
                                <select class="Input" v-model="providerCategorySelection">
                                    <option value="">Select Category</option>
                                    <option v-for="cat in availableCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                                    <option value="__other__">Other (type your own)</option>
                                </select>
                                <input v-if="providerCategorySelection === '__other__'" class="Input" style="margin-top: 8px;" type="text" placeholder="Type your category..." v-model="providerForm.category"/>
                            </div>
                            <div class="form-group">
                                <label class="label">Phone Number</label>
                                <input class="Input" type="text" v-model="providerForm.phone" placeholder="e.g. 012 345 678"/>
                            </div>
                            <div class="form-group">
                                <label class="label">Price Range ($)</label>
                                <div style="display: flex; gap: 10px;">
                                    <input class="Input" type="number" placeholder="Min" v-model="providerForm.price_min"/>
                                    <input class="Input" type="number" placeholder="Max" v-model="providerForm.price_max"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="label">Provider Type</label>
                                <select class="Input" v-model="providerForm.provider_type">
                                    <option value="freelancer">Freelancer (I travel to the customer)</option>
                                    <option value="shop">Shop / Business</option>
                                </select>
                            </div>
                            <div class="form-group" v-if="providerForm.provider_type === 'freelancer'">
                                <label class="label">Service Range (km)</label>
                                <select class="Input" v-model="providerForm.service_range_km">
                                    <option :value="5">5 km</option>
                                    <option :value="10">10 km</option>
                                    <option :value="15">15 km</option>
                                    <option :value="20">20 km</option>
                                    <option :value="30">30 km</option>
                                    <option :value="50">50 km</option>
                                </select>
                            </div>
                          </div>

                          <!-- Step 2: Location & Description & Working Hours -->
                           <div v-if="currentStep === 2">
                            <div class="modal-title">Location and Description</div>
                            <div class="form-group">
                                <label class="label">Address / Location</label>
                                <input class="Input" type="text" placeholder="Pin a location on the map below" v-model="providerForm.address" readonly/>
                                <button class="a-btn-primary find-loc-btn" @click="openProviderMap">📍 Get Location</button>
                                <div id="provider-modal-map" class="listing-map" v-show="mapVisible"></div>
                            </div>
                            <div class="form-group">
                                <label class="label">Description</label>
                                <textarea class="Input" rows="4" placeholder="Write a brief description about your service..." v-model="providerForm.description"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="label">Working Hours</label>
                                <div v-for="day in providerWorkingHours" :key="day.day" class="wh-row">
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

                            <!-- Step 3: Review and Submit -->
                             <div v-if="currentStep === 3">
                                <div class="modal-title">Review & Submit</div>
                                <div class="review-desc">Please review your information before submitting. You can submit verification documents separately after your listing is created.</div>
                             </div>

                             <!-- Modal Button-->
                              <div class="modal-button">
                                <button v-if="currentStep > 1"  class="a-btn" @click="currentStep--">Back</button>
                                <button v-if="currentStep < 3" class="a-btn-primary" @click="currentStep++">Next</button>
                                <button v-if="currentStep === 3" class="a-btn-primary" @click="submitProvider" :disabled="submitting">
                                    {{ submitting ? 'Submitting...' : 'Submit' }}
                                </button>
                              </div>

                    </div>
                  </div>

                              <!-- Delete Account -->
                               <div v-if="activeTab==='delete-account'" class="settings-content">
                                <div class="settings-section">
                                    <div class="delete-warning">
                                        ⚠️ Warning: This action is permanent and cannot be undone. All your data including profile, requests, favorites and chat history will be permanently deleted.
                                    </div>

                                    <div v-if="isGoogleAccount" class="google-password-hint">
                                        You signed in with Google. Please set a password in Account Settings before deleting your account.
                                    </div>

                                    <div class="form-group">
                                        <label class="label">Enter your password to confirm deletion</label>
                                        <input class="Input" type="password" v-model="deletePassword" placeholder="Password"/>
                                    </div>

                                    <button class="a-btn-delete" @click="deleteAccount">Delete My Account</button>
                                </div>
                               </div>


                
              </div>
        </div>
    </div>
  
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const user= JSON.parse(localStorage.getItem('user') || '{}')
const editName = ref(user.name ||'')
const editEmail = ref(user.email ||'')
const editPhone = ref(user.phone ||'')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const deletePassword = ref('')
const isGoogleAccount = ref(false)
const submitting = ref(false)
const providerForm = ref({ name: '', category: '', phone: '', address: '', description: '', latitude: null, longitude: null, photo_url: null, price_min: 0, price_max: 0, provider_type: 'freelancer', service_range_km: 10 })
const providerWorkingHours = ref([
    { day: 'monday', is_open: true, open_time: '08:00', close_time: '18:00' },
    { day: 'tuesday', is_open: true, open_time: '08:00', close_time: '18:00' },
    { day: 'wednesday', is_open: true, open_time: '08:00', close_time: '18:00' },
    { day: 'thursday', is_open: true, open_time: '08:00', close_time: '18:00' },
    { day: 'friday', is_open: true, open_time: '08:00', close_time: '18:00' },
    { day: 'saturday', is_open: false, open_time: '08:00', close_time: '18:00' },
    { day: 'sunday', is_open: false, open_time: '08:00', close_time: '18:00' },
])
const mapVisible = ref(false)
let providerMapInstance = null
let providerMarker = null
const providerPhotoFile = ref(null)
const providerPhotoPreview = ref(null)
const providerCategorySelection = ref('')

watch(providerCategorySelection, (val) => {
    if (val !== '__other__') providerForm.value.category = val
    else providerForm.value.category = ''
})
const myServices = ref([])
const availableCategories = ref([])
const router = useRouter();
const activeTab = ref('account');

const tabTitle ={
    'account': 'Account Settings',
    'notification': 'Notification Settings',
    'privacy': 'Privacy Settings',
    'become-provider': 'Become a Provider',
    'delete-account': 'Delete Account'
}

async function signOut(){
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    router.push('/login');
}

const showProviderModal = ref(false);
const currentStep = ref(1);

async function openProviderMap() {
    if (providerMapInstance) { providerMapInstance.remove(); providerMapInstance = null; providerMarker = null }
    providerForm.value.address = 'Getting your location...'
    mapVisible.value = true
    await nextTick()

    providerMapInstance = L.map('provider-modal-map').setView([11.5564, 104.9282], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(providerMapInstance)
    providerMarker = L.marker([11.5564, 104.9282]).addTo(providerMapInstance)

    navigator.geolocation?.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        providerMapInstance.setView([lat, lng], 16)
        providerMarker.setLatLng([lat, lng])
        providerForm.value.latitude = lat
        providerForm.value.longitude = lng
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        providerForm.value.address = data.display_name || `${lat}, ${lng}`
    }, () => {
        providerForm.value.address = ''
    })

    providerMapInstance.on('dblclick', async (e) => {
        const { lat, lng } = e.latlng
        providerMarker.setLatLng([lat, lng])
        providerForm.value.latitude = lat
        providerForm.value.longitude = lng
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        providerForm.value.address = data.display_name || `${lat}, ${lng}`
    })
}

function handleProviderPhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    providerPhotoFile.value = file
    providerPhotoPreview.value = URL.createObjectURL(file)
}

// Notification //
const emailNoti = ref(true)
const smsNoti= ref(true)
const requestUpdate=ref(false)
const promotionalOffer=ref(false)
const newMessage=ref(true)


// Privacy // 
const profileVisible = ref(true)
const showPhone = ref(false)
const showEmail = ref(false)

//Provider//
const isProvider = ref(user.is_provider || false)




async function fetchMyServices(){
    if(!user.id)return
    const res = await fetch(`http://localhost:3000/api/services/user/${user.id}`)
    const data = await res.json()
    myServices.value = data
}

async function fetchCategories(){
    const res = await fetch('http://localhost:3000/api/categories/all')
    const data = await res.json()
    availableCategories.value = Array.isArray(data) ? data : []
}

onMounted(async () => {
    if(isProvider.value) fetchMyServices()
    fetchCategories()
    if(user.id) {
        const res = await fetch(`http://localhost:3000/api/auth/password-type/${user.id}`)
        const data = await res.json()
        isGoogleAccount.value = data.isGoogleOAuth
    }
})

async function submitProvider(){
    submitting.value = true
    const { name, category, phone, address, description, latitude, longitude, price_min, price_max, provider_type, service_range_km } = providerForm.value

    let photo_url = null
    if (providerPhotoFile.value) {
        const formData = new FormData()
        formData.append('photo', providerPhotoFile.value)
        formData.append('userId', user.id)
        const uploadRes = await fetch('http://localhost:3000/api/services/upload-photo', { method: 'POST', body: formData })
        if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            photo_url = uploadData.photo_url
        }
    }

    const res = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, name, category, phone, address, description, latitude: latitude || 0, longitude: longitude || 0, photo_url, price_min, price_max, provider_type, service_range_km: provider_type === 'freelancer' ? service_range_km : null })
    })
    if (res.ok) {
        const createdService = await res.json()
        for (const wh of providerWorkingHours.value) {
            await fetch('http://localhost:3000/api/working-hours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service_id: createdService.id, day: wh.day, is_open: wh.is_open, open_time: wh.open_time, close_time: wh.close_time })
            })
        }
    }

    await fetch(`http://localhost:3000/api/auth/set-provider/${user.id}`, { method: 'PATCH' })
    user.is_provider = true
    localStorage.setItem('user', JSON.stringify(user))

    providerForm.value = { name: '', category: '', phone: '', address: '', description: '', latitude: null, longitude: null, photo_url: null, price_min: 0, price_max: 0, provider_type: 'freelancer', service_range_km: 10 }
    providerWorkingHours.value = [
        { day: 'monday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'tuesday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'wednesday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'thursday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'friday', is_open: true, open_time: '08:00', close_time: '18:00' },
        { day: 'saturday', is_open: false, open_time: '08:00', close_time: '18:00' },
        { day: 'sunday', is_open: false, open_time: '08:00', close_time: '18:00' },
    ]
    providerPhotoFile.value = null
    providerPhotoPreview.value = null
    providerCategorySelection.value = ''
    mapVisible.value = false
    if (providerMapInstance) { providerMapInstance.remove(); providerMapInstance = null; providerMarker = null }
    submitting.value = false
    showProviderModal.value = false
    currentStep.value = 1
    isProvider.value = true
    await fetchMyServices()
}

async function saveProfile(){
    await fetch(`http://localhost:3000/api/auth/update/${user.id}`,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: editName.value,
            email: editEmail.value,
            phone: editPhone.value
        })
    })
    user.name = editName.value
    user.email = editEmail.value
    user.phone = editPhone.value
    localStorage.setItem('user', JSON.stringify(user))
}


async function setPassword(){
    if(!newPassword.value || !confirmPassword.value) { passwordError.value = 'Please fill in all fields'; return }
    if(newPassword.value !== confirmPassword.value) { passwordError.value = 'Passwords do not match'; return }
    passwordError.value = ''
    passwordSuccess.value = ''
    const res = await fetch(`http://localhost:3000/api/auth/set-password/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPassword.value })
    })
    const data = await res.json()
    if (!res.ok) { passwordError.value = data.message; return }
    isGoogleAccount.value = false
    newPassword.value = ''
    confirmPassword.value = ''
    passwordSuccess.value = 'Password set successfully!'
}

async function changePassword(){
    if(newPassword.value !== confirmPassword.value){
        passwordError.value = "New password and confirm password do not match"
        return
    }
    passwordError.value = ''
    passwordSuccess.value = ''
    const res= await fetch(`http://localhost:3000/api/auth/change-password/${user.id}`,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            currentPassword: currentPassword.value,
            newPassword: newPassword.value
        })
    })
    const data = await res.json()
    if (!res.ok){
        passwordError.value = data.message
        return
    }
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordSuccess.value = 'Password changed successfully!'
}

async function deleteAccount(){
    if(!deletePassword.value) return
    if(!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    const res = await fetch(`http://localhost:3000/api/auth/delete/${user.id}`,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ Password: deletePassword.value })
    })
    if(!res.ok) { alert('Incorrect password'); return }
    await supabase.auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
}
</script>

<style scoped>

.settings-page{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.settings-main{
    display: flex;
    flex: 1;
    overflow: hidden;
}

.settings-sidebar{
    width: 280px;
    background: #edfcfa;
    border-right: 2px solid #b2ede8;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 16px 10px;
    gap: 4px;
}

.sidebar-item{
    padding: 14px;
    border-radius: 10px;
    font-size: 20px;
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

.sidebar-item.danger{
    color: #e74c3c;
}

.sidebar-item.danger:hover{
    background: #ffe8e8;
    color: #e74c3c;
    border-radius: 25px;
}

.sidebar-item.danger.active{
    background: #e74c3c;
    color: white;
}
.settings-body{
    flex: 1;
    overflow-y: auto;
    background: #f2f2f2;
    display: flex;
    flex-direction: column;
}

.settings-header{
    background: #f2f2f2;
    border-bottom: 3px solid #b2ede8;
    padding: 20px 40px;
}

.settings-title{
    font-size: 24px;
    font-weight: 700;
    color: #22223b;
    padding: 18px;
}

.settings-content{
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 22px 36px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
}

.settings-section{
    background: white;
    border-radius: 12px;
    border: 3px solid #b2ede8;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.settings-section-title{
    font-size: 20px;
    font-weight: 700;
    color: #22223b;
    border-bottom: 3px solid #b2ede8;
    margin: -22px -22px 0 -23px;
    padding: 18px 22px 18px 23px;
}

.settings-section .Input{
    max-width:700px;
}

.settings-section .a-btn-primary{
    width: 300px;
    padding: 12px 30px;
}
.sidebar-space{
    flex: 1;
}

.sidebar-divider{
    border-top: 2px solid #b2ede8;
    margin: 4px 12px;
}

.form-group{
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
}

.form-group .label{
   padding-left: 12px;
}

.toggle-row{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-radius: 12px;
    background: #f2f2f2;
    border: 2px solid #b2ede8;
}

.toggle-label{
    font-size: 15px;
    font-weight: 600;
    color: #22223b;
}

.toggle-desc{
    font-size: 13px;
    color: #888;
    margin-top: 4px;
}

.provider-card{
    align-items: center;
    text-align: center;
    padding: 40px;
}

.provider-icon{ font-size: 48px; }

.provider-title{
    font-size:20px;
}


.provider-desc{
    font-size:15px;
    color: #777;
    max-width: 500px;
    line-height: 1.5;
}

.provider-action{
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.listing-item{
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    border-radius: 10px;
    background: #f9fffe;
    border: 1px solid #b2ede8  ;
}

.listing-name{
    font-size: 15px;
    font-weight: 600;
    color: #22223b;
}

.listing-meta{
    font-size: 13px;
    color: #777;
}

.modal-overlay{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;  
    align-items: center;
    justify-content: center;
    z-index: 1001;
}

.modal-box{
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

.step-indicator{
    display:flex;
    align-items: center;
    justify-content: center;
}

.step{
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

.step.active{
    background: #2ec4b6;
    color: white;
}

.step.done{
    background: #2ec4b6;
    color: white;
}

.step-line{
    flex: 1;
    height: 2px;
    background: #e0e0e0;
    max-width: 60px;
}

.modal-title{
    font-size: 16px;
    font-weight: 700;
    color: #22223b;
    margin-bottom: 12px;
}

.modal-button{
    display: flex;
    gap: 10px;
    margin-top: 8px;
}

.review-desc{
    font-size: 15px;
    color: #777;
    line-height: 1.5;
}

.optional{
    font-size: 12px;
    color: #aaa;
    font-weight: 400;
}

.modal-box .label{
    font-size: 14px;
    font-weight: 600;
}

.modal-box .Input{
    font-size: 12px;
    margin-bottom: 10px;
}

.find-loc-btn{
    margin-top: 4px;
    margin-bottom: 15px;
}

.form-success {
    background: #d9f7f4;
    border: 1px solid #2ec4b6;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 600;
    color: #1a8a83;
}

.google-password-hint {
    font-size: 13px;
    color: #777;
    background: #f9fffe;
    border: 1px solid #b2ede8;
    border-radius: 8px;
    padding: 10px 14px;
    line-height: 1.5;
}

.delete-warning{
    background: #ffe8e8;
    border: 2px solid #e74c3c;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 14px;
    color: #c0392b;
    line-height: 1.5;
}

.a-btn-delete{
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 8px 18px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    width: fit-content;
}

.a-btn-delete:hover{
    background: #c0392b;
}

.ios-toggle{
    width: 44px;
    height: 24px;
    border-radius: 15px;
    background: #ccc;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
    flex-shrink: 0 ;
}

.ios-toggle.active{
    background: #2ec4b6;
}

.ios-knob{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: left 0.3s;
}

.ios-toggle.active .ios-knob{
    left: 22px;
}
body.dark-mode .settings-sidebar { background: var(--bg-sidebar); border-color: var(--border);}
body.dark-mode .sidebar-item { color: var(--text-primary);}
body.dark-mode .sidebar-item:hover { background: #1f3f3c; color: #2ec4b6;}
body.dark-mode .sidebar-item.active {background: #498f88; color: white;}
body.dark-mode .sidebar-item.danger { color: #e74c3c;}
body.dark-mode .sidebar-item.danger:hover { background: #3b2c2c;}
body.dark-mode .sidebar-item.danger.active { background: #e74c3c; color: white;}
body.dark-mode .sidebar-divider{ border-color: var(--border);}
body.dark-mode .settings-body{ background: var(--bg-page);}
body.dark-mode .settings-header{ background: var(--bg-page); border-color: var(--border);}
body.dark-mode .settings-title {color: var(--text-primary);}
body.dark-mode .settings-section{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .settings-section-title { color: var(--text-primary); border-color: var(--border);}
body.dark-mode .toggle-row{ background: var(--bg-toggle-row); border-color: var(--border);}
body.dark-mode .toggle-label{ color: var(--text-primary);}
body.dark-mode .toggle-desc{ color: var(--text-secondary);}
body.dark-mode .provider-title{ color: var(--text-primary);}
body.dark-mode .provider-desc{ color: var(--text-secondary);}
body.dark-mode .modal-box{background: var(--bg-card);}
body.dark-mode .modal-title{color: var(--text-primary);}
body.dark-mode .review-desc{color: var(--text-secondary);}
body.dark-mode .step { background: #1f3f3c; color: var(--text-secondary);}
body.dark-mode .step-line { background: #1f3f3c;}
body.dark-mode .listing-item{background: var(--bg-input); border-color: var(--border);}
body.dark-mode .listing-name{ color: var(--text-primary);}
body.dark-mode .listing-meta{ color: var(--text-secondary)}

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
.listing-map {
    width: 100%;
    height: 280px;
    border-radius: 10px;
    border: 1px solid #b2ede8;
    margin-top: 4px;
    z-index: 0;
}
</style>