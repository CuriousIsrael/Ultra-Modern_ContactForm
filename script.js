// ── Firebase Imports ─────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Firebase Config ──────────────────────────────────
// 🔧 Replace these values with your own from Firebase Console
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
  measurementId: "Your_Measurement_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── DOM Ready ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("status");
  const successSection = document.getElementById("success-section");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("count");
  const submitBtn = form.querySelector(".submit-btn");

  // ── Live character counter ───────────────────────
  messageInput.addEventListener("input", () => {
    charCount.textContent = messageInput.value.length;
  });

  // ── Form Submit ──────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value;
    const message = messageInput.value.trim();

    // Basic validation
    if (!fname || !email || !message) {
      statusEl.textContent = "⚠ Please fill in all required fields.";
      statusEl.style.color = "#ff6b6b";
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.querySelector("span").textContent = "Sending…";
    statusEl.textContent = "";

    try {
      // Save to Firestore — "messages" collection
      const docRef = await addDoc(collection(db, "messages"), {
        firstName: fname,
        lastName: lname,
        email,
        subject,
        message,
        source: "LightSolution Contact Form",
        createdAt: serverTimestamp()
      });

      console.log("Message saved — Document ID:", docRef.id);

      // Show success state
      form.style.display = "none";
      statusEl.style.display = "none";
      successSection.style.display = "block";

    } catch (error) {
      console.error("Firestore error:", error);
      statusEl.textContent = "✖ Something went wrong. Please try again.";
      statusEl.style.color = "#ff6b6b";

      // Re-enable button on failure
      submitBtn.disabled = false;
      submitBtn.querySelector("span").textContent = "Send message →";
    }
  });

});