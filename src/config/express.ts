// import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as mongoose from "mongoose";
import * as cors from "cors";
import * as compression from "compression";
import * as passport from "passport";
import * as helmet from "helmet";
import Routes from "./routes";
import * as Passport from "./passport";


class Express {
    public app: express.Express;
    


    constructor () {
        this.app = express();

        this.setupEnv();
        this.initializePassport();
        this.setupMongo();
        this.setupMiddleware();
        this.setupRoutes();
    }

    private setupEnv() {

        // Set env from file
        require('dotenv').config();

    }

    private initializePassport() {
        this.app.use(passport.initialize());
    }

    private setupMongo() {

        var options = {
            autoIndex: false, // Don't build indexes
            reconnectInterval: 500, // Reconnect every 500ms
            bufferMaxEntries: 0,
            useNewUrlParser: true
          };
        //
        // Connect to mongo using mongoose
        // @todo: fix "open()" DeprecationWarning warning

        switch (process.env.NODE_ENV) {
            case 'test':
            mongoose.connect(process.env.MONGO_TEST_URI, options, (err)=>{
                console.log('connected to test database')
                if(err){
                    console.log(err);
                }
            });

            break;

            default: 'development'

            mongoose.connect(process.env.MONGO_URI, options, (err)=>{
                console.log('connected to development database')
                if(err){
                    console.log(err);
                }
            });

            break;   
        }

    }


    private setupRoutes() {
        new Routes(this.app);
    }

    private setupMiddleware() {
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(compression());
    }

}

export default new Express().app;
