// tslint:disable-next-line:no-var-requires
//const AWS = require('aws-sdk');
import {S3_STORE} from '@constants/app_defaults';
import log from '@logger';
import {AWS_S3} from '@config';

let s3Connection;

export function s3ConnectionLoader() {
    log.info(`s3ConnectionLoader()`);
    log.debug(`creating AWS connection with config: ${JSON.stringify(AWS_S3)}`);
    try {
        if (s3Connection) {
            return s3Connection;
        }
     /*   if (AWS_S3.accessKeyId && AWS_S3.secretAccessKey && AWS_S3.region && AWS_S3.bucketName) {
            S3_STORE.enabled = true;
        }
        AWS.config.update({
            accessKeyId: AWS_S3.accessKeyId,
            secretAccessKey: AWS_S3.secretAccessKey,
            acl: AWS_S3.acl,
            region: AWS_S3.region,
        });
        s3Connection = new AWS.S3();*/
        return s3Connection;
    } catch (e) {
        log.error('ERROR Occurred while creating AWSConnection()', e);
    }
}
