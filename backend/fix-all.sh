#!/bin/bash
# fix-remaining.sh
# اجرا از ریشه backend: bash fix-remaining.sh
set -e
GREEN='\033[0;32m'; NC='\033[0m'
ok() { echo -e "${GREEN}✅ $1${NC}"; }

[ -f "src/app.module.ts" ] || { echo "❌ از ریشه backend اجرا کن"; exit 1; }

echo "【1/2】 ai-content.service.ts ..."

node << 'JSEOF'
const fs = require('fs');
const path = 'src/modules/ai-content/ai-content.service.ts';
let src = fs.readFileSync(path, 'utf8');

// Fix A: داخل create() هر فیلد body را به content تبدیل کن
// (body نام ستون entity نیست، content است)
src = src.replace(
  "body: content.body,",
  "content: content.body,"
);

// Fix B: cast اشتباه روی save — باید unknown باشد
src = src.replace(
  "await this.contentRepo.save(article) as AiContent",
  "await this.contentRepo.save(article) as unknown as AiContent"
);

// Fix C: content.body = updates.body
src = src.replace(
  "content.body = updates.body",
  "content.content = updates.body"
);

fs.writeFileSync(path, src, 'utf8');
console.log('  patched');
JSEOF

ok "ai-content.service.ts"

echo "【2/2】 otp.module.ts ..."

cat > src/modules/otp/otp.module.ts << 'TSEOF'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpEntity } from '../../database/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
TSEOF

ok "otp.module.ts"

echo ""
echo "══════════════════════════"
echo "  npm run build"
echo "══════════════════════════"