import { Module } from '@nestjs/common';
import {AuthModule} from "./modules/auth/auth.module";
import {DatabaseModule} from "./modules/database/database.module";

@Module({
  imports: [
      DatabaseModule,
      AuthModule
  ],
})
export class AppModule {}
