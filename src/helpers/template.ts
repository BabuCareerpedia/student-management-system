// import htmlPdf, {FileInfo} from 'html-pdf';
// import log from 'logger';
//
// export async function generateHtmlFromData(data: any, template: HandlebarsTemplateDelegate): Promise<string> {
//     log.info('generateHtmlFromData()');
//     log.debug('STARTED file Generating html from data');
//     try {
//         return template(data);
//     } catch (e) {
//         log.error('ERROR occurred generateHtmlFromData() ', e);
//         throw e;
//     }
// }
//
// export async function generateHtmlToBuffer(html: string): Promise<Buffer> {
//     log.info('generateHtmlToPdf()');
//     log.debug('STARTED conversion from Html to Pdf');
//     try {
//         return new Promise((resolve, reject) => {
//             htmlPdf.create(html, {
//                 format: 'A4',
//                 quality: '100',
//                 border: {
//                     top: '0.3in',
//                     right: '0.3in',
//                     bottom: '0.3in',
//                     left: '0.3in',
//                 },
//             }).toBuffer((error, res) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(res);
//                 }
//             });
//         });
//     } catch (e) {
//         log.error('ERROR occurred generateHtmlToPdf() ', e);
//         throw e;
//     }
// }
