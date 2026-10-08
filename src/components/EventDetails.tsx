import { useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

type DropdownOption = {
	value: string;
	label: string;
};

interface EventDetailsProps {
	titulo: string;
	foto: string;
	descripcion: string;
	primerPlaceholder?: string;
	contadorLabel?: string;
	primeraListaOpciones?: DropdownOption[];
}

function EventDetails({
	titulo,
	foto,
	descripcion,
	primerPlaceholder = "Selecciona una opción",
	contadorLabel = "Cantidad",
	primeraListaOpciones = [
		{ value: "general", label: "General" },
		{ value: "vip", label: "VIP" },
	],
}: EventDetailsProps) {
	const [primeraSeleccion, setPrimeraSeleccion] = useState("");
	const [cantidad, setCantidad] = useState(1);

	const handlePrimeraSeleccion = (event: SelectChangeEvent) => {
		setPrimeraSeleccion(event.target.value);
	};

	const handleDisminuirCantidad = () => {
		setCantidad((actual) => Math.max(1, actual - 1));
	};

	const handleAumentarCantidad = () => {
		setCantidad((actual) => actual + 1);
	};

	return (
		<Box sx={{ display: "flex", justifyContent: "center", px: 2, py: 4 }}>
			<Card sx={{ width: "100%", maxWidth: 720, borderRadius: 3, boxShadow: 3 }}>
				<CardContent>
					<Stack spacing={3}>
						<Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
							{titulo}
						</Typography>

						<CardMedia
							component="img"
							image={foto}
							alt={titulo}
							sx={{ width: "100%", borderRadius: 2, aspectRatio: "16 / 9", objectFit: "cover" }}
						/>

						<Typography variant="body1" color="text.secondary">
							{descripcion}
						</Typography>

						<Stack spacing={2}>
							<FormControl fullWidth>
								<InputLabel id="event-details-first-select-label">
									{primerPlaceholder}
								</InputLabel>
								<Select
									labelId="event-details-first-select-label"
									value={primeraSeleccion}
									label={primerPlaceholder}
									onChange={handlePrimeraSeleccion}
									displayEmpty
									renderValue={(selected) => {
										if (!selected) {
											return primerPlaceholder;
										}

										return (
											primeraListaOpciones.find((option) => option.value === selected)?.label ??
											selected
										);
									}}
								>
									<MenuItem value="" disabled>
										{primerPlaceholder}
									</MenuItem>
									{primeraListaOpciones.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<Typography variant="subtitle2" color="text.secondary">
									{contadorLabel}
								</Typography>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										border: 1,
										borderColor: "divider",
										borderRadius: 2,
										px: 1,
										py: 0.5,
									}}
								>
									<Button variant="text" onClick={handleDisminuirCantidad} sx={{ minWidth: 48 }}>
										-
									</Button>
									<Typography variant="h6" sx={{ minWidth: 32, textAlign: "center" }}>
										{cantidad}
									</Typography>
									<Button variant="text" onClick={handleAumentarCantidad} sx={{ minWidth: 48 }}>
										+
									</Button>
								</Box>
							</Box>
						</Stack>

						<Button variant="contained" size="large" fullWidth>
							Pagar
						</Button>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}

export default EventDetails;
