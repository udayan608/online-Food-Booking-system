// --- Global State Simulation (for a simple front-end demo) ---
let isLoggedIn = false;
let cart = [];
let nextOrderId = 104; // Start next ID after FOO-103

// --- Hardcoded Credentials ---
const CORRECT_USERNAME = "admin";
const CORRECT_PASSWORD = "password123";

// --- Service Fees ---
const DELIVERY_FEE = 40.00;
const TAX_RATE = 0.05; // 5% GST

// --- DOM Element Selectors ---
const loginLogoutBtn = document.getElementById("login-logout-btn");
const orderButtons = document.querySelectorAll(".order-btn");
const cartItemsContainer = document.getElementById("cart-items");
const trackBtn = document.getElementById("track-btn");
const orderIdInput = document.getElementById("order-id");
const trackingStatusBox = document.getElementById("tracking-status");
const checkoutBtn = document.querySelector(".checkout-btn");

// Modal Elements
const loginModal = document.getElementById("login-modal");
const loginCloseBtn = document.querySelector(".login-close-btn");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("login-message");

// Bill Modal Elements
const billModal = document.getElementById("bill-modal");
const billCloseBtn = document.querySelector(".bill-close-btn");
const billOrderId = document.getElementById("bill-order-id");
const billItemsSummary = document.getElementById("bill-items-summary");
const billSubtotal = document.getElementById("bill-subtotal");
const billTax = document.getElementById("bill-tax");
const billTotal = document.getElementById("bill-total");

// NEW: Cart Notification Element
const cartNotification = document.getElementById("cart-notification");


// --- Utility Functions ---

function updateLoginButton() {
  loginLogoutBtn.textContent = isLoggedIn ? "Logout" : "Login";
}

function updateCartDisplay() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is currently empty.</p>';
    checkoutBtn.style.display = 'none';
    return;
  }

  checkoutBtn.style.display = 'block';
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>₹${(item.price * item.quantity).toFixed(2)}</span>
    `;
    cartItemsContainer.appendChild(itemElement);
    totalPrice += item.price * item.quantity;
  });

  // Add total price
  const totalElement = document.createElement('div');
  totalElement.classList.add('cart-item', 'total-price');
  totalElement.innerHTML = `
    <span style="font-weight: bold;">Subtotal</span>
    <span style="font-weight: bold; color: #ff6600;">₹${totalPrice.toFixed(2)}</span>
  `;
  cartItemsContainer.appendChild(totalElement);
}

function showCartNotification(foodName) {
    cartNotification.textContent = `✅ ${foodName} added to cart!`;
    cartNotification.classList.add("show");

    // Hide the notification after 3 seconds
    setTimeout(() => {
        cartNotification.classList.remove("show");
    }, 3000);
}


function calculateAndShowBill(orderId) {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let taxAmount = subtotal * TAX_RATE;
    let total = subtotal + taxAmount + DELIVERY_FEE;

    billOrderId.textContent = orderId;
    billSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    billTax.textContent = `₹${taxAmount.toFixed(2)}`;
    billTotal.textContent = `₹${total.toFixed(2)}`;

    // Populate item summary
    billItemsSummary.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('bill-item');
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        `;
        billItemsSummary.appendChild(itemElement);
    });

    billModal.style.display = "block";
    
    // Auto-fill order tracking input with the new ID
    orderIdInput.value = orderId;
}


// --- Event Listeners ---

// 1. Login/Logout Button Handler
loginLogoutBtn.addEventListener("click", () => {
  if (isLoggedIn) {
    // Perform Logout
    isLoggedIn = false;
    cart = []; 
    updateCartDisplay();
    updateLoginButton();
    alert("You have been successfully logged out.");
  } else {
    // Open Login Modal
    loginModal.style.display = "block";
    loginMessage.textContent = ""; 
    usernameInput.value = "";
    passwordInput.value = "";
  }
});

// 2. Modal Close Handlers
loginCloseBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
});

billCloseBtn.addEventListener("click", () => {
    billModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target === billModal) {
    billModal.style.display = "none";
  }
});


