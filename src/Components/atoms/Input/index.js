import styled from 'styled-components/native'

export const InputLogin = styled.TextInput `
    margin-top: ${({ theme, mt }) => theme.metrics.px(mt || 10)}px;
    margin-bottom: ${({ theme, mb }) => theme.metrics.px(mb || 10)}px;
    margin-left: ${({ theme, ml }) => theme.metrics.px(ml || 0)}px;
    font-size: ${({ theme, size }) => theme.metrics.px(size || 18)}px;
    width: ${({ theme, w }) => (w ? `${theme.metrics.px(w)}px` : '85%')};
    background-color: ${({ bg, theme }) => theme.colors[bg || 'white']};
    padding: 15px;
    border-radius: 5px;
    color: ${({ color, theme }) => theme.colors[color || 'black']};
`;