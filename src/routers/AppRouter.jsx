import { Basket } from "@/components/basket";
import { Footer, Navigation } from "@/components/common";
import * as ROUTES from "@/constants/routes";
import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import * as view from "@/views";
import AdminRoute from "./AdminRoute";
import ClientRoute from "./ClientRoute";
import PublicRoute from "./PublicRoute";

// Revert back to history v4.10.0 because
// v5.0 breaks navigation
export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <>
      <Navigation />
      <Basket />
      <Switch>
        <PublicRoute component={view.Search} exact path={ROUTES.SEARCH} />
        <PublicRoute component={view.Home} exact path={ROUTES.HOME} />
        <PublicRoute
          component={view.ProductsByCategory}
          exact
          path={ROUTES.PRODUCTS_BY_CATEGORY}
        />
        <PublicRoute
          component={view.FeaturedProducts}
          exact
          path={ROUTES.FEATURED_PRODUCTS}
        />
        <PublicRoute
          component={view.RecommendedProducts}
          exact
          path={ROUTES.RECOMMENDED_PRODUCTS}
        />
        <PublicRoute component={view.Faq} path={ROUTES.FAQ} />
        <PublicRoute component={view.AboutUs} path={ROUTES.ABOUT_US} />
        <PublicRoute component={view.Terms} path={ROUTES.TERMS} />
        <PublicRoute component={view.Privacy} path={ROUTES.PRIVACY} />
        <PublicRoute component={view.Damage} path={ROUTES.DAMAGE} />
        <PublicRoute component={view.Shipping} path={ROUTES.SHIPPING} />
        <PublicRoute component={view.Cancellation} path={ROUTES.CANCELLATION} />

        <PublicRoute component={view.ViewProduct} path={ROUTES.VIEW_PRODUCT} />
        <ClientRoute component={view.UserAccount} exact path={ROUTES.ACCOUNT} />
        <ClientRoute
          component={view.EditAccount}
          exact
          path={ROUTES.ACCOUNT_EDIT}
        />
        <ClientRoute
          component={view.CheckOutStep1}
          path={ROUTES.CHECKOUT_STEP_1}
        />
        <ClientRoute
          component={view.CheckOutStep2}
          path={ROUTES.CHECKOUT_STEP_2}
        />
        <ClientRoute
          component={view.CheckOutStep3}
          path={ROUTES.CHECKOUT_STEP_3}
        />
        <AdminRoute
          component={view.Dashboard}
          exact
          path={ROUTES.ADMIN_DASHBOARD}
        />
        <AdminRoute component={view.Products} path={ROUTES.ADMIN_PRODUCTS} />
        <AdminRoute component={view.AddProduct} path={ROUTES.ADD_PRODUCT} />
        <AdminRoute
          component={view.EditProduct}
          path={`${ROUTES.EDIT_PRODUCT}/:id`}
        />
        <PublicRoute component={view.PageNotFound} />
      </Switch>
      <Footer />
    </>
  </Router>
);

export default AppRouter;
