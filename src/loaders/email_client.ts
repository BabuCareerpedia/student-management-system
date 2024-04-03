import { SENDGRID_API_KEY } from '@config'
import log from '@logger'
import * as nodeMailer from 'nodemailer'
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'

const TAG = 'loaders.email_client'

let emailClient: nodeMailer.Transporter<SentMessageInfo>;

export function emailClientLoader() {
  log.info(TAG + '.getEmailClientInstance()')
  try {
    if (emailClient) {
      return emailClient
    }

    emailClient = nodeMailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: SENDGRID_API_KEY
      }
    })
  } catch (error) {
    log.error('ERROR occurred in getEmailClientInstance()')

  }
}
