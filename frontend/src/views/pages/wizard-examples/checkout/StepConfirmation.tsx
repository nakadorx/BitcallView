'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useSelector } from 'react-redux'

import { Box, Grid, Card, CardContent, Typography, Button, Divider, Stack } from '@mui/material'
import AndroidIcon from '@mui/icons-material/Android'
import AppleIcon from '@mui/icons-material/Apple'
import qrcode from 'qrcode'

// Utils Imports
import type { RootState } from '@/redux-store'
import { customLog } from '@/utils/commons'

interface StepConfirmationProps {
  sessionData: any
  orderData?: any // optional; if not provided, we'll use Redux state
}

const StepConfirmation = ({ sessionData, orderData }: StepConfirmationProps) => {
  // Consume the esimorderdetails slice from Redux.
  const reduxOrderDetails = useSelector((state: RootState) => state.esimorderdetails.data)

  // Use the passed orderData if available; otherwise, use the Redux state.
  const order = orderData || reduxOrderDetails

  // Derive details from either order (if available) or fallback to sessionData.
  const orderId = order?._id || sessionData?.metadata?.orderId || 'N/A'

  const totalPaid = order?.totalPrice
    ? order.totalPrice.toFixed(2)
    : sessionData
      ? (sessionData.amount_total / 100).toFixed(2)
      : '0.00'

  const currency = order?.currency || (sessionData?.currency ? sessionData.currency.toUpperCase() : '')

  const createdTime = order?.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : sessionData
      ? new Date(sessionData.created * 1000).toLocaleString()
      : 'N/A'

  const customerEmail = order?.customerEmail || sessionData?.customer_details?.email || 'N/A'

  // Extract the activation code from purchaseDetails if available.
  const activationCode =
    order?.purchaseDetails && order.purchaseDetails.length > 0
      ? order.purchaseDetails[0].activationCode
      : 'this-fallback-dummy-activationCode-For-Test-Purpose'

  // Construct the universal provisioning link for iOS.
  const universalLink = activationCode
    ? `https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=${encodeURIComponent(activationCode)}`
    : ''

  // State to hold the QR code image as a data URL.
  const [qrCodeImage, setQrCodeImage] = useState<string>('')

  // Generate the QR code image when activationCode changes.
  useEffect(() => {
    if (activationCode) {
      qrcode.toDataURL(activationCode, { width: 150, margin: 1 }, (err, url) => {
        if (err) {
          console.error('Failed to generate QR Code', err)
          setQrCodeImage('')
        } else {
          setQrCodeImage(url)
        }
      })
    }
  }, [activationCode])

  useEffect(() => {
    customLog('session in confirmation: ', sessionData)
    customLog('order in confirmation: ', order)
    customLog('activationCode: ', activationCode)
  }, [sessionData, order, activationCode])

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Grid container spacing={4} justifyContent='center'>
        {/* Main Confirmation Card */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack spacing={3} alignItems='center'>
                <Typography variant='h4' color='primary' sx={{ fontWeight: 'bold' }}>
                  Thank You! 😇
                </Typography>
                <Typography variant='subtitle1' textAlign='center'>
                  Your order <strong>#{orderId}</strong> has been successfully placed.
                </Typography>
                <Typography variant='body1' textAlign='center'>
                  We have sent an order confirmation and receipt to <strong>{customerEmail}</strong>. If you do not
                  receive it within two minutes, please check your spam folder.
                </Typography>
                <Stack direction='row' spacing={2} justifyContent='center'>
                  <Typography variant='body2'>
                    <strong>Order Time:</strong> {createdTime}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Total Paid:</strong> {currency} ${totalPaid}
                  </Typography>
                </Stack>

                {/* Instruction to choose a setup */}
                <Divider sx={{ width: '100%' }} />
                <Typography variant='body1' color='text.secondary' align='center'>
                  Choose which setup you prefer:
                </Typography>
                <Typography variant='body2' color='text.secondary' align='center'>
                  <strong>Setup 1:</strong> Manual (available for Android &amp; iOS) &nbsp;&nbsp;|&nbsp;&nbsp;
                  <strong>Setup 2:</strong> Automatic (iOS only)
                </Typography>
                <Divider sx={{ width: '100%' }} />

                {/* Setup 1: Manual */}
                <Stack spacing={2} alignItems='center' width='100%'>
                  <Typography variant='h6' sx={{ fontWeight: 500 }}>
                    Setup 1: Manual
                  </Typography>
                  <Grid container spacing={2} justifyContent='center'>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                      <AndroidIcon style={{ color: '#3DDC84', fontSize: 40 }} />
                      <Typography variant='subtitle1' sx={{ mt: 1 }}>
                        Android
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                      <AppleIcon style={{ color: '#000', fontSize: 40 }} />
                      <Typography variant='subtitle1' sx={{ mt: 1 }}>
                        iOS
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography variant='body2' color='text.secondary' align='center'>
                    Please scan the QR code below with your device for manual configuration.
                  </Typography>
                  {activationCode && qrCodeImage ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <img src={qrCodeImage} alt='QR Code' width={150} height={150} />
                    </Box>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      No QR Code available.
                    </Typography>
                  )}
                </Stack>

                <Divider sx={{ width: '100%' }} />

                {/* Setup 2: Automatic for iOS */}
                <Stack spacing={2} alignItems='center' width='100%'>
                  <Typography variant='h6' sx={{ fontWeight: 500 }}>
                    Setup 2: Automatic (iOS Only)
                  </Typography>
                  <Typography variant='body2' color='text.secondary' align='center'>
                    For a faster and easier setup on iOS, please use the automatic provisioning below.
                  </Typography>
                  {universalLink && (
                    <Button
                      variant='contained'
                      color='secondary'
                      startIcon={<AppleIcon style={{ color: '#fff' }} />}
                      href={universalLink}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Automatic eSIM Setup
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StepConfirmation
