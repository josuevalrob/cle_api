import App from './App';
import{normalizePort} from './utils' 
const port = normalizePort(process.env.PORT);
const release = new Date('August 19, 1975 23:15:30');

App.listen(port, () => console.log(`Server Ready 🚀  at ${release.toTimeString()}, on port ${port}`))
