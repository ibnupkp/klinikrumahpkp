const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const prototypes = [
    { tipe: 22, altNo: 1, title: 'Tipe 22 Alternatif 1' },
    { tipe: 22, altNo: 2, title: 'Tipe 22 Alternatif 2' },
    { tipe: 27, altNo: 1, title: 'Tipe 27 Alternatif 1' },
    { tipe: 36, altNo: 1, title: 'Tipe 36 Alternatif 1' }
  ];

  for (const p of prototypes) {
    await prisma.designCatalog.create({
      data: {
        ...p,
        kepmenRef: 'Kepmen PUPR 2947/2024',
        filesJson: JSON.stringify({ placeholder: true })
      }
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
