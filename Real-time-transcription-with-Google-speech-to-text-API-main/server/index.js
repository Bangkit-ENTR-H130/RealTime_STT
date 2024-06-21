const express = require('express');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const cors = require('cors');

const app = express();
const port = 8081;

// Middleware untuk parsing JSON body
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
));
let lastReceivedUrl = "";

app.post("/saveUrl", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  lastReceivedUrl = url;
  res.status(200).json({ message: 'URL received successfully' });
});

app.get("/getPublicUrl", async (req, res) => {
  try {
    if (!lastReceivedUrl) {
      return res.status(404).json({ error: "No URL found" });
    }
    res.status(200).json({ url: lastReceivedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/predict', async (req, res) => {
  const { jsonUrl } = req.body;
  if (!jsonUrl) {
    return res.status(400).json({ error: 'URL to JSON file is required' });
  }

  try {
    // Download JSON file
    const response = await axios.get(jsonUrl);
    const inputData = response.data;

    // Get access token for authentication
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    // Prepare Vertex AI Prediction request
    const PROJECT_ID = '744929906379';
    const ENDPOINT_ID = '2119662705282383872';
    const LOCATION = 'us-central1';
    const predictionUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict`;
    const headers = {
      'Authorization': `Bearer ${accessToken.token}`,
      'Content-Type': 'application/json',
    };

    // Make prediction request
    const predictionResponse = await axios.post(predictionUrl, inputData, { headers });
    res.json(predictionResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

app.post('/predicts', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    // Create input data in required format
    const inputData = {
      instances: [
        {
          inputs: text
        }
      ]
    };

    // Get access token for authentication
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    // Prepare Vertex AI Prediction request
    const PROJECT_ID = '744929906379';
    const ENDPOINT_ID = '2119662705282383872';
    const LOCATION = 'us-central1';
    const predictionUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}:predict`;
    const headers = {
      'Authorization': `Bearer ${accessToken.token}`,
      'Content-Type': 'application/json',
    };

    // Make prediction request
    const predictionResponse = await axios.post(predictionUrl, inputData, { headers });
    res.json(predictionResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
