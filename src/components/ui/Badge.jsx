export default function Badge({

  children,

  color = "violet",

}) {

  const colors = {

    violet:
      "bg-violet-100 text-violet-700",

    green:
      "bg-green-100 text-green-700",

    red:
      "bg-red-100 text-red-700",

    amber:
      "bg-amber-100 text-amber-700",

    blue:
      "bg-blue-100 text-blue-700",

  };

  return (

    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${colors[color]}
      `}
    >

      {children}

    </span>

  );

}