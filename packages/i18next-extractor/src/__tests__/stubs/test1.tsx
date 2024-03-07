const t = (testString: string) => testString

const test1 = () => {
	const testString = "common:search.mustBeLongerThan2"
	const testString1 = "common:search.mustBeLongerThan1"
	const testString2 = "common:search.mustBeLongerThan4"
	const result = t(testString)
	const result1 = t(testString1)
	const result2 = t(testString2)

	const test1       = "test123"
	const test2       = "test456"
	const translation = t("common:search.mustBeLongerThan2")
	const translation4 = t("common:search.mustBeLongerThan2")

}
