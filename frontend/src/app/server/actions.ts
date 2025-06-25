/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

// Data Imports
// @ts-ignore
import nodemailer from 'nodemailer'

import { customLog } from '@/utils/commons'

/**
 * Send Email Action
 */
export const sendEmail = async (subject: string, text: string) => {
  // Validate input
  if (!subject || !text) {
    throw new Error('Subject and text are required.')
  }

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject,
    text
  }

  try {
    // Send the email
    customLog('process.env.EMAIL_SERVICE', process.env.EMAIL_SERVICE)
    customLog('process.env.EMAIL_USER', process.env.EMAIL_USER)
    await transporter.sendMail(mailOptions)

    return { success: true, message: 'Email sent successfully.' }
  } catch (error: any) {
    console.error('Error sending email:', error.message)
    throw new Error('Failed to send email.')
  }
}
