import styled from "styled-components/native"

export const BtnAcont = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    background-color: ${({ bg, theme }) => theme.colors[bg || 'roxoText']};
    border-radius: 5px;
    width: ${({ theme, w }) => (w ? `${theme.metrics.px(w)}px` : '85%')};
    height: ${({ theme, h }) => (h ? `${theme.metrics.px(h)}px` : '50')}px;
    justify-content: center;
    margin: 5px;
    align-items: center;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 1.2);
`

export const BtnLogin = styled.TouchableOpacity`
    background-color: #502779;
    border-radius: 5px;
    width: ${({ theme, w }) => (w ? `${theme.metrics.px(w)}px` : '85%')};
    height: ${({ theme, h }) => (h ? `${theme.metrics.px(h)}px` : '50')}px;
    margin-top: ${({ theme, mt }) => theme.metrics.px(mt || 0)}px;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 1.2);
`

export const BtnCategory = styled.TouchableOpacity`
    background-color: #6DBDDF;
    padding: 20px;
    border-radius: 10px;
    width: ${({ theme, w }) => (w ? `${theme.metrics.px(w)}px` : '100%')};
    margin: ${({ theme, margin }) => theme.metrics.px(margin || 0)}px;
    align-items: ${({ align }) => align || 'center'};
    justify-content: ${({ justify }) => justify || 'center'};
`
