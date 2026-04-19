// ===================== 🔥 FIREBASE =====================
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

const firebaseConfig = {
    apiKey: "AIzaSyDwh8I7Q-rznqld_yKTI8NZoKNCYNQFJFw",
    authDomain: "usspace-81fc6.firebaseapp.com",
    projectId: "usspace-81fc6",
    storageBucket: "usspace-81fc6.firebasestorage.app",
    messagingSenderId: "759765363721",
    appId: "1:759765363721:web:a894ba10e2878aba8d9cd8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===================== 💬 CHAT =====================
async function sendMessage(textOverride = null) {
    const input = document.getElementById("message");
    const msgText = textOverride || (input ? input.value.trim() : null);
    if (!msgText) return;

    const sender = localStorage.getItem("chatName") || "User";

    await addDoc(collection(db, "messages"), {
        text: msgText,
        time: Date.now(),
        sender
    });

    if (input && !textOverride) input.value = "";
}

function loadMessages() {
    const chatBox = document.getElementById("chatBox");
    if (!chatBox) return;

    const q = query(collection(db, "messages"), orderBy("time"));

    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = "";

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const div = document.createElement("div");

            div.innerHTML = `
                <b>${data.sender}</b><br>
                ${data.text}
            `;

            chatBox.appendChild(div);
        });
    });
}

// ===================== 📝 NOTES =====================
async function addNote() {
    const text = prompt("Enter note:");
    if (!text) return;

    await addDoc(collection(db, "notes"), {
        content: text,
        time: Date.now()
    });
}

// ===================== 🔐 LOGIN =====================
function login() {
    if (document.getElementById("pin").value === "1436") {
        window.location.href = "home.html";
    } else {
        alert("Wrong PIN ❌");
    }
}

// ===================== 🔥 SECRET BUTTON SWIPE =====================
function initSecretUnlock() {
    const btn = document.getElementById("okBtn");
    if (!btn) return;

    // 👉 NORMAL CLICK = EXIT
    btn.addEventListener("click", () => {
        window.history.back();
    });

    // 👉 SECRET SWIPE
    let startX = 0;

    btn.addEventListener("touchstart", e => {
        startX = e.changedTouches[0].screenX;
    });

    btn.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].screenX;
        let endY = e.changedTouches[0].screenY;

        // STRICT CONDITION
        if (endX - startX > 100 && endY > window.innerHeight - 250) {
            unlock();
        }
    });
}

// ===================== 🔓 UNLOCK =====================
function unlock() {
    document.getElementById("fakeError").style.display = "none";
    document.getElementById("realApp").style.display = "block";
}

// ===================== 🚀 INIT =====================
window.onload = () => {
    loadMessages();
    initSecretUnlock();
};

// expose
window.login = login;
window.sendMessage = sendMessage;
window.addNote = addNote;
