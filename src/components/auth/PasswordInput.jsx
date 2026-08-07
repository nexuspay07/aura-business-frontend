import { useId, useState } from "react";

export default function PasswordInput({
  label,
  error,
  id,
  className = "",
  style = {},
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <style>{styles}</style>

      <div className={`password-group ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="password-label"
          >
            {label}
          </label>
        )}

        <div className="password-wrapper">

          <input
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={`password-input ${
              error ? "password-input-error" : ""
            }`}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : undefined
            }
            style={style}
            {...props}
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowPassword((current) => !current)
            }
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="password-error"
          >
            {error}
          </p>
        )}

      </div>
    </>
  );
}

const styles = `

.password-group{

margin-top:18px;

}

.password-label{

display:block;

margin-bottom:8px;

font-size:14px;

font-weight:700;

color:#20322e;

}

.password-wrapper{

position:relative;

}

.password-input{

width:100%;

height:52px;

padding:0 76px 0 16px;

font-size:15px;

border-radius:10px;

border:1px solid #cbd8d3;

background:#fff;

color:#10201c;

outline:none;

transition:
border-color .2s,
box-shadow .2s;

}

.password-input:hover{

border-color:#94a3b8;

}

.password-input:focus{

border-color:#0f766e;

box-shadow:
0 0 0 4px rgba(15,118,110,.12);

}

.password-input-error{

border-color:#dc2626;

background:#fffafa;

}

.password-input-error:focus{

border-color:#dc2626;

box-shadow:
0 0 0 4px rgba(220,38,38,.10);

}

.toggle-password{

position:absolute;

top:6px;

right:6px;

height:40px;

min-width:64px;

padding:0 12px;

border:none;

border-radius:8px;

background:#edf5f2;

color:#0f766e;

font-weight:700;

font-size:13px;

cursor:pointer;

transition:
background .2s,
transform .15s;

}

.toggle-password:hover{

background:#dff5ef;

}

.toggle-password:active{

transform:scale(.97);

}

.password-error{

margin-top:8px;

font-size:13px;

color:#b91c1c;

line-height:1.4;

}

`;