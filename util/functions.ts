export function displayDate(time: string): string {
	return new Date(time).toLocaleDateString("en-UK", {
		year: "numeric",
		month: "short",
		day: "numeric",
	})
}
