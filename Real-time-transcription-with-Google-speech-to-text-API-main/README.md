# Node.js and React Speech-to-Text Demo

This is a simple app that demonstrates how to use the Google Speech-to-Text API in a Node.js and React application.

## Requirements

- Node.js (tested with version 14.x)
- React (tested with version 16.x)
- Google Cloud Platform Service Account Key with Speech-to-text api permissions

  > Follow this [tutorial](https://console.cloud.google.com/welcome?q=search&referrer=search&project=speech-to-text-test-371505&walkthrough_id=speech-to-text--speech-to-text-v2-nodejs) to create credentials and learn how to use the Google-Speech-To-Text API

## Setup

1.  Clone this repository: `git clone https://github.com/untilhamza/Real-time-transcription-with-Google-speech-to-text-API.git`

### Frontend part

1.  Navigate to the react-app project directory: `cd stt-client`
2.  Install dependencies: `yarn`
3.  Start the development server: `yarn start`
4.  Navigate back to the parent directory : `cd..`

The app will now be running at [http://localhost:3000](http://localhost:3000/).

### Add Credentials

1. Make sure to get a Google cloud Service Account Key as shown in this [tutorial](https://console.cloud.google.com/welcome?q=search&referrer=search&project=speech-to-text-test-371505&walkthrough_id=speech-to-text--speech-to-text-v2-nodejs)
2. Download the generated Service Account key json file save it to the server folder as `speech-to-text-key.json`.
   > This file name is already added to the .gitignore file but make sure not to push to github or any public repositories
3. Open the server folder and add this line in `index.js` file to add google credentials to our node js backend.

```
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./speech-to-text-key.json"; //TODO: set this to the path for your Service account key JSON file
```

### Backend part

1.  Navigate to the server project directory: `cd server`
2.  Install dependencies: `yarn`
3.  Start the development server: `yarn run dev`
4.  Start the development server: `npm start`

The backend listens at [http://localhost:8081](http://localhost:8081/).

# How To Use

## Server 1

### URL Route: http://127.0.0.1:8080/

#### [POST] Start Google Cloud Stream

- **Endpoint**: /startGoogleCloudStream
- **Description**: Starts the Google Cloud Speech-to-Text streaming recognition.

**Request**:
```json
{
  "data": "start"
}
```

**Response**:
```json
{
  "status": "Started"
}
```

#### [POST] End Google Cloud Stream

- **Endpoint**: /endGoogleCloudStream
- **Description**: Ends the Google Cloud Speech-to-Text streaming recognition and saves the transcription to Google Cloud Storage.

**Request**:
```json
{
  "data": "end"
}
```

**Response**:
```json
{
  "status": "Ended",
  "message": "Transcription saved",
  "transcriptionUrl": "https://storage.googleapis.com/naraspeak_bucket1/transcription_123456789.json"
}
```

#### [POST] Send Audio Data

- **Endpoint**: /send_audio_data
- **Description**: Sends audio data to the Google Cloud Speech-to-Text streaming recognition.

**Request**:
```json
{
  "audio": "base64encodedAudioData"
}
```

**Response**:
```json
{
  "status": "Received"
}
```

## Server 2

### URL Route: http://127.0.0.1:8081/

#### [POST] Save URL

- **Endpoint**: /saveUrl
- **Description**: Saves the URL of the transcription file sent by Server 1.

**Request**:
```json
{
  "url": "https://storage.googleapis.com/naraspeak_bucket1/transcription_123456789.json"
}
```

**Response**:
```json
{
  "status": "Success",
  "message": "URL received successfully"
}
```

#### [GET] Get Public URL

- **Endpoint**: /getPublicUrl
- **Description**: Retrieves the last received URL.

**Response**:
```json
{
  "status": "Success",
  "url": "https://storage.googleapis.com/naraspeak_bucket1/transcription_123456789.json"
}
```

#### [POST] Predict from URL

- **Endpoint**: /predict
- **Description**: Sends the JSON file URL to Vertex AI for prediction.

**Request**:
```json
{
  "jsonUrl": "https://storage.googleapis.com/naraspeak_bucket1/transcription_123456789.json"
}
```

**Response**:
```json
{
  "status": "Success",
  "prediction": "Prediction results from Vertex AI"
}
```

#### [POST] Predict from Text

- **Endpoint**: /predicts
- **Description**: Sends text input directly to Vertex AI for prediction.

**Request**:
```json
{
  "text": "sample text to predict"
}
```

**Response**:
```json
{
  "status": "Success",
  "prediction": "Prediction results from Vertex AI"
}
```

## Headers

- **Content-Type**: application/json
- **Authorization**: Bearer [Token]

## Common Responses

- **Success**:
  ```json
  {
    "status": "Success",
    "message": "Description of the success"
  }
  ```

- **Error**:
  ```json
  {
    "status": "Error",
    "message": "Description of the error"
  }
  ```

## Usage

To use the app, simply click the "Start Recording" button and speak into your microphone. The transcription will appear on the screen as you speak, updating in real-time. When you're finished, click the "Stop Recording" button to see the final transcription.
