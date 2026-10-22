import { getIO } from "../config/socket.js";

// 1. Meta Webhook Verification
export const verifyWebhook = (req, res) => {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "my_secure_token";

    const mode = req.query("hub.mode");
    const token = req.query("hub.verify_token");
    const challenge = req.query("hub.challenge");

    // Check if mode and token sent are correct
    if(mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("Webhook verified successfully!");
            // Respond with the challenge token from the request
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
}

// 2. Handle Incoming Lead from Meta (POST Request)
export const handleIncomingLead = (req, res) => {
    const body = req.body;

    console.log("Incoming Webhook payload received:", JSON.stringify(body, null, 2));

    // Check if this is an event from a page subscription
    if (body.object === "page") {
        body.entry.forEach((entry) => {
            // Iterate over each messaging/lead event
            entry.changes.forEach((change) => {
                if (change.field === "leadgen") {
                    const leadData = change.value;
                    console.log("New Lead Data Extracted:", leadData);

                    // Get the socket instance and broadcast the new lead to all connected clients
                    const io = getIO();
                    io.emit("new_lead", {
                        lead_id: leadData.leadgen_id,
                        form_id: leadData.form_id,
                        created_time: leadData.created_time,
                        message: "New lead received from Meta!"
                    });
                }
            });
        });

        // Return a '200 OK' response to acknowledge receipt of the event
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
};