export default function Button({

  children,

  onClick,

  variant = "primary",

  className = "",

}) {

  const variants = {

    primary:
      "bg-gradient-to-r from-violet-600 to-blue-500 text-white",

    secondary:
      "bg-slate-100 text-slate-800",

    danger:
      "bg-red-500 text-white",

  };

  return (

    <button

      onClick={onClick}

      className={`
        px-5
        py-3
        rounded-2xl
        font-semibold
        transition-all
        hover:scale-[1.02]
        ${variants[variant]}
        ${className}
      `}

    >

      {children}

    </button>

  );

}