const QUESTIONS = require("../data/questions");
const users = require("../data/users.json");

const startQuiz = (req, res) => {
    try{
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
    } catch (error) {
        console.error("Error en startQuiz:", error);
        res.status(500).json({ error: "Error interno al iniciar el examen." });
    }
};

const { generarCertificado } = require("../src/libs/pdfKit");
const path = require("path");

const submitAnswers = async (req, res) => {
    try{
        const user = users.find(u => u.cuenta === req.userId);
        const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

        let score = 0;
        const details = [];

        for (const answer of userAnswers) {
            const originalAnswer = QUESTIONS.find(q => q.id === answer.id);
            const isCorrect = originalAnswer && answer.answer === originalAnswer.correct;

            if (isCorrect) score++;

            details.push({
                id: answer.id,
                text: originalAnswer ? originalAnswer.text : null,
                yourAnswer: answer.answer,
                correctAnswer: originalAnswer ? originalAnswer.correct : null,
                correct: isCorrect
            });
        }

        // Marcar aprobado a true si cumple calificacion del 70%
        const porcentaje = (score / userAnswers.length) * 100;

        const aprobo = porcentaje >= 70;

        user.aprobo = aprobo;

        if (aprobo) {


            return res.status(200).json({
                message: "Respuestas evaluadas.",
                score,
                total: userAnswers.length,
                details,
                porcentaje,
                aprobo,
                mensaje: " \nExamen de Certificación aprobado",
            });
        }

        return res.status(200).json({
            message: "Respuestas evaluadas.",
            score,
            total: userAnswers.length,
            details,
            porcentaje,
            mensaje: " \nExamen de Certificación reprobado",
            aprobo,
        });
    } catch (error) {
        console.error("Error en submitAnswers:", error);
        res.status(500).json({ error: "Error interno al evaluar el examen." });
    }
};

const Certificado = async (req, res) => {
    try {
        const user = users.find(u => u.cuenta === req.userId);

        if (!user.aprobo) {
            res.status(403).json({
                message: "el usuario no aprobo el examen"
            })
        }

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

        res.status(200).json({
            message: "certificado generado correctamete",
            pdfUrl: `http://localhost:3000/api/descargas/${pdfPath}`
        });
    } catch (error) {
        console.error("Error al generar el certificado:", error);
        res.status(500).json({ error: "Error interno al generar el certificado." });
    }
};

module.exports = { startQuiz, submitAnswers, Certificado };
