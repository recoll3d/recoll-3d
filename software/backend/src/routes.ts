import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';
import { FindUserController } from './modules/users/useCases/findUser/FindUserController';
import { ListUsersController } from './modules/users/useCases/listUsers/ListUsersController';
import { CreateProfileController } from './modules/profiles/useCases/createProfile/CreateProfileController';
import { ListProfilesController } from './modules/profiles/useCases/listProfiles/ListProfilesController';

import { ensureAuthenticateUser } from './middlewares/ensureAuthenticateUser';
import { AuthenticateUserController } from './modules/account/authenticateUser/AuthenticateUserController';
import { DisconnectUserController } from './modules/account/disconnectUser/DisconnectUserController';
import { ForgotPasswordController } from './modules/account/forgotPassword/ForgotPasswordController';
import { ResetPasswordController } from './modules/account/resetPassword/ResetPasswordController';

const routes = Router();

const upload = multer(multerConfig);

const authenticateUserController = new AuthenticateUserController();
const disconnectUserController = new DisconnectUserController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

const createUserController = new CreateUserController();
const createProfileController = new CreateProfileController();
const findUserController = new FindUserController();
const listUsersController = new ListUsersController();
const listProfilesController = new ListProfilesController();

routes.post("/authenticate/", authenticateUserController.handle);
routes.post("/disconnect/", ensureAuthenticateUser, disconnectUserController.handle);
routes.post("/forgot-password/", forgotPasswordController.handle);
routes.post("/users/", createUserController.handle);
routes.post("/profiles/", upload.single("image"), createProfileController.handle);

routes.get("/users/", listUsersController.handle);
routes.get("/users/:id", ensureAuthenticateUser, findUserController.handle);
routes.get("/profiles/", listProfilesController.handle);

routes.patch("/reset-password/:token", resetPasswordController.handle);

export { routes };