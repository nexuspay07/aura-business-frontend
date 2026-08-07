export default function SocialLogin({
  onGoogle,
  onMicrosoft,
  loading = false,
}) {
  return (
    <>
      <style>{styles}</style>

      <div className="social-login">

        <div className="social-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="social-button"
          disabled={loading}
          onClick={onGoogle}
        >
          <GoogleIcon />

          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          className="social-button"
          disabled={loading}
          onClick={onMicrosoft}
        >
          <MicrosoftIcon />

          <span>Continue with Microsoft</span>
        </button>

      </div>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.72 1.22 9.22 3.61l6.85-6.85C35.9 2.49 30.43 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.2C12.45 13.61 17.76 9.5 24 9.5z"
      />

      <path
        fill="#4285F4"
        d="M46.5 24.55c0-1.64-.15-3.22-.43-4.75H24v9h12.66c-.55 2.95-2.21 5.46-4.72 7.15l7.27 5.64c4.25-3.92 6.69-9.69 6.69-17.04z"
      />

      <path
        fill="#FBBC05"
        d="M10.54 28.42A14.5 14.5 0 019.5 24c0-1.53.27-3 .75-4.42l-7.98-6.2A23.95 23.95 0 000 24c0 3.88.93 7.55 2.57 10.78l7.97-6.36z"
      />

      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.27-5.64c-2.02 1.36-4.61 2.16-8.62 2.16-6.24 0-11.55-4.11-13.46-9.92l-7.98 6.2C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 21 21"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="8" height="8" fill="#F25022" />
      <rect x="12" y="1" width="8" height="8" fill="#7FBA00" />
      <rect x="1" y="12" width="8" height="8" fill="#00A4EF" />
      <rect x="12" y="12" width="8" height="8" fill="#FFB900" />
    </svg>
  );
}

const styles = `

.social-login{

margin-top:28px;

}

.social-divider{

display:flex;

align-items:center;

margin:26px 0;

color:#94a3b8;

font-size:13px;

font-weight:700;

}

.social-divider::before,

.social-divider::after{

content:"";

flex:1;

height:1px;

background:#e5e7eb;

}

.social-divider span{

padding:0 16px;

}

.social-button{

width:100%;

height:50px;

display:flex;

align-items:center;

justify-content:center;

gap:12px;

margin-bottom:12px;

background:#ffffff;

border:1px solid #d1d5db;

border-radius:10px;

cursor:pointer;

font-size:15px;

font-weight:700;

color:#10201c;

transition:
all .2s ease;

}

.social-button:hover{

background:#f8fafc;

border-color:#94a3b8;

transform:translateY(-1px);

box-shadow:

0 10px 25px rgba(15,23,42,.08);

}

.social-button:active{

transform:scale(.98);

}

.social-button:disabled{

opacity:.6;

cursor:not-allowed;

transform:none;

box-shadow:none;

}

.social-button svg{

flex-shrink:0;

}

`;