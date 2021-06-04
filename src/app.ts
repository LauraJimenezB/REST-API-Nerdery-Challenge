import { app } from './server';
const PORT = 3000

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
})
