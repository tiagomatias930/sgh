import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">404</h1>
              <p className="text-lg text-gray-700">Página não encontrada</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            A página que procura não existe ou foi movida.
          </p>
          
          <div className="mt-6">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
