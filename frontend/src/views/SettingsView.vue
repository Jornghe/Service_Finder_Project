<template>
    <div class="settings-page">
        <NavBar/>

        <div class="settings-main">

            <!-- Side Bar -->
             <div class="settings-sidebar">
                <div class="sidebar-item" :class="{ active: activeTab === 'account'}" @click="activeTab = 'account'"> Account </div>
                <div class="sidebar-item" :class="{ active: activeTab === 'notification'}" @click="activeTab = 'notification'"> Notification </div>
                <div class="sidebar-item" :class="{ active: activeTab === 'privacy'}" @click="activeTab = 'privacy'"> Privacy </div>
                <div class="sidebar-item" :class="{ active: activeTab === 'become-provider'}" @click="activeTab = 'become-provider'"> Become Provider </div>

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
                            <input class="Input" type="text" placeholder="Kuoch Chyhang"/>
                        </div>

                        <div class="form-group">
                            <label class="label">Email Address</label>
                            <input class="Input" type="email" placeholder="jihong@gmail.com"/>
                        </div>

                        <div class="form-group">
                            <label class="label">Phone</label>
                            <input class="Input" type="text" placeholder="012 345 678"/>
                        </div>

                        <button class="a-btn-primary">Save Change</button>

                    </div>

                    <div class="settings-section">
                        <div class="settings-section-title">Change Password</div>

                        <div class="form-group">
                            <label class="label">Current Password</label>
                            <input class="Input" type="password" placeholder="........"/>
                        </div>

                        <div class="form-group">
                            <label class="label">New Password</label>
                            <input class="Input" type="password" placeholder="........"/>
                        </div>

                        <div class="form-group">
                            <label class="label">Confirm New Password</label>
                            <input class="Input" type="password" placeholder="........"/>
                        </div>

                        <button class="a-btn-primary">Update Password</button>

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
                            <div class="provider-title">Sokha AC Repair</div>
                            <div class="provider-desc">Member since 2024 · ⭐ 4.8 · 32 reviews </div>
                            <div class="provider-action">
                                <button class="a-btn-primary" @click="showProviderModal = true">+ Add New Listing</button>
                                <RouterLink to="/provider" class="a-btn">Provider Daskboard</RouterLink>
                            </div>
                        </div>

                        <div class="settings-section">
                            <div class="settings-section-title">My Listing</div>
                            <div class="listing-item">
                                <div class="listing-name">Sokha AC Repair</div> 
                                <div class="listing-meta">📍 Toul Kork · ⭐ 4.8</div>
                            </div>
                        </div>

                    </div>


                  </div>

                  <!-- Provider Modal -->
                   <div v-if="showProviderModal" class="modal-overlay" @click.self="showProviderModal = false">
                    <div class="modal-box">


                        <!-- Step Indicator -->
                         <div class="step-indicator">
                            <div class="step" :class="{ active: currentStep >= 1, done: currentStep > 1}">1</div>
                            <div class="step-line"></div>
                            <div class="step" :class="{ active: currentStep >= 2, done: currentStep > 2}">2</div>
                            <div class="step-line"></div>
                            <div class="step" :class="{ active: currentStep >= 3, done: currentStep > 3}" >3</div>
                            <div class="step-line"></div>
                            <div class="step" :class="{ active: currentStep >= 4,}">4</div>
                         </div>

                         <!-- Step 1: Basic Info -->
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

                          <!-- Step 2: Locationbn & Description -->
                           <div v-if="currentStep === 2">
                            <div class="modal-title">Location and Description</div>
                            <div class="form-group">
                                <label class="label">Address / Location</label>
                                <input class="Input" type="text" placeholder="e.g. Toul Kork, PhnomPenh"/>
                                <button class="a-btn-primary find-loc-btn" @click="findLocation">Find Location</button>
                            </div>
                            <div class="form-group">
                                <label class="label">Description</label>
                                <textarea class="Input" rows="4" placeholder="Write a brief description about your service..."></textarea>
                            </div>
                           </div>

                           <!-- Step 3 : Verification -->
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

                            <!-- Step 4: Review and Submit -->
                             <div v-if="currentStep ===  4">
                                <div class="modal-title">Review & Submit</div>
                                <div class="review-desc">please review your information before submitting. Our team will review your application and get back to you soon. You will be notified once your account has been reviewed </div>
                             </div>

                             <!-- Modal Button-->
                              <div class="modal-button">
                                <button v-if="currentStep > 1"  class="a-btn" @click="currentStep--">Back</button>
                                <button v-if="currentStep < 4" class="a-btn-primary" @click="currentStep++">Next</button>
                                <button v-if="currentStep === 4" class="a-btn-primary" >Submit</button>
                              </div>

                    </div>
                  </div>

                              <!-- Delete Account -->
                               <div v-if="activeTab==='delete-account'" class="settings-content">
                                <div class="settings-section">
                                    <div class="delete-warning">
                                        ⚠️ Warning: This action is permanent and cannot be undone. All your data including profile, requests, favorites and chat history will be permanently deleted.
                                    </div>

                                    <div class="form-group">
                                        <label class="label">Enter your password to confirm deletion</label>
                                        <input class="Input" type="password" placeholder="Password"/>
                                    </div>

                                    <button class="a-btn-delete">Delete My Account</button>
                                </div>
                               </div>


                
              </div>
        </div>
    </div>
  
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('account');
const tabTitle ={
    'account': 'Account Settings',
    'notification': 'Notification Settings',
    'privacy': 'Privacy Settings',
    'become-provider': 'Become a Provider',
    'delete-account': 'Delete Account'
}

function signOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    router.push('/login');
}

const showProviderModal = ref(false);
const currentStep = ref(1);

function findLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) =>{
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
        })
    }else {
        alert('Geolocation is not supported by your browser');
    }
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
const isProvider= ref(false)
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
</style>