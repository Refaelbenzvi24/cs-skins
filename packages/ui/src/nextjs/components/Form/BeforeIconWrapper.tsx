import styled from "@emotion/styled";
import {css} from "@emotion/react";
import theme from "../../Utils/theme";
import tw from "twin.macro";

const BeforeIconWrapper = styled.div(() => [
	css`
    color: ${theme.colorScheme.subtitle1};
    ${tw`ltr:pl-[22px] rtl:pr-[22px]`};
    display: flex;
    justify-content: center;
    position: absolute;
    align-items: center;
	`,
])

export default BeforeIconWrapper
