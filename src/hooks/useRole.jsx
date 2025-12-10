import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
  const { user } = useContext(AuthContext);

  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ["role", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/users/${user.email}/role`
      );
      const data = await res.json();
      return data.role;
    },
    enabled: !!user?.email, 
  });

  return { role, isRoleLoading };
};

export default useRole;
