import 'twin.macro'
import type { css as cssImport } from '@emotion/react'
import type { CSSInterpolation } from '@emotion/serialize'
import type styledImport from '@emotion/styled'
import type {DOMAttributes} from "react";

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport
  const css: typeof cssImport
}

declare module 'react' {
  interface DOMAttributes<T> {
    tw?: string
    css?: CSSInterpolation
  }
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation
    tw?: string
  }
  // The inline svg css prop
  interface SVGProps extends SVGProps<SVGSVGElement> {
    css?: CSSInterpolation
    tw?: string
  }
}

