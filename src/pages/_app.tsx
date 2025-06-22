import "@/styles/globals.css"
import "@mantine/notifications/styles.css"
import type { AppProps } from "next/app"

import { createTheme, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import { Notifications } from "@mantine/notifications"

export const theme = createTheme({
	components: {
		Table: {
			styles: () => ({
				th: {
					textTransform: "capitalize",
					textDecoration: "underline",
					cursor: "pointer",
				},
				td: {
					textTransform: "capitalize",
				},
			}),
		},
	},
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider theme={theme}>
			<Notifications />
			<Component {...pageProps} />
		</MantineProvider>
	)
}
