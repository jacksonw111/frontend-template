export type AuthType = "TOKEN" | "COOKIE";
interface HTTPSettingProps {
  auth_type: AuthType;
  whitelist: string[];
}

export const settings: HTTPSettingProps = {
  auth_type: "TOKEN",
  whitelist: ["/login"],
};
