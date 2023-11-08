"use client";
import {useContext} from "react";
import {MainContext} from "./components/Main/MainContext";
// import {useTheme} from "next-themes"
import {ThemeContext} from "./components/Theme/ThemeContext";

export {default as AppBar} from './components/AppBar/AppBar'
export {default as Row} from './components/Grid/Row'
export {default as Col} from './components/Grid/Col'
export {default as Container} from './components/Grid/Container'
export {default as ConditionalAnimation} from './components/Animation/ConditionalAnimation'
export {default as Backdrop} from './components/Backdrop/Backdrop'
export {default as Button} from './components/Buttons/Button'
export {default as ATagButton} from './components/Buttons/ATagButton'
export {default as ColoredLink} from './components/Buttons/ColoredLink'
export {default as FormButton} from './components/Buttons/FormButton'
export {default as IconButton} from './components/Buttons/IconButton'
export {default as LinkButton} from './components/Buttons/LinkButton'
export {default as Icon} from './components/Icon/Icon'
export {default as Card} from './components/Cards/Card'
export {default as CardLinkButton} from './components/Cards/CardLinkButton'
export {default as Divider} from './components/Dividers/Divider'
export {default as LongDivider} from './components/Dividers/LongDivider'
export {default as Label} from './components/Form/Label'
export {default as ConditionalLabel} from './components/Form/ConditionalLabel'
export {default as HelperText} from './components/Form/HelperText'
export {default as TextField} from './components/Form/TextField'
export {default as TextArea} from './components/Form/TextArea'
export {default as Select} from './components/Form/Select'
export {default as Main} from './components/Main/Main'
export {default as MainProvider} from './components/Main/MainProvider'
export {default as Navigation} from './components/Navigation/Navigation'
export {default as NavigationItem} from './components/Navigation/NavigationItem'
export {default as Modal} from './components/Modal/Modal'
export {default as Portal} from './components/Portal/Portal'
export {default as ImpulseSpinner} from './components/Loaders/Impulse'
export {default as CubicProgress} from './components/Loaders/CubicProgress'
export {default as SideBar} from './components/SideBar/SideBar'
export {default as SideBarButton} from './components/SideBar/SideBarButton'
export {default as SideBarLink} from './components/SideBar/SideBarLink'
export {default as SideBarLinkWrapper} from './components/SideBar/SideBarLinkWrapper'
export {default as SimpleSideBar} from "./components/SideBar/SimpleSideBar"
export {default as Skeleton} from './components/Loaders/Skelton'
export {default as Tabs} from './components/Tabs/Tabs'
export {default as Tab} from './components/Tabs/Tab'
export {default as ThemeProvider} from './components/Theme/ThemeProvider'
export {default as ThemeToggle} from './components/Theme/ThemeToggle'
export {default as Tooltip} from './components/Tooltip/Tooltip'
export {default as Typography} from './components/Typograpy/Typogrphy'
export {default as theme} from './Utils/theme'
export {default as HamburgerSideBar} from './components/SideBar/HamburgerSideBar'
export {default as Table} from "./components/Table/Table"
export {default as List} from "./components/List/List"
export {default as ListItem} from "./components/List/ListItem"
export {default as Body} from "./components/Body/Body"

// export {useTheme}
export {default as useDimensions} from "./hooks/useDimensions"
export const useMain = () => useContext(MainContext)

export const useTheme = () => useContext(ThemeContext)
export const useIsDark = () => useThemeValue() === 'dark'
export const useThemeValue = () => useTheme().theme

export {default as useToasts} from "./hooks/useToasts"

