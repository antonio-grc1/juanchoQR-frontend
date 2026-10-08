import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface EventoProps {
  titulo: string;
  descripcion?: string;
  foto?: string;
}

function Evento({ titulo, descripcion, foto }: EventoProps) {
  return (
    <Card elevation={2} sx={{ maxWidth: 480, borderRadius: 3 }}>
      {foto && (
        <CardMedia
          component="img"
          image={foto}
          alt={titulo}
          sx={{ aspectRatio: "3 / 1", objectFit: "cover" }}
        />
      )}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {titulo}
        </Typography>
        {descripcion && (
          <Typography variant="body2" color="text.secondary">
            {descripcion}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default Evento;
