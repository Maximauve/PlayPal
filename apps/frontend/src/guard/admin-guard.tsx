import { Role } from "@playpal/schemas";
import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "@/components/loader";
import useAuth from "@/hooks/use-auth";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.role && user.role !== Role.Admin) {
      navigate('/');
    }
  }, [user]);

  if (user?.loading) {
    return <Loader />;
  }
  
  if (!user?.loading && !user) {
    navigate('/');
  }

  return <>{children}</>;
};

export default AdminGuard;