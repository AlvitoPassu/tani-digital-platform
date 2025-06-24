const { sendNotification } = require('./notification-server');

// Test notifikasi transaksi
function testTransactionNotification() {
    sendNotification("user-123", {
        title: "Transaksi Berhasil ✅",
        body: "Pesanan #12345 telah berhasil diproses"
    });
}

// Test notifikasi pengiriman
function testShippingNotification() {
    sendNotification("user-123", {
        title: "Status Pengiriman 🚚",
        body: "Pesanan Anda sedang dalam perjalanan"
    });
}

// Test notifikasi AI
function testAINotification() {
    sendNotification("user-123", {
        title: "Saran AI 🤖",
        body: "Ada rekomendasi baru untuk tanaman Anda!"
    });
}

// Jalankan test dengan delay
setTimeout(testTransactionNotification, 2000);
setTimeout(testShippingNotification, 4000);
setTimeout(testAINotification, 6000);

console.log("Testing notifikasi dimulai..."); 