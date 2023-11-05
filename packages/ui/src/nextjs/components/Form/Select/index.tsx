import { useContext } from "react"
import { SelectContext } from "./SelectContext"

export {default as Control} from './Control'
export {default as DropdownIndicator} from './DropdownIndicator'
export {default as MultiValue} from './MultiValue'
export {default as MultiValueRemove} from './MultiValueRemove'
export {default as Option} from './Option'
export {default as selectStyles} from './SelectStyles'

export const useSelect = () => useContext (SelectContext)
export const useIsSelectDark = () => useSelect().theme.isDark

export {default as default} from './Select'
