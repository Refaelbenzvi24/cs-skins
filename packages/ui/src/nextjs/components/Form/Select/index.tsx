import { useContext } from "react"
import { SelectContext } from "./SelectContext"

export {default as Control} from './Control'
export {default as DropdownIndicator} from './DropdownIndicator'
export {default as IndicatorSeparator} from './IndicatorSeparator'
export {default as Input} from './Input'
export {default as LoadingIndicator} from './LoadingIndicator'
export {default as Menu} from './Menu'
export {default as MultiValue} from './MultiValue'
export {default as MultiValueRemove} from './MultiValueRemove'
export {default as Option} from './Option'
export {default as Placeholder} from './Placeholder'
export {default as SelectContainer} from './SelectContainer'
export {default as SingleValue} from './SingleValue'
export {default as ValueContainer} from './ValueContainer'

export const useSelect = () => useContext (SelectContext)
export const useIsSelectDark = () => useSelect().theme.isDark
