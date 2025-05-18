import React from "react";
import "components/styles/Button.scss";

interface Props {
  children: JSX.Element | String;
  size?: "sm" | "md" | "xl";
  outline?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  [key: string]: any;
}

const Button = ({ size, outline, children, ...rest }: Props) => {
  const updateSize = (style: any) => {
    if (size === "xl") {
      return {
        ...style,
        fontSize: "18px",
        padding: "15px 30px",
      };
    } else if (size === "sm") {
      return {
        ...style,
        fontSize: "12px",
        padding: "8px 16px",
      };
    } else {
      return {
        ...style,
        fontSize: "16px",
        padding: "10px 24px",
      };
    }
  };

  const updateColor = (style: any) => {
    if (outline) {
      return {
        ...style,
        background: "linear-gradient(45deg, #fff, #fff)",
        color: "#7b34dd",
        border: "1px solid #7b34dd",
      };
    } else {
      return {
        ...style,
        background: "linear-gradient(45deg, #7b34dd, #c56cff)",
        color: "#fff",
        border: "1px solid #7b34dd",
      };
    }
  };

  const getStyle = () => {
    let style = {};
    style = updateSize(style);
    style = updateColor(style);
    return style;
  };

  return (
    <button {...rest} className="home-btn" style={{ ...getStyle() }}>
      {children}
    </button>
  );
};

export default Button;
