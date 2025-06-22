import React from "react"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { z } from "zod"
import { Settings } from "../../util/types"
import { zodResolver } from "mantine-form-zod-resolver"
import { Button, Group, NumberInput } from "@mantine/core"
import { IconAdjustments } from "@tabler/icons-react"

export default function SettingsForm(props: {
	setSettings: (settings: Settings) => void
	currentSettings: Settings
	close: () => void
}) {
	const form = useForm({
		initialValues: {
			projects: props.currentSettings.projects ?? 3,
			employees: props.currentSettings.employees ?? 5,
			entries: props.currentSettings.entries ?? 30,
		},
		validate: zodResolver(
			z.object({
				projects: z.number().min(1),
				employees: z.number().min(1),
				entries: z.number().min(1),
			})
		),
		mode: "controlled",
	})

	return (
		<form
			onSubmit={form.onSubmit((values: Settings) => {
				props.setSettings(values)
				props.close()
				showNotification({
					title: "Settings",
					message: "Settings updated",
					icon: <IconAdjustments size={20} />,
				})
			})}
		>
			<NumberInput
				label="Projects"
				withAsterisk
				min={1}
				key={form.key("projects")}
				{...form.getInputProps("projects")}
			/>

			<NumberInput
				label="Employees"
				withAsterisk
				min={1}
				key={form.key("employees")}
				{...form.getInputProps("employees")}
			/>

			<NumberInput
				label="Entries"
				withAsterisk
				min={1}
				key={form.key("entries")}
				{...form.getInputProps("entries")}
			/>
			<Group justify="flex-end" gap={"sm"}>
				<Button mt={"md"} color="green" type="submit">
					Submit
				</Button>
				<Button mt={"md"} color="red" onClick={props.close}>
					Close
				</Button>
			</Group>
		</form>
	)
}
