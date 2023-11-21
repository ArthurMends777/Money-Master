import styled from 'styled-components/native';

export const Background = styled.View`
  flex:1;
  background-color: #F0F4FF;
`;

export const Input = styled.TextInput`
  height: 50px;
  width: 90%;
  background-color: #D9D9D8;
  font-size: 17px;
  padding: 0 8px;
  margin-bottom: 14px;
  border-radius: 4px;
`;

export const SubmitButton = styled.TouchableOpacity`
  width: 90%;
  height: 50px;
  align-items: center;
  justify-content: center;
  background-color: #00755C;
  border-radius: 4px;
`;

export const SubmitText = styled.Text`
  color: #FFF;
  font-size: 21px;
  font-weight: bold;
`;

export const BtnReceita = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  width: 45%;
  height: 50px;
  align-items: center;
  justify-content: center;
  background-color: #9F9F9F;
  border-radius: 4px;
`;
