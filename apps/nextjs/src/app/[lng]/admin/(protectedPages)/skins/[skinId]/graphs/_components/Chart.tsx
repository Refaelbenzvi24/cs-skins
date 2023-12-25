"use client";
import type { Serie } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line"
import { chartTheme, chartThemeDark } from "~/app/[lng]/admin/(protectedPages)/skins/[skinId]/graphs/_components/chartTheme"
import { useIsDark } from "@acme/ui"

interface ChartProps {
	data: Serie[]
	xText?: string
	yText?: string
}

const Chart = ({ data, xText, yText }: ChartProps) => {
	const isDark = useIsDark()
	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
			xScale={{ type: "time" }}
			yScale={{
				type: "linear",
				min:  data.reduce((min, { data }) => Math.min(min, ...data.map(({ y }) => y as number)), Infinity) * 0.98,
				max:  data.reduce((max, { data }) => Math.max(max, ...data.map(({ y }) => y as number)), -Infinity) * 1.02
			}}
			curve={"linear"}
			axisBottom={{
				legend:         xText,
				legendPosition: "middle",
				legendOffset:   40,
				format:         () => ""
			}}
			axisLeft={{
				legend:         yText,
				legendPosition: "middle",
				legendOffset:   -50
			}}
			theme={isDark ? chartThemeDark : chartTheme}
			axisTop={null}
			axisRight={null}
			enablePoints={false}
			pointSize={10}
			pointColor={{ theme: "background" }}
			pointBorderWidth={2}
			pointBorderColor={{ from: "serieColor" }}
			pointLabelYOffset={-12}
			useMesh={true}
			legends={[
				{
					anchor:            "bottom-right",
					direction:         "column",
					justify:           false,
					translateY:        0,
					translateX:        100,
					itemsSpacing:      1,
					itemDirection:     "left-to-right",
					itemWidth:         120,
					itemHeight:        20,
					itemOpacity:       0.75,
					symbolSize:        12,
					symbolShape:       "circle",
					symbolBorderColor: "rgba(0, 0, 0, .5)",
					effects:           [
						{
							on:    "hover",
							style: {
								itemBackground: "rgba(0, 0, 0, .03)",
								itemOpacity:    1
							}
						}
					]
				}
			]}
		/>
	)
}

export default Chart
