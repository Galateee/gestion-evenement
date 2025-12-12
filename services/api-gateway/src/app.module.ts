import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Charge le fichier .env globalement
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) { }

  configure(consumer: MiddlewareConsumer) {
    // Route vers le Service Événements
    consumer
      .apply(createProxyMiddleware({
        target: this.configService.get('EVENT_SERVICE_URL'), // http://localhost:3001
        changeOrigin: true,
      }))
      .forRoutes('events');

    // Route vers le Service Billetterie (Tickets)
    consumer
      .apply(createProxyMiddleware({
        target: this.configService.get('TICKET_SERVICE_URL'), // http://localhost:3002
        changeOrigin: true,
      }))
      .forRoutes('tickets');

    // Route vers le Service Paiement
    consumer
      .apply(createProxyMiddleware({
        target: this.configService.get('PAYMENT_SERVICE_URL'), // http://localhost:3003
        changeOrigin: true,
      }))
      .forRoutes('payments');

    // Route vers le Service Notifications
    consumer
      .apply(createProxyMiddleware({
        target: this.configService.get('NOTIFICATION_SERVICE_URL'), // http://localhost:3004
        changeOrigin: true,
      }))
      .forRoutes('notifications');

    // Route vers le Service Utilisateurs (Auth & Users)
    consumer
      .apply(createProxyMiddleware({
        target: this.configService.get('USER_SERVICE_URL'), // http://localhost:3005
        changeOrigin: true,
      }))
      .forRoutes('users', 'auth');
  }
}