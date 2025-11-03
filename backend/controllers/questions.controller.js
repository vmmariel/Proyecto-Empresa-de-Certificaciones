const QUESTIONS = require("../data/questions");
const users = require("../data/users.json");

const startQuiz = (req, res) => {
    const user = users.find(u => u.cuenta === req.userId);

    if (!user.pago || user.pago !== true) {
        return res.status(403).json({ error: "No ha pagado el examen." });
    }

    if (user.intento === true) {
        return res.status(403).json({ error: "El examen solo se puede aplicar una vez." });
    }

    // hace el intento y se registra
    user.intento = true;

    // Primero se mezclan las preguntas 
    const quizAleatorio = QUESTIONS.sort(() => Math.random() - 0.5);

    // Se guardan 8 
    const quiz = quizAleatorio.slice(0, 8);

    const publicQuestions = quiz.map(({ id, text, options }) => ({
        id, text, options
    }));

    res.status(200).json({
        message: "Preguntas listas. ¡Éxito!",
        questions: publicQuestions
    });
};

const { generarCertificado } = require("../src/libs/pdfKit");
const path = require("path");

const submitAnswers = async (req, res) => {
    const user = users.find(u => u.cuenta === req.userId);
    const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

    let score = 0;
    const details = [];

    for (const user of userAnswers) {
        const originalAnswer = QUESTIONS.find(q => q.id === user.id);
        const isCorrect = originalAnswer && user.answer === originalAnswer.correct;

        if (isCorrect) score++;

        details.push({
            id: user.id,
            text: originalAnswer ? originalAnswer.text : null,
            yourAnswer: user.answer,
            correctAnswer: originalAnswer ? originalAnswer.correct : null,
            correct: isCorrect
        });
    }

    // Marcar aprobado a true si cumple calificacion del 70%
    const porcentaje = (score / userAnswers.length) * 100;
    
    const aprobo = porcentaje >= 70;

    user.aprobo = aprobo;

    if(aprobo) {
        const fecha = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        const ciudad = "Aguascalientes, Ags, México";
        const pdfPath = await generarCertificado({
            nombreCompleto: user.nomComp,
            fecha,
            ciudad,
        });

        return res.status(200).json({
        message: "Respuestas evaluadas.",
        score,
        total: userAnswers.length,
        details,
        porcentaje,
        aprobo,
        pdfUrl: `http://localhost:3000/api/questions/certificado?path=${encodeURIComponent(pdfPath)}`
        });
    }

    return res.status(200).json({
        message: "Respuestas evaluadas.",
        score,
        total: userAnswers.length,
        details,
        porcentaje,
        aprobo,
    });
};

module.exports = { startQuiz, submitAnswers };
