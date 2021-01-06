import { Router, request, response } from 'express';
import CreateUserService from '@modules/users/services/CreateUsersService';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import UpadateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);


usersRouter.post('/', async (request, response) => {

    const { name, email, password } = request.body;
    
    const userRepository = new UsersRepository();
    const createUser = new CreateUserService(userRepository);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);

});

usersRouter.patch('/avatar',ensureAuthenticated,upload.single('avatar'), async (request, response) => {

    const updateUserAvatar = new UpadateUserAvatarService(userRepository);

   const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename:request.file.filename,
    });

    delete user.password;
    return response.json(user);


});

export default usersRouter;
