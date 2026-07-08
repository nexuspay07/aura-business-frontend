import Card from "./Card";

export default function StatCard({

  title,

  value,

  icon,

}) {

  return (

    <Card>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-slate-500">

            {title}

          </p>

          <h3 className="text-3xl font-bold mt-2">

            {value}

          </h3>

        </div>

        {icon}

      </div>

    </Card>

  );

}