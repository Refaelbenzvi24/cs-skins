import type { Theme } from "@nivo/core"
import { theme } from "@acme/ui"


export const chartThemeDark: Theme = {
	background: "transparent",
	axis:       {
		domain: {
			line: {
				stroke:      "transparent", // grid basis(x/y lines) color
				strokeWidth: 1
			}
		},
		legend: {
			text: {
				fontSize:     12,
				fill:         theme.colorScheme.subtitle2, // titles text color,
				outlineWidth: 0,
				outlineColor: "transparent"
			}
		},
		ticks:  {
			line: {
				stroke:      theme.colorScheme.light, // metrics pointers color
				strokeWidth: 1
			},
			text: {
				fontSize:     11,
				fill:         theme.colorScheme.light, // metrics numbers color
				outlineWidth: 0,
				outlineColor: "transparent"
			}
		}
	},
	grid:       {
		line: {
			stroke:      theme.colorScheme.body2, // grid lines color
			strokeWidth: 1
		}
	},
	legends:    {
		// title: {
		// 	text: {
		// 		fontSize: 11,
		// 		fill: "#333333",
		// 		outlineWidth: 0,
		// 		outlineColor: "transparent"
		// 	}
		// },
		text: {
			fontSize:     11,
			fill:         theme.colorScheme.light, // legends text color
			outlineWidth: 0,
			outlineColor: "transparent"
		},
		// ticks: {
		// 	line: {},
		// 	text: {
		// 		fontSize: 10,
		// 		fill: "#333333",
		// 		outlineWidth: 0,
		// 		outlineColor: "transparent"
		// 	}
		// }
	},
	// annotations: {
	// 	text: {
	// 		fontSize: 13,
	// 		fill: "#333333",
	// 		outlineWidth: 2,
	// 		outlineColor: "#ffffff",
	// 		outlineOpacity: 1
	// 	},
	// 	link: {
	// 		stroke: "#000000",
	// 		strokeWidth: 1,
	// 		outlineWidth: 2,
	// 		outlineColor: "#ffffff",
	// 		outlineOpacity: 1
	// 	},
	// 	outline: {
	// 		stroke: "#000000",
	// 		strokeWidth: 2,
	// 		outlineWidth: 2,
	// 		outlineColor: "#ffffff",
	// 		outlineOpacity: 1
	// 	},
	// 	symbol: {
	// 		fill: "#000000",
	// 		outlineWidth: 2,
	// 		outlineColor: "#ffffff",
	// 		outlineOpacity: 1
	// 	}
	// },
	tooltip: {
		container:      {
			background: theme.colorScheme.overlaysDark,
			fontSize:   12
		},
		basic:          {},
		chip:           {},
		table:          {},
		tableCell:      {},
		tableCellValue: {}
	}
}

export const chartTheme: Theme = {}
