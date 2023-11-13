import { serverHttp } from './http';
import './websockets';

const localPort = 3333;

serverHttp.listen(localPort, () => {
  console.log("Server is running on PORT 3333");
});