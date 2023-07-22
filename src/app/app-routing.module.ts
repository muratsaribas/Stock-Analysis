import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";

const routes: Routes = [
  {
    path: "",
    component: CustomLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'stock-analysis',
        pathMatch: 'full',
      },
      {
        path: "stock-analysis",
        title: "Hisse Senedi Analizi",
        loadComponent: () =>
          import("./stock-analysis/stock-analysis.component").then(
            (c) => c.StockAnalysisComponent
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/stock-analysis",
  },
  {
    path: "",
    redirectTo: "/stock-analysis",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
