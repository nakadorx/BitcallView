// React Imports
import React, { useState } from 'react'

// Next Imports
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

// MUI Imports
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

// Redux Imports
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/redux-store'
import { updatePlanQuantity, removePlan } from '@/redux-store/slices/cart'

// Utils
import { getLocale } from '@/utils/commons'

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cartReducer.plans)
  const [confirmDeletePlanCode, setConfirmDeletePlanCode] = useState<string | null>(null)
  const locale = getLocale()
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleQuantityChange = (planCode: string, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(updatePlanQuantity({ planCode, quantity: newQuantity }))
  }

  const handleRemove = (planCode: string) => {
    dispatch(removePlan(planCode))
  }

  // Remove item if image fails to load
  const handleImageError = (planCode: string) => {
    handleRemove(planCode)
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <>
      <Drawer anchor='right' open={open} onClose={onClose}>
        <Box
          sx={{
            width: { xs: 300, sm: 400 },
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h6'>Your Cart</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Cart Items List */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {cartItems.length === 0 ? (
              <Typography variant='body1' sx={{ mt: 2 }}>
                Your cart is empty.
              </Typography>
            ) : (
              cartItems.map(item => (
                <Box
                  key={item.planCode}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: 'background.paper'
                  }}
                >
                  {/* Top Row: Flag & Plan Name and Desktop Price/Delete */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {item.customFlag && (
                      <Box sx={{ mr: 1 }}>
                        <Image
                          src={item.customFlag}
                          alt={item.name}
                          width={isMobile ? 40 : 50}
                          height={isMobile ? 28 : 35}
                          objectFit='contain'
                          onError={() => handleImageError(item.planCode)}
                        />
                      </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant='subtitle1' sx={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                        {item.name}
                      </Typography>
                    </Box>
                    {/* Desktop-only: Price & Delete Icon */}
                    <Stack spacing={0.5} alignItems='flex-end' sx={{ display: { xs: 'none', md: 'flex' } }}>
                      <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                        {item.currency} {item.price.toFixed(2)}
                      </Typography>
                      <IconButton onClick={() => setConfirmDeletePlanCode(item.planCode)}>
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Middle Row: Quantity Controls & Mobile Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => handleQuantityChange(item.planCode, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        size='small'
                      >
                        <RemoveIcon fontSize='small' />
                      </IconButton>
                      <TextField
                        type='number'
                        size='small'
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.planCode, Number(e.target.value))}
                        inputProps={{
                          min: 1,
                          style: {
                            textAlign: 'center',
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield'
                          }
                        }}
                        sx={{ width: 70, mx: 1 }}
                      />
                      <IconButton onClick={() => handleQuantityChange(item.planCode, item.quantity + 1)} size='small'>
                        <AddIcon fontSize='small' />
                      </IconButton>
                    </Box>
                    <Typography variant='body2' sx={{ fontWeight: 'bold', display: { xs: 'flex', md: 'none' } }}>
                      {item.currency} {item.price.toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Bottom Row: Mobile-only Delete Icon */}
                  <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => setConfirmDeletePlanCode(item.planCode)} size='small'>
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Total and Action Buttons */}
          <Box sx={{ mb: 2 }}>
            <Typography variant='h6'>
              Total: {cartItems.length > 0 ? `${cartItems[0].currency} ${totalPrice.toFixed(2)}` : 'N/A'}
            </Typography>
          </Box>
          <Stack spacing={1}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={() => {
                onClose()
                router.push(`/${locale}/checkout`)
              }}
            >
              Proceed to Checkout
            </Button>
            <Button variant='outlined' fullWidth onClick={onClose}>
              Continue Shopping
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      {confirmDeletePlanCode && (
        <Dialog open={Boolean(confirmDeletePlanCode)} onClose={() => setConfirmDeletePlanCode(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to remove this item from your cart?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeletePlanCode(null)}>Cancel</Button>
            <Button
              color='error'
              onClick={() => {
                handleRemove(confirmDeletePlanCode)
                setConfirmDeletePlanCode(null)
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default CartSidebar
