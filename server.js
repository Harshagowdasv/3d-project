const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let trainedModels = {};

app.post('/generate', (req, res) => {
    const prompt = req.body.prompt;
    let modelData;
    
    if (trainedModels[prompt]) {
        modelData = trainedModels[prompt];
    } else {
        // Basic model types for untrained prompts
        if (prompt.toLowerCase().includes('human')) {
            modelData = { type: 'human', color: '0x00ff00' };
        } else {
            modelData = { type: 'cube', color: '0x00ff00' };
        }
    }

    res.json(modelData);
});

app.post('/train', (req, res) => {
    const prompt = req.body.prompt;
    // Save the trained example
    trainedModels[prompt] = { type: 'cube', color: '0xff0000' };
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
