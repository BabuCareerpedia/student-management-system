import * as APIPaths from '@constants/api_path_constants';
import {Router} from 'express';
import AuthRoutes from './auth';
import dummyRoutes from './dummy';
import UserRoutes from './user';
import ProfileRoutes from './profile'
import  UserDemo from './demo'

const router = Router();

router.use('/dummy', dummyRoutes);
router.use(APIPaths.ROUTER_AUTH, AuthRoutes);
router.use(APIPaths.ROUTER_USER, UserRoutes);
router.use(APIPaths.ROUTER_PROFILE,ProfileRoutes );
router.use("/user", UserDemo);

export default router;
