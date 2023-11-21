import styled from 'styled-components/native'

export const HeaderContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  background-color: #7A0053;
  height: ${({ theme }) => theme.metrics.px(100)}px;
  margin-bottom: ${({ theme, mb }) => theme.metrics.px(mb || 0)}px;
`