import type { NextApiRequest, NextApiResponse } from "next"
import { faker } from "@faker-js/faker"
import { Data } from "../../../util/types"

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data | { error: string }>
) {
	try {
		const projects = parseInt((req.query.projects as string) || "3")
		const employees = parseInt((req.query.employees as string) || "5")
		const entries = parseInt((req.query.entries as string) || "20")

		if (
			isNaN(projects) ||
			projects <= 0 ||
			isNaN(employees) ||
			employees <= 0 ||
			isNaN(entries) ||
			entries <= 0
		) {
			return res.status(400).json({ error: "Errore: Parametri non validi!" })
		}

		const projectsNames = []
		const employeesNames = []

		const result = []

		for (let i = 0; i < projects; i++) {
			projectsNames.push(`${faker.company.buzzAdjective()} ${faker.company.buzzNoun()}`)
		}

		for (let i = 0; i < employees; i++) {
			employeesNames.push(faker.person.fullName())
		}

		for (let i = 0; i < entries; i++) {
			const projectSeed = Math.floor(Math.random() * projectsNames.length)
			const employeeSeed = Math.floor(Math.random() * employeesNames.length)

			const project = {
				id: projectSeed.toString(),
				name: projectsNames[projectSeed],
			}
			const employee = {
				id: employeeSeed.toString(),
				name: employeesNames[employeeSeed],
			}
			const date = faker.date
				.between({ from: "2025-01-01", to: "2025-02-01" })
				.toISOString()
				.split("T")[0]
			const hours = faker.number.int({ min: 1, max: 6 })

			result.push({
				project,
				employee,
				date,
				hours,
			})
		}

		res.status(200).json(result)
	} catch (error) {
		console.error("Error in /api mockData:", error)
		res.status(500).json({ error: "Internal Server Error" })
	}
}
