import styled, {createGlobalStyle} from 'styled-components';
import { mainColor } from '../constants/colors';

export const GlobalStyle = createGlobalStyle`
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
`

export const MainContainer = styled.div`
width: 100vw;
height: 100vh;
background-color: ${mainColor.background};
color: white;
`