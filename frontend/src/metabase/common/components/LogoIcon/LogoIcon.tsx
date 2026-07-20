import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

const AMARA_LOGO_URL = "/app/assets/img/amara-logo.png";

interface LogoIconProps {
  width?: number;
  height?: number;
  dark?: boolean;
  fill?: string;
}

export const DefaultLogoIcon = ({ height = 32, width }: LogoIconProps) => {
  const resolvedWidth = width ?? height;

  return (
    <img
      alt="AMARA"
      data-testid="main-logo"
      height={height}
      src={AMARA_LOGO_URL}
      style={{
        display: "block",
        objectFit: "contain",
      }}
      width={resolvedWidth}
    />
  );
};

export function LogoIcon(props: LogoIconProps) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
