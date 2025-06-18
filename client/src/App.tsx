import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";

function Router() {
  return (
    <Switch>
      <Route path="/xadminx" component={Admin} />
      <Route path="/noticias/:id" component={NewsDetail} />
      <Route path="/noticias" component={News} />
      <Route path="/" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;