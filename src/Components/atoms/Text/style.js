import styled from 'styled-components/native'

export const CustomText = styled.Text`
  font-size: ${({ theme, size }) => theme.metrics.px(size || 24)}px;
  font-weight: ${({ weight }) => [weight || 'normal']};
  color: ${({ color, theme }) => theme.colors[color || 'black']};
  margin-top: ${({ theme, mt }) => theme.metrics.px(mt || 0)}px;
  margin-bottom: ${({ theme, mb }) => theme.metrics.px(mb || 0)}px;
  margin-left: ${({ theme, ml }) => theme.metrics.px(ml || 0)}px;
  margin-right: ${({ theme, mr }) => theme.metrics.px(mr || 0)}px;
`