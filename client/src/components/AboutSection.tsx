import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sobre o Hospital Pediátrico de Luanda
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Há mais de 40 anos, o Hospital Pediátrico de Luanda tem sido uma referência em cuidados de saúde infantil em Angola. Nossa missão é proporcionar cuidados médicos de excelência, com compaixão e dedicação, para todas as crianças e adolescentes.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Contamos com uma equipa multidisciplinar de profissionais altamente qualificados e equipamentos médicos de última geração, garantindo diagnósticos precisos e tratamentos eficazes.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-medical-blue text-white w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>client/src/components/AboutSection.tsx
                      <h4 className="font-semibold">Certificação ISO</h4>
                      <p className="text-sm text-gray-600">Qualidade garantida</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-success-green text-white w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Cuidado Humanizado</h4>
                      <p className="text-sm text-gray-600">Foco no bem-estar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="relative">
              <img 
              src="https://raw.githubusercontent.com/tiagomatias930/sgh/main/Gemini_Generated_Image_mypclomypclomypc.png" 
              alt="Equipa médica do Hospital Pediátrico" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
            <Card className="absolute -bottom-6 -right-6 bg-white shadow-lg border-none">
              <CardContent className="p-6 text-center">
                <h4 className="text-3xl font-bold text-medical-blue">40+</h4>
                <p className="text-sm text-gray-600">Anos de Existência</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
