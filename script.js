// ===================== 🔥 FIREBASE IMPORTS =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// ===================== 🔥 FIREBASE CONFIG =====================
const firebaseConfig = {
    apiKey: "AIzaSyDwh8I7Q-rznqld_yKTI8NZoKNCYNQFJFw",
    authDomain: "usspace-81fc6.firebaseapp.com",
    projectId: "usspace-81fc6",
    storageBucket: "usspace-81fc6.firebasestorage.app",
    messagingSenderId: "759765363721",
    appId: "1:759765363721:web:a894ba10e2878aba8d9cd8",
    measurementId: "G-53ZX9KXDYS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===================== 💬 SEND MESSAGE =====================
async function sendMessage(textOverride = null) {
    const input = document.getElementById("message");
    const msgText = textOverride || (input ? input.value.trim() : null);
    
    if (!msgText) return;

    const currentSender = localStorage.getItem("chatName") || "User";

    try {
        await addDoc(collection(db, "messages"), {
            text: msgText,
            time: Date.now(),
            sender: currentSender
        });
        if (input && !textOverride) input.value = "";
    } catch (err) {
        console.error("Send Error:", err);
    }
}

// ===================== 🗑️ DELETE MESSAGE =====================
async function deleteMessage(msgId, senderName) {
    const myName = localStorage.getItem("chatName") || "User";

    if (senderName !== myName) {
        alert("You can delete only your messages!");
        return;
    }

    if (confirm("Delete this message?")) {
        try {
            await deleteDoc(doc(db, "messages", msgId));
        } catch (error) {
            console.error("Delete error:", error);
        }
    }
}

// ===================== 💬 LOAD MESSAGES =====================
function loadMessages() {
    const chatBox = document.getElementById("chatBox");
    if (!chatBox) return;

    const q = query(collection(db, "messages"), orderBy("time"));

    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = "";
        const myName = localStorage.getItem("chatName") || "User";

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const msgId = docSnap.id;
            const isMe = data.sender === myName;

            const div = document.createElement("div");
            div.className = `message ${isMe ? "my-msg" : "other-msg"}`;
            div.onclick = () => deleteMessage(msgId, data.sender);

            div.innerHTML = `
                <small><b>${data.sender}</b></small><br>
                ${data.text}<br>
                <small style="font-size:0.6em;">${new Date(data.time).toLocaleTimeString()}</small>
            `;
            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// ===================== 🗑️ CLEAR CHAT =====================
async function clearChat() {
    if (!confirm("Delete ALL messages?")) return;

    const querySnapshot = await getDocs(collection(db, "messages"));
    const deletes = [];

    querySnapshot.forEach((docSnap) => {
        deletes.push(deleteDoc(doc(db, "messages", docSnap.id)));
    });

    await Promise.all(deletes);
}

// ===================== 📝 NOTES =====================
async function addNote() {
    const text = prompt("Enter note:");
    if (!text) return;

    await addDoc(collection(db, "notes"), {
        content: text,
        time: Date.now(),
        author: localStorage.getItem("chatName") || "User"
    });
}

function loadNotes() {
    const notesList = document.getElementById("notesList");
    const previewList = document.getElementById("notesPreviewList");
    if (!notesList && !previewList) return;

    const q = query(collection(db, "notes"), orderBy("time", "desc"));

    onSnapshot(q, (snapshot) => {
        let html = "";
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            html += `
                <div class="note-item">
                    ${data.content}
                    <br><small>By ${data.author}</small>
                </div>`;
        });

        if (notesList) notesList.innerHTML = html;
        if (previewList) previewList.innerHTML = html || "No notes yet...";
    });
}

// ===================== 🔐 LOGIN =====================
function login(){
    if(document.getElementById("pin").value === "1436"){
        window.location.href = "home.html";
    } else {
        alert("Wrong PIN ❌");
    }
}

// ===================== 🎭 SECRET ERROR SCREEN LOGIC =====================
function initSecretUnlock() {
    const btn = document.getElementById("okBtn");
    if (!btn) return;

    // Normal click → exit
    btn.addEventListener("click", () => {
        window.history.back();
    });

    // Swipe unlock (LEFT ➝ RIGHT)
    let startX = 0;
    let endX = 0;

    btn.addEventListener("touchstart", e => {
        startX = e.changedTouches[0].screenX;
    });

    btn.addEventListener("touchend", e => {
        endX = e.changedTouches[0].screenX;

        if (endX - startX > 80) {
            unlock();
        }
    });
}

// Unlock screen
function unlock() {
    const fake = document.getElementById("fakeError");
    const real = document.getElementById("realApp");

    if (fake && real) {
        fake.style.display = "none";
        real.style.display = "block";
    }
}

// ===================== 🌍 GLOBAL EXPORT =====================
window.sendMessage = () => sendMessage();
window.deleteMessage = deleteMessage;
window.clearChat = clearChat;
window.addNote = addNote;
window.login = login;

// ===================== 🚀 INIT =====================
window.onload = () => {
    loadMessages();
    loadNotes();

    const nameEl = document.getElementById("chatName") || document.getElementById("homeName");
    if (nameEl) {
        nameEl.innerText = localStorage.getItem("chatName") || "My Person 💜";
    }

    initSecretUnlock(); // 🔥 IMPORTANT
};
