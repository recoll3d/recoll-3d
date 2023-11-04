import { serverHttp } from './http';
import './websockets';

const localPort = 3000;

serverHttp.listen(localPort, () => {
  console.log("Server is running on PORT 3000");
});