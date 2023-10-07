import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import { AuthenticateUserController } from './modules/account/authenticateUser/AuthenticateUserController';
import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';
import { CreateProfileController } from './modules/profiles/useCases/createProfile/CreateProfileController';

const routes = Router();

const upload = multer(multerConfig);

const authenticateUserController = new AuthenticateUserController();
const createUserController = new CreateUserController();
const createProfileController = new CreateProfileController();

routes.post("/authenticate/", authenticateUserController.handle);
routes.post("/users/", createUserController.handle);
routes.post("/profiles/", upload.single("image"), createProfileController.handle);

export { routes };