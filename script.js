let queue = [];
let number = [];
let images = [];
let calledCustomers = [];
const maxQueueSize = 10;

const callSound = new Audio("call_sound.mp3");
callSound.volume = 1;

// Event listeners
document.getElementById("enqueueBtn").addEventListener("click", enqueueCustomer);
document.getElementById("dequeueBtn").addEventListener("click", dequeueCustomer);
document.getElementById("cls").addEventListener("click", clearQueue);

// Function to enqueue customer
function enqueueCustomer() {
  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerImage = document.getElementById("customerImage").files[0];

  const phoneRegex = /^\d{10}$/; // Validate 10-digit phone number

  if (queue.length >= maxQueueSize) {
    alert("Queue is Full");
    return;
  }

  if (!customerName || !phoneRegex.test(customerPhone) || !customerImage) {
    alert("Please fill in all fields with valid data and select an image.");
    return;
  }

  if (queue.includes(customerName)) {
    alert("This customer is already in the queue.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    queue.push(customerName);
    number.push(customerPhone);
    images.push(e.target.result);

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerImage").value = "";

    updateQueueDisplay();
  };
  reader.readAsDataURL(customerImage);
}

// Function to dequeue customer
function dequeueCustomer() {
  if (queue.length > 0) {
    const dequeuedCustomer = queue.shift();
    const dequeuedPhone = number.shift();
    images.shift();
    calledCustomers.push({ name: dequeuedCustomer, phone: dequeuedPhone });

    callSound.play();
    callOutCustomer(dequeuedCustomer, dequeuedPhone);

    alert(`Next Customer: ${dequeuedCustomer} Phone: ${dequeuedPhone}`);
    updateQueueDisplay();
    updateCalledList();
  } else {
    alert("No more customers in the queue.");
  }
}

// Function to clear the queue
function clearQueue() {
  if (queue.length > 0) {
    queue.length = 0;
    number.length = 0;
    images.length = 0;
    calledCustomers.length = 0;

    alert("Queue Cleared!!!");
    updateQueueDisplay();
    updateCalledList();
  } else {
    alert("No more customers in the queue.");
  }
}

// Function to update queue display
function updateQueueDisplay() {
  const queueList = document.getElementById("queueList");
  queueList.innerHTML = "";

  if (queue.length === 0) {
    queueList.innerHTML = "<h3>Queue is Empty</h3>";
  } else {
    queue.forEach((customer, index) => {
      queueList.innerHTML += `
        <div class="queue-item">
          <img src="${images[index]}" alt="Customer Image" class="customer-img" />
          <p>${index + 1}. ${customer} - ${number[index]}</p>
        </div>`;
    });
  }
}

// Function to update called list display
function updateCalledList() {
  const calledList = document.getElementById("calledList");
  calledList.innerHTML = "";

  if (calledCustomers.length === 0) {
    calledList.innerHTML = "<h3>No Customers Called Yet</h3>";
  } else {
    calledCustomers.forEach((customer, index) => {
      calledList.innerHTML += `<li>${index + 1}. ${customer.name} - ${customer.phone}</li>`;
    });
  }
}

// Function to call out customer details with Text-to-Speech
function callOutCustomer(name, phone) {
  const speechSynthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(
    `Next Customer, ${name}, phone number, ${phone}`
  );
  utterance.lang = "en-US";
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// Automatically call the next customer every 20 seconds
setInterval(() => {
  if (queue.length > 0) {
    const dequeuedCustomer = queue.shift();
    const dequeuedPhone = number.shift();
    images.shift();
    calledCustomers.push({ name: dequeuedCustomer, phone: dequeuedPhone });

    callSound.play();
    callOutCustomer(dequeuedCustomer, dequeuedPhone);

    alert(`Auto Calling Next Customer: ${dequeuedCustomer} Phone: ${dequeuedPhone}`);
    updateQueueDisplay();
    updateCalledList();
  }
}, 20000); // 20 seconds
