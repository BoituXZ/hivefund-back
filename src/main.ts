import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    console.log("👉 STEP 1: Starting NestFactory...");
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({ origin: true });

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    // Swagger
    const config = new DocumentBuilder()
        .setTitle("HiveFund API")
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    // THE PORT SETUP
    // Cloud Run injects the PORT variable automatically.
    const port = process.env.PORT || 3000;

    console.log(`👉 STEP 2: Attempting to listen on port ${port}...`);

    // We MUST use '0.0.0.0' for Cloud Run
    await app.listen(port, "0.0.0.0");

    console.log(`🚀 SUCCESS: Application is running on: ${await app.getUrl()}`);
}

// Wrap in a try-catch to see startup errors
bootstrap().catch((err) => {
    console.error("❌ FATAL ERROR during startup:", err);
    process.exit(1);
});
