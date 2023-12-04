import styled from 'styled-components/native';

export const Input = styled.TextInput`
    padding: 10px;
    margin-top: 10px;
    font-size: 18px;
    border: 1px solid #000;
    width: 80%;
`;

export const CategoryItemContainer = styled.View`
    display: flex;
    align-items: center;
    margin-top: 10px;
    background-color: #7A0053;
    padding: 5px;
    border-radius: 5px;
    height: 90px;
    justify-content: center;
    width: 300px;
`;

export const EditButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 10px;
`;

export const EditButtonText = styled.Text`
  color: white;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 5px 10px;
  border-radius: 5px;
`;

export const DeleteButtonText = styled.Text`
  color: white;
`;


export const ModalContainer = styled.Modal`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  padding: 20px;
  background-color: white;
  width: 80%;
  border-radius: 10px;
`;

export const ModalInput = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const ModalButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;