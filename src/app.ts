import { app } from './server';
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

export { server };