// 3. Login Form Submission Handler (Simulated Login)
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value.trim();
  
  loginMessage.classList.remove('error', 'success');
  
  if (enteredUsername === CORRECT_USERNAME && enteredPassword === CORRECT_PASSWORD) {
    // SUCCESS
    isLoggedIn = true;
    updateLoginButton();
    loginMessage.textContent = "Login Successful! Redirecting...";
    loginMessage.classList.add('success');
    
    setTimeout(() => {
        loginModal.style.display = "none";
    }, 800);
    
  } else {
    // ERROR
    loginMessage.textContent = "Invalid credentials. Please try again.";
    loginMessage.classList.add('error');
    passwordInput.value = ""; 
  }
});


// 4. Search Functionality (from original code)
document.querySelector(".search-btn").addEventListener("click", () => {
  const searchValue = document.getElementById("search").value;
  if (searchValue.trim() !== "") {
    alert(`Searching for: ${searchValue}. (Front-end simulation.)`);
  } else {
    alert("Please enter a food or restaurant name.");
  }
});


// 5. Add to Cart Functionality (Requires Login)
orderButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!isLoggedIn) {
        loginModal.style.display = "block";
        loginMessage.textContent = "Please log in to add items to your cart.";
        loginMessage.classList.add('error');
        return;
    }

    const card = button.parentElement;
    const foodName = card.querySelector("h3").textContent;
    const priceText = card.querySelector("span").textContent.replace('₹', '');
    const price = parseFloat(priceText);
    
    const existingItem = cart.find(item => item.name === foodName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name: foodName, price: price, quantity: 1 });
    }

    // --- REPLACED ALERT WITH TOAST NOTIFICATION ---
    showCartNotification(foodName); 
    updateCartDisplay();
  });
});


// 6. Order Tracking Simulation (Added Delivery Notification)
trackBtn.addEventListener("click", () => {
    const orderId = orderIdInput.value.trim().toUpperCase();
    trackingStatusBox.classList.remove('active-status');

    if (orderId === "") {
        trackingStatusBox.innerHTML = "<p>Please enter an Order ID.</p>";
        return;
    }
    
    let statusText = "";
    
    if (orderId === "FOO-101") {
        statusText = "✅ Order Placed! Restaurant is preparing your food.";
        trackingStatusBox.classList.add('active-status');
    } else if (orderId === "FOO-102") {
        statusText = "🛵 Out for Delivery! Your rider is 5 mins away.";
        trackingStatusBox.classList.add('active-status');
    } else if (orderId === "FOO-103") {
        statusText = "📦 Delivered! Enjoy your meal! Please leave a rating.";
        trackingStatusBox.classList.add('active-status');
        
        // --- Delivery Notification ---
        setTimeout(() => {
             alert(`🔔 NOTIFICATION: Your Foodify order ${orderId} has been successfully delivered!`);
        }, 500);
        // -----------------------------
        
    } else if (orderId.startsWith("FOO-") && orderId.length > 6) {
        // Handle current dynamically generated IDs
        statusText = `🚚 Your order ${orderId} is currently out for delivery!`;
        trackingStatusBox.classList.add('active-status');
    } 
    else {
        statusText = `⚠️ Order ID **${orderId}** not found. Please check the ID.`;
    }

    trackingStatusBox.innerHTML = `<p>${statusText}</p>`;
});


// 7. Checkout Logic (Added Bill Generation)
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to order.");
        return;
    }

    if (!isLoggedIn) {
        loginModal.style.display = "block";
        loginMessage.textContent = "Please log in before checking out.";
        loginMessage.classList.add('error');
        return;
    }
    
    const currentOrderId = `FOO-${nextOrderId}`;

    // 1. Show Bill/Receipt
    calculateAndShowBill(currentOrderId);
    
    // 2. Simulate Order Placement

    // 3. Reset Cart
    cart = [];
    nextOrderId += 1;
    updateCartDisplay();
});


// --- Initial Setup ---
document.addEventListener("DOMContentLoaded", () => {
    updateLoginButton();
    updateCartDisplay();
});