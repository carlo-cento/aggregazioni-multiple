export type Project = {
	id: string
	name: string
}

export type Employee = {
	id: string
	name: string
}

export type Entry = {
	project: Project
	employee: Employee
	date: string
	hours: number
}

export type Data = Entry[]

export type GroupedEntry = Record<
	string,
	{ totalHours: number; keyParts: string[]; entries: Entry[] }
>

export type ProcessedEntry = {
	project: string
	employee: string
	date: string
	hours: number
}

export type GroupKey = "employee" | "project" | "date"
