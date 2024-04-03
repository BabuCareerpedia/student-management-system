import {AUTHENTICATION} from '@constants/app_defaults';
import {NextFunction, Response, Router} from 'express';
const router = Router();

router.route('/test')
    .get(async (req: any, res: Response, next: NextFunction) => {
           // await generateStudentPdf({createdDate:new Date()},'test8.pdf',true);
        res.status(200).send({message: 'dummy test done'});
    });
router.route('/testAPI')
    .get(async (req: any, res: Response, next: NextFunction) => {
       // await updateActiveEmployees();
        //await updateSubdomainsInDB();
     //    await updateHeadcountInDB();
       // await insertHeadCountForUnchangedGrpCompanies({client_id:194});
        res.status(200).send({message: 'dummy test done'});
    });
router.route('/authenticate/:authenticate')
    .get((req: any, res: Response, next: NextFunction) => {
        AUTHENTICATION.enabled = req.params.authenticate !== 'false';
        res.status(200).send({message: 'Authentication ' + (AUTHENTICATION.enabled === true ? 'enabled' : 'disabled')});

    });
export default router;
