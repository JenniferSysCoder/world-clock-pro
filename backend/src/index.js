import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4100;

// Health check simple
app.get("/health", (_req, res) => res.json({ ok: true }));

// Utilidad: formatea hora local de una zona
function hourIn(tz) {
  return new Intl.DateTimeFormat("es-SV", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, timeZone: tz
  }).format(new Date());
}

// SSE: envía las horas por zonas cada segundo
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const send = () => {
    const payload = {
      ts: new Date().toISOString(),
      clocks: {
        "America/El_Salvador": hourIn("America/El_Salvador"),
        "America/New_York":     hourIn("America/New_York"),
        "Europe/Madrid":        hourIn("Europe/Madrid"),
        "Asia/Tokyo":           hourIn("Asia/Tokyo"),
        "UTC":                  hourIn("UTC")
      }
    };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  send();
  const interval = setInterval(send, 1000);
  req.on("close", () => clearInterval(interval));
});

app.listen(PORT, () => console.log(`SSE running on http://localhost:${PORT}`));
