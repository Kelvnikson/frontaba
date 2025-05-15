const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
// Use a variável de ambiente para a conexão do MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  // opções opcionais, se necessário
});


// Schema e Model do Paciente
const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  nextSession: String,
  progress: Number,
  status: String,
  avatarSeed: String,
});

const Patient = mongoose.model("Patient", PatientSchema);

// Rotas CRUD

// Listar todos os pacientes
app.get("/patients", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

// Adicionar paciente
app.post("/patients", async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.json(patient);
});

// Editar paciente
app.put("/patients/:id", async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(patient);
});

// Remover paciente
app.delete("/patients/:id", async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Inicialização do servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
