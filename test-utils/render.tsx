// ./test-utils/render.tsx
import { render as testingLibraryRender } from "@testing-library/react"
import { MantineProvider } from "@mantine/core"
import { theme } from "@/pages/_app" 

export function render(ui: React.ReactNode) {
	return testingLibraryRender(<>{ui}</>, {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<MantineProvider theme={theme} env="test">
				{children}
			</MantineProvider>
		),
	})
}
