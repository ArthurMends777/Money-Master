import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  flex-direction: ${({ dir }) => dir || 'column'};
  align-items: ${({ align }) => align || 'flex-start'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  background-color: ${({ bg, theme }) => theme.colors[bg || 'white']};
  width: ${({ theme, w }) => (w ? `${theme.metrics.px(w)}px` : '100%')};
  height: ${({ theme, h }) => (h ? `${theme.metrics.px(h)}px` : '100%')};
  margin-top: ${({ theme, mt }) => theme.metrics.px(mt || 0)}px;
  margin-left: ${({ theme, ml }) => theme.metrics.px(ml || 0)}px;
  border-radius: ${({ theme, br }) => theme.metrics.px(br || 0)}px;
  margin-right: ${({ theme, mr }) => theme.metrics.px(mr || 0)}px;
`

export const ScrollContainer = styled.ScrollView`
  display: flex;
  flex-direction: ${({ dir }) => dir || 'column'};
  background-color: ${({ bg, theme }) => theme.colors[bg || 'roxo']};
  width: ${({ theme, w }) => (w ? `${theme.metrics.px(w)}px` : '100%')};
  height: ${({ theme, h }) => (h ? `${theme.metrics.px(h)}px` : '100%')};
  margin-top: ${({ theme, mt }) => theme.metrics.px(mt || 0)}px;
  margin-left: ${({ theme, ml }) => theme.metrics.px(ml || 0)}px;
`
