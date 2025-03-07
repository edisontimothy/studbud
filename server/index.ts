import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '../dist/public');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // In production, serve static files first
<<<<<<< HEAD
    const distPath = path.resolve(process.cwd(), "dist/public");
=======
    const distPath = path.resolve(__dirname, "public");
>>>>>>> 86b51fa2ea63758fbfde5e83bff854201824d151
    app.use(express.static(distPath));
    
    // Then handle all other routes by serving index.html
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  // In production (Vercel), we don't need to specify a port as it's handled by the platform
  // In development, we'll use port 5000
  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  } else {
    // For Vercel serverless environment
    log('Running in production mode (serverless)');
  }
})();
