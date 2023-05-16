import createCache from '@emotion/cache'
import {CacheProvider, Global} from '@emotion/react'
import {GlobalStyles as BaseStyles} from 'twin.macro'
import "@acme/ui/src/nextjs/styles/globals.css"
import "../styles/index.css"
import {MainProvider} from "@acme/ui"
import {useDarkMode} from 'storybook-dark-mode';
import {ThemeContext} from "@acme/ui/src/nextjs/components/Theme/ThemeContext";
import {ThemeProvider as EmotionThemeProvider} from '@emotion/react'
import GlobalStyles from "@acme/ui/src/nextjs/styles/GlobalStyles";
import {RouterContext} from "next/dist/shared/lib/router-context";


export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},

    darkMode: {
        stylePreview: true,
        classTarget:  'html'
    },

    nextRouter: {
        Provider: RouterContext.Provider,
    },

    controls: {
        matchers: {
            color: /(background|color)$/i,
            date:  /Date$/,
        },
    }
}

const cache = createCache({
    prepend: true,
    key:     'sb',
    // This disables vendor prefixing in storybook and storyshots snapshots
    ...((process.env.NODE_ENV === 'development' || 'test') && {
        stylisPlugins: [],
    }),
});


export const decorators = [
           (Story, context) => (
               <div id="__next">
                   <MainProvider defaults={{isAnimationsActive: false}}>
                       <CacheProvider value={cache}>
                           <ThemeContext.Provider value={{theme: useDarkMode() ? 'dark' : 'light', toggleTheme: () => ''}}>
                               <EmotionThemeProvider theme={{isDark: useDarkMode()}}>
                                   <BaseStyles/>
                                   <GlobalStyles/>
                                   <Global styles={{html: {scrollBehavior: 'smooth'}}}/>
                                   {Story(context)}
                               </EmotionThemeProvider>
                           </ThemeContext.Provider>
                       </CacheProvider>
                   </MainProvider>
               </div>
           )
       ]
;
