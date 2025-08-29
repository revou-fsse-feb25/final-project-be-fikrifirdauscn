import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { BookingModule } from './booking/booking.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoryModule,
    EventModule,
    BookingModule, 
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: class {
        intercept(context, next) {
          const response = context.switchToHttp().getResponse();
          const request = context.switchToHttp().getRequest();

          // Ensure CORS headers are always present
          const origin = request.headers.origin;
          if (origin) {
            response.header('Access-Control-Allow-Origin', origin);
          }
          response.header('Access-Control-Allow-Credentials', 'true');
          response.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
          response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');

          return next.handle();
        }
      }
    }
  ],
})
export class AppModule {}