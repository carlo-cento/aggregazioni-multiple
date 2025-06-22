import { getEmployeeName, getProjectName } from "../../util/functions"

describe("Utility Functions", () => {
	describe("getEmployeeName", () => {
		const mockEmployeesMap = new Map([
			["1", "Mario Rossi"],
			["2", "Giovanni Bianchi"],
			["3", "Sergio Neri"],
		])

		test("return correct employee name for valid ID", () => {
			const result = getEmployeeName("1", mockEmployeesMap)
			expect(result).toBe("Mario Rossi")
		})

		test("return fallback for non existent ID", () => {
			const result = getEmployeeName("999", mockEmployeesMap)
			expect(result).toBe("Employee id: 999")
		})

		test("return fallback for empty map", () => {
			const emptyMap = new Map<string, string>()
			const result = getEmployeeName("1", emptyMap)
			expect(result).toBe("Employee id: 1")
		})
	})

	describe("getProjectName", () => {
		const mockProjectsMap = new Map([
			["1", "Mars Rover"],
			["2", "Manhattan"],
			["3", "New York"],
		])

		test("should return correct project name for valid ID", () => {
			const result = getProjectName("1", mockProjectsMap)
			expect(result).toBe("Mars Rover")
		})

		test("should return fallback for non existent ID", () => {
			const result = getProjectName("999", mockProjectsMap)
			expect(result).toBe("Project id: 999")
		})

		test("should return fallback for empty map", () => {
			const emptyMap = new Map<string, string>()
			const result = getProjectName("1", emptyMap)
			expect(result).toBe("Project id: 1")
		})
	})
})
