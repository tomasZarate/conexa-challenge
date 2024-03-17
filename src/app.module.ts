import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => dataSourceOptions(configService)
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [UsersService, AuthService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})

export class AppModule { }
