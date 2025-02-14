import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1676380000000 implements MigrationInterface {
    name = 'InitialSchema1676380000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" varchar NOT NULL UNIQUE,
                "password" varchar NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "isEmailVerified" boolean NOT NULL DEFAULT false,
                "settings" jsonb NOT NULL DEFAULT '{}',
                "progress" jsonb NOT NULL DEFAULT '{}',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Words table
        await queryRunner.query(`
            CREATE TABLE "words" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "arabicText" varchar NOT NULL,
                "diacritics" varchar,
                "englishTranslation" varchar NOT NULL,
                "examples" text[] DEFAULT '{}',
                "audioUrl" varchar,
                "tags" text[] DEFAULT '{}',
                "metadata" jsonb NOT NULL DEFAULT '{}',
                "relatedWords" text[] DEFAULT '{}',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Study sessions table
        await queryRunner.query(`
            CREATE TABLE "study_sessions" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "sessionData" jsonb NOT NULL,
                "status" varchar NOT NULL,
                "performance" jsonb NOT NULL DEFAULT '{}',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Word progress table
        await queryRunner.query(`
            CREATE TABLE "word_progress" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "wordId" uuid NOT NULL,
                "masteryLevel" float NOT NULL DEFAULT 0,
                "timesReviewed" integer NOT NULL DEFAULT 0,
                "reviewHistory" jsonb NOT NULL DEFAULT '[]',
                "nextReviewDate" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_user_progress" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_word" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE
            )
        `);

        // Indexes
        await queryRunner.query(`CREATE INDEX "idx_words_arabic" ON "words" ("arabicText")`);
        await queryRunner.query(`CREATE INDEX "idx_words_english" ON "words" ("englishTranslation")`);
        await queryRunner.query(`CREATE INDEX "idx_study_sessions_user" ON "study_sessions" ("userId")`);
        await queryRunner.query(`CREATE INDEX "idx_word_progress_user" ON "word_progress" ("userId")`);
        await queryRunner.query(`CREATE INDEX "idx_word_progress_word" ON "word_progress" ("wordId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "word_progress"`);
        await queryRunner.query(`DROP TABLE "study_sessions"`);
        await queryRunner.query(`DROP TABLE "words"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
