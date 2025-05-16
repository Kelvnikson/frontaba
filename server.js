const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB usando variável de ambiente
console.log("Tentando conectar ao MongoDB...");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1); // Encerra o app se não conectar
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
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar pacientes", details: err.message });
  }
});

// Adicionar paciente
app.post("/patients", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar paciente", details: err.message });
  }
});

// Editar paciente
app.put("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao editar paciente", details: err.message });
  }
});

// Remover paciente
app.delete("/patients/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover paciente", details: err.message });
  }
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("API está rodando!");
});

// Inicialização do servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
