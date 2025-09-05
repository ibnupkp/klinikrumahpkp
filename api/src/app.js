const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// List prototypes
app.get('/designs/prototypes', async (req, res) => {
  const designs = await prisma.designCatalog.findMany();
  res.json(designs);
});

// Create project
app.post('/projects', async (req, res) => {
  const { ownerName, address, luasM2, type } = req.body;
  const project = await prisma.project.create({
    data: { ownerName, address, luasM2, type }
  });
  res.status(201).json(project);
});

// Create consult request
app.post('/consult', async (req, res) => {
  const { projectId, mode } = req.body;
  const consult = await prisma.consultRequest.create({
    data: { projectId, mode }
  });
  res.status(201).json({ id: consult.id });
});

// Get consult details
app.get('/consult/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const consult = await prisma.consultRequest.findUnique({
    where: { id },
    include: { messages: true }
  });
  if (!consult) return res.status(404).json({ error: 'not found' });
  res.json(consult);
});

// Add message
app.post('/consult/:id/message', async (req, res) => {
  const requestId = parseInt(req.params.id);
  const { sender, text, attachments } = req.body;
  const message = await prisma.consultMessage.create({
    data: {
      requestId,
      sender,
      text,
      attachmentsJson: JSON.stringify(attachments || [])
    }
  });
  res.status(201).json(message);
});

// Submit documents
app.post('/consult/:id/submit', async (req, res) => {
  const requestId = parseInt(req.params.id);
  const { documents } = req.body;
  const request = await prisma.consultRequest.findUnique({ where: { id: requestId } });
  if (!request) return res.status(404).json({ error: 'not found' });

  const createdDocs = [];
  for (const doc of documents || []) {
    const created = await prisma.document.create({
      data: {
        projectId: request.projectId,
        kind: doc.kind,
        url: doc.url,
        version: doc.version,
        checksum: doc.checksum
      }
    });
    createdDocs.push(created);
  }
  await prisma.consultRequest.update({
    where: { id: requestId },
    data: { status: 'final' }
  });
  res.json(createdDocs);
});

module.exports = app;
