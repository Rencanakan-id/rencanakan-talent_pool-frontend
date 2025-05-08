import { AuthBanner, Button, Input, Typography } from "@/components";
import { useState } from "react";

export const ForgotPasswordModule = () => {

  const [email, setEmail] = useState<string>("");

  return (
    <p>Forgot password</p>
  );
};