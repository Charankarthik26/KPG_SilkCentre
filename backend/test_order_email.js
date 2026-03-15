import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (templateId, templateParams) => {
    const pubKey = (process.env.EMAILJS_PUBLIC_KEY || '').trim();
    const privKey = (process.env.EMAILJS_PRIVATE_KEY || '').trim();
    const serviceId = (process.env.EMAILJS_SERVICE_ID || '').trim();

    const payload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: pubKey,
        accessToken: privKey,
        template_params: templateParams
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const resultText = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${resultText}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
};

const testParams = {
    to_name: "Test User",
    email: "kpgsilk365@gmail.com", // Sending to self for test
    order_id: "TEST-123",
    orders: [
        { name: "Test Saree", units: 1, price: "₹1,000" }
    ],
    tracking_id: "TRACK-TEST",
    total_amount: "₹1,000",
    shipping_address: "123 Test St",
    order_date: new Date().toLocaleDateString()
};

console.log("Sending test order email...");
sendEmail(process.env.EMAILJS_ORDER_TEMPLATE_ID, testParams);
