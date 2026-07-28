import cluster from "node:cluster";
import os from "node:os";
import { app } from "./app.js";
import { env } from "./config/env.js";

/**
 * @description
 * - cluster spawn a separate backend process for each cpu core 
 * - if machine have 8 core, then 8 instance of backend runs and share traffic
 * - if one process crash, others run, makes app safe
 * - this increases requeset handling capcity ,if 1 cpu core ,then 1,000 users per second
 * -if 2 cpu core ,then 2,000 users per second
 */
if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Primary ${process.pid} is running. Forking for ${numCPUs} CPUs.`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart workers if they die
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        cluster.fork(); 
    });
} else {
    // Workers share the TCP connection
    app.listen(env.PORT, () => {
        console.log(`Worker ${process.pid} started and server is running on port ${env.PORT}`);
    });
}