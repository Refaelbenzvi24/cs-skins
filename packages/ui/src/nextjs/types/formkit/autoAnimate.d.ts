import type {AutoAnimateOptions, AutoAnimationPlugin, AnimationController} from "@formkit/auto-animate"

declare module "@formkit/auto-animate" {
	declare const autoAnimate: (el: HTMLElement, config?: Partial<AutoAnimateOptions> | AutoAnimationPlugin) => AnimationController
	export default autoAnimate
}
