import Evento from "../components/Evento";
import { Container, Stack, Typography } from "@mui/material";

function EventList() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Próximos Eventos
                </Typography>
                <Stack spacing={2}>
                    <Evento
                        titulo="Cumple del Grupo 59 Años"
                        descripcion="Veni a festejar el cumple del grupo en el polideportivo del colegio Peña y a comer locro!"
                        foto="images/cumplejuancho.jpg"
                    />
                    <Evento
                        titulo="Evento 2"
                        descripcion="Descripción del evento 2"
                        foto="images/cumplejuancho.jpg"
                    />
                </Stack>
            </Stack>
        </Container>
    );
}

export default EventList;