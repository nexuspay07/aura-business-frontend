export default function EmptyState({

  title,

  description,

}) {

  return (

    <div className="text-center py-16">

      <h3 className="text-xl font-semibold">

        {title}

      </h3>

      <p className="text-slate-500 mt-2">

        {description}

      </p>

    </div>

  );

}