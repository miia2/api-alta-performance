const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Sai o 'fs', entra o Mongoose!

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// 2. Conexão com o Banco de Dados na Nuvem (MongoDB Atlas)
// NOTA: Vamos preencher essa URL no próximo passo!
const mongoURI = 'mongodb+srv://miia:iamawarrior@cluster0.dwx0t26.mongodb.net/diario?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado ao MongoDB com sucesso! 🚀'))
  .catch(err => console.error('Erro ao conectar no banco de dados:', err));

// 3. Criando o "Molde" (Schema) para os registros da Mirian
const RegistroSchema = new mongoose.Schema({
  tipo: String,
  descricao: String,
  detalhe: String,
  data: { type: Date, default: Date.now } // Bônus: O MongoDB salva a data sozinho!
});

// 4. Criando o Modelo baseado no molde
const Registro = mongoose.model('Registro', RegistroSchema);

// Rota GET: Busca todos os registros direto da nuvem
app.get('/registros', async (req, res) => {
  try {
    const todosOsRegistros = await Registro.find(); // Comando do MongoDB para "achar tudo"
    res.json(todosOsRegistros);
  } catch (erro) {
    res.status(500).json({ erro: "Falha ao buscar os dados." });
  }
});

// Rota POST: Salva um novo registro na nuvem
app.post('/registros', async (req, res) => {
  try {
    // Pega os dados que vieram do Front-End
    const dadosRecebidos = req.body;
    
    // Cria um novo registro seguindo o nosso Molde
    const novoRegistro = new Registro(dadosRecebidos);
    
    // Salva na nuvem do MongoDB
    await novoRegistro.save();
    
    res.status(201).json({ mensagem: "Registro salvo no MongoDB com sucesso!", dado: novoRegistro });
  } catch (erro) {
    res.status(500).json({ erro: "Falha ao salvar o dado." });
  }
});

// ==========================================
// ROTA DO TREINADOR CONTINUA AQUI PARA BAIXO
// ==========================================
// app.post('/treinador', (req, res) => { ... }

