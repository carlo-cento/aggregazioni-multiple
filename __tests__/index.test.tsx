import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Home from "@/pages/index"
import "@testing-library/jest-dom"
import { render } from "../test-utils/render"

jest.mock("@/components/CustomTable", () => {
	const CustomTable = () => <div data-testid="custom-table">Mocked Table</div>
	return { CustomTable }
})

jest.mock("@/components/SettingsForm", () => {
	const SettingsForm = () => <div data-testid="settings-form">Mocked Settings Form</div>
	return { SettingsForm }
})

// Mock fetch
global.fetch = jest.fn(() =>
	Promise.resolve({
		ok: true,
		json: () =>
			Promise.resolve([
				{
					employee: { id: "e1", name: "John Doe" },
					project: { id: "p1", name: "Project 1" },
					date: new Date().toISOString(),
					hours: 5,
				},
			]),
	})
) as jest.Mock

describe("Home Page", () => {
	it("renders loading bar", async () => {
		render(<Home />)
		await waitFor(() => {
			expect(screen.getByTestId("loading")).toBeInTheDocument()
		})
	})

	it("renders table", async () => {
		render(<Home />)
		await waitFor(() => {
			expect(screen.getByTestId("custom-table")).toBeInTheDocument()
		})
	})

	it("renders grouping buttons", async () => {
		render(<Home />)
		await waitFor(() => {
			expect(screen.getByRole("button", { name: /employee/i })).toBeInTheDocument()
			expect(screen.getByRole("button", { name: /project/i })).toBeInTheDocument()
			expect(screen.getByRole("button", { name: /date/i })).toBeInTheDocument()
			expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument()
		})
	})

	it("toggles grouping keys on buttons click", async () => {
		render(<Home />)
		const button = screen.getByRole("button", { name: /employee/i })

		await userEvent.click(button)
		await waitFor(() => {
			expect(screen.getByText(/current selection/i)).toBeInTheDocument()
			expect(screen.getByText("employee")).toBeInTheDocument()
		})
	})

	it("opens the modal settings on button clicked", async () => {
		render(<Home />)
		const openBtn = screen.getByRole("button", { name: /Impostazioni/i })

		await userEvent.click(openBtn)

		await waitFor(() => {
			expect(screen.getByText("Settings")).toBeInTheDocument()
			expect(screen.getByTestId("settings-form")).toBeInTheDocument()
		})
	})

	it("render correct grouping keys on key remove", async () => {
		render(<Home />)
		const employeeBtn = screen.getByRole("button", { name: /employee/i })
		const projectBtn = screen.getByRole("button", { name: /project/i })

		await userEvent.click(employeeBtn)
		await userEvent.click(projectBtn)

		await waitFor(() => {
			expect(screen.getByText("employee")).toBeInTheDocument()
			expect(screen.getByText("project")).toBeInTheDocument()
		})

		await userEvent.click(projectBtn)

		await waitFor(() => {
			expect(screen.queryByText("project")).not.toBeInTheDocument()
			expect(screen.getByText("employee")).toBeInTheDocument()
		})
	})
})
