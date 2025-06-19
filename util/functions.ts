export function displayDate(time: string): string {
	return new Date(time).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric",
	})
}

export const getEmployeeName = (value: string, map: Map<string, string>) => {
	return map.get(value) || `Employee id: ${value}`
}

export const getProjectName = (value: string, map: Map<string, string>) => {
	return map.get(value) || `Project id: ${value}`
}
