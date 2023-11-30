import { useEffect, useState } from "react"
import Row from "../../../Grid/Row"
import Button from "../../../Buttons/Button"
import Icon from "../../../Icon/Icon"
import Typography from "../../../Typograpy/Typogrphy"
import IconCarbonChevronLeft from "~icons/carbon/chevronLeft"
import IconCarbonChevronRight from "~icons/carbon/chevronRight"


interface YearHeaderProps {
	onYearClick: () => void
	value: number
	onNextYearClick?: () => void
	onPrevYearClick?: () => void
}

const YearHeader = ({ onYearClick, value, onPrevYearClick, onNextYearClick }: YearHeaderProps) => {
	const [year, setYear] = useState<number> (value)

	useEffect (() => {
		setYear (value)
	}, [value]);

	return (
		<Row className="py-1 px-2 justify-between items-center">
			<Button className="p-[4px]"
			        colorsForStates="subtitle3"
			        colorsForStatesDark="body1"
			        onClick={() => {
				        if (onPrevYearClick) onPrevYearClick ()
				        setYear (year - 1)
			        }}
			        fab icon noPadding>
				<Icon size={16} color="colorScheme.light" colorDark="colorScheme.light">
					<IconCarbonChevronLeft/>
				</Icon>
			</Button>

			<Button onClick={onYearClick} text>
				<Typography variant="small">
					{year}
				</Typography>
			</Button>

			<Button className="p-[4px]"
			        colorsForStates="subtitle3"
			        colorsForStatesDark="body1"
			        onClick={() => {
				        if (onNextYearClick) onNextYearClick ()
				        setYear (year + 1)
			        }}
			        fab icon noPadding>
				<Icon size={16} color="colorScheme.light" colorDark="colorScheme.light">
					<IconCarbonChevronRight/>
				</Icon>
			</Button>
		</Row>
	)
}

export default YearHeader
