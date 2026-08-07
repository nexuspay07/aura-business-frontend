import { useId } from "react";

export default function AuthInput({
  label,
  error,
  type = "text",
  id,
  className = "",
  style = {},
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <>
      <style>{styles}</style>

      <div className={`auth-input-group ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="auth-input-label"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          type={type}
          className={`auth-input ${
            error ? "auth-input-error" : ""
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : undefined
          }
          style={style}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="auth-input-error-text"
          >
            {error}
          </p>
        )}
      </div>
    </>
  );
}

const styles = `

.auth-input-group{

margin-top:18px;

}

.auth-input-label{

display:block;

margin-bottom:8px;

font-size:14px;

font-weight:700;

color:#20322e;

}

.auth-input{

width:100%;

height:52px;

padding:0 16px;

font-size:15px;

border-radius:10px;

border:1px solid #cbd8d3;

background:#fff;

color:#10201c;

transition:
border-color .2s,
box-shadow .2s,
background .2s;

outline:none;

}

.auth-input::placeholder{

color:#9ca3af;

}

.auth-input:hover{

border-color:#94a3b8;

}

.auth-input:focus{

border-color:#0f766e;

box-shadow:

0 0 0 4px rgba(15,118,110,.12);

}

.auth-input:disabled{

background:#f3f4f6;

cursor:not-allowed;

opacity:.7;

}

.auth-input-error{

border-color:#dc2626;

background:#fffafa;

}

.auth-input-error:focus{

border-color:#dc2626;

box-shadow:

0 0 0 4px rgba(220,38,38,.10);

}

.auth-input-error-text{

margin-top:8px;

font-size:13px;

color:#b91c1c;

line-height:1.4;

}

`;