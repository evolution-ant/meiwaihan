import PropTypes from 'prop-types'; // @mui
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
};

export default function LoginButton({ sx }) {
  const { method } = useAuthContext();

  const loginPath = loginPaths[method];

  return (
    <Button component={RouterLink} href={loginPath} variant="outlined" sx={{ mr: 1, ...sx }}>
      Login
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