// Nova rota POST para o Treinador Virtual
app.post('/treinador', (req, res) => {
    const { pesoAtual, pesoObjetivo, altura, diasTreino, orcamento, nivel } = req.body;

    const diferencaPeso = pesoAtual - pesoObjetivo;
    const imc = pesoAtual / (altura * altura);
    
    let multiplicadorAtividade = 1.2; 
    if (diasTreino >= 1 && diasTreino <= 3) multiplicadorAtividade = 1.375;
    else if (diasTreino >= 4 && diasTreino <= 5) multiplicadorAtividade = 1.55;
    else if (diasTreino >= 6) multiplicadorAtividade = 1.725;

    const gastoCaloricoDiario = (pesoAtual * 24) * multiplicadorAtividade;

    let planoAcao = "";
    let metaCalorias = 0;

    if (diferencaPeso > 0) {
        planoAcao = `Foco em definição. Faltam ${diferencaPeso.toFixed(1)} kg para atingir sua meta.`;
        metaCalorias = gastoCaloricoDiario - 500; 
    } else if (diferencaPeso < 0) {
        planoAcao = `Foco em ganho de força e massa. Faltam ${Math.abs(diferencaPeso).toFixed(1)} kg para atingir sua meta.`;
        metaCalorias = gastoCaloricoDiario + 300; 
    } else {
        planoAcao = "Meta de peso alcançada! Foco em manutenção e performance.";
        metaCalorias = gastoCaloricoDiario; 
    }

    // 4. A Mágica da Personalização: O Back-End agora devolve apenas DADOS PUROS (JSON)
    let sugestaoTreino = {}; // Mudamos de string ("") para objeto ({})

    if (orcamento === "economico") {
        if (nivel === "avancado") {
            sugestaoTreino = {
                titulo: "🏎️ O Treino 'Chassi de Aço'",
                fases: [
                    { hora: "06:00 - 07:30", nome: "Cardio 'Falta de Ar'", exercicios: ["O Exercício: Burpees ininterruptos.", "O Hack Econômico: Máscara dupla."] },
                    { hora: "08:00 - 09:30", nome: "Armadura Muscular", exercicios: ["Core: Prancha com mochila nas costas.", "Pescoço: 'Técnica da Toalha'."] },
                    { hora: "10:00 - 11:30", nome: "Sobrecarga Cognitiva", exercicios: ["Equilíbrio em uma perna respondendo tabuada."] },
                    { hora: "13:30 - 16:30", nome: "Simulador 'Cadeira de Macarrão'", exercicios: ["Cadeira rígida, tampa de panela e vídeos Onboard."] },
                    { hora: "19:00", nome: "Recuperação Extrema", exercicios: ["Chuveiro gelado e privação sensorial."] }
                ],
                tabela: [
                    { foco: "Cardio/Core", acao: "Burpees + Prancha" },
                    { foco: "Simulador", acao: "Tampa + Vídeos" },
                    { foco: "Cognitivo", acao: "Bolinhas + Tabuada" }
                ],
                aviso: "Aviso: Plano extremo. Em caso de tontura, interrompa."
            };
        } else {
            sugestaoTreino = {
                titulo: "🌱 Fase 1: Despertar do Motor (Em Casa)",
                fases: [
                    { hora: "07:00", nome: "Aquecimento", exercicios: ["Rotação de articulações e alongamento."] },
                    { hora: "07:20", nome: "Construção do Core", exercicios: ["Prancha abdominal tradicional e isometria de pescoço."] },
                    { hora: "08:00", nome: "Cardio de Adaptação", exercicios: ["Caminhada acelerada intervalada."] }
                ],
                tabela: [
                    { foco: "Mobilidade", acao: "Alongamento (10 min)" },
                    { foco: "Fortalecimento", acao: "Prancha + Agachamento" },
                    { foco: "Cardio", acao: "Caminhada (30 min)" }
                ]
            };
        }
    } else if (orcamento === "academia") {
        if (nivel === "avancado") {
            sugestaoTreino = {
                titulo: "🚀 O Cockpit de Elite (Alta Performance)",
                fases: [
                    { hora: "06:00", nome: "Cardio Extremo (VO2 Max)", exercicios: ["Tiroteio na AirBike ou Remo Seco."] },
                    { hora: "08:00", nome: "Força Bruta e Pescoço", exercicios: ["Cinto de tração no crossover e Levantamento Terra."] },
                    { hora: "14:00", nome: "Reflexo e Telemetria", exercicios: ["Simulador dinâmico e painel Batak."] },
                    { hora: "19:00", nome: "Recuperação de Atleta", exercicios: ["Crioterapia e bota de compressão."] }
                ],
                tabela: [
                    { foco: "Cardio VO2 Max", acao: "AirBike / Remo" },
                    { foco: "Força Bruta", acao: "Barras Olímpicas" },
                    { foco: "Reflexo", acao: "Painel Batak" }
                ]
            };
        } else {
            sugestaoTreino = {
                titulo: "🏗️ Construindo a Base (Adaptação no CT)",
                fases: [
                    { hora: "08:00", nome: "Reconhecimento de Pista", exercicios: ["20 minutos de Elíptico ou Esteira."] },
                    { hora: "08:30", nome: "Armadura Muscular Guiada", exercicios: ["Uso de máquinas guiadas e abdominais básicos."] },
                    { hora: "09:15", nome: "Respiração e Foco", exercicios: ["Conexão mente-músculo e controle de ansiedade."] }
                ],
                tabela: [
                    { foco: "Cardio Base", acao: "Elíptico / Esteira" },
                    { foco: "Força Segura", acao: "Máquinas Guiadas" },
                    { foco: "Estabilidade", acao: "Abdominal colchonete" }
                ]
            };
        }
    }

    // 5. Devolve o plano completo em formato limpo
    res.json({
        imc: imc.toFixed(2),
        diagnostico: planoAcao,
        dieta: `Meta diária: ${metaCalorias.toFixed(0)} kcal (Ajustado para ${diasTreino} dias de treino).`,
        treino: sugestaoTreino // Agora envia o objeto JSON, sem HTML!
    });
});

app.listen(port, () => {
  console.log(`API com gravação em disco rodando em http://localhost:${port}`);

});
