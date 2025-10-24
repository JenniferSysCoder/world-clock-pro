const API = "http://localhost:4100";
let es = null;

const $sv = document.getElementById("sv");
const $ny = document.getElementById("ny");
const $mad = document.getElementById("mad");
const $tok = document.getElementById("tok");
const $utc = document.getElementById("utc");
const $log = document.getElementById("log");
const $status = document.getElementById("status");
const $start = document.getElementById("start");
const $stop = document.getElementById("stop");

function setStatus(txt, ok=false) {
  $status.textContent = txt;
  $status.style.color = ok ? "#16a34a" : "#dc2626";
}

function connect() {
  if (es) return;
  setStatus("Conectando...");
  es = new EventSource(`${API}/events`);
  es.onopen = () => { setStatus("Conectado", true); $start.disabled = true; $stop.disabled = false; };
  es.onerror = () => { setStatus("Desconectado"); $start.disabled = false; $stop.disabled = true; es?.close(); es = null; };
  es.onmessage = (e) => {
    try {
      const d = JSON.parse(e.data);
      $sv.textContent  = d.clocks["America/El_Salvador"];
      $ny.textContent  = d.clocks["America/New_York"];
      $mad.textContent = d.clocks["Europe/Madrid"];
      $tok.textContent = d.clocks["Asia/Tokyo"];
      $utc.textContent = d.clocks["UTC"];

      const li = document.createElement("li");
      li.textContent = `${d.ts} | SV:${d.clocks["America/El_Salvador"]} NY:${d.clocks["America/New_York"]} MAD:${d.clocks["Europe/Madrid"]} TOK:${d.clocks["Asia/Tokyo"]} UTC:${d.clocks["UTC"]}`;
      $log.prepend(li);
      while ($log.children.length > 40) $log.removeChild($log.lastChild);
    } catch {}
  };
}

function disconnect() { es?.close(); es = null; setStatus("Desconectado"); $start.disabled = false; $stop.disabled = true; }

$start.onclick = connect;
$stop.onclick = disconnect;
setStatus("Desconectado");
