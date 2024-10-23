import { Express } from "express";
import config from "./config.json";
import { hostname } from "os";

export const configureRoutes = (app: Express) => {
  Object.entries(config.services).forEach(([name, service]) => {
    console.log(name, service);
    service.routes.forEach((route) => {
      route.methods.forEach((method) => {
        console.log(method, route.path, hostname);
      });
    });
  });
};
