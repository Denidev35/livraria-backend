/*
  Warnings:

  - Added the required column `ibsn` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "ibsn" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL
);
INSERT INTO "new_Book" ("author", "id", "price", "stock", "title") SELECT "author", "id", "price", "stock", "title" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_ibsn_key" ON "Book"("ibsn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
