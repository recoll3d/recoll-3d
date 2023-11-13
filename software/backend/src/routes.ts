import { Request, Response, Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';
import { CreateProfileController } from './modules/profiles/useCases/createProfile/CreateProfileController';
import { CreateCollectPointController } from './modules/collectionPoints/useCases/createCollectPoint/CreateCollectPointController';
import { CreateLevelController } from './modules/levels/useCases/createLevels/CreateLevelController';
import { CreateLevelRewardsController } from './modules/levelRewards/useCases/createLevelRewards/CreateLevelRewardsController';
import { CreateRecyclingController } from './modules/recycling/useCases/createRecycling/CreateRecyclingController';
import { CreateBottleController } from './modules/bottles/useCases/createBottle/CreateBottleController';

import { UpdateEndDateController } from './modules/recycling/useCases/updateEndDate/UpdateEndDateController';

import { ListUsersController } from './modules/users/useCases/listUsers/ListUsersController';
import { ListProfilesController } from './modules/profiles/useCases/listProfiles/ListProfilesController';
import { ListLevelsController } from './modules/levels/useCases/listLevels/ListLevelsController';

import { FindUserController } from './modules/users/useCases/findUser/FindUserController';
import { BottleDetailsController } from './modules/bottles/useCases/bottleDetails/BottleDetailsController';

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
const createCollectPointController = new CreateCollectPointController();
const createLevelController = new CreateLevelController();
const createLevelRewardsController = new CreateLevelRewardsController();
const createRecyclingController = new CreateRecyclingController();
const createBottleController = new CreateBottleController();

const updateEndDateController = new UpdateEndDateController();

const listUsersController = new ListUsersController();
const listProfilesController = new ListProfilesController();
const listLevelsController = new ListLevelsController();

const findUserController = new FindUserController();
const bottleDetailsController = new BottleDetailsController();

routes.post("/authenticate/", authenticateUserController.handle);
routes.post("/disconnect/", ensureAuthenticateUser, disconnectUserController.handle);
routes.post("/forgot-password/", forgotPasswordController.handle);
routes.post("/users/", createUserController.handle);
routes.post("/profiles/", upload.single("image"), createProfileController.handle);
// routes.post("/profiles/", upload.fields([
//   { name: "profile_image", maxCount: 1 },
//   { name: "level_image", maxCount: 1 },
//   { name: "reward_image", maxCount: 1 }
// ]), createProfileController.handle);
routes.post("/collection-points/", upload.single("image"), createCollectPointController.handle);
routes.post("/levels/", upload.single("image"), createLevelController.handle);
routes.post("/levels-rewards/", upload.single("image"), createLevelRewardsController.handle);
routes.post("/recycling/", ensureAuthenticateUser, createRecyclingController.handle);
routes.post("/recycling/bottles/", createBottleController.handle);

routes.get("/", (request: Request, response: Response) => {
  response.json({ message: "Hello World" });
});
routes.get("/users/", ensureAuthenticateUser, listUsersController.handle);
routes.get("/profiles/", listProfilesController.handle);
routes.get("/levels", listLevelsController.handle);

routes.get("/users/:id", ensureAuthenticateUser, findUserController.handle);
routes.get("/bottles/", bottleDetailsController.handle);

routes.put(
  "/recycling/update-end-date/:id",
  ensureAuthenticateUser,
  updateEndDateController.handle
)

routes.patch("/reset-password/:token", resetPasswordController.handle);

export { routes };