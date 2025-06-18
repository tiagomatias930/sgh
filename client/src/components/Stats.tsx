import { Card, CardContent } from "@/components/ui/card";
import { Users, Bed, Baby, Clock } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: "50+",
      label: "Médicos Especialistas",
      color: "bg-blue-600",
    },
    {
      icon: Bed,
      value: "120",
      label: "Camas Disponíveis",
      color: "bg-green-500",
    },
    {
      icon: Baby,
      value: "15.000+",
      label: "Crianças Atendidas/Ano",
      color: "bg-blue-400",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Urgências Pediátricas",
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <div className={`${stat.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
