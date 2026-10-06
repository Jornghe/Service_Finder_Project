<template>
    <div class="chat-page">
        <NavBar/>

        <div class="chat-main">

            <!-- Inbox List -->
             <div class="inbox-panel">
                <div class="chat-header">Messages</div>
                <div v-if="conversations.length === 0 " class="empty-state">No conversations yet</div>
                <div class="chat-item" v-for="conv in conversations" :key="conv.id"
                    :class="{ active: activeConversation?.id === conv.id}"
                    @click="openConversation(conv)">
                    <div class="chat-avatar"></div>
                    <div class="chat-info">
                        <div class="chat-name">{{ conv.user_one_id === user.id ? conv.user_two.name : conv.user_one.name }}</div>

                        <div style="display: flex; justify-content:space-between; align-items:cengter">
                        <div class="chat-message">{{  conv.last_message }}</div>
                        <div class="chat-time">{{  conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : '' }}</div>
                        </div>
                    </div>
                </div>
               
             </div>

             <!-- Chat Window-->

             <div class="message-panel">
                <div class="message-header" v-if="activeConversation">
                    <div class="chat-avatar"></div>
                    <div class="message-name">{{ activeConversation.user_one_id === user.id ? activeConversation.user_two.name : activeConversation.user_one.name }}</div>
                </div>

                <div class="message-body">
                   <div v-for="msg in messages" :key="msg.id"
                      class="message"
                      :class="msg.sender_id === user.id ? 'sent': 'received'">
                       <div> {{ msg.content }} </div>
                       <div style="font-size: 9px; opacity: 0.6; margin-top: 4px;">{{ new Date(new Date(msg.created_at).getTime() + 7 * 60 * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Phnom_Penh' }) }}</div>                
                    </div>
                </div>

                <div class="message-input">
                    <input type="text" v-model="newMessage" placeholder="Type a message..." @keydown.enter="sendMessage">
                    <button class="a-btn-primary" @click="sendMessage">Send</button>
                </div>

             </div>
        </div>
    </div>

  
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const newMessage = ref('')
const conversations = ref([])
const activeConversation = ref(null)
const messages = ref([])

const user = JSON.parse(localStorage.getItem('user') || '{}')
const route = useRoute()

async function fetchConversations(){
    if(!user.id)return
    const res = await fetch(`http://localhost:3000/api/chat/conversation/${user.id}`)
    const data = await res.json()
    conversations.value = data
}

async function openConversation(conv){
    activeConversation.value = conv
    if(!user.id)return
    const res = await fetch(`http://localhost:3000/api/chat/message/${conv.id}`)
    const data = await res.json()
    messages.value = data
}

async function sendMessage(){
    if(!newMessage.value.trim() || !activeConversation.value)return
    await fetch(`http://localhost:3000/api/chat/messages`,{
        method:'POST',
        headers:{ 'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            conversation_id: activeConversation.value.id,
            sender_id: user.id,
            content: newMessage.value
        })
    })
    newMessage.value= ''
    openConversation(activeConversation.value)
}

onMounted(async ()=>{
    await fetchConversations()
    if (route.query.conversationId) {
        const conv = conversations.value.find(c => c.id === route.query.conversationId)
        if (conv) openConversation(conv)
    }
})





</script>

<style scoped>
.chat-page{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.chat-main{
    display: flex;
    flex: 1;
    overflow: hidden;
    min-width: 600px;
}

.inbox-panel{
    width: 400px;
    min-width: 300px;
    background: #edfcfa;
    border: 2px solid #b2ede8;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.chat-header{
    padding: 16px 16px;
    font-size: 20px;
    font-weight: 700;
    color: #22223b;
    border-bottom: 1px solid #b2ede8;
}

.chat-item{
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    border-bottom: 1px solid #b2ede8;
    cursor: pointer;
    transition: background 0.15s;
}

.chat-tiem:hover{
    background: #d9f7f4;
}

.chat-item.active{
    background: #d9f7f4;
    border-left: 4px solid #2ec4b6;
}

.chat-avatar{
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #b2ede8;
    flex-shrink: 0;
}

.chat-info{
    flex: 1;
    overflow: hidden;
}

.chat-name{
    font-size: 15px;
    color: #22223b;
    font-weight: 700;
    padding: 0 10px;
}

.chat-messages{
    font-size: 13px;
    color: #aaa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px;
}

.chat-time{
    font-size: 12px;
    color: #aaa;
    flex-shrink: 0;
}

.message-panel{
    flex: 1;
    display: flex;
    flex-direction:column ;
    background: #f9fffe;
}

.message-header{
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border-bottom: 2px solid #b2ede8;
}

.message-name{
    font-size: 18px;
    font-weight: 700;
    color: #22223b;
}

.message-body{
    flex: 1;
    overflow-y:auto; 
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message{
    max-width: 60%;
    padding: 8px 12px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.5;
}

.message.received{
    background:white;
    border: 1px solid #b2ede8;
    color: #22223b;
    align-self: flex-start;

}

.message.sent{
    background: #2ec4b6;
    color: white;
    align-self: flex-end;
}

.message-input{
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    background: white;
    border-top: 3px solid #b2ede8;
}

.message-input input{
    flex: 1;
    border: 2px solid #b2ede8;
    border-radius: 25px;
    padding: 8px 16px;
    font-size: 14px;
    outline: none;
    background: #f9fffe;
}

.message-input input:focus{
    border-color: #2ec4b6;
}

body.dark-mode .inbox-panel{ background: var(--bg-sidebar); border-color: var(--border);}
body.dark-mode .chat-header{ color: var(--text-primary); border-color: var(--border);}
body.dark-mode .chat-item{ border-color: var(--border);}
body.dark-mode .chat-item:hover{ background: #1f3f3c;}
body.dark-mode .chat-item.active { background: #498f88; border-color: #2ec4b6; }
body.dark-mode .chat-name{ color: var(--text-primary);}
body.dark-mode .message-panel{ background: var(--bg-page);}
body.dark-mode .message-header{  background: var(--bg-card); border-color: var(--border);}
body.dark-mode .message-name{ color: var(--text-primary);}
body.dark-mode .message-body{ background: var(--bg-page);}
body.dark-mode .message.received {background: var(--bg-card); border-color: var(--border); color: var(--text-primary);}
body.dark-mode .message-input{ background: var(--bg-card); border-color: var(--border);}
body.dark-mode .message-input input{ background: var(--bg-input); border-color: var(--border); color: var(--text-primary);}
</style>