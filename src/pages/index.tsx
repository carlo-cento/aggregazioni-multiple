import { useEffect, useMemo, useState } from "react"
import Head from "next/head"
import styles from "@/styles/Style.module.sass"
import { Geist, Geist_Mono } from "next/font/google"

import { Button, Loader } from "@mantine/core"
import { Data, GroupedEntry, GroupKey } from "../../util/types"

import {
	IconAdjustments,
	IconArrowNarrowRight,
	IconSquareRoundedMinusFilled,
	IconSquareRoundedPlusFilled,
	IconSquareRoundedXFilled,
} from "@tabler/icons-react"

import { CustomTable } from "../components/CustomTable"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const groupOptions: { key: GroupKey; label: string }[] = [
	{ key: "employee", label: "Employee" },
	{ key: "project", label: "Project" },
	{ key: "date", label: "Date" },
]

const CurrentKeysSelection = ({ groupKeys }: { groupKeys: GroupKey[] }) => {
	if (groupKeys.length > 0)
		return (
			<div className={styles.group_keys_container}>
				<span>Current selection: </span>
				{groupKeys.map((groupKey) => (
					<div className={styles.group_key_breadcrumb} key={groupKey}>
						<span>{groupKey}</span>
						{groupKeys.length - 1 !== groupKeys.indexOf(groupKey) && (
							<IconArrowNarrowRight size={20} style={{ marginTop: "3px" }} />
						)}
					</div>
				))}
			</div>
		)
}

export default function Home() {
	// Fetch dati
	// TODO : gestire errore, settings
	const [data, setData] = useState<Data>()

	// TODO settings
	const [settings, setSettings] = useState({ projects: 3, employees: 5, entries: 30 }) // eslint-disable-line @typescript-eslint/no-unused-vars

	// TODO sistemare
	const [employeesMap, setEmployeesMap] = useState<Map<string, string>>(new Map())
	const [projectsMap, setProjectsMap] = useState<Map<string, string>>(new Map())

	useEffect(() => {
		const employeesMap = new Map()
		const projectsMap = new Map()

		const fetchData = async (projects: number, employees: number, entries: number) => {
			const res = await fetch(
				`/api/mockData?projects=${projects}&employees=${employees}&entries=${entries}`
			)
			const data: Data = await res.json()

			data.forEach((entry) => {
				if (!employeesMap.has(entry.employee.id))
					employeesMap.set(entry.employee.id, entry.employee.name)

				if (!projectsMap.has(entry.project.id))
					projectsMap.set(entry.project.id, entry.project.name)
			})

			setEmployeesMap(employeesMap)
			setProjectsMap(projectsMap)
			setData(data)
		}

		fetchData(settings.projects, settings.employees, settings.entries)
	}, [settings])

	// Gestione chiavi
	const [groupKeys, setGroupKeys] = useState<GroupKey[]>([])
	function handleGroupKeys(groupKey: GroupKey) {
		setGroupKeys((prev) => {
			if (prev.includes(groupKey)) {
				return prev.filter((g) => g !== groupKey)
			} else {
				return [...prev, groupKey]
			}
		})
	}

	// Gestione raggruppamenti
	const groupData = (data: Data, groupKeys: string[]) => {
		if (groupKeys.length === 0) return data
		const grouped: GroupedEntry = {}

		data.forEach((item) => {
			let key = ""
			const keyParts: string[] = []

			groupKeys.forEach((groupKey) => {
				let value
				switch (groupKey) {
					case "employee":
						value = item.employee.id
						break
					case "project":
						value = item.project.id
						break
					case "date":
						value = new Date(item.date).toISOString()
						break
					default:
						value = ""
				}
				keyParts.push(value)
			})

			key = keyParts.join("%")
			if (!grouped[key]) {
				grouped[key] = {
					totalHours: 0,
					keyParts: keyParts,
					//entries: [],
				}
			}
			// Non serve per il raggruppamento richiesto, ma potrebbe essere utile per sviluppi successivi
			//grouped[key].entries.push(item)
			grouped[key].totalHours += item.hours
		})

		return grouped
	}

	const groupedData = useMemo(() => {
		if (!data) return null
		if (groupKeys.length === 0) return data
		return groupData(data, groupKeys)
	}, [data, groupKeys])

	return (
		<>
			<Head>
				<title>Aggregazioni multiple</title>
				<meta name="description" content="Aggregazioni multiple - Carlo Centoducati" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={styles.header}>
				{groupOptions.map((option: { key: GroupKey; label: string }) => {
					return (
						<Button
							leftSection={
								groupKeys.includes(option.key) ? (
									<IconSquareRoundedMinusFilled />
								) : (
									<IconSquareRoundedPlusFilled />
								)
							}
							key={option.key}
							color={groupKeys.includes(option.key) ? "red" : "green"}
							onClick={() => {
								handleGroupKeys(option.key)
							}}
							aria-label={`Group by ${option.label}`}
							aria-pressed={groupKeys.includes(option.key)}
						>
							{option.label}
						</Button>
					)
				})}

				<Button
					color="dark"
					aria-label="Reset"
					leftSection={<IconSquareRoundedXFilled />}
					onClick={() => {
						setGroupKeys([])
					}}
				>
					Reset
				</Button>
				<Button leftSection={<IconAdjustments />} color="dark" aria-label="Impostazioni DB">
					Data
				</Button>
			</div>

			<CurrentKeysSelection groupKeys={groupKeys} />

			<div className={`${styles.table_container} ${geistSans.variable} ${geistMono.variable}`}>
				{groupedData && employeesMap && projectsMap ? (
					<CustomTable
						entries={groupedData}
						groupKeys={groupKeys}
						employeesMap={employeesMap}
						projectsMap={projectsMap}
					/>
				) : (
					<Loader mt={"xl"} color="dark" type="bars" />
				)}
			</div>
		</>
	)
}
