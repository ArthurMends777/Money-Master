import React from 'react'
import { CustomText } from './style'

export const Text = ({ children, ...props }) => {
  return <CustomText {...props}>{children}</CustomText>
}
