const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

app.post('/compile', (req, res) => {
    const code = req.body.code;
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const filename = `/tmp/${uuidv4()}.cpp`;
    const binary = filename.replace('.cpp', '');

    fs.writeFileSync(filename, code);

    // Kompajliraj
    exec(`g++ ${filename} -o ${binary}`, (compileErr, stdout, stderr) => {
        if (compileErr) {
            return res.status(400).json({ error: 'Compilation failed', output: stderr });
        }

        // Pokreni binarni fajl
        exec(binary, { timeout: 5000 }, (runErr, runStdout, runStderr) => {
            // Očisti fajlove
            fs.unlinkSync(filename);
            fs.unlinkSync(binary);

            if (runErr) {
                return res.status(400).json({ error: 'Execution failed', output: runStderr });
            }

            res.json({ output: runStdout });
        });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
