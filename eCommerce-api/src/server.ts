import express, {
    type Application,
    type Request,
    type Response,
} from "express";
// import AdminJS from "adminjs";
// import AdminJSExpress from "@adminjs/express";
import cookieParser from "cookie-parser";
import env from "./config/env";
import routes from "./routes";

const start = async () => {
    const app: Application = express();
    // const admin = new AdminJS({});
    // const adminRouter = AdminJSExpress.buildRouter(admin);

    // app.use(admin.options.rootPath, adminRouter);
    app.use(express.json());
    app.use(cookieParser());
    app.use("/", routes);

    app.use((_req: Request, res: Response) => {
        return res.status(404).json({
            success: false,
            error: "Endpoint not found",
        });
    });

    app.listen(env.PORT, () => {
        console.log(`Listening on port http://localhost:${env.PORT}...`);
        // console.log(
        //     `AdminJS started on http://localhost:${env.PORT}${admin.options.rootPath}`,
        // );
    });
};

start();
