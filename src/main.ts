import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 1. Enable CORS
    app.enableCors({
        origin: true,
    });

    // 2. Enable Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    // 3. Setup Swagger
    const config = new DocumentBuilder()
        .setTitle("HiveFund API")
        .setDescription(
            "The backend API for the HiveFund Financial Inclusion Platform"
        )
        .setVersion("1.0")
        .addTag("Auth")
        .addTag("Circles")
        .addTag("Payments")
        .addTag("Credit")
        .addTag("Loans")
        .addTag("Storefront")
        .addTag("Marketplace")
        .addTag("Learning")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    // --- CRITICAL FIX BELOW ---
    // Cloud Run injects the PORT variable. We fallback to 3000 for local dev.
    const port = process.env.POTO || 3000;

    // We MUST pass '0.0.0.0' as the second argument.
    // This allows the app to accept connections from outside the docker container.
    await app.listen(port, "0.0.0.0");

    console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
    console.log(`📚 Swagger documentation: http://0.0.0.0:${port}/api/docs`);
}
bootstrap();
