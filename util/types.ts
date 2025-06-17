export type Project = {
	id: number
	name: string
}

export type Employee = {
	id: number
	name: string
}

export type Entry = {
	project: Project
	employee: Employee
	date: string
	hours: number
}

export type Data = Entry[]
