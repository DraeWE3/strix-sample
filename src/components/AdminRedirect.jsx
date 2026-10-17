import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ADMIN_URL = 'https://admin.strixproduction.com';

const AdminRedirect = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const rest = pathname.replace(/^\/admin/i, '') || '/';
    window.location.replace(`${ADMIN_URL}${rest}${search}${hash}`);
  }, [pathname, search, hash]);

  return null;
};

export default AdminRedirect;
