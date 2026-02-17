const express = require('express');
const path = require('path');

const app = express();

// ⚠️ nombre REAL del proyecto Angular
const distPath = path.join(
  __dirname,
  'dist/MISW4201-202611-Frontend-Grupo12'
);

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});