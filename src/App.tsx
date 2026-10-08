import EventDetails from "./components/EventDetails";
import { Box, CssBaseline } from "@mui/material";

function App() {

  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
        <EventDetails
          titulo="Cumple del Grupo 59 Años"
          foto="images/cumplejuancho.jpg"
          descripcion="Vení a festejar el cumple del grupo en el polideportivo del colegio Peña y a comer locro."
          primerPlaceholder="Tipo de entrada"
          contadorLabel="Cantidad"
          primeraListaOpciones={[
            { value: "general", label: "General" },
            { value: "vip", label: "VIP" },
            { value: "mesa", label: "Mesa especial" },
          ]}
        />
      </Box>
    </>
  )
}

export default App
