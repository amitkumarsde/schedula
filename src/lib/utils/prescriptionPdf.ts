import type { Appointment } from "@/types";
import { formatLongDate, formatSlotLabel } from "@/lib/utils/schedule";

// Opens a clean print window so the browser can save the prescription as a PDF.
export function downloadPrescriptionPdf(appointment: Appointment) {
  const rows = appointment.medicines
    .map(
      (m) =>
        `<tr><td>${m.name}</td><td>${m.dosage || "-"}</td><td>${m.duration || "-"}</td></tr>`
    )
    .join("");

  const html = `
    <html>
      <head>
        <title>Prescription #${appointment.appointmentNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #323941; padding: 32px; }
          h1 { color: #2faecb; margin-bottom: 4px; }
          .muted { color: #80899a; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #e6e6e6; padding: 8px; text-align: left; font-size: 14px; }
          .section { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Schedula</h1>
        <p class="muted">Prescription for appointment #${appointment.appointmentNumber}</p>
        <div class="section"><strong>Doctor:</strong> ${appointment.doctor.name} (${appointment.doctor.specialization})</div>
        <div class="section"><strong>Patient:</strong> ${appointment.patient.name}</div>
        <div class="section"><strong>Date:</strong> ${formatLongDate(appointment.appointmentDate)} at ${formatSlotLabel(appointment.slotTime)}</div>
        <div class="section"><strong>Diagnosis:</strong> ${appointment.diagnosis || "-"}</div>
        <div class="section">
          <strong>Medicines</strong>
          <table>
            <tr><th>Name</th><th>Dosage</th><th>Duration</th></tr>
            ${rows || '<tr><td colspan="3">None</td></tr>'}
          </table>
        </div>
        <div class="section"><strong>Instructions:</strong> ${appointment.instructions || "-"}</div>
      </body>
    </html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
