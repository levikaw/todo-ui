import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function Error(props: { message: string }) {
  const styles = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={styles}>
      <Typography id="error-title" variant="h6" component="h2">
        ERROR
      </Typography>
      <Typography id="error-description" sx={{ mt: 2 }}>
        {props.message}
      </Typography>
    </Box>
  );
}
