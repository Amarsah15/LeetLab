/*
  Warnings:

  - You are about to drop the column `testCase` on the `TestCaseResult` table. All the data in the column will be lost.
  - Added the required column `testcase` to the `TestCaseResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "testCase",
ADD COLUMN     "testcase" INTEGER NOT NULL;
