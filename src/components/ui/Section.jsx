export default function Section({

  title,

  children,

}) {

  return (

    <section className="space-y-4">

      <h2 className="text-xl font-semibold text-slate-900">

        {title}

      </h2>

      {children}

    </section>

  );

}