import Row from "../../../Grid/Row"
import { useMain } from "../../../../index"
import Button from "../../../Buttons/Button"
import Icon from "../../../Icon/Icon"
import IconCarbonChevronLeft from "~icons/carbon/chevronLeft"
import Typography from "../../../Typograpy/Typogrphy"
import IconCarbonChevronRight from "~icons/carbon/chevronRight"

interface MonthHeaderProps {
	onMonthClick: () => void
	month: number
	year: number
	onNextMonthClick: () => void
	onPrevMonthClick: () => void
}

const MonthHeader = ({ onPrevMonthClick, onNextMonthClick, onMonthClick, month, year }: MonthHeaderProps) => {
	const {t} = useMain()
	return (
		<Row className="py-1 px-2 justify-between items-center">
			<Button className="p-[4px]"
			        colorsForStates="subtitle3"
			        colorsForStatesDark="body1"
			        onClick={onPrevMonthClick}
			        fab icon noPadding>
				<Icon size={16} color="colorScheme.light" colorDark="colorScheme.light">
					<IconCarbonChevronLeft/>
				</Icon>
			</Button>

			<Button onClick={onMonthClick} text>
				<Typography variant="small">
					{t ? t(`ui:calendar.months.${month}`) : month} {year}
				</Typography>
			</Button>

			<Button className="p-[4px]"
			        colorsForStates="subtitle3"
			        colorsForStatesDark="body1"
			        onClick={onNextMonthClick}
			        fab icon noPadding>
				<Icon size={16} color="colorScheme.light" colorDark="colorScheme.light">
					<IconCarbonChevronRight/>
				</Icon>
			</Button>
		</Row>
	)
}

export default MonthHeader
