import { Request, Response, Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';
import { FindUserController } from './modules/users/useCases/findUser/FindUserController';
import { ListUsersController } from './modules/users/useCases/listUsers/ListUsersController';
import { CreateProfileController } from './modules/profiles/useCases/createProfile/CreateProfileController';
import { ListProfilesController } from './modules/profiles/useCases/listProfiles/ListProfilesController';
import { BottleDetailsController } from './modules/bottles/useCases/bottleDetails/BottleDetailsController';
import { CreateCollectPointController } from './modules/collectionPoints/useCases/createCollectPoint/CreateCollectPointController';

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
const bottleDetailsController = new BottleDetailsController();
const createCollectPointController = new CreateCollectPointController();

routes.post("/authenticate/", authenticateUserController.handle);
routes.post("/disconnect/", ensureAuthenticateUser, disconnectUserController.handle);
routes.post("/forgot-password/", forgotPasswordController.handle);
routes.post("/users/", createUserController.handle);
routes.post("/profiles/", upload.single("image"), createProfileController.handle);
routes.post("/collection-points/", upload.single("image"), createCollectPointController.handle);

routes.get("/", (request: Request, response: Response) => {
  response.json({ message: "Hello World" });
});
routes.get("/users/", listUsersController.handle);
routes.get("/users/:id", ensureAuthenticateUser, findUserController.handle);
routes.get("/profiles/", listProfilesController.handle);
routes.get("/bottles/", bottleDetailsController.handle);

routes.patch("/reset-password/:token", resetPasswordController.handle);

export { routes };