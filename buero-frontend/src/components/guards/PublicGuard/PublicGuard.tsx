import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/helpers/routes";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/slices/auth";
import { PublicGuardProps } from "@/types/components/guards/Guards.types";

const PublicGuard: React.FC<PublicGuardProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />; 
  }
  return <>{children}</>;
};


export default PublicGuard;