"use client";
import { ResponsiveLine, Serie } from "@nivo/line"
import moment from "moment"


const data = [
	{
		"id":    "japan",
		"color": "hsl(255, 70%, 50%)",
		"data":  [
			{
				"x": "plane",
				"y": 277
			},
			{
				"x": "helicopter",
				"y": 191
			},
			{
				"x": "boat",
				"y": 118
			},
			{
				"x": "train",
				"y": 17
			},
			{
				"x": "subway",
				"y": 35
			},
			{
				"x": "bus",
				"y": 232
			},
			{
				"x": "car",
				"y": 25
			},
			{
				"x": "moto",
				"y": 71
			},
			{
				"x": "bicycle",
				"y": 185
			},
			{
				"x": "horse",
				"y": 169
			},
			{
				"x": "skateboard",
				"y": 151
			},
			{
				"x": "others",
				"y": 125
			}
		]
	},
	{
		"id":    "france",
		"color": "hsl(97, 70%, 50%)",
		"data":  [
			{
				"x": "plane",
				"y": 273
			},
			{
				"x": "helicopter",
				"y": 218
			},
			{
				"x": "boat",
				"y": 136
			},
			{
				"x": "train",
				"y": 113
			},
			{
				"x": "subway",
				"y": 122
			},
			{
				"x": "bus",
				"y": 298
			},
			{
				"x": "car",
				"y": 235
			},
			{
				"x": "moto",
				"y": 128
			},
			{
				"x": "bicycle",
				"y": 219
			},
			{
				"x": "horse",
				"y": 213
			},
			{
				"x": "skateboard",
				"y": 141
			},
			{
				"x": "others",
				"y": 296
			}
		]
	},
	{
		"id":    "us",
		"color": "hsl(198, 70%, 50%)",
		"data":  [
			{
				"x": "plane",
				"y": 149
			},
			{
				"x": "helicopter",
				"y": 253
			},
			{
				"x": "boat",
				"y": 283
			},
			{
				"x": "train",
				"y": 103
			},
			{
				"x": "subway",
				"y": 36
			},
			{
				"x": "bus",
				"y": 33
			},
			{
				"x": "car",
				"y": 83
			},
			{
				"x": "moto",
				"y": 35
			},
			{
				"x": "bicycle",
				"y": 287
			},
			{
				"x": "horse",
				"y": 218
			},
			{
				"x": "skateboard",
				"y": 234
			},
			{
				"x": "others",
				"y": 117
			}
		]
	},
	{
		"id":    "germany",
		"color": "hsl(244, 70%, 50%)",
		"data":  [
			{
				"x": "plane",
				"y": 287
			},
			{
				"x": "helicopter",
				"y": 232
			},
			{
				"x": "boat",
				"y": 239
			},
			{
				"x": "train",
				"y": 6
			},
			{
				"x": "subway",
				"y": 76
			},
			{
				"x": "bus",
				"y": 247
			},
			{
				"x": "car",
				"y": 122
			},
			{
				"x": "moto",
				"y": 118
			},
			{
				"x": "bicycle",
				"y": 159
			},
			{
				"x": "horse",
				"y": 230
			},
			{
				"x": "skateboard",
				"y": 280
			},
			{
				"x": "others",
				"y": 28
			}
		]
	},
	{
		"id":    "norway",
		"color": "hsl(319, 70%, 50%)",
		"data":  [
			{
				"x": "plane",
				"y": 96
			},
			{
				"x": "helicopter",
				"y": 106
			},
			{
				"x": "boat",
				"y": 230
			},
			{
				"x": "train",
				"y": 14
			},
			{
				"x": "subway",
				"y": 236
			},
			{
				"x": "bus",
				"y": 274
			},
			{
				"x": "car",
				"y": 54
			},
			{
				"x": "moto",
				"y": 234
			},
			{
				"x": "bicycle",
				"y": 81
			},
			{
				"x": "horse",
				"y": 212
			},
			{
				"x": "skateboard",
				"y": 207
			},
			{
				"x": "others",
				"y": 80
			}
		]
	}
]

interface ChartProps {
	data: Serie[]
}

const Chart = (props: ChartProps) => {
	console.log(props)

	return (
		<ResponsiveLine
			data={props.data}
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
			xScale={{ type: "point" }}
			yScale={{
				type:    "linear",
				min:     "auto",
				max:     "auto",
				stacked: true,
				reverse: false
			}}
			yFormat=" >-.2f"
			curve={"cardinal"}
			axisBottom={{
				legend:         "Date",
				legendPosition: "middle",
				legendOffset:   40,
				format:         () => ""
			}}
			axisLeft={{
				legend:         "Price",
				legendPosition: "middle",
				legendOffset:   -50
			}}
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
					itemsSpacing:      0,
					itemDirection:     "left-to-right",
					itemWidth:         80,
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
