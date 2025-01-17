let queue = [];
let number = [];
let images = [];
let calledCustomers = []; // สำหรับบันทึกประวัติการเรียก
const maxQueueSize = 10;

const callSound = new Audio("call_sound.mp3"); // เสียงเรียกคิว
callSound.volume = 1; // ปรับระดับเสียงให้ดังขึ้น

document.getElementById("enqueueBtn").addEventListener("click", () => {
  const customerName = document.getElementById("customerName").value;
  const customerPhone = document.getElementById("customerPhone").value;
  const customerImage = document.getElementById("customerImage").files[0];

  if (queue.length < maxQueueSize) {
    if (customerName && customerPhone && customerImage) {
      const reader = new FileReader();
      reader.onload = function (e) {
        queue.push(customerName);
        number.push(customerPhone);
        images.push(e.target.result); // Save the image base64 data

        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("customerImage").value = ""; // Clear the image input

        updateQueueDisplay();
      };
      reader.readAsDataURL(customerImage); // Convert image to base64
    } else {
      alert("Please fill in all fields and select an image.");
    }
  } else {
    alert("Queue is Full");
  }
});

document.getElementById("dequeueBtn").addEventListener("click", () => {
  if (queue.length > 0) {
    const dequeuedCustomer = queue.shift();
    const dequeuedPhone = number.shift();
    images.shift(); // Remove the image of the served customer
    calledCustomers.push({ name: dequeuedCustomer, phone: dequeuedPhone }); // บันทึกรายการเรียก

    // Play call sound
    callSound.play();

    alert("Next Customer: " + dequeuedCustomer + " Phone: " + dequeuedPhone);
    updateQueueDisplay();
    updateCalledList(); // อัพเดตรายการที่ถูกเรียก
  } else {
    alert("No more customers in the queue.");
  }
});

document.getElementById("cls").addEventListener("click", () => {
  if (queue.length > 0) {
    queue.length = 0;
    number.length = 0;
    images.length = 0; // Clear the image array
    calledCustomers = []; // เคลียร์ประวัติการเรียก
    alert("Queue Cleared!!!");
    updateQueueDisplay();
    updateCalledList();
  } else {
    alert("No more customers in the queue.");
  }
});

// Function to update the queue display
function updateQueueDisplay() {
  const queueList = document.getElementById("queueList");
  queueList.innerHTML = "";

  if (queue.length === 0) {
    queueList.innerHTML = "<h3>Queue is Empty</h3>";
  } else {
    queue.forEach((customer, index) => {
      queueList.innerHTML += `
        <div class="queue-item">
            <img src="${
              images[index]
            }" alt="Customer Image" class="customer-img" />
            <p>${index + 1}. ${customer} - ${number[index]}</p>
        </div>
      `;
    });
  }
}

// Function to update the called list display
function updateCalledList() {
  const calledList = document.getElementById("calledList");
  calledList.innerHTML = "";

  if (calledCustomers.length === 0) {
    calledList.innerHTML = "<h3>No Customers Called Yet</h3>";
  } else {
    calledCustomers.forEach((customer, index) => {
      calledList.innerHTML += `
        <li>${index + 1}. ${customer.name} - ${customer.phone}</li>
      `;
    });
  }
}

// Automatically call the next customer every 20 seconds
setInterval(() => {
  if (queue.length > 0) {
    const dequeuedCustomer = queue.shift();
    const dequeuedPhone = number.shift();
    images.shift(); // Remove the image of the served customer
    calledCustomers.push({ name: dequeuedCustomer, phone: dequeuedPhone }); // บันทึกข้อมูลการเรียก

    // Play call sound (ดังขึ้น)
    callSound.play();

    alert(
      "Auto Calling Next Customer: " +
        dequeuedCustomer +
        " Phone: " +
        dequeuedPhone
    );
    updateQueueDisplay();
    updateCalledList(); // อัพเดตรายการที่ถูกเรียก
  }
}, 200000); // 20 seconds interval
