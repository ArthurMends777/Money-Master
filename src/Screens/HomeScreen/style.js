import styled from 'styled-components/native'

export const SaldoContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80%;
  background-color: #D9D9D9;
  height: 100%;
  border-radius: 10px;
  margin-bottom: ${({ theme, mb }) => theme.metrics.px(mb || 0)}px;
`

export const Totais = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
`

export const ContainerMovimentacao = styled.View`
  display: flex;
  align-items: center;
  width: 95%;
  background-color: #fff;
  height: 100%;
  margin-bottom: ${({ theme, mb }) => theme.metrics.px(mb || 10)}px;
`

export const UltimasMovis = styled.View`
  display: flex;
  width: 95%;
  justify-content: space-between;
  background-color: #D9D9D9;
  height: 100px;
  margin-bottom: ${({ theme, mb }) => theme.metrics.px(mb || 10)}px;
`

export const CustomText = styled.View`
  font-size: ${({ theme, size }) => theme.metrics.px(size || 24)}px;
  font-weight: ${({ weight }) => [weight || 'normal']};
  color: ${({ color, theme }) => theme.colors[color || 'black']};
  background-color: ${({ bg, theme }) => theme.colors[bg || 'green']};
  border-radius: 5px;
  width: 110px;
  padding: 10px;
  margin-top: ${({ theme, mt }) => theme.metrics.px(mt || 0)}px;
  margin-bottom: ${({ theme, mb }) => theme.metrics.px(mb || 0)}px;
  margin-left: ${({ theme, ml }) => theme.metrics.px(ml || 0)}px;
  margin-right: ${({ theme, mr }) => theme.metrics.px(mr || 0)}px;
`

export const Filter = styled.TouchableOpacity`
  padding: 2px;
  background-color: #D9D9D9;
`