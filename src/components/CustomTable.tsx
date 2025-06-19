import { Table } from "@mantine/core"
import { displayDate, getEmployeeName, getProjectName } from "../../util/functions"
import { Data, GroupedEntry, GroupKey, ProcessedEntry } from "../../util/types"
import { groupOptions } from "@/pages"
import { useMemo, useState } from "react"

const getElementValue = (element: ProcessedEntry, key: string): string | number => {
	switch (key) {
		case "employee":
			return element.employee
		case "project":
			return element.project
		case "date":
			return element.date
		case "hours":
			return element.hours
		default:
			return ""
	}
}

export function CustomTable(props: {
	entries: Data | GroupedEntry
	groupKeys: GroupKey[]
	employeesMap: Map<string, string>
	projectsMap: Map<string, string>
}) {
	// TODO ...props
	const { groupKeys } = props

	// TODO orderBy
	const [orderBy, setOrderBy] = useState<string>("hours") // eslint-disable-line @typescript-eslint/no-unused-vars

	const processedEntries = useMemo((): ProcessedEntry[] => {
		if (!props.entries) return []

		// non ci sono raggruppamenti -> restituisci i dati originali
		if (groupKeys.length === 0 && Array.isArray(props.entries)) {
			return (props.entries as Data).map((entry) => ({
				employee: entry.employee.name,
				project: entry.project.name,
				date: displayDate(entry.date),
				hours: entry.hours,
			}))
		}

		// processa i raggruppamenti
		const groupedEntries = props.entries as GroupedEntry
		return Object.keys(groupedEntries).map((key) => {
			const groupData = groupedEntries[key]
			const row: ProcessedEntry = {
				employee: "",
				project: "",
				date: "",
				hours: 0,
			}

			groupData.keyParts?.forEach((keyPart: string, index: number) => {
				const groupKey = groupKeys[index]
				switch (groupKey) {
					case "employee":
						row.employee = getEmployeeName(keyPart, props.employeesMap)
						break
					case "project":
						row.project = getProjectName(keyPart, props.projectsMap)
						break
					case "date":
						row.date = displayDate(keyPart)
						break
				}
			})
			row.hours = groupData.totalHours

			return row
		})
	}, [props.entries, groupKeys, props.employeesMap, props.projectsMap])

	const DynamicHeader = () => {
		return (
			<Table.Tr>
				{props.groupKeys.length > 0
					? props.groupKeys.map((groupKey) => (
							<Table.Th onClick={() => setOrderBy(groupKey)} key={groupKey}>
								{groupKey}
							</Table.Th>
					  ))
					: groupOptions.map((groupOption) => (
							<Table.Th onClick={() => setOrderBy(groupOption.key)} key={groupOption.key}>
								{groupOption.label}
							</Table.Th>
					  ))}
				<Table.Th onClick={() => setOrderBy("hours")}>Hours</Table.Th>
			</Table.Tr>
		)
	}

	const DynamicRows = () => {
		//TODO processedEntries === 0

		const columns = props.groupKeys.length > 0 ? props.groupKeys : ["employee", "project", "date"]

		if (processedEntries.length > 0) {
			return processedEntries.map((element: ProcessedEntry, index) => {
				return (
					<Table.Tr key={index}>
						{columns.map((groupKey, index) => (
							<Table.Td key={index}>{getElementValue(element, groupKey)}</Table.Td>
						))}
						<Table.Td>{element.hours}</Table.Td>
					</Table.Tr>
				)
			})
		}
	}

	return (
		<Table stickyHeader withRowBorders striped>
			<Table.Thead>
				<DynamicHeader />
			</Table.Thead>
			<Table.Tbody>
				<DynamicRows />
			</Table.Tbody>
		</Table>
	)
}
